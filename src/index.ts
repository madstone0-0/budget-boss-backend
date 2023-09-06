import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

import { httpLogger } from "./logging";
import { HOST, PORT } from "./constants";
import auth from "./routes/auth.ts";

dotenv.config();
const app = express();
app.use(cors({ origin: "*", credentials: true }));
app.use(express.json());
app.use(httpLogger);
app.use(helmet());

export const prettyPrint = (log: string | Object | any) => {
    return JSON.stringify(log, undefined, 4);
};

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ msg: "Server error!" });
});

app.get("/info", (req, res, next) => {
    res.send("INVEBB Backend Server");
});

app.use("/auth", auth);

app.listen(PORT, HOST, () => {
    console.log(`Listening on http://${HOST}:${PORT}`);
});
