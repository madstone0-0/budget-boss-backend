import { body } from "express-validator";
import { Middleware } from "express-validator/src/base";

const validateUserInfo = () => {
    return [
        body("email")
            .isEmail()
            .normalizeEmail()
            .withMessage("Invalid Email")
            .exists(),
        body("password")
            .isLength({ min: 7 })
            .withMessage("Password must be at least 5 characters long")
            .isLength({ max: 30 })
            .withMessage("Password must not be longer than 30 characters")
            .matches(/\d/)
            .withMessage("Password must contain at least one number")
            .matches(/\W/)
            .withMessage(
                "Password must contain at lease one special character, i.e !@#&$",
            )
            .exists(),
    ];
};

export default validateUserInfo;
