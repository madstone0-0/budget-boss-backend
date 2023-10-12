import express, { Request, Response, NextFunction } from "express";
import {
    validateBudget,
    validateBudgetOptions,
    validateJWT,
} from "../middleware/validators";
import BudgetService from "../services/BudgetService";
import { logger } from "../logging";
import { NewBudget } from "../db/schema/budget";
import { NewUserBudget } from "../db/schema/user_budget";
import { prettyPrint } from "..";
import { resolveError } from "../utils/catchError";
import { CustomRequest } from "../types";
import { handleValidation } from "../middleware/handlers";

const bud = express.Router();

bud.get("/info", (req, res) => {
    /*
    #swagger.summary = 'Budget info'
    */
    return res.send("Budget route");
});

bud.use(validateJWT);

bud.get(
    "/all/:id",
    // validateRequiredFields({ requiredFieldsParam: ["id"] }),
    (req, res) => {
        /*
        #swagger.summary = 'Get all budgets'
        #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
        #swagger.responses[200] = { description: 'Budgets successfully retrieved', schema: { $budgets: { $ref: "#/definitions/Budget"} } }
        */
        const { id } = req.params;
        if (!id) {
            return res.status(400).send({ msg: "Missing required fields" });
        }

        BudgetService.GetAll(id)
            .then(({ status, data }) => {
                return res.status(status).send(data);
            })
            .catch((e) => {
                const err = resolveError(e);
                logger.error(
                    `Get budget msg:${err.message} stack: ${err.stack}`,
                );
                return res.status(500).send({ msg: "Server Error" });
            });
    },
);

bud.post(
    "/add/:id",
    validateBudget(),
    handleValidation,
    (req: CustomRequest<{ id: string }, NewBudget>, res: Response) => {
        /*
    #swagger.summary = 'Add budget'
    #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
    #swagger.parameters['budget'] = { in: 'body', description: 'Budget info', required: true, schema: { $ref: "#/definitions/NewBudget" } }
    #swagger.responses[200] = { description: 'Budget successfully added' }
    */
        const { id } = req.params;
        const { name, amount, dateAdded, categoryId } = req.body;

        if (!id) {
            return res.status(400).send({ msg: "Missing required fields" });
        }

        const budget: NewBudget = {
            userId: id,
            name,
            amount,
            dateAdded,
            categoryId,
        };

        logger.debug(prettyPrint(budget));

        BudgetService.Add(budget)
            .then(({ status, data }) => {
                return res.status(status).send(data);
            })
            .catch((e) => {
                const err = resolveError(e);
                logger.error(`Add budget: ${err.stack}`);
                return res.status(500).send({ msg: "Server Error" });
            });
    },
);

bud.put(
    "/update/:id",
    validateBudget(),
    handleValidation,
    (req: CustomRequest<{ id: string }, NewBudget>, res: Response) => {
        /*
    #swagger.summary = 'Update budget'
    #swagger.parameters['id'] = { in: 'path', description: 'Budget id', required: true, type: 'string' }
    #swagger.parameters['budget'] = { in: 'body', description: 'Budget info', required: true, schema: { $ref: "#/definitions/Budget" } }
    #swagger.responses[200] = { description: 'Budget successfully updated' }
    */
        const { id } = req.params;
        const { name, amount, dateAdded, categoryId, userId } = req.body;

        const budget: NewBudget = {
            userId: userId,
            name,
            amount,
            dateAdded,
            categoryId,
        };

        logger.debug(prettyPrint(budget));

        BudgetService.Update(budget, id)
            .then(({ status, data }) => {
                return res.status(status).send(data);
            })
            .catch((e) => {
                const err = resolveError(e);
                logger.error(`Update budget: ${err.stack}`);
                return res.status(500).send({ msg: "Server Error" });
            });
    },
);

bud.delete("/delete/:id", (req, res) => {
    /*
    #swagger.summary = 'Delete budget'
    #swagger.parameters['id'] = { in: 'path', description: 'Budget id', required: true, type: 'string' }
    #swagger.responses[200] = { description: 'Budget successfully deleted' }
    */
    const { id } = req.params;

    BudgetService.Delete(id)
        .then(({ status, data }) => {
            return res.status(status).send(data);
        })
        .catch((e) => {
            const err = resolveError(e);
            logger.error(`Delete budget: ${err.stack}`);
            return res.status(500).send({ msg: "Server Error" });
        });
});

