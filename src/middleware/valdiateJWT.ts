import { Handler } from "express";
import { access } from "fs";
import { verify } from "jsonwebtoken";
import { logger } from "../logging";

const validateJWT: Handler = (req, res, next) => {
    const { refreshToken, accessToken } = req.body;
    if (!refreshToken || !accessToken) {
        logger.error("No access token found in request");
        return res
            .status(401)
            .send({ msg: "No access token found in request" });
    }

    try {
        verify(accessToken, process.env.SECRET_KEY!);
        next();
    } catch (err: any) {
        logger.error(`Validate JWT: ${err.stacktrace}`);
        return res.status(401).send({ msg: err.stacktrace });
    }
};

export default validateJWT;
