import Koa from 'koa';
import Bodyparser from 'koa-bodyparser';
const app = new Koa();

/*
import https from 'https';
import http from 'http';
import path from 'path';
import fs from 'fs';

var config = {
   domain: 'localhost',

   https: {
      port: 443,
      options: {
         key: fs.readFileSync(path.resolve(process.cwd(), 'cert/server-key.pem'), 'utf8').toString(),
         cert: fs.readFileSync(path.resolve(process.cwd(), 'cert/server-cert.pem'), 'utf8').toString(),
      },
   },
};

*/
import { router } from './routes/route.mjs';
import { adminRouter } from './routes/admin.mjs';

import { static_files, static_router } from './routes/static.mjs';
import { check_authentication } from './modules/auth.mjs';
import { set_header_allow_origin } from './modules/header.mjs';

import { cron_start } from './modules/crontask.mjs'
cron_start();
//import { connection } from './db/connection.mjs'



app.use(Bodyparser());
app.use(set_header_allow_origin);
//app.use(connection);
app.use(check_authentication);
app.use(static_files);
app.use(static_router.routes());
app.use(adminRouter.routes());
app.use(router.routes());

app.listen(80, function () {
   console.log('Server running on https://localhost:80')
});
/*const serverCallback = app.callback();
try {
   var httpsServer = https.createServer(config.https.options, serverCallback);
   httpsServer
      .listen(config.https.port, function (err) {
         if (!!err) {
            console.error('HTTPS server FAIL: ', err, (err && err.stack));
         }
         else {
            console.log(`HTTPS server OK: http://${config.domain}:${config.https.port}`);
         }
      });
}
catch (ex) {
   console.error('Failed to start HTTPS server\n', ex, (ex && ex.stack));
}*/
