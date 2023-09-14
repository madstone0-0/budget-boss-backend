import supertest from "supertest";
import db from "../db";
import { NewBudget, budget } from "../db/schema/budget";
import { User, users } from "../db/schema/users";
import UserService from "../services/UserService";
import { UserInfo, ServiceReturn } from "../types";
import crypto, { randomUUID } from "crypto";
import { sign } from "jsonwebtoken";
import app from "..";

import { NewCategory, insertCategory } from "../db/schema/categories";

let userWithToken: UserInfo;

let testBudget: NewBudget;

beforeAll(async () => {
    const user: UserInfo = {
        email: "madibahq@gmail.com",
        password: "#MTS#@#testing123",
    };

    await new UserService().SignUp(user);
    await new UserService()
        .Login(user, (userId) => {
            const SECRET_KEY = process.env.SECRET_KEY!;
            const refreshId = userId + SECRET_KEY;
            const salt = crypto.randomBytes(16).toString("base64");
            const hash = crypto
                .createHmac("sha512", salt)
                .update(refreshId)
                .digest("base64");
            const token = sign(user, SECRET_KEY, {
                expiresIn: "3h",
            });
            const b = Buffer.from(hash);
            const refreshToken = b.toString("base64");
            return { accessToken: token, refreshToken: refreshToken };
        })
        .then(async (res) => {
            userWithToken = res.data.userDetails;
            const testCategory: NewCategory = {
                name: "Ballin",
                userId: userWithToken.userId,
                color: "#FFFFFF",
            };

            insertCategory(testCategory).then((res) => {
                testBudget = {
                    userId: userWithToken.userId!,
                    name: "Ballin",
                    amount: "4000",
                    dateAdded: new Date().toString(),
                    categoryId: res[0].categoryId,
                    id: randomUUID(),
                };
            });
        });
    // await db.delete(users);
    // return await db.delete(budget);
});

test("GET /budget/info check validation", async () => {
    await supertest(app).get("/budget/info").send(userWithToken).expect(200);
});

test("POST /budget/add/:id", async () => {
    await supertest(app)
        .post(`/budget/add/${userWithToken.userId}`)
        .send({
            ...testBudget,
            accessToken: userWithToken.accessToken!,
            refreshToken: userWithToken.refreshToken!,
        })
        .expect(200);
});

// test("GET /budget/:id get budget", async () => {
//     await supertest(app).get(`/budget/${userWithToken.userId}`).expect(200);
// });

test("PUT /budget/update/:id update budget", async () => {
    await supertest(app)
        .put(`/budget/update/${testBudget.id}`)
        .send({
            ...testBudget,
            accessToken: userWithToken.accessToken!,
            refreshToken: userWithToken.refreshToken!,
        })
        .expect(200);
});

test("DELETE /budget/delete/:id delete budget", async () => {
    await supertest(app)
        .delete(`/budget/delete/${testBudget.id}`)
        .send({
            ...testBudget,
            accessToken: userWithToken.accessToken!,
            refreshToken: userWithToken.refreshToken!,
        })
        .expect(200);
});

test("GET /budget/all/:id get all budgets", async () => {
    await supertest(app)
        .get(`/budget/all/${userWithToken.userId}`)
        .send(userWithToken)
        .expect(200);
});
