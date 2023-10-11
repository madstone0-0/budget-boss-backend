import { prettyPrint } from "..";
import {
    NewCategory,
    deleteCategory,
    getCategoryByName,
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
            const categories = await getCategoryByName(
                category.userId!,
                category.name,
            );

            if (categories.length !== 0)
                return {
                    status: 400,
                    data: { msg: "Category already exists" },
                };

            const res = await insertCategory(category);

            logger.info(
                `Category for user: ${category.userId} added successfully`,
            );
            logger.debug(prettyPrint(res));
            return {
                status: 200,
                data: { msg: "Category added successfully" },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Add category: ${err.stack}`);
            return {
                status: 500,
                data: { msg: "Something went wrong while adding category" },
            };
        }
    }

    async GetAll(id: string): Promise<ServiceReturn> {
        try {
            const categories = await getUserCategories(id);

            logger.info(`Categories for user: ${id}`);
            logger.debug(prettyPrint(categories));
            return { status: 200, data: { categories } };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Get category: ${err.stack}`);
            return {
                status: 500,
                data: { msg: "Something went wrong while fetching categories" },
            };
        }
    }

    async Update(
        category: NewCategory,
        categoryId: number,
    ): Promise<ServiceReturn> {
        try {
            const res = await updateCategory(category, categoryId);

            logger.info(`Category: ${categoryId} updated successfully`);
            logger.debug(prettyPrint(res));
            return {
                status: 200,
                data: { msg: "Category updated successfully" },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Update category: ${err.stack}`);
            return {
                status: 500,
                data: { msg: "Something went wrong while updating category" },
            };
        }
    }

    async Delete(categoryId: number): Promise<ServiceReturn> {
        try {
            const res = await deleteCategory(categoryId);

            logger.info(`Category: ${categoryId} deleted successfully`);
            logger.debug(prettyPrint(res));
            return {
                status: 200,
                data: { msg: "Category deleted successfully" },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Delete category: ${err.stack}`);
            return {
                status: 500,
                data: {
                    msg: "Something went wrong while deleting the category.\nPlease check that the category is not being used.",
                },
            };
        }
    }
}

export default new Category();
