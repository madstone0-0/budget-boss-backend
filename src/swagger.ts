const swaggerAutogen = require("swagger-autogen")({ openapi: "3.0.0" });

const doc = {
    info: {
        title: "INVEBB API",
        description: "INVEBB API Documentation",
    },
    servers: [
        {
            url: `http://localhost:10500`,
            description: "Development server",
        },
        {
            url: `http://localhost:80`,
            description: "Production server",
        },
    ],
    // host: `${HOST}:${PORT}`,
    schemes: ["http"],
    // components: {
    //     "@schemas": {
    //         UserInfo: {
    //             type: "object",
    //             properties: {
    //                 email: {
    //                     type: "string",
    //                     description: "User email",
    //                 },
    //                 password: {
    //                     type: "string",
    //                     description: "User password",
    //                 },
    //             },
    //         },
    //     },
    //     examples: {
    //         UserInfo: {
    //             value: {
    //                 email: "abc@gmail",
    //                 password: "123456",
    //             },
    //             summary: "User info",
    //         },
    //     },
    // },
    definitions: {
        UserInfo: {
            email: "abc@gmail.com",
            password: "123456",
        },
        Budget: {
            id: "uuid",
            name: "budget 1",
            amount: "1000",
            dateadded: "2021-01-01",
            categoryid: "uuid",
        },
        NewBudget: {
            name: "budget 1",
            amount: "1000",
            dateadded: "2021-01-01",
            categoryid: "uuid",
        },
        BudgetOptions: {
            id: "uuid",
        },
        Category: {
            categoryid: "1",
            userId: "uuid",
            name: "Cash",
            color: "#000000",
        },
        NewCategory: {
            userId: "uuid",
            name: "Cash",
            color: "#000000",
        },
        ErrorResponse: {
            msg: "Error message",
        },
    },
};

const outputFile = "./swagger_output.json";
const endpointFiles = ["./src/index.ts"];

swaggerAutogen(outputFile, endpointFiles, doc);
