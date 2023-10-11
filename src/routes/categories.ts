import express from "express";
import CategoryService from "../services/CategoryService";
import { logger } from "../logging";
import { NewCategory } from "../db/schema/category";
import { prettyPrint } from "..";
import validateJWT from "../middleware/valdiateJWT";
import { resolveError } from "../utils/catchError";

const cat = express.Router();

cat.get("/info", (req, res) => {
    /*
    #swagger.summary = 'Category info'
    */
    return res.send("Categroy route");
});

cat.use(validateJWT);

cat.get("/all/:id", (req, res) => {
    /*
    #swagger.summary = 'Get all categories'
    #swagger.parameters['id'] = { in: 'path', description: 'User id', required: true, type: 'string' }
    #swagger.responses[200] = { description: 'Categories successfully retrieved', schema: { $categories: { $ref: "#/definitions/Category"} } }
    */

    const { id } = req.params;
    if (!id) return res.status(400).send("Missing required fields");

    CategoryService.GetAll(id)
        .then(({ status, data }) => {
            return res.status(status).send(data);
        })
        .catch((error) => {
            const err = resolveError(error);
            logger.error(`Get category: ${err.stack}`);
            return res.status(500).send({ msg: "Server Error" });
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
        return res.status(400).send("Missing required fields");

    const category: NewCategory = {
        userId,
        name,
        color,
    };

    logger.debug(prettyPrint(category));

    CategoryService.Add(category)
        .then(({ status, data }) => {
            return res.status(status).send(data);
        })
        .catch((error) => {
            const err = resolveError(error);
            logger.error(`Add category: ${err.stack}`);
            return res.status(500).send({ msg: "Server Error" });
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
    const { name, userId, color } = req.body;

    if (!name || !userId || !color || !id)
        return res.status(400).send("Missing required fields");

    const category: NewCategory = {
        userId,
        name,
        color,
    };

    logger.debug(prettyPrint(category));

    CategoryService.Update(category, parseInt(id))
        .then(({ status, data }) => {
            return res.status(status).send(data);
        })
        .catch((error) => {
            const err = resolveError(error);
            logger.error(`Update category: ${err.stack}`);
            return res.status(500).send({ msg: "Server Error" });
        });
});

cat.delete("/delete/:id", (req, res) => {
    /*
    #swagger.summary = 'Delete category'
    #swagger.parameters['id'] = { in: 'path', description: 'Category id', required: true, type: 'string' }
    #swagger.responses[200] = { description: 'Category successfully deleted' }
    */
    const { id } = req.params;
    if (!id) return res.status(400).send("Missing required fields");

    try {
        CategoryService.Delete(Number(id))
            .then(({ status, data }) => {
                return res.status(status).send(data);
            })
            .catch((error) => {
                const err = resolveError(error);
                logger.error(`Delete category: ${err.stack}`);
                return res.status(500).send({ msg: "Server Error" });
            });
    } catch (error) {
        const err = resolveError(error);
        logger.error(`CategoryService.Delete: ${prettyPrint(err)}`);
        return res.status(500).send({ msg: "Server Error" });
    }
});

export default cat;
