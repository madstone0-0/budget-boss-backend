import { pgTable, varchar, uuid } from "drizzle-orm/pg-core";
import { InferInsertModel, InferSelectModel, eq, sql } from "drizzle-orm";
import db from "../../db";

export const users = pgTable("users", {
    userId: uuid("user_id").primaryKey().defaultRandom(),
    email: varchar("email").notNull(),
    salt: varchar("salt").notNull(),
    passhash: varchar("passhash").notNull(),
});

export type User = InferSelectModel<typeof users>;
export type NewUser = InferInsertModel<typeof users>;

const userSelectById = db
    .select()
    .from(users)
    .where(eq(users.userId, sql.placeholder("id")))
    .prepare("user_select_by_id");

const userSelectByEmail = db
    .select()
    .from(users)
    .where(eq(users.email, sql.placeholder("email")))
    .limit(1)
    .prepare("user_select_by_email");

const userDeleteById = db
    .delete(users)
    .where(eq(users.userId, sql.placeholder("id")))
    .prepare("user_delete_by_id");

export const getUser = async (email: string) =>
    await userSelectByEmail.execute({ email: email });

export const getUserById = async (id: string) =>
    await userSelectById.execute({ id: id });

export const insertUser = async (user: NewUser) =>
    db.insert(users).values(user).returning();

export const deleteUser = async (id: string) =>
    await userDeleteById.execute({ id });
