import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as constants from "../constants.ts";

const pool = new Pool({
    host: constants.PG_HOST,
    port: constants.PG_PORT,
    user: constants.PG_USER,
    password: constants.PG_PASS,
    database: constants.PG_DB,
});

const db = drizzle(pool);

export default db;
