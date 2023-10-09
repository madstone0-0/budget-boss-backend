import { pgTable, varchar, uuid, serial } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, eq, sql } from "drizzle-orm";
import db from "../../db";
import { users } from "./user";

export const categories = pgTable("category", {
    categoryId: serial("category_id").primaryKey(),
    userId: uuid("user_id").references(() => users.userId),
    name: varchar("name").notNull(),
    color: varchar("color").notNull(),
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

export const getCategoryById = async (id: number) =>
    await categorySelectById.execute({ id });

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
