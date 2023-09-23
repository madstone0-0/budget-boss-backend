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
import { updateUser } from "../db/schema/users";
import { logger } from "../logging";
import { ServiceReturn } from "../types";

class BudgetService {
    async Add(budget: NewBudget): Promise<ServiceReturn> {
        try {
            const result = await insertBudget(budget);

            logger.info(`Budget for user: ${budget.userId} added successfully`);
            logger.info(prettyPrint(result));
            return { status: 200, data: { msg: "Budget added successfully" } };
        } catch (err: any) {
            logger.error(`Add budget: ${err}`);
            return { status: 500, data: { msg: err.message } };
        }
    }

    async GetAll(userId: string): Promise<ServiceReturn> {
        try {
            const budgets = await getUserBudget(userId);

            logger.info(`Budgets for user: ${userId}`);
            logger.info(prettyPrint(budgets));
            return { status: 200, data: { budgets } };
        } catch (err: any) {
            logger.error(`Get budget: ${err}`);
            return { status: 500, data: { msg: err.message } };
        }
    }

    async Update(budget: NewBudget, budgetId: string): Promise<ServiceReturn> {
        try {
            await updateBudget(budget, budgetId);
            return {
                status: 200,
                data: { msg: `Budget ${budgetId} updated successfully` },
            };
        } catch (err: any) {
            logger.error(`Update budget: ${err}`);
            return { status: 500, data: { msg: err.message } };
        }
    }

    async Delete(budgetId: string): Promise<ServiceReturn> {
        try {
            await deleteBudget(budgetId);
            logger.info(`Budget: ${budgetId} deleted successfully`);
            return {
                status: 200,
                data: { msg: `Budget ${budgetId} deleted successfully` },
            };
        } catch (err: any) {
            logger.error(`Delete budget: ${err}`);
            return { status: 500, data: { msg: err.message } };
        }
    }

    async Create(
        userId: string,
        newUserBudget: NewUserBudget,
    ): Promise<ServiceReturn> {
        try {
            // Create budget spec
            const budget = await insertUserBudget(newUserBudget);

            // Update user hasCreatedBudget
            const result = await updateUser(userId, { hasCreatedBudget: true });
            logger.info(`Budget for user: ${userId} successfully created`);
            logger.info(prettyPrint(result));
            return {
                status: 200,
                data: { msg: "Budget created successfully" },
            };
        } catch (err: any) {
            logger.error(`Create budget: ${err}`);
            return { status: 500, data: { msg: err.message } };
        }
    }

    async GetOptions(userId: string): Promise<ServiceReturn> {
        try {
            const result = await getUserBudget(userId);

            logger.info(`Budget options for user: ${userId}`);
            logger.info(prettyPrint(result));
            return {
                status: 200,
                data: { msg: "Budget options retrieved successfully" },
            };
        } catch (err: any) {
            logger.error(`Get budget options: ${err}`);
            return { status: 500, data: { msg: err.message } };
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
            logger.info(prettyPrint(result));
            return {
                status: 200,
                data: { msg: "Budget options updated successfully" },
            };
        } catch (err: any) {
            logger.error(`Update budget options: ${err}`);
            return { status: 500, data: { msg: err.message } };
        }
    }

    async DeleteOptions(userId: string): Promise<ServiceReturn> {
        try {
            deleteUserBudget(userId);

            logger.info(
                `Budget options for user: ${userId} deleted successfully`,
            );
            return {
                status: 200,
                data: { msg: "Budget options deleted successfully" },
            };
        } catch (err: any) {
            logger.error(`Delete budget options: ${err}`);
            return { status: 500, data: { msg: err.message } };
        }
    }
}

export default new BudgetService();
