import { Handler } from "express";
import { verify } from "jsonwebtoken";
import { logger } from "../logging";
import { prettyPrint } from "..";

const validateJWT: Handler = (req, res, next) => {
    const token = req.headers["authorization"];
    if (!token) {
        logger.error("No access token found in request");
        return res
            .status(417)
            .send({ msg: "No access token found in request" });
    }

    try {
        verify(token.split(" ")[1], process.env.SECRET_KEY!);
        next();
    } catch (err: any) {
        logger.error(`Validate JWT: ${err}`);
        return res.status(401).send({ msg: err });
    }
};

export default validateJWT;
