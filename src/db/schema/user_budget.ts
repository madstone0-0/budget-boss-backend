import { pgTable, varchar, uuid, jsonb } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, eq, sql } from "drizzle-orm";
import db from "../../db";

const userBudgets = pgTable("user_budgets", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    budgetOptions: jsonb("budget_options").notNull(),
});

export type UserBudget = InferSelectModel<typeof userBudgets>;
export type NewUserBudget = InferInsertModel<typeof userBudgets>;

const userBudgetSelectById = db
    .select()
    .from(userBudgets)
    .where(eq(userBudgets.id, sql.placeholder("id")))
    .prepare("user_budget_select_by_id");

const userBudgetDeleteById = db
    .delete(userBudgets)
    .where(eq(userBudgets.id, sql.placeholder("id")))
    .prepare("user_budget_delete_by_id");

export const insertUserBudget = async (newUserBudget: NewUserBudget) =>
    db.insert(userBudgets).values(newUserBudget).returning();

export const getUserBudget = async (id: string) =>
    await userBudgetSelectById.execute({ id });

export const deleteUserBudget = async (id: string) =>
    await userBudgetDeleteById.execute({ id });

export const updateUserBudget = async (
    id: string,
    userBudget: Partial<UserBudget>,
) =>
    db
        .update(userBudgets)
        .set(userBudget)
        .where(eq(userBudgets.id, id))
        .returning();
