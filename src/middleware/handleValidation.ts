import { Handler } from "express";
import { validationResult } from "express-validator";

const handleValidation: Handler = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).send({ msg: errors.array() });
    }
    next();
};

export default handleValidation;
