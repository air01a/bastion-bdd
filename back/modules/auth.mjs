
import { validate_token } from './jsonvalidator.mjs'
import { user_is_admin } from '../db/queries.mjs'

const check_authentication = async (ctx, next) => {
    if (ctx.request.method == 'OPTIONS' || ctx.request.url == '/api/cognito' || ctx.request.url == '/' || ctx.request.url.startsWith('/public/') || ctx.request.url.startsWith('/index.html'))
        return await next();
    //console.log(ctx.headers);
    if (!('authorisation' in ctx.headers)) {
        console.log('no authorisation context')
        ctx.status = 401;
    } else {
        var auth_header = ctx.headers.authorisation.split(' ')
        if (auth_header[0] != 'Bearer' || auth_header.length < 2) {
            ctx.status = 401;
            console.log("Header auth mal formated")
        } else {
            var token = auth_header[1];
            let user_id = validate_token(token);
            //console.log(user_id)
            if (user_id == null) {
                ctx.status = 401;
                console.log("Invalid token")
            } else {
                ctx.state.user_id = user_id;
                ctx.state.is_admin = await user_is_admin(user_id.googleId);
                //console.log(ctx.state.user_id)
                await next();
            }
        }
    }
}

const is_admin = (ctx) => {
    if (!ctx.state.is_admin) {
        ctx.status = 401;
        return false;
    }
    return true;

}

export { is_admin, check_authentication }