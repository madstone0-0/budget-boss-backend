import { prettyPrint } from "..";
import {
    NewBudget,
    deleteBudget,
    getUserBudget,
    insertBudget,
    updateBudget,
} from "../db/schema/budget";
import {
    NewUserBudget,
    UserBudget,
    deleteUserBudget,
    insertUserBudget,
    updateUserBudget,
} from "../db/schema/user_budget";
import { updateUser } from "../db/schema/user";
import { logger } from "../logging";
import { ServiceReturn } from "../types";
import { resolveError } from "../utils/catchError";

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

    async Create(
        userId: string,
        newUserBudget: NewUserBudget,
    ): Promise<ServiceReturn> {
        try {
            // Create budget spec
            await insertUserBudget(newUserBudget);

            // Update user hasCreatedBudget
            const result = await updateUser(userId, { hasCreatedBudget: true });
            logger.info(`Budget for user: ${userId} successfully created`);
            logger.debug(prettyPrint(result));
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

    async CreatedTemplate(userId: string): Promise<ServiceReturn> {
        try {
            const result = await updateUser(userId, {
                hasCreatedBudget: true,
            });

            logger.info(`User: ${userId} budget state successfully updated`);
            logger.debug(prettyPrint(result));
            return {
                status: 200,
                data: { msg: "Updated budget template status" },
            };
        } catch (error) {
            const err = resolveError(error);
            logger.error(`/auth/createdBudget Error: ${err.stack}`);
            return {
                status: 500,
                data: {
                    msg: "Something went wrong while updating user status",
                },
            };
        }
    }

    async GetOptions(userId: string): Promise<ServiceReturn> {
        try {
            const result = await getUserBudget(userId);

            logger.info(`Budget options for user: ${userId}`);
            logger.debug(prettyPrint(result));
            return {
                status: 200,
                data: { msg: "Budget template retrieved successfully" },
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
        try {
            const result = await updateUserBudget(userId, newUserBudget);

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
            await deleteUserBudget(userId);

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
