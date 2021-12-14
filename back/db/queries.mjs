import 'pg';

import { encrypt, decrypt } from '../modules/aescrypto.mjs';

import { pool } from './connection.mjs';


const get_current_timestamp = () => {
  const currentDate = new Date();
  const timestamp = Math.floor(currentDate.getTime() / 1000);
  return timestamp;
}

const execute_query = async (query, values) => {
  return new Promise((resolve, reject) => {
    pool
      .connect()
      .then(client => {
        client
          .query(query, values)
          .then(res => {
            resolve(res.rows)
          })
          .catch(err => {
            reject(err.stack)
            console.log(err.stack)
          })
          .finally(() => {
            client.release();
          });
      })
  })
}

//check si user existe
const check_pumpkin_user = async (email, google_id) => {
  const fetch_values = [email];
  const update_values = [email, google_id];
  const fetch = 'SELECT user_id, user_mail, user_google_id FROM users WHERE user_mail=$1 AND user_deleted=false';
  const update = `UPDATE users SET user_google_id=$2 WHERE user_mail=$1`;

  return new Promise((resolve, reject) => {
    pool
      .connect()
      .then(client => {
        client
          .query(fetch, fetch_values)
          .then(res => {
            //ctx.state.res = res.rows
            resolve(res.rows)
            if (res.rows.length !== 0 && res.rows[0].user_google_id !== google_id)
              client.query(update, update_values)
          })
          .catch(err => {
            reject(err.stack)
            console.log(err.stack)
          })
          .finally(() => {
            client.release();
          });
      })
  })
}

//check les db
const check_pumpkin_user_db = async (google_id) => {
  const user_google_id = [google_id, get_current_timestamp()];
  const query = "SELECT user_rights.right_id, user_rights.right_role,db.db_name,db.db_path FROM user_rights INNER JOIN db on db.id=user_rights.right_db_id INNER JOIN users on users.user_id = user_rights.right_user_id WHERE users.user_google_id = $1 and right_deleted!=true and (right_expire=0 OR right_expire>$2)"
  return execute_query(query, user_google_id);
}



//get user password
const get_user_password = async (user_id, id) => {

  const params = [user_id, id]
  const fetch = 'SELECT user_rights.right_id FROM user_rights INNER JOIN users on users.user_id = user_rights.right_user_id WHERE users.user_google_id = $1 and user_rights.right_id=$2';
  const fetch_password = 'SELECT user_db.id,db_user_name,db_user_password FROM user_db, user_rights WHERE user_rights.right_id=$1 AND db_user_role=right_role AND db_id = right_db_id  AND user_db.id NOT IN (SELECT log_db_user_id FROM logdb WHERE log_date+log_duration>$2)'

  return new Promise((resolve, reject) => {
    pool
      .connect()
      .then(client => {
        client
          .query(fetch, params)
          .then(res => {
            if (res.length < 1)
              resolve({ error: 1 })
            const currentDate = new Date();
            const current_time = Math.floor(currentDate.getTime() / 1000);

            client.query(fetch_password, [id, current_time])
              .then(res => {
                if (res.rowCount > 0) {
                  const db_user_name = res.rows[0].db_user_name;
                  const db_user_password = decrypt(res.rows[0].db_user_password);
                  const id = res.rows[0].id;
                  resolve({ db_user_name: db_user_name, db_user_password: db_user_password, id: id })
                } else
                  resolve(null)
              })
          })
          .catch(err => {
            reject({})
            console.log(err.stack)
          })
          .finally(() => {
            client.release();
          });

      })
  })
}

const user_is_admin = async (user_id) => {
  const query = "SELECT user_is_admin from users WHERE user_google_id=$1";
  const values = [user_id];
  const res = await execute_query(query, values);
  if (res.length > 0)
    return res[0].user_is_admin;
  return false;

}

const user_connect = async (db_user_id, user_id, duration) => {
  const query = "INSERT INTO logdb(log_user_id, log_db_user_id, log_duration,log_date) VALUES ($1, $2, $3, $4)"
  const currentDate = new Date();
  const timestamp = Math.floor(currentDate.getTime() / 1000);
  const values = [user_id, db_user_id, duration, timestamp]
  return execute_query(query, values);
}

