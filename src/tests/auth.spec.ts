import supertest from "supertest";
import db from "../db";
import app from "..";
import { UserInfo } from "../types";
import { users } from "../db/schema/users";

beforeAll(async () => {
    return await db.delete(users);
});

const user: UserInfo = {
    email: "mhquansah@gmail.com",
    password: "#MTS#@#testing123",
};

test("POST /auth/signup", async () => {
    await supertest(app)
        .post("/auth/signup")
        .send(user)
        .expect(200)
        .then((res) => {
            expect(res.body.msg).toBe("User inserted successfully");
        });
});

test("POST /auth/signup user already exists", async () => {
    await supertest(app)
        .post("/auth/signup")
        .send(user)
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBe("Email is already registered");
        });
});

test("POST /auth/signup validation general", async () => {
    await supertest(app)
        .post("/auth/signup")
        .send({ email: "", password: "" })
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBeInstanceOf(Array);
        });
});

test("POST /auth/signup validation missing items", async () => {
    await supertest(app)
        .post("/auth/signup")
        .send({ email: "", password: "#MTS#@#testing123" })
        .expect(400)
        .then((res) => {
            const { msg } = res.body;
            expect(msg[0].msg).toBe("Invalid Email");
        });

    await supertest(app)
        .post("/auth/signup")
        .send({ email: "mhquansah@gmail.com", password: "" })
        .expect(400)
        .then((res) => {
            const { msg } = res.body;
            expect(msg[0].msg).toBe(
                "Password must be at least 5 characters long",
            );
        });
});

test("POST /auth/signup invalid items", async () => {
    await supertest(app)
        .post("/auth/signup")
        .send({ email: "mhquansah", password: "#MTS#@#testing123" })
        .expect(400)
        .then((res) => {
            const { msg } = res.body;
            expect(msg[0].msg).toBe("Invalid Email");
        });
});

test("POST /auth/login normal", async () => {
    await supertest(app)
        .post("/auth/login")
        .send(user)
        .expect(200)
        .then((res) => {
            const { email } = res.body;
            expect(email).toBe(user.email);
        });
});

test("POST /auth/login user not found", async () => {
    await supertest(app)
        .post("/auth/login")
        .send({ email: "madibahq@gmail.com", password: "#MTS#testing123" })
        .expect(404);
});

test("POST /auth/login validation general", async () => {
    await supertest(app)
        .post("/auth/login")
        .send({ email: "", password: "" })
        .expect(400)
        .then((res) => {
            expect(res.body.msg).toBeInstanceOf(Array);
        });
});

test("POST /auth/login validation missing items", async () => {
    await supertest(app)
        .post("/auth/login")
        .send({ email: "", password: "#MTS#@#testing123" })
        .expect(400)
        .then((res) => {
            const { msg } = res.body;
            expect(msg[0].msg).toBe("Invalid Email");
        });

    await supertest(app)
        .post("/auth/login")
        .send({ email: "mhquansah@gmail.com", password: "" })
        .expect(400)
        .then((res) => {
            const { msg } = res.body;
            expect(msg[0].msg).toBe(
                "Password must be at least 5 characters long",
            );
        });
});

test("POST /auth/login invalid items", async () => {
    await supertest(app)
        .post("/auth/login")
        .send({ email: "mhquansah", password: "#MTS#@#testing123" })
        .expect(400)
        .then((res) => {
            const { msg } = res.body;
            expect(msg[0].msg).toBe("Invalid Email");
        });
});
