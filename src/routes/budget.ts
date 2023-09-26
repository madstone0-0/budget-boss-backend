import express, { Request, Response, NextFunction } from "express";
import validateJWT from "../middleware/valdiateJWT";
import BudgetService from "../services/BudgetService";
import { logger } from "../logging";
import { NewBudget } from "../db/schema/budget";
import { NewUserBudget } from "../db/schema/user_budget";
import validateRequiredFields from "../middleware/validateRequiredFields";
import { prettyPrint } from "..";
// import validateRequiredFields from "../middleware/validateRequiredFields";

const bud = express.Router();

bud.get("/info", (req, res) => {
    /*
    #swagger.summary = 'Budget info'
    */
    res.send("Budget route");
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
            res.status(400).send("Missing required fields");
        }

        BudgetService.GetAll(id)
            .then(({ status, data }) => {
                res.status(status).send(data);
            })
            .catch((err) => {
                logger.error(`Get budget: ${err.stacktrace}`);
                res.status(500).send({ msg: "Server Error" });
            });
    },
);

bud.post("/add/:id", (req, res) => {
    /*
    #swagger.summary = 'Add budget'
    #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
    #swagger.parameters['budget'] = { in: 'body', description: 'Budget info', required: true, schema: { $ref: "#/definitions/NewBudget" } }
    #swagger.responses[200] = { description: 'Budget successfully added' }
    */
    const { id } = req.params;
    const { name, amount, dateAdded, categoryId } = req.body;

    if (!name || !amount || !dateAdded || !categoryId || !id) {
        res.status(400).send("Missing required fields");
    }

    const budget: NewBudget = {
        userId: id,
        name,
        amount,
        dateAdded,
        categoryId,
    };

    BudgetService.Add(budget)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Add budget: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

bud.put("/update/:id", (req, res) => {
    /*
    #swagger.summary = 'Update budget'
    #swagger.parameters['id'] = { in: 'path', description: 'Budget id', required: true, type: 'string' }
    #swagger.parameters['budget'] = { in: 'body', description: 'Budget info', required: true, schema: { $ref: "#/definitions/Budget" } }
    #swagger.responses[200] = { description: 'Budget successfully updated' }
    */
    const { id } = req.params;
    const { name, amount, dateAdded, categoryId, userId } = req.body;

    if (!name || !amount || !dateAdded || !categoryId || !id) {
        res.status(400).send("Missing required fields");
    }

    const budget: NewBudget = {
        userId: userId,
        name,
        amount,
        dateAdded,
        categoryId,
    };

    logger.info(prettyPrint(budget));

    BudgetService.Update(budget, id)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Update budget: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

bud.delete("/delete/:id", (req, res) => {
    /*
    #swagger.summary = 'Delete budget'
    #swagger.parameters['id'] = { in: 'path', description: 'Budget id', required: true, type: 'string' }
    #swagger.responses[200] = { description: 'Budget successfully deleted' }
    */
    const { id } = req.params;

    BudgetService.Delete(id)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Delete budget: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
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
    // validateRequiredFields({ requiredFieldsBody: ["budgetOptions"] }),
    (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        const { budgetOptions } = req.body;

        if (!id || !budgetOptions) {
            return res.status(400).send("Missing required fields");
        }

        const userBudget: NewUserBudget = {
            userId: id,
            budgetOptions: budgetOptions,
        };

        BudgetService.Create(id, userBudget)
            .then(({ status, data }) => {
                res.status(status).send(data);
            })
            .catch((err) => {
                logger.error(`Create budget: ${err.stacktrace}`);
                res.status(500).send({ msg: "Server Error" });
            });
    },
);

bud.get("/options/:id", (req, res) => {
    /*
    #swagger.summary = 'Get budget options'
    #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
    #swagger.responses[200] = { description: 'Budget options successfully retrieved', schema: { $ref: "#/definitions/BudgetOptions" }}
    */
    const { id } = req.params;

    if (!id) {
        return res.status(400).send("Missing required fields");
    }

    BudgetService.GetOptions(id)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Get budget options: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

bud.put("/options/update/:id", (req, res) => {
    /*
    #swagger.summary = 'Update budget options'
    #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
    #swagger.parameters['budgetOptions'] = { in: 'body', description: 'Budget options', required: true, schema: { $ref: "#/definitions/BudgetOptions" } }
    #swagger.responses[200] = { description: 'Budget options successfully updated' }
    */
    const { id } = req.params;
    const { budgetOptions } = req.body;

    if (!id || !budgetOptions) {
        return res.status(400).send("Missing required fields");
    }

    BudgetService.UpdateOptions(id, budgetOptions)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Update budget options: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

bud.delete("/options/delete/:id", (req, res) => {
    /*
    #swagger.summary = 'Delete budget options'
    #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
    #swagger.responses[200] = { description: 'Budget options successfully deleted' }
    */
    const { id } = req.params;

    if (!id) {
        return res.status(400).send("Missing required fields");
    }

    BudgetService.DeleteOptions(id)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Delete budget options: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

export default bud;
