import express from "express";
import validateJWT from "../middleware/valdiateJWT";
import BudgetService from "../services/BudgetService";
import { logger } from "../logging";
import { NewBudget } from "../db/schema/budget";

const bud = express.Router();

bud.get("/info", (req, res) => {
    res.send("Budget route");
});

bud.use(validateJWT);

bud.get("/all/:id", (req, res) => {
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
});

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

export default bud;
