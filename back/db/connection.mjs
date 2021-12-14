import pg from 'pg'

const connection = () => {
  const pgPool = new pg.Pool({
    user: process.env.DBUSER,
    host: process.env.DBHOST,
    database: process.env.DBNAME,
    password: process.env.DBPASSWORD,
    port: 5432
  });
  pgPool.on("error", err => {
    // just need to catch this error, don't need to do anything
  });
  return pgPool;
  //  await next()
}


const pool = connection()
export { pool }

//NO ctx ?