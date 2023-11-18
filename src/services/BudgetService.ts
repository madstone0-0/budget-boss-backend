import { prettyPrint } from "..";
import {
    NewBudget,
    deleteBudget,
    getBudgetTotalByCategory,
    getUserBudget,
    insertBudget,
    updateBudget,
} from "../db/schema/budget";
import {
    NewUserBudget,
    UserBudget,
    deleteUserBudgetOption,
    insertUserBudgetOption,
    getUserBudgetOptions,
    updateUserBudgetOption,
} from "../db/schema/user_budget";
import { updateUser } from "../db/schema/user";
import { logger } from "../logging";
import { BudgetOptions, ServiceReturn } from "../types";
import { resolveError } from "../utils/catchError";
import { NewCategory, insertCategory } from "../db/schema/category";

class BudgetService {
    async Add(budget: NewBudget): Promise<ServiceReturn> {
        try {
            const result = await insertBudget(budget);

            logger.info(`Budget for user: ${budget.userId} added successfully`);
            logger.debug(prettyPrint(result));
            return { status: 200, data: { msg: "Record added successfully" } };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Add budget: ${err.stack}`);
            return {
                status: 500,
                data: { msg: "Something went wrong while adding record" },
            };
        }
    }

    async GetAll(userId: string): Promise<ServiceReturn> {
        try {
            const budgets = await getUserBudget(userId);

            logger.info(`Budgets for user: ${userId}`);
            logger.debug(prettyPrint(budgets));
            return { status: 200, data: { budgets } };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Get budget: ${err.stack}`);
            return {
                status: 500,
                data: { msg: "Something went wrong while getting records" },
            };
        }
    }

    async Update(budget: NewBudget, budgetId: string): Promise<ServiceReturn> {
        try {
            logger.debug(prettyPrint(budget));
            const res = await updateBudget(budget, budgetId);
            logger.debug(prettyPrint(res));
            return {
                status: 200,
                data: { msg: "Record updated successfully" },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Update budget: ${err.stack}`);
            return { status: 500, data: { msg: err.message } };
        }
    }

    async Delete(budgetId: string): Promise<ServiceReturn> {
        try {
            await deleteBudget(budgetId);
            logger.info(`Budget: ${budgetId} deleted successfully`);
            return {
                status: 200,
                data: { msg: "Record deleted successfully" },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Delete budget: ${err.stack}`);
            return {
                status: 500,
                data: { msg: "Something went wrong while deleting record" },
            };
        }
    }

    async GetTotal(userId: string, categoryId: string): Promise<ServiceReturn> {
        try {
            const total = await getBudgetTotalByCategory(userId, categoryId);
            logger.info(
                `Total amount for category with id ${categoryId} for user with id ${userId}: ${total}`,
            );
            return {
                status: 200,
                data: {
                    total,
                },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Get budget total: ${err.stack}`);
            return {
                status: 500,
                data: {
                    msg: "Something went wrong while retrieving budget total",
                },
            };
        }
    }

    async Create(
        userId: string,
        newUserBudget: NewUserBudget,
    ): Promise<ServiceReturn> {
        try {
            // Create budget spec
            await insertUserBudgetOption(newUserBudget);

            // Update user hasCreatedBudget
            logger.info(`Budget for user: ${userId} successfully created`);
            await this.CreatedTemplate(userId);

            // await this.AddCreatedBudgets(userId);
            return {
                status: 200,
                data: { msg: "Budget template created successfully" },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Create budget: ${err.stack}`);
            return {
                status: 500,
                data: {
                    msg: "Something went wrong while creating budget template",
                },
            };
        }
    }

    async CreatedTemplate(userId: string): Promise<void> {
        try {
            const result = await updateUser(userId, {
                hasCreatedBudget: true,
            });

            logger.info(`User: ${userId} budget state successfully updated`);
            logger.debug(prettyPrint(result));

            await this.AddCreatedBudgets(userId);
        } catch (error) {
            const err = resolveError(error);
            throw err;
        }
    }

    async AddCreatedBudgets(userId: string): Promise<void> {
        try {
            const userBudget = await getUserBudgetOptions(userId);
            let { budgetOptions } = userBudget[0];
            let actualBudgetOptions: BudgetOptions = JSON.parse(
                JSON.stringify(budgetOptions),
            );

            actualBudgetOptions.options = actualBudgetOptions.options.filter(
                (v, i, a) =>
                    i ===
                    a.findIndex((t) => t.category.name === v.category.name),
            );

            logger.info(`Adding created categories to user ${userId}`);

            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            for (const option of actualBudgetOptions.options) {
                const { category, weight } = option;
                const newCategory: NewCategory = {
                    userId: userId,
                    name: category.name,
                    weight: weight.toString(),
                    color: category.color,
                };
                logger.debug(prettyPrint(newCategory));
                logger.info(
                    `Adding category ${category.name} to user ${userId}`,
                );

                await insertCategory(newCategory);
            }

            logger.info(`Created categories added to user ${userId}`);
        } catch (error) {
            const err = resolveError(error);
            throw err;
        }
    }

    async GetOptions(userId: string): Promise<ServiceReturn> {
        try {
            const result = await getUserBudgetOptions(userId);

            logger.info(`Budget options for user: ${userId}`);
            logger.debug(prettyPrint(result));
            return {
                status: 200,
                data: { budgetOptions: result[0] },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Get budget options: ${err.stack}`);
            return {
                status: 500,
                data: {
                    msg: "Something went wrong while retrieving budget template",
                },
            };
        }
    }

    async UpdateOptions(
        userId: string,
        newUserBudget: Partial<UserBudget>,
    ): Promise<ServiceReturn> {
        logger.debug(`userId: ${userId}`);
        logger.debug("newUserBudget: " + prettyPrint(newUserBudget));

        try {
            const result = await updateUserBudgetOption(userId, newUserBudget);

            logger.info(
                `Budget options for user: ${userId} updated successfully`,
            );
            logger.debug(prettyPrint(result));
            return {
                status: 200,
                data: { msg: "Budget template updated successfully" },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Update budget options: ${err.stack}`);
            return {
                status: 500,
                data: {
                    msg: "Something went wrong while updating budget template",
                },
            };
        }
    }

    async DeleteOptions(userId: string): Promise<ServiceReturn> {
        try {
            await deleteUserBudgetOption(userId);

            logger.info(
                `Budget options for user: ${userId} deleted successfully`,
            );
            return {
                status: 200,
                data: { msg: "Budget template deleted successfully" },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`Delete budget options: ${err.stack}`);
            return {
                status: 500,
                data: {
                    msg: "Something went wrong while deleting budget template",
                },
            };
        }
    }
}

export default new BudgetService();
