import supertest from "supertest";
import db from "../db";
import app from "..";
import { UserInfo } from "../types";
import { users } from "../db/schema/users";

test("GET /info", async () => {
    await supertest(app)
        .get("/info")
        .expect(200)
        .then((res) => {
            expect(res.body == "INVEBB Backend Server");
        });
});
