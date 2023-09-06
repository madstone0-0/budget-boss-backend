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

export const getUser = async (email: string) =>
    await db.select().from(users).where(eq(users.email, email)).limit(1);

export const getUserById = async (id: string) =>
    await db.select().from(users).where(eq(users.userId, id)).limit(1);

export const insertUser = async (user: NewUser) =>
    db.insert(users).values(user).returning();
