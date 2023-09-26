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
import { users } from "./user";
import { categories } from "./category";

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
    .where(eq(budget.userId, sql.placeholder("userId")));

const budgetDeleteById = db
    .delete(budget)
    .where(eq(budget.id, sql.placeholder("id")));

export const insertBudget = async (newBudget: NewBudget) =>
    db.insert(budget).values(newBudget).returning();

export const getUserBudget = async (userId: string) =>
    await budgetSelectByUser.execute({ userId });

export const deleteBudget = async (id: string) =>
    await budgetDeleteById.execute({ id });

export const updateBudget = async (newBudget: NewBudget, id: string) =>
    await db.update(budget).set(newBudget).where(eq(budget.id, id)).returning();