const get_all_user_active_connection = async () => {
  const query = `SELECT log_id,log_date,log_duration, db_name,db_user_name,db_user_role  FROM logdb 
  INNER JOIN user_db on user_db.id = log_db_user_id 
  INNER JOIN db on db.id = user_db.db_id
  WHERE log_date+log_duration > $1 `

  const currentDate = new Date();
  const timestamp = Math.floor(currentDate.getTime() / 1000);
  const values = [timestamp]
  return execute_query(query, values);
}


const get_user_active_connection = async (user_id) => {
  const query = `SELECT log_id,log_date,log_duration, db_name,db_user_name,db_user_role  FROM logdb 
  INNER JOIN user_db on user_db.id = log_db_user_id 
  INNER JOIN db on db.id = user_db.db_id
  WHERE log_date+log_duration > $1 and log_user_id = $2`

  const currentDate = new Date();
  const timestamp = Math.floor(currentDate.getTime() / 1000);
  const values = [timestamp, user_id]
  return execute_query(query, values);
}

const delete_user_active_connection = async (id, user_id) => {
  const query = `UPDATE logdb SET log_duration=$1-log_date WHERE log_id=$2 AND log_user_id=$3`


  const values = [get_current_timestamp(), id, user_id]

  return execute_query(query, values);

}

const delete_active_connection = async (id) => {
  const query = `UPDATE logdb SET log_duration=$1-log_date WHERE log_id=$2 `


  const values = [get_current_timestamp(), id]

  return execute_query(query, values);

}


const get_db_credentials_from_log = async (log_id) => {
  const query = `SELECT db_name, db_path, db_user_name, db_user_password 
                FROM logdb 
                INNER JOIN user_db on user_db.id=log_db_user_id 
                INNER JOIN db on db.id=user_db.db_id
                WHERE log_id=$1`


  const values = [log_id]

  return new Promise((resolve, reject) => {
    pool
      .connect()
      .then(client => {
        client
          .query(query, values)
          .then(res => {
            if (res.rowCount > 0) {
              const db_name = res.rows[0].db_name;
              const db_user_password = decrypt(res.rows[0].db_user_password);
              const db_path = res.rows[0].db_path;
              const db_user_name = res.rows[0].db_user_name;

              resolve({ db_name: db_name, db_user_password: db_user_password, db_path: db_path, db_user_name: db_user_name });
            }
            else
              resolve(null);
          })
          .finally(() => {
            client.release();
          })
      })

  })
}

const change_userdb_password = async (name, password) => {
  const query = `UPDATE user_db SET db_user_password=$1 WHERE db_user_name = $2`;
  const values = [encrypt(password), name]

  return execute_query(query, values);
}

const validate_connection_finished = async (id) => {
  const query = `UPDATE logdb SET log_cron_finished=TRUE WHERE log_id = $1`;
  const values = [id]
  return execute_query(query, values);
}



const get_expired_connections = async () => {
  const query = `SELECT logdb.log_id, db_name, db_path, db_user_name, db_user_password 
                  FROM logdb 
                  INNER JOIN user_db on user_db.id=log_db_user_id 
                  INNER JOIN db on db.id=user_db.db_id
                WHERE log_cron_finished IS NOT TRUE AND (log_date+log_duration) < $1`;

  const timestamp = get_current_timestamp();
  const values = [timestamp]
  return execute_query(query, values);

}


const get_expired_right = async () => {
  const query = `SELECT right_id
                FROM user_rights  
                WHERE right_expire<$1 AND right_expire!=0 AND right_deleted!=true`;

  const timestamp = get_current_timestamp();
  const values = [timestamp]
  return execute_query(query, values);

}


const get_users = async () => {
  const query = `SELECT * FROM users WHERE user_deleted=false`;

  const timestamp = get_current_timestamp();
  const values = []
  return execute_query(query, values);

}


const get_all_db = async () => {
  const query = `SELECT id, db_name,db_path FROM db WHERE db_deleted=false`;
  return execute_query(query, []);

}

const get_all_users = async () => {
  const query = `SELECT user_id, user_mail FROM users WHERE user_deleted=false`;
  return execute_query(query, []);

}

