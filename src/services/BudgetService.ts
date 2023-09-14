import {
    NewBudget,
    deleteBudget,
    getUserBudget,
    insertBudget,
    updateBudget,
} from "../db/schema/budget";
import { ServiceReturn } from "../types";

class BudgetService {
    async Add(budget: NewBudget): Promise<ServiceReturn> {
        try {
            await insertBudget(budget);
            return { status: 200, data: { msg: "Budget added successfully" } };
        } catch (err: any) {
            return { status: 500, data: { msg: err.message } };
        }
    }

    async GetAll(userId: string): Promise<ServiceReturn> {
        try {
            const budgets = await getUserBudget(userId);
            return { status: 200, data: { budgets } };
        } catch (err: any) {
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
            return { status: 500, data: { msg: err.message } };
        }
    }

    async Delete(budgetId: string): Promise<ServiceReturn> {
        try {
            await deleteBudget(budgetId);
            return {
                status: 200,
                data: { msg: `Budget ${budgetId} deleted successfully` },
            };
        } catch (err: any) {
            return { status: 500, data: { msg: err.message } };
        }
    }
}

export default BudgetService;
