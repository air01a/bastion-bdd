import KoaRouter from 'koa-router';
import { get_all_roles, delete_active_connection, get_all_user_active_connection, delete_right_for_user, delete_right_for_db, delete_right, delete_user, delete_db_user, delete_db, create_right, modify_right, get_current_timestamp, get_user_rights, modify_db_user, create_db_user, get_all_db_users, get_all_db, get_all_users, modify_user, create_user, create_database, modify_database } from '../db/queries.mjs';
import { is_admin } from '../modules/auth.mjs';

const adminRouter = new KoaRouter()

const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
}
//savoir si lecture/ecriture ---- slider pour def la durée du droit, POSt -->log accès dansla table et renvoit le mdp
adminRouter.get('/api/db', async (ctx, next) => {

  if (ctx.state.is_admin) {
    try {
      const response = await get_all_db();
      ctx.body = JSON.stringify(response);

    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  } else {
    ctx.status = 401
  }
});

adminRouter.get('/api/users', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {
      const response = await get_all_users();
      ctx.body = JSON.stringify(response);

    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  } else {
    ctx.status = 401
  }
});


adminRouter.put('/api/users', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {

      if (validateEmail(ctx.request.body.email)) {
        const response = await create_user(ctx.request.body.email);

        ctx.body = JSON.stringify(response);
      } else {
        ctx.status = 500;
      }
    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  } else {
    ctx.status = 401
  }
});

adminRouter.post('/api/users/:id', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {
      if (validateEmail(ctx.request.body.email)) {
        const response = await modify_user(ctx.params.id, ctx.request.body.email);

        ctx.body = JSON.stringify(response);
      } else {
        console.log("email vinvalid")
        ctx.status = 500;
      }
    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  } else {
    ctx.status = 401
  }
});


adminRouter.put('/api/database', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {

      if (ctx.request.body.name.length > 0 && ctx.request.body.path.length > 0) {
        const response = await create_database(ctx.request.body.name, ctx.request.body.path);

        ctx.body = JSON.stringify(response);
      } else {
        ctx.status = 500;
      }
    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  } else {
    ctx.status = 401
  }
});

adminRouter.post('/api/database/:id', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {
      if (ctx.request.body.name.length > 0 && ctx.request.body.path.length > 0) {
        const response = await modify_database(ctx.params.id, ctx.request.body.name, ctx.request.body.path);

        ctx.body = JSON.stringify(response);
      } else {
        console.log("params invalid");
        ctx.status = 500;
      }
    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  } else {
    ctx.status = 401
  }
});

adminRouter.get('/api/dbusers', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {
      const response = await get_all_db_users();
      ctx.body = JSON.stringify(response);

    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  } else {
    ctx.status = 401
  }
});

adminRouter.post('/api/dbusers/:id', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {
      if (ctx.request.body.name.length > 0 && ctx.request.body.role.length > 0) {
        const response = await modify_db_user(ctx.params.id, ctx.request.body.name, ctx.request.body.db, ctx.request.body.role);
        if (ctx.request.body.password != null && ctx.request.body.password.length)
          change_userdb_password(ctx.request.body.name, ctx.request.body.password)
        ctx.body = JSON.stringify(response);
      } else {
        console.log("params invalid");
        ctx.status = 500;
      }
    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  } else {
    ctx.status = 401
  }
});

adminRouter.put('/api/dbusers/', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {

      if (ctx.request.body.name.length > 0 && ctx.request.body.role.length > 0 && ctx.request.body.password.length > 0) {
        const response = await create_db_user(ctx.request.body.name, ctx.request.body.db, ctx.request.body.role, ctx.request.body.password);

        ctx.body = JSON.stringify(response);
      } else {
        ctx.status = 500;
      }
    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  } else {
    ctx.status = 401
  }
});

