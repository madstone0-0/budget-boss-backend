import { pgTable, varchar, uuid, serial, numeric } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, eq, sql, and } from "drizzle-orm";
import db from "../../db";
import { users } from "./user";
import { logger } from "../../logging";
import { prettyPrint } from "../..";

export const categories = pgTable("category", {
    categoryId: serial("category_id").primaryKey(),
    userId: uuid("user_id").references(() => users.userId),
    name: varchar("name").notNull(),
    color: varchar("color").notNull(),
    weight: numeric("weight", { scale: 5, precision: 2 })
        .notNull()
        .default("0"),
});

export type Category = InferSelectModel<typeof categories>;
export type NewCategory = InferInsertModel<typeof categories>;

export const STARTING_CATEGORIES: NewCategory[] = [
    { name: "Shopping", color: "#E4D00A" },
    { name: "Health", color: "#2567F9" },
    { name: "Food", color: "#FF3C82" },
];

const categorySelectById = db
    .select()
    .from(categories)
    .where(eq(categories.categoryId, sql.placeholder("id")))
    .orderBy(categories.categoryId);

const categorySelectByUser = db
    .select()
    .from(categories)
    .where(eq(categories.userId, sql.placeholder("userId")))
    .orderBy(categories.categoryId);

const categoryDeleteById = db
    .delete(categories)
    .where(eq(categories.categoryId, sql.placeholder("id")));

const categorySelectByName = db
    .select()
    .from(categories)
    .where(
        and(
            eq(categories.userId, sql.placeholder("userId")),
            eq(categories.name, sql.placeholder("name")),
        ),
    )
    .orderBy(categories.categoryId);

const categoryTotalWeight = db
    .select({ total: sql<number>`sum(weight)` })
    .from(categories)
    .where(eq(categories.userId, sql.placeholder("userId")));

export const getCategoryById = async (id: number) => {
    return await categorySelectById.execute({ id });
};

export const getCategoryByName = async (userId: string, name: string) =>
    await categorySelectByName.execute({ userId, name });

export const getUserCategories = async (userId: string) =>
    await categorySelectByUser.execute({ userId });

export const deleteCategory = async (id: number) =>
    await categoryDeleteById.execute({ id });

export const insertCategory = async (newCategory: NewCategory) =>
    db.insert(categories).values(newCategory).returning();

export const updateCategory = async (newCategory: NewCategory, id: number) =>
    db
        .update(categories)
        .set(newCategory)
        .where(eq(categories.categoryId, id))
        .returning();

export const getTotalUserWeight = async (userId: string) => {
    const total = await categoryTotalWeight.execute({ userId });
    return total[0].total;
};
