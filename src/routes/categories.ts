import express from "express";
import CategoryService from "../services/CategoryService";
import { logger } from "../logging";
import { NewCategory } from "../db/schema/categories";
import { prettyPrint } from "..";
import validateJWT from "../middleware/valdiateJWT";

const cat = express.Router();

cat.get("/info", (req, res) => {
    /*
    #swagger.summary = 'Category info'
    */
    res.send("Categroy route");
});

cat.use(validateJWT);

cat.get("/all/:id", (req, res) => {
    /*
    #swagger.summary = 'Get all categories'
    #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
    #swagger.responses[200] = { description: 'Categories successfully retrieved', schema: { $categories: { $ref: "#/definitions/Category"} } }
    */

    const { id } = req.params;
    if (!id) res.status(400).send("Missing required fields");

    CategoryService.GetAll(id)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err: any) => {
            logger.error(`Get category: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

cat.post("/add/:id", (req, res) => {
    /*
    #swagger.summary = 'Add category'
    #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
    #swagger.parameters['category'] = { in: 'body', description: 'Category info', required: true, schema: { $ref: "#/definitions/NewCategory" } }
    #swagger.responses[200] = { description: 'Category successfully added' }
    */

    const { id } = req.params;
    const { name, userId, color } = req.body;

    if (!name || !userId || !color || !id)
        res.status(400).send("Missing required fields");

    const category: NewCategory = {
        userId,
        name,
        color,
    };

    CategoryService.Add(category)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Add category: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

cat.put("/update/:id", (req, res) => {
    /*
    #swagger.summary = 'Update category'
    #swagger.parameters['id'] = { in: 'path', description: 'Category id', required: true, type: 'string' }
    #swagger.parameters['category'] = { in: 'body', description: 'Category info', required: true, schema: { $ref: "#/definitions/Category" } }
    #swagger.responses[200] = { description: 'Category successfully updated' }
    */
    const { id } = req.params;
    const { name, userId, color, categoryId } = req.body;

    if (!name || !userId || !color || !categoryId || !id)
        res.status(400).send("Missing required fields");

    const category: NewCategory = {
        userId,
        name,
        color,
    };

    CategoryService.Update(category, categoryId)
        .then(({ status, data }) => {
            res.status(status).send(data);
        })
        .catch((err) => {
            logger.error(`Update category: ${err.stacktrace}`);
            res.status(500).send({ msg: "Server Error" });
        });
});

cat.delete("/delete/:id", (req, res) => {
    /*
    #swagger.summary = 'Delete category'
    #swagger.parameters['id'] = { in: 'path', description: 'Category id', required: true, type: 'string' }
    #swagger.responses[200] = { description: 'Category successfully deleted' }
    */
    const { id } = req.params;
    if (!id) res.status(400).send("Missing required fields");

    try {
        CategoryService.Delete(Number(id))
            .then(({ status, data }) => {
                res.status(status).send(data);
            })
            .catch((err) => {
                logger.error(`Delete category: ${err.stacktrace}`);
                res.status(500).send({ msg: "Server Error" });
            });
    } catch (err: any) {
        logger.error(`CategoryService.Delete: ${prettyPrint(err)}`);
        res.status(500).send({ msg: "Server Error" });
    }
});

export default cat;