adminRouter.get('/api/admin/rights', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {
      let response = await get_user_rights();
      const timestamp = get_current_timestamp();
      for (let i = 0; i < response.length; i++)
        if (response[i].right_expire != 0)
          response[i].right_expire = parseFloat((response[i].right_expire - timestamp) / (3600 * 24)).toFixed(2);

      ctx.body = JSON.stringify(response);

    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  } else {
    ctx.status = 401
  }
});

adminRouter.post('/api/rights/:id', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {
      const timestamp = get_current_timestamp();

      if (ctx.request.body.db_id != undefined && ctx.request.body.user_id != undefined && ctx.request.body.role != undefined) {
        let expiration = 0
        if (ctx.request.body.expiration != undefined && ctx.request.body.expiration != '0') {
          expiration = timestamp + parseInt(ctx.request.body.expiration) * 3600 * 24;
        }
        const response = await modify_right(ctx.params.id, ctx.request.body.db_id, ctx.request.body.user_id, ctx.request.body.role, expiration);

        ctx.body = JSON.stringify(response);
      } else {
        console.log("params invalid");
        ctx.status = 500;
      }
    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  } else {
    ctx.status = 401
  }
});

adminRouter.put('/api/rights/', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {
      const timestamp = get_current_timestamp();

      if (ctx.request.body.db_id != undefined && ctx.request.body.user_id != undefined && ctx.request.body.role != undefined) {
        let expiration = 0
        if (ctx.request.body.expiration != undefined && ctx.request.body.expiration != '0') {
          expiration = timestamp + parseInt(ctx.request.body.expiration) * 3600 * 24;
        }
        const response = await create_right(ctx.request.body.db_id, ctx.request.body.user_id, ctx.request.body.role, expiration);

        ctx.body = JSON.stringify(response);
      } else {
        console.log("params invalid");
        ctx.status = 500;
      }
    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  } else {
    ctx.status = 401
  }
});

adminRouter.get('/api/active', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {
      const response = await get_all_user_active_connection();
      ctx.body = JSON.stringify(response)
    } catch (err) {
      console.log(err)
      ctx.status = 500;
      ctx.body = JSON.stringify(err)
    }
    return next();
  }
});

adminRouter.get('/api/roles', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {
      const response = await get_all_roles();
      ctx.body = JSON.stringify(response)
    } catch (err) {
      console.log(err)
      ctx.status = 500;
      ctx.body = JSON.stringify(err)
    }
    return next();
  }
});


adminRouter.delete('/api/active/:id(\\d+)', async (ctx, next) => {
  if (ctx.state.is_admin) {
    try {
      const response = await delete_active_connection(ctx.params.id);
      ctx.body = JSON.stringify(response)
    } catch (err) {
      console.log(err)
      ctx.status = 500;
      ctx.body = JSON.stringify(err)
    }
    return next();
  }
});

adminRouter.delete('/api/users/:id(\\d+)', async (ctx, next) => {

  if (is_admin(ctx)) {
    try {
      const response = await delete_user(ctx.params.id);
      delete_right_for_user(ctx.params.id);
      ctx.body = JSON.stringify(response);
    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  }
});

adminRouter.delete('/api/rights/:id(\\d+)', async (ctx, next) => {

  if (is_admin(ctx)) {
    try {
      const response = await delete_right(ctx.params.id);
      ctx.body = JSON.stringify(response);
    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  }
});

adminRouter.delete('/api/dbusers/:id(\\d+)', async (ctx, next) => {

  if (is_admin(ctx)) {
    try {
      const response = await delete_db_user(ctx.params.id);
      ctx.body = JSON.stringify(response);
    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  }
});

adminRouter.delete('/api/db/:id(\\d+)', async (ctx, next) => {

  if (is_admin(ctx)) {
    try {
      const response = await delete_db(ctx.params.id);
      await delete_right_for_db(ctx.params.id);
      ctx.body = JSON.stringify(response);

    } catch (err) {
      console.log(err);
      ctx.status = 500
    }
    return next();
  }
});


export { adminRouter }