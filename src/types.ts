import type { Request } from "express";
import { NewCategory } from "./db/schema/category";

export interface UserInfo {
    userId?: string;
    email: string;
    password: string;
    hasCreatedBudget?: boolean;
    accessToken?: string;
    refreshToken?: string;
}

export interface ServiceReturn {
    status: number;
    data: any;
    extra?: any;
}

export type CustomRequest<Params = unknown, ReqBody = unknown> = Request<
    Params,
    unknown,
    ReqBody
>;

export interface LoginRequest {
    refreshKey?: string;
    email: string;
    password: string;
}

export interface BudgetOptions {
    income: number;
    options: { weight: number; category: NewCategory }[];
}

export interface Options {
    options: { defaultCurrency: string };
}
