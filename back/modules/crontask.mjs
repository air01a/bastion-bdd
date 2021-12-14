import { delete_right, get_expired_right, get_expired_connections, change_userdb_password, validate_connection_finished } from '../db/queries.mjs';
import { change_password } from '../db/change_pass.mjs';
import { decrypt } from './aescrypto.mjs'

import cron from 'cron';

const expire_connection = async () => {
   const res = await get_expired_connections();
   for (const db of res) {
      try {
         change_password(db.db_path, db.db_user_name, decrypt(db.db_user_password), db.db_name)
            .then((password) => {
               change_userdb_password(db.db_user_name, password.pass);
               validate_connection_finished(db.log_id);

            });
      } catch (e) {
         console.log(e);
      }
   }
}

const expire_right = async () => {
   const res = await get_expired_right();
   for (const db of res) {
      try {
         delete_right(db.right_id);
      } catch (e) {
         console.log(e);
      }
   }
}

const cron_start = async () => {
   console.log("Starting Cronjob")
   try {
      const job = new cron.CronJob('0 */10 * * * *', function () {
         console.log("execute cron")
         expire_connection();
         expire_right();
      });

      job.start();
   } catch (e) {
      console.log("+++++  Error with CRON", e);
   }
}
export {
   cron_start

}

