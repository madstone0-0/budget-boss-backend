import express, { Request, Response, NextFunction } from "express";
import validateJWT from "../middleware/valdiateJWT";
import BudgetService from "../services/BudgetService";
import { logger } from "../logging";
import { NewBudget } from "../db/schema/budget";
import { NewUserBudget } from "../db/schema/user_budget";
import validateRequiredFields from "../middleware/validateRequiredFields";
// import validateRequiredFields from "../middleware/validateRequiredFields";

const bud = express.Router();

bud.get("/info", (req, res) => {
    res.send("Budget route");
});

bud.use(validateJWT);

bud.get(
    "/all/:id",
    // validateRequiredFields({ requiredFieldsParam: ["id"] }),
    (req, res) => {
        const { id } = req.params;
        if (!id) {
            res.status(400).send("Missing required fields");
        }

        new BudgetService()
            .GetAll(id)
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

    new BudgetService()
        .Add(budget)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Add budget: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

bud.put("/update/:id", (req, res) => {
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

    new BudgetService()
        .Update(budget, id)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Update budget: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

bud.delete("/delete/:id", (req, res) => {
    const { id } = req.params;

    new BudgetService()
        .Delete(id)
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

        new BudgetService()
            .Create(id, userBudget)
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
    const { id } = req.params;

    if (!id) {
        return res.status(400).send("Missing required fields");
    }

    new BudgetService()
        .GetOptions(id)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Get budget options: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

bud.put("/options/update/:id", (req, res) => {
    const { id } = req.params;
    const { budgetOptions } = req.body;

    if (!id || !budgetOptions) {
        return res.status(400).send("Missing required fields");
    }

    new BudgetService()
        .UpdateOptions(id, budgetOptions)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Update budget options: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

bud.delete("/options/delete/:id", (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).send("Missing required fields");
    }

    new BudgetService()
        .DeleteOptions(id)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Delete budget options: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

export default bud;
