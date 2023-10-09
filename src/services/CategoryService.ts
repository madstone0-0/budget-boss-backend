import { prettyPrint } from "..";
import {
    NewCategory,
    deleteCategory,
    getUserCategories,
    insertCategory,
    updateCategory,
} from "../db/schema/category";
import { logger } from "../logging";
import { ServiceReturn } from "../types";
import { resolveError } from "../utils/catchError";

class Category {
    async Add(category: NewCategory): Promise<ServiceReturn> {
        try {
            const res = await insertCategory(category);

            logger.info(
                `Category for user: ${category.userId} added successfully`,
            );
            logger.info(prettyPrint(res));
            return {
                status: 200,
                data: { msg: "Category added successfully" },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Add category: ${err.stack}`);
            return { status: 500, data: { msg: err.message } };
        }
    }

    async GetAll(id: string): Promise<ServiceReturn> {
        try {
            const categories = await getUserCategories(id);

            logger.info(`Categories for user: ${id}`);
            logger.info(prettyPrint(categories));
            return { status: 200, data: { categories } };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Get category: ${err.stack}`);
            return { status: 500, data: { msg: err.message } };
        }
    }

    async Update(
        category: NewCategory,
        categoryId: number,
    ): Promise<ServiceReturn> {
        try {
            const res = await updateCategory(category, categoryId);

            logger.info(`Category: ${categoryId} updated successfully`);
            logger.info(prettyPrint(res));
            return {
                status: 200,
                data: { msg: `Category ${categoryId} updated successfully` },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Update category: ${err.stack}`);
            return { status: 500, data: { msg: err.message } };
        }
    }

    async Delete(categoryId: number): Promise<ServiceReturn> {
        try {
            const res = await deleteCategory(categoryId);

            logger.info(`Category: ${categoryId} deleted successfully`);
            logger.info(prettyPrint(res));
            return {
                status: 200,
                data: { msg: "Category deleted successfully" },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Delete category: ${err.stack}`);
            return { status: 500, data: { msg: err.message } };
        }
    }
}

export default new Category();
