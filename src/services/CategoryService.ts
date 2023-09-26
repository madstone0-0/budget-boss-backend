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
        } catch (err: any) {
            logger.error(`Add category: ${err}`);
            return { status: 500, data: { msg: err.message } };
        }
    }

    async GetAll(id: string): Promise<ServiceReturn> {
        try {
            const categories = await getUserCategories(id);

            logger.info(`Categories for user: ${id}`);
            logger.info(prettyPrint(categories));
            return { status: 200, data: { categories } };
        } catch (err: any) {
            logger.error(`Get category: ${err}`);
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
        } catch (err: any) {
            logger.error(`Update category: ${err}`);
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
                data: { msg: `Category deleted successfully` },
            };
        } catch (err: any) {
            logger.error(`Delete category: ${err}`);
            return { status: 500, data: { msg: err.message } };
        }
    }
}

export default new Category();
