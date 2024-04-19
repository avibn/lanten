import {
    createProperty,
    deleteProperty,
    getProperties,
    getProperty,
    updateProperty,
} from "../../../src/controllers/properties";

import { User } from "@prisma/client";
import app from "../../utils/expressApp";
import argon2 from "argon2";
import { errorHandler } from "../../../src/configs/errorHandler";
import prismaMock from "../../utils/prismaMock";
import request from "supertest";

// Mock session user id
app.use((req, res, next) => {
    req.session.userId = "1"; // Mock the session object
    next();
});

// Create an Express app for testing
app.post("/properties", createProperty);
app.get("/properties", getProperties);
app.get("/properties/:id", getProperty);
app.put("/properties/:id", updateProperty);
app.delete("/properties/:id", deleteProperty);
app.use(errorHandler);

async function getExampleMockUser(): Promise<User> {
    return {
        id: "1",
        email: "test@test.com",
        name: "Test User",
        userType: "LANDLORD",
        password: await argon2.hash("correctPassword123"),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

async function getExampleMockProperty() {
    return {
        id: "1",
        name: "Test Property",
        description: "Test Description",
        address: "Test Address",
        landlordId: "1",
        createdAt: new Date(),
        updatedAt: new Date(),
        isDeleted: false,
        propertyImageId: null,
        landlord: await getExampleMockUser(),
    };
}

describe("POST /properties", () => {
    it("should respond with property data when property is created successfully", async () => {
        // Arrange
        const exampleMockProperty = await getExampleMockProperty();
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser()
        );
        prismaMock.property.create.mockResolvedValue(exampleMockProperty);

        // Act
        const response = await request(app).post("/properties").send({
            name: "Test Property",
            description: "Test Description",
            address: "Test Address",
        });

        // Assert
        expect(response.status).toBe(201);
    });

    it("should respond with 403 when user is not a landlord", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue({
            ...(await getExampleMockUser()),
            userType: "TENANT",
        });

        // Act
        const response = await request(app).post("/properties").send({
            name: "Test Property",
            description: "Test Description",
            address: "Test Address",
        });

        // Assert
        expect(response.status).toBe(403);
    });
});

describe("GET /properties", () => {
    it("should respond with properties data when properties are found", async () => {
        // Arrange
        const exampleMockProperty = await getExampleMockProperty();
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser()
        );
        prismaMock.property.findMany.mockResolvedValue([exampleMockProperty]);

        // Act
        const response = await request(app).get("/properties");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with 403 when user is not a landlord", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue({
            ...(await getExampleMockUser()),
            userType: "TENANT",
        });

        // Act
        const response = await request(app).get("/properties");

        // Assert
        expect(response.status).toBe(403);
    });
});

describe("GET /properties/:id", () => {
    it("should respond with property data when property is found", async () => {
        // Arrange
        const exampleMockProperty = await getExampleMockProperty();
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser()
        );
        prismaMock.property.findUnique.mockResolvedValue(exampleMockProperty);

        // Act
        const response = await request(app).get("/properties/1");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with 403 when user is not a landlord", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue({
            ...(await getExampleMockUser()),
            userType: "TENANT",
        });

        // Act
        const response = await request(app).get("/properties/1");

        // Assert
        expect(response.status).toBe(403);
    });

    it("should respond with 404 when property is not found", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser()
        );
        prismaMock.property.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).get("/properties/1");

        // Assert
        expect(response.status).toBe(404);
    });
});

describe("PUT /properties/:id", () => {
    it("should respond with property data when property is updated successfully", async () => {
        // Arrange
        const exampleMockProperty = await getExampleMockProperty();
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser()
        );
        prismaMock.property.findUnique.mockResolvedValue(exampleMockProperty);
        prismaMock.property.update.mockResolvedValue(exampleMockProperty);

        // Act
        const response = await request(app).put("/properties/1").send({
            name: "Test Property",
            description: "Test Description",
            address: "Test Address",
        });

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with 403 when user is not a landlord", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue({
            ...(await getExampleMockUser()),
            userType: "TENANT",
        });

        // Act
        const response = await request(app).put("/properties/1").send({
            name: "Test Property",
            description: "Test Description",
            address: "Test Address",
        });

        // Assert
        expect(response.status).toBe(403);
    });

    it("should respond with 404 when property is not found", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser()
        );
        prismaMock.property.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).put("/properties/1").send({
            name: "Test Property",
            description: "Test Description",
            address: "Test Address",
        });

        // Assert
        expect(response.status).toBe(404);
    });
});

describe("DELETE /properties/:id", () => {
    it("should respond with 204 when property is deleted successfully", async () => {
        // Arrange
        const exampleMockProperty = await getExampleMockProperty();
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser()
        );
        prismaMock.property.findUnique.mockResolvedValue(exampleMockProperty);

        // Act
        const response = await request(app).delete("/properties/1");

        // Assert
        expect(response.status).toBe(204);
    });

    it("should respond with 403 when user is not a landlord", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue({
            ...(await getExampleMockUser()),
            userType: "TENANT",
        });

        // Act
        const response = await request(app).delete("/properties/1");

        // Assert
        expect(response.status).toBe(403);
    });

    it("should respond with 404 when property is not found", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser()
        );
        prismaMock.property.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).delete("/properties/1");

        // Assert
        expect(response.status).toBe(404);
    });
});
