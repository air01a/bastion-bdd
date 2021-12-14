import Mount from 'koa-mount'
import Static from 'koa-static'
import KoaRouter from 'koa-router';
import KoaSend from 'koa-send';

const static_router = new KoaRouter()
const static_files = new Mount('/public', new Static('static/'));

static_router.all(['/', '/index.html'], (ctx, next) => {
    return KoaSend(ctx, 'static/index.html');
});

export { static_files, static_router }
