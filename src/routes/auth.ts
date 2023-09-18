import { logger } from "../logging";
import crypto from "crypto";
import { sign } from "jsonwebtoken";

import validateUserInfo from "../middleware/validateUserInfo";
import express, { NextFunction, Request, Response } from "express";
import { prettyPrint } from "../";
import UserService from "../services/UserService";
import { UserInfo } from "../types";
import handleValidation from "../middleware/handleValidation";

const auth = express.Router();

auth.get("/info", (req, res) => {
    res.send("Auth route");
});

auth.use(validateUserInfo(), handleValidation);

auth.post("/signup", (req: Request, res: Response, next: NextFunction) => {
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
});

auth.post("/login", (req: Request, res: Response, next: NextFunction) => {
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
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Login: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

export default auth;
