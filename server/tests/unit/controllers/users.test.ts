import {
    login,
    logout,
    me,
    signUp,
    updatePassword,
} from "../../../src/controllers/users";

import { User } from "@prisma/client";
import app from "../../expressApp";
import argon2 from "argon2";
import { errorHandler } from "../../../src/configs/errorHandler";
import prismaMock from "../../prismaMock";
import request from "supertest";

// Create an Express app for testing
app.post("/users/login", login);
app.post("/users/signup", signUp);
app.post("/users/logout", logout);
app.patch("/users/update-password", updatePassword);
app.get("/users/me", me);
app.use(errorHandler);

function expectSessionCookie(response: request.Response, not = false) {
    const checkArray = expect.arrayContaining([
        expect.stringContaining("connect.sid="),
    ]);
    const checkArrayEmpty = expect.arrayContaining([
        expect.stringContaining("connect.sid=;"),
    ]);

    if (not) {
        expect(response.headers["set-cookie"]).toEqual(checkArrayEmpty);
    } else {
        expect(response.headers["set-cookie"]).toEqual(checkArray);
    }
}

async function getExampleMockUser(): Promise<User> {
    return {
        id: "1",
        email: "test@test.com",
        name: "Test User",
        userType: "TENANT",
        password: await argon2.hash("correctPassword123"),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

describe("POST /users/login", () => {
    it("should respond with user data when login is successful", async () => {
        const exampleMockUser = await getExampleMockUser();
        prismaMock.user.findUnique.mockResolvedValue(exampleMockUser);

        // Act
        const response = await request(app).post("/users/login").send({
            email: exampleMockUser.email,
            password: "correctPassword123",
        });

        // Assert
        expect(response.status).toBe(201);
        expect(response.body).toEqual({
            id: exampleMockUser.id,
            email: exampleMockUser.email,
            name: exampleMockUser.name,
            userType: exampleMockUser.userType,
        });
        expectSessionCookie(response);
    });

    it("should respond with 401 when email is invalid", async () => {
        // Act
        const response = await request(app)
            .post("/users/login")
            .send({ email: "invalid_email", password: "correctPassword123" });

        // Assert
        expect(response.status).toBe(400);
    });

    it("should respond with 401 when password is incorrect", async () => {
        const exampleMockUser = await getExampleMockUser();
        prismaMock.user.findUnique.mockResolvedValue(exampleMockUser);

        // Act
        const response = await request(app).post("/users/login").send({
            email: exampleMockUser.email,
            password: "incorrectPassword123",
        });

        // Assert
        expect(response.status).toBe(401);
    });

    it("should respond with 401 when user is not found", async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).post("/users/login").send({
            email: "random_email@email.com",
            password: "randomPassword123",
        });

        // Assert
        expect(response.status).toBe(401);
    });
});

describe("POST /users/signup", () => {
    it("should respond with user data when signup is successful", async () => {
        // Arrange
        const exampleMockUser = await getExampleMockUser();
        prismaMock.user.create.mockResolvedValue(exampleMockUser);

        // Act
        const response = await request(app).post("/users/signup").send({
            email: exampleMockUser.email,
            name: exampleMockUser.name,
            password: "correctPassword123",
            type: "tenant",
        });

        // Assert
        expect(response.status).toBe(201);
        expectSessionCookie(response);
    });

    it("should respond with 400 when email is invalid", async () => {
        // Act
        const response = await request(app).post("/users/signup").send({
            email: "invalid_email",
            name: "Test User",
            password: "correctPassword123",
            type: "tenant",
        });

        // Assert
        expect(response.status).toBe(400);
    });

    it("should respond with 400 when password is invalid", async () => {
        // Act
        const response = await request(app).post("/users/signup").send({
            email: "email@email.com",
            name: "Test User",
            password: "invalid",
            type: "tenant",
        });

        // Assert
        expect(response.status).toBe(400);
    });

    it("should respond with 409 when email is already in use", async () => {
        // Arrange
        const exampleMockUser = await getExampleMockUser();
        prismaMock.user.findUnique.mockResolvedValue(exampleMockUser);

        // Act
        const response = await request(app).post("/users/signup").send({
            email: exampleMockUser.email,
            name: exampleMockUser.name,
            password: "correctPassword123",
            type: "tenant",
        });

        // Assert
        expect(response.status).toBe(409);
    });
});

describe("POST /users/logout", () => {
    it("should clear session cookie and respond with 204", async () => {
        // Arrange
        const exampleMockUser = await getExampleMockUser();
        prismaMock.user.findUnique.mockResolvedValue(exampleMockUser);

        // Act
        const loginResponse = await request(app).post("/users/login").send({
            email: exampleMockUser.email,
            password: "correctPassword123",
        });
        const response = await request(app)
            .post("/users/logout")
            .set("Cookie", loginResponse.headers["set-cookie"]);

        // Assert
        expect(response.status).toBe(204);
        expectSessionCookie(response, true);
    });
});

describe("PATCH /users/update-password", () => {
    it("should respond with 204 when password is updated successfully", async () => {
        // Arrange
        const exampleMockUser = await getExampleMockUser();
        prismaMock.user.findUnique.mockResolvedValue(exampleMockUser);
        prismaMock.user.update.mockResolvedValue(exampleMockUser);

        // Act
        const response = await request(app)
            .patch("/users/update-password")
            .send({
                oldPassword: "correctPassword123",
                newPassword: "newPassword123",
            });

        // Assert
        expect(response.status).toBe(204);
    });

    it("should respond with 400 when old password is invalid", async () => {
        // Arrange
        const exampleMockUser = await getExampleMockUser();
        prismaMock.user.findUnique.mockResolvedValue(exampleMockUser);

        // Act
        const resposne = await request(app)
            .patch("/users/update-password")
            .send({
                oldPassword: "incorrectPassword123",
                newPassword: "newPassword123",
            });

        // Assert
        expect(resposne.status).toBe(401);
    });

    it("should respond with 401 when user is not found", async () => {
        prismaMock.user.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app)
            .patch("/users/update-password")
            .send({
                oldPassword: "correctPassword123",
                newPassword: "newPassword123",
            });

        // Assert
        expect(response.status).toBe(401);
    });
});

describe("GET /users/me", () => {
    it("should respond with user data when user is authenticated", async () => {
        // Arrange
        const exampleMockUser = await getExampleMockUser();
        prismaMock.user.findUnique.mockResolvedValue(exampleMockUser);

        // Act
        const response = await request(app).get("/users/me");

        // Assert
        expect(response.status).toBe(200);
        expect(response.body).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                email: expect.any(String),
                name: expect.any(String),
                userType: expect.any(String),
            })
        );
    });

    it("should respond with 401 when user is not authenticated", async () => {
        // Act
        const response = await request(app).get("/users/me");

        // Assert
        expect(response.status).toBe(401);
    });
});
