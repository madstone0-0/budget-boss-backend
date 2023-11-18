import { pgTable, varchar, uuid, jsonb } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, eq, sql } from "drizzle-orm";
import db from "../../db";
import { logger } from "../../logging";
import { prettyPrint } from "../..";

const userBudgets = pgTable("user_budget", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id").notNull(),
    budgetOptions: jsonb("budget_options").notNull(),
});

export type UserBudget = InferSelectModel<typeof userBudgets>;
export type NewUserBudget = InferInsertModel<typeof userBudgets>;

const userBudgetSelectById = db
    .select()
    .from(userBudgets)
    .where(eq(userBudgets.id, sql.placeholder("id")));

const userBudgetSelectByUser = db
    .select()
    .from(userBudgets)
    .where(eq(userBudgets.userId, sql.placeholder("userId")));

const userBudgetDeleteById = db
    .delete(userBudgets)
    .where(eq(userBudgets.id, sql.placeholder("id")));

export const insertUserBudgetOption = async (newUserBudget: NewUserBudget) =>
    db.insert(userBudgets).values(newUserBudget).returning();

// export const getUserBudget = async (id: string) =>
//     await userBudgetSelectById.execute({ id });
export const getUserBudgetOptions = async (userId: string) =>
    await userBudgetSelectByUser.execute({ userId });

export const deleteUserBudgetOption = async (id: string) =>
    await userBudgetDeleteById.execute({ id });

export const updateUserBudgetOption = async (
    userId: string,
    userBudget: Partial<UserBudget>,
) => {
    logger.debug(`userBudget: ${prettyPrint(userBudget)}`);
    return db
        .update(userBudgets)
        .set(userBudget)
        .where(eq(userBudgets.userId, userId))
        .returning();
};