const create_user = async (email) => {
  const query = `INSERT INTO users(user_mail) VALUES ($1)`;
  return execute_query(query, [email]);

}

const modify_user = async (id, email) => {
  const query = `UPDATE users SET user_mail = $1 WHERE user_id = $2`;

  return execute_query(query, [email, id]);

}


const create_database = async (name, path) => {
  const query = `INSERT INTO db(db_name, db_path) VALUES ($1,$2)`;
  return execute_query(query, [name, path]);

}

const modify_database = async (id, name, path) => {
  const query = `UPDATE db SET db_name = $1, db_path = $2 WHERE id = $3`;

  return execute_query(query, [name, path, id]);

}

const get_all_db_users = async () => {
  const query = `SELECT user_db.id, db_id, db_name, db_user_name, db_user_role FROM user_db INNER JOIN db on db.id = user_db.db_id WHERE user_db.db_deleted=false`;
  return execute_query(query, []);

}



const create_db_user = async (username, database, role, password) => {
  const query = `INSERT INTO user_db(db_user_name, db_id,db_user_role, db_user_password) VALUES ($1,$2,$3,$4)`;
  return execute_query(query, [username, database, role, encrypt(password)]);

}

const modify_db_user = async (id, username, database, role) => {
  const query = `UPDATE user_db SET db_user_name = $1, db_id=$2, db_user_role=$3 WHERE id = $4`;

  return execute_query(query, [username, database, role, id]);

}

const get_all_roles = async () => {
  const query = `SELECT DISTINCT db_user_role FROM user_db`;

  return execute_query(query, []);

}

const get_user_rights = async () => {
  const query = `SELECT right_id, right_user_id, right_role, right_db_id, right_expire, db_name,db_path,user_mail 
  FROM user_rights
  INNER JOIN users ON user_id=right_user_Id
  INNER JOIN db ON id = right_db_id
  WHERE right_deleted != true`
  return execute_query(query, []);
}

const modify_right = async (id, db_id, user_id, role, expiration) => {
  const query = `UPDATE user_rights SET right_user_id = $1, right_role=$2, right_db_id=$3, right_expire=$4 WHERE right_id = $5`;

  return execute_query(query, [user_id, role, db_id, expiration, id]);

}

const create_right = async (db_id, user_id, role, expiration) => {
  const query = `INSERT INTO user_rights(right_user_id, right_role, right_db_id, right_expire) VALUES ($1,$2,$3,$4)`;

  return execute_query(query, [user_id, role, db_id, expiration]);

}

const delete_right = async (id) => {
  const query = `UPDATE user_rights SET right_deleted = true WHERE right_id = $1`;
  return execute_query(query, [id]);
}

const delete_right_for_user = async (id) => {
  const query = `UPDATE user_rights SET right_deleted = true WHERE right_user_id = $1`;
  return execute_query(query, [id]);
}

const delete_right_for_db = async (id) => {
  const query = `UPDATE user_rights SET right_deleted = true WHERE right_db_id = $1`;
  return execute_query(query, [id]);
}

const delete_user = async (id) => {
  const query = `UPDATE users SET user_deleted=true WHERE user_id = $1`;
  return execute_query(query, [id]);
}

const delete_db_user = async (id) => {
  const query = `UPDATE user_db SET db_deleted = true WHERE id = $1`;
  return execute_query(query, [id]);
}

const delete_db = async (id) => {
  const query = `UPDATE db SET db_deleted = true WHERE id = $1`;
  return execute_query(query, [id]);
}

export { get_all_roles, delete_active_connection, get_all_user_active_connection, delete_right_for_user, delete_right_for_db, get_expired_right, delete_right, delete_user, delete_db_user, delete_db, create_right, modify_right, get_user_rights, create_db_user, modify_db_user, get_all_db_users, create_database, modify_database, modify_user, create_user, get_all_users, get_all_db, user_is_admin, get_users, validate_connection_finished, get_expired_connections, change_userdb_password, get_db_credentials_from_log, check_pumpkin_user, check_pumpkin_user_db, get_user_password, user_connect, get_user_active_connection, get_current_timestamp, delete_user_active_connection }