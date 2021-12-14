import pg from 'pg'

import { encrypt, decrypt } from '../modules/aescrypto.mjs';

var generate_password = (length) => {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!#@-_';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;

}


const change_password = async (host, user, password, database) => {

    return new Promise((resolve, reject) => {
        const new_password = generate_password(20);
        const query = `ALTER USER "` + user + `" WITH PASSWORD '` + new_password + `'`;
        const query2 = `SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE application_name!='' AND pid <> pg_backend_pid() AND usename='` + user + `'`;

        const client = new pg.Client({
            user: user,
            host: host,
            database: database,
            password: password,
            port: 5432,
        });

        client.connect()
            .then(() => {
                client.query(query, [])
                    .then(res => {
                        resolve({ pass: new_password })
                    })
                    .catch((err) => {
                        console.error(err);
                        reject({ error: 4, errorStr: 'Could not set user password on remote db' })
                    })
                    .finally(() => {
                        client.query(query2)
                            .catch(err => console.error(err))
                            .finally(() => client.end())
                    });
            })
            .catch(err => console.error(err))
    });
}

export { change_password };
    //client.connect();



    //client
    //    .query("")