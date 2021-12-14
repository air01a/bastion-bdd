import KoaRouter from 'koa-router';
import { validate_connection_finished, check_pumpkin_user, check_pumpkin_user_db, get_user_password, user_connect, get_user_active_connection, delete_user_active_connection, get_db_credentials_from_log, change_userdb_password } from '../db/queries.mjs';
import { change_password } from '../db/change_pass.mjs';

const router = new KoaRouter()


router.options('/api/(.*)', (ctx, next) => {
  ctx.body = JSON.stringify('');
  return next();
});

router.get('/api/cognito', (ctx, next) => {
  ctx.body = JSON.stringify({ url: process.env.COGNITOURL });
  return next();
});

//activate password
router.post('/api/rights/:id(\\d+)/activate', async (ctx, next) => {

  try {
    const response = await get_user_password(ctx.state.user_id.googleId, ctx.params.id);
    if (response !== null) {
      const db_user_id = response.id
      const user_id = ctx.state.user_id.googleId
      const duration = ctx.request.body.time * 60
      ctx.body = JSON.stringify({ error: 0, errorstr: 'No error', credentials: response });
      user_connect(db_user_id, user_id, duration)
    } else {
      ctx.body = JSON.stringify({ error: 1, errorstr: 'No user available' });
    }
  } catch (err) {
    console.log(err);
    ctx.status = 500
  }
});


//savoir a quoi l'utilisateur peut acceder (JSON de tous les droits de l'ut)
router.get('/api/rights', async (ctx, next) => {
  try {
    const response = await check_pumpkin_user_db(ctx.state.user_id.googleId);
    ctx.state.user_db_id = response[0].db_user_name;
    ctx.body = JSON.stringify({ db: response });
  } catch (err) {
    console.log(err)
    ctx.status = 500
  }
  return next();
});

//auth et check existence de l'user
router.get('/api/verif_token', async (ctx, next) => {
  try {
    const response = await check_pumpkin_user(ctx.state.user_id.email, ctx.state.user_id.googleId);
    if (response.length !== 0) {
      ctx.body = JSON.stringify({ userName: response[0].user_id, userMail: response[0].user_mail, isAdmin: ctx.state.is_admin });
    } else {
      ctx.status = 401;
      ctx.body = JSON.stringify({ err: "User does not exist!" })
    }
  } catch (err) {
    console.log(err)
    ctx.status = 500;
    ctx.body = JSON.stringify(err)
  }
  return next();

});


router.get('/api/rights/active', async (ctx, next) => {
  try {
    const response = await get_user_active_connection(ctx.state.user_id.googleId);
    ctx.body = JSON.stringify(response)
  } catch (err) {
    console.log(err)
    ctx.status = 500;
    ctx.body = JSON.stringify(err)
  }
  return next();
});


router.delete('/api/rights/active/:id(\\d+)', async (ctx, next) => {
  try {
    const response = await delete_user_active_connection(ctx.params.id, ctx.state.user_id.googleId);
    const credentials = await get_db_credentials_from_log(ctx.params.id);
    const password = await change_password(credentials.db_path, credentials.db_user_name, credentials.db_user_password, credentials.db_name)
    if (password != null) {
      change_userdb_password(credentials.db_user_name, password.pass);
      validate_connection_finished(ctx.params.id)
    }
    ctx.status = 200;
    ctx.body = JSON.stringify({ error: 0, errorstr: 'No Error' })
    return next();
  } catch (err) {
    console.log(err)
    ctx.status = 500;
    ctx.body = JSON.stringify(err)
    return next();
  }

});


export { router }