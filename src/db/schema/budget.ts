import {
    pgTable,
    varchar,
    uuid,
    date,
    numeric,
    integer,
} from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, eq, sql } from "drizzle-orm";
import db from "../../db";
import { users } from "./users";
import { categories } from "./categories";

export const budget = pgTable("budget", {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
        .notNull()
        .references(() => users.userId),
    name: varchar("name").notNull(),
    dateAdded: date("date_added").notNull(),
    amount: numeric("amount", { scale: 18, precision: 8 }).notNull(),
    categoryId: integer("category_id")
        .notNull()
        .references(() => categories.categoryId),
});

export type Budget = InferSelectModel<typeof budget>;
export type NewBudget = InferInsertModel<typeof budget>;

const budgetSelectByUser = db
    .select()
    .from(budget)
    .where(eq(budget.userId, sql.placeholder("userId")))
    .prepare("budget_select_by_id");

const budgetDeleteById = db
    .delete(budget)
    .where(eq(budget.id, sql.placeholder("id")))
    .prepare("budget_delete_by_id");

const budgetUpdateById = db
    .update(budget)
    .set(sql.placeholder("newBudget"))
    .where(eq(budget.id, sql.placeholder("id")))
    .prepare("budget_update_by_id");

export const insertBudget = async (newBudget: NewBudget) =>
    db.insert(budget).values(newBudget).returning();

export const getUserBudget = async (userId: string) =>
    await budgetSelectByUser.execute({ userId });

export const deleteBudget = async (id: string) =>
    await budgetDeleteById.execute({ id });

export const updateBudget = async (newBudget: NewBudget, id: string) =>
    await budgetUpdateById.execute({ newBudget: newBudget, id: id });
