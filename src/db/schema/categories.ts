import { pgTable, varchar, uuid, serial } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, eq, sql } from "drizzle-orm";
import db from "../../db";
import { users } from "./users";

export const catergories = pgTable("catergories", {
    categoryId: serial("category_id").primaryKey(),
    userId: uuid("user_id").references(() => users.userId),
    name: varchar("name").notNull(),
    color: varchar("color").notNull(),
});

export type Category = InferSelectModel<typeof catergories>;
export type NewCategory = InferInsertModel<typeof catergories>;

const categoorySelectById = db
    .select()
    .from(catergories)
    .where(eq(catergories.categoryId, sql.placeholder("id")))
    .prepare("category_select_by_id");

const categorySelectByUser = db
    .select()
    .from(catergories)
    .where(eq(catergories.userId, sql.placeholder("userId")))
    .prepare("category_select_by_user");

const categoryDeleteById = db
    .delete(catergories)
    .where(eq(catergories.categoryId, sql.placeholder("id")))
    .prepare("category_delete_by_id");

export const getCategoryById = async (id: number) =>
    await categoorySelectById.execute({ id });

export const getUserCategories = async (userId: string) =>
    await categorySelectByUser.execute({ userId });

export const deleteCategory = async (id: number) =>
    await categoryDeleteById.execute({ id });

export const insertCategory = async (newCategory: NewCategory) =>
    db.insert(catergories).values(newCategory).returning();
