import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import swaggerUi from "swagger-ui-express";
import swaggerFile from "./swagger_output.json";
import dotenv from "dotenv";

import { httpLogger, logger } from "./logging";
import { HOST, PORT } from "./constants";
import auth from "./routes/auth";
import bud from "./routes/budget";
import cat from "./routes/categories";

dotenv.config();
const app = express();

app.use(compression());
if (process.env.NODE_ENV !== "development") {
    app.use(
        cors({
            origin: [
                "https://budget-boss.vercel.app",
                "https://invebb.vercel.app",
            ],
        }),
    );
} else {
    app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
}
app.use(express.json());
app.use(httpLogger);
app.use(helmet());

export const prettyPrint = <T>(log: T) => {
    return JSON.stringify(log, undefined, 4);
};

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send({ msg: "Server error!" });
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.get("/info", (_req, res, _next) => {
    res.send("INVEBB Backend Server");
});

// prettier-ignore
app.use(
    "/auth",
    auth
    /*
    #swagger.tags = ['Auth']
    #swagger.responses[500] = { description: 'Server Error', schema: {$ref: "#/definitions/ErrorResponse"} }
    */
);

// prettier-ignore
app.use(
    /*
    #swagger.tags = ['Budget']
    #swagger.responses[500] = { description: 'Server Error', schema: {$ref: "#/definitions/ErrorResponse"} }
    #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: "#/definitions/ErrorResponse" } }
    #swagger.responses[400] = { description: 'Missing required fields', schema: { $ref: "#/definitions/ErrorResponse" } }
    #swagger.responses[417] = { description: 'No access token found in request', schema: { $ref: "#/definitions/ErrorResponse" } }
    */
    "/budget",
    bud
);

// prettier-ignore
app.use(
    "/category",
    cat
    /*
    #swagger.tags = ['Category']
    #swagger.responses[500] = { description: 'Server Error', schema: {$ref: "#/definitions/ErrorResponse"} }
    #swagger.responses[401] = { description: 'Unauthorized', schema: { $ref: "#/definitions/ErrorResponse" } }
    #swagger.responses[400] = { description: 'Missing required fields', schema: { $ref: "#/definitions/ErrorResponse" } }
    #swagger.responses[417] = { description: 'No access token found in request', schema: { $ref: "#/definitions/ErrorResponse" } }
    */
);

export default app;

if (process.env.NODE_ENV !== "testing") {
    (() => {
        app.listen(PORT, HOST, () => {
            console.log(`Mode: ${process.env.NODE_ENV}`);
            console.log(`Listening on http://${HOST}:${PORT}`);
        });
    })();
}
