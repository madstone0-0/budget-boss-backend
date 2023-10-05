import { logger } from "../logging";
import crypto from "crypto";
import { sign } from "jsonwebtoken";

import validateUserInfo from "../middleware/validateUserInfo";
import express, { NextFunction, Request, Response } from "express";
import { prettyPrint } from "../";
import UserService from "../services/UserService";
import { LoginRequest, UserInfo } from "../types";
import handleValidation from "../middleware/handleValidation";

const auth = express.Router();

auth.get("/info", (_req, res) => {
    //#summary = 'Auth info'
    /*
    #swagger.tags = ['Auth']
    #swagger.responses[500] = { description: 'Server Error'}
    */

    res.send("Auth route");
});

auth.use(validateUserInfo(), handleValidation);

auth.post("/signup", (req: Request, res: Response, next: NextFunction) => {
    /*
    #swagger.summary = 'Sign up'
     #swagger.parameters['userInfo'] = { in: 'body', description: 'User info', required: true, schema: { $ref: "#/definitions/UserInfo" } }
    #swagger.responses[200] = { description: 'User successfully signed up' }
    #swagger.responses[400] = { description: 'Email is already registered'}
    */
    const { email, password } = req.body;
    const userInfo: UserInfo = {
        email: email,
        password: password,
    };
    logger.info(prettyPrint(userInfo));

    UserService.SignUp(userInfo)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Signup: ${err}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

auth.post(
    "/login",
    (
        req: Request<unknown, unknown, LoginRequest>,
        res: Response,
        next: NextFunction,
    ) => {
        /*
    #swagger.summary = 'Login'
    #swagger.parameters['userInfo'] = { in: 'body', description: 'User info', required: true, schema: { $ref: "#/definitions/UserInfo" } }
    #swagger.responses[200] = { description: 'User successfully logged in',  schema: { $userDetails: { $ref: "#/definitions/UserInfo" } } }
    #swagger.responses[401] = { description: 'Incorrect Password'}
    */
        const { email, password } = req.body;
        const userInfo: UserInfo = {
            email: email,
            password: password,
        };
        logger.info(prettyPrint(userInfo));
        UserService.Login(userInfo, (userId) => {
            const SECRET_KEY = process.env.SECRET_KEY!;
            const refreshId = userId + SECRET_KEY;
            const salt = crypto.randomBytes(16).toString("base64");
            const hash = crypto
                .createHmac("sha512", salt)
                .update(refreshId)
                .digest("base64");
            req.body.refreshKey = salt;
            const token = sign(req.body, SECRET_KEY, {
                expiresIn: "3h",
            });
            const b = Buffer.from(hash);
            const refreshToken = b.toString("base64");
            return { accessToken: token, refreshToken: refreshToken };
        })
            .then(({ status, data }) => {
                res.status(status).send(data);
            })
            .catch((err) => {
                logger.error(`Login: ${err}`);
                res.status(500).send({ msg: "Server Error" });
            });
    },
);

export default auth;
