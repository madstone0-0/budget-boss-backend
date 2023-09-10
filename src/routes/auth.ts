import { logger } from "../logging.ts";
import crypto from "crypto";
import { sign } from "jsonwebtoken";

import validateUserInfo from "../middleware/validateUserInfo.ts";
import { validationResult } from "express-validator";
import express, { NextFunction, Request, Response } from "express";
import { prettyPrint } from "../index.ts";
import UserService from "../services/UserService.ts";
import { UserInfo } from "../types.ts";
import handleValidation from "../middleware/handleValidation.ts";

const auth = express.Router();

auth.get("/info", (req, res) => {
    res.send("Auth route");
});

auth.post(
    "/signup",
    validateUserInfo(),
    handleValidation,
    (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        const userInfo: UserInfo = {
            email: email,
            password: password,
        };
        logger.info(prettyPrint(userInfo));

        new UserService()
            .SignUp(userInfo)
            .then(({ status, data }) => {
                res.status(status).send(data);
            })
            .catch((err) => {
                logger.error(`Signup: ${err.stacktrace}`);
                res.status(500).send({ msg: "Server Error" });
            });
    },
);

auth.post(
    "/login",
    validateUserInfo(),
    handleValidation,
    (req: Request, res: Response, next: NextFunction) => {
        const { email, password } = req.body;
        const userInfo: UserInfo = {
            email: email,
            password: password,
        };
        logger.info(prettyPrint(userInfo));
        new UserService()
            .Login(userInfo, (userId) => {
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
                res.status(status).send(data.userDetails);
            })
            .catch((err) => {
                logger.error(`Login: ${err.stacktrace}`);
                res.status(500).send({ msg: "Server Error" });
            });
    },
);

export default auth;
