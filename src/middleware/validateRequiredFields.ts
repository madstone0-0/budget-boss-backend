import { Handler } from "express";

const validateRequiredFields: (options: {
    requiredFieldsParam?: string[];
    requiredFieldsBody?: string[];
}) => Handler = (
    options = { requiredFieldsParam: [], requiredFieldsBody: [] },
) => {
    return (req, res, next) => {
        const { requiredFieldsBody, requiredFieldsParam } = options;

        if (requiredFieldsParam!.length !== 0) {
            if (requiredFieldsParam!.some((field) => !req.params[field])) {
                return res.status(400).send("Missing required fields");
            }
        }

        if (requiredFieldsBody!.length !== 0) {
            if (requiredFieldsBody!.some((field) => !req.body[field])) {
                return res.status(400).send("Missing required fields");
            }
        }

        next();
    };
};

export default validateRequiredFields;