// Budget Options

bud.post(
    /*
    #swagger.summary = 'Create budget options'
    #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
    #swagger.parameters['budgetOptions'] = { in: 'body', description: 'Budget options', required: true, schema: { $ref: "#/definitions/BudgetOptions" } }
    #swagger.responses[200] = { description: 'Budget options successfully created' }
    */
    "/options/create/:id",
    validateBudgetOptions(),
    handleValidation,
    (req: CustomRequest<{ id: string }, NewUserBudget>, res: Response) => {
        const { id } = req.params;
        const { budgetOptions } = req.body;

        if (!id) {
            return res.status(400).send({ msg: "Missing required fields" });
        }

        const userBudget: NewUserBudget = {
            userId: id,
            budgetOptions: budgetOptions,
        };

        logger.debug(prettyPrint(userBudget));

        BudgetService.Create(id, userBudget)
            .then(({ status, data }) => {
                return res.status(status).send(data);
            })
            .catch((e) => {
                const err = resolveError(e);
                logger.error(`Create budget: ${err.stack}`);
                return res.status(500).send({ msg: "Server Error" });
            });
    },
);

bud.put("/options/createdTemplate/:id", (req, res) => {
    /*
    #swagger.summary = 'Update user info'
    #swagger.parameters['userInfo'] = { in: 'body', description: 'User info', required: true, schema: { $ref: "#/definitions/UserInfo" } }
    #swagger.responses[200] = { description: 'User info successfully updated' }
    #swagger.responses[401] = { description: 'Incorrect Password'}
    */
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ msg: "Missing required fields" });
    }

    BudgetService.CreatedTemplate(id)
        .then(({ status, data }) => {
            return res.status(status).send(data);
        })
        .catch((e) => {
            const err = resolveError(e);
            logger.error(`Update user: ${err.stack}`);
            return res.status(500).send({ msg: "Server Error" });
        });
});

bud.get("/options/:id", (req, res) => {
    /*
    #swagger.summary = 'Get budget options'
    #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
    #swagger.responses[200] = { description: 'Budget options successfully retrieved', schema: { $ref: "#/definitions/BudgetOptions" }}
    */
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ msg: "Missing required fields" });
    }

    BudgetService.GetOptions(id)
        .then(({ status, data }) => {
            return res.status(status).send(data);
        })
        .catch((e) => {
            const err = resolveError(e);
            logger.error(`Get budget options: ${err.stack}`);
            return res.status(500).send({ msg: "Server Error" });
        });
});

bud.put(
    "/options/update/:id",
    validateBudgetOptions(),
    handleValidation,
    (
        req: CustomRequest<{ id: string }, { budgetOptions: NewUserBudget }>,
        res: Response,
    ) => {
        /*
    #swagger.summary = 'Update budget options'
    #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
    #swagger.parameters['budgetOptions'] = { in: 'body', description: 'Budget options', required: true, schema: { $ref: "#/definitions/BudgetOptions" } }
    #swagger.responses[200] = { description: 'Budget options successfully updated' }
    */
        const { id } = req.params;
        const { budgetOptions } = req.body;

        if (!id) {
            return res.status(400).send({ msg: "Missing required fields" });
        }

        logger.debug(prettyPrint(budgetOptions));

        BudgetService.UpdateOptions(id, budgetOptions)
            .then(({ status, data }) => {
                return res.status(status).send(data);
            })
            .catch((e) => {
                const err = resolveError(e);
                logger.error(`Update budget options: ${err.stack}`);
                return res.status(500).send({ msg: "Server Error" });
            });
    },
);

bud.delete("/options/delete/:id", (req, res) => {
    /*
    #swagger.summary = 'Delete budget options'
    #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
    #swagger.responses[200] = { description: 'Budget options successfully deleted' }
    */
    const { id } = req.params;

    if (!id) {
        return res.status(400).send({ msg: "Missing required fields" });
    }

    BudgetService.DeleteOptions(id)
        .then(({ status, data }) => {
            return res.status(status).send(data);
        })
        .catch((e) => {
            const err = resolveError(e);
            logger.error(`Delete budget options: ${err.stack}`);
            return res.status(500).send({ msg: "Server Error" });
        });
});

export default bud;
