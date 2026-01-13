import pkg, { Connection } from "pg";

const { pool } = pg;
// pool  is connection manager
// we dont open or close the db manually pool handles it for us

export const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});
