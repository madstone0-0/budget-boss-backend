let PORT: number;
switch (process.env.NODE_ENV) {
    case "development":
        PORT = 10500;
        break;
    case "production":
        PORT = 80;
        break;
    default:
        PORT = 10500;
}
export const HOST = "0.0.0.0";

export const ROUNDS = 10;

export const PG_USER = "mads";
export const PG_PASS = "";
export const PG_HOST = "0.0.0.0";
export const PG_PORT = 5432;
let PG_DB: string;

if (process.env.NODE_ENV == "testing") {
    PG_DB = "bossTest";
} else {
    PG_DB = "boss";
}

export { PG_DB, PORT };
