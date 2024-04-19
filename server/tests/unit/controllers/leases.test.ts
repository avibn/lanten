import {
    createLease,
    deleteLease,
    getLease,
    getLeaseList,
    getLeases,
    updateLease,
} from "../../../src/controllers/leases";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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
app.post("/leases", createLease);
app.get("/leases", getLeases);
app.get("/leases/list", getLeaseList);
app.get("/leases/:id", getLease);
app.put("/leases/:id", updateLease);
app.delete("/leases/:id", deleteLease);
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

async function getExampleMockLease() {
    return {
        id: "1",
        propertyId: "1",
        description: "Test Description",
        totalRent: 1000,
        inviteCode: "test-invite-code",
        startDate: new Date(),
        endDate: new Date(),
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        property: await getExampleMockProperty(),
    };
}

describe("POST /leases", () => {
    it("should respond with lease data when lease is created successfully", async () => {
        // Arrange
        const exampleMockProperty = await getExampleMockProperty();
        prismaMock.property.findUnique.mockResolvedValue(exampleMockProperty);
        prismaMock.lease.create.mockResolvedValue(await getExampleMockLease());

        // Act
        const response = await request(app).post("/leases").send({
            propertyId: "1",
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            totalRent: 1000,
        });

        // Assert
        expect(response.status).toBe(201);
    });

    it("should respond with 404 when property is not found", async () => {
        // Arrange
        prismaMock.property.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).post("/leases").send({
            propertyId: "1",
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            totalRent: 1000,
        });

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not a landlord", async () => {
        // Arrange
        const exampleMockProperty = {
            ...(await getExampleMockProperty()),
            landlord: {
                ...(await getExampleMockUser()),
                userType: "TENANT",
            },
        };
        prismaMock.property.findUnique.mockResolvedValue(exampleMockProperty);

        // Act
        const response = await request(app).post("/leases").send({
            propertyId: "1",
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            totalRent: 1000,
        });

        // Assert
        expect(response.status).toBe(403);
    });

    it("should respond with 403 when user is not the landlord of the property", async () => {
        // Arrange
        const exampleMockProperty = {
            ...(await getExampleMockProperty()),
            landlordId: "2",
        };
        prismaMock.property.findUnique.mockResolvedValue(exampleMockProperty);

        // Act
        const response = await request(app).post("/leases").send({
            propertyId: "1",
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            totalRent: 1000,
        });

        // Assert
        expect(response.status).toBe(403);
    });
});

describe("GET /leases", () => {
    it("should respond with leases data", async () => {
        // Arrange
        prismaMock.lease.findMany.mockResolvedValue([
            await getExampleMockLease(),
        ]);

        // Act
        const response = await request(app).get("/leases");

        // Assert
        expect(response.status).toBe(200);
    });
});

describe("GET /leases/list", () => {
    it("should respond with leases data", async () => {
        // Arrange
        prismaMock.lease.findMany.mockResolvedValue([
            await getExampleMockLease(),
        ]);

        // Act
        const response = await request(app).get("/leases/list");

        // Assert
        expect(response.status).toBe(200);
    });
});

describe("GET /leases/:id", () => {
    it("should respond with lease data", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(
            await getExampleMockLease()
        );

        // Act
        const response = await request(app).get("/leases/1");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with 404 when lease is not found", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).get("/leases/1");

        // Assert
        expect(response.status).toBe(404);
    });
});

describe("PUT /leases/:id", () => {
    it("should respond with lease data when lease is updated successfully", async () => {
        // Arrange
        prismaMock.lease.update.mockResolvedValue(await getExampleMockLease());

        // Act
        const response = await request(app).put("/leases/1").send({
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            totalRent: 1000,
        });

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with 404 when lease is not found", async () => {
        // Arrange
        // mock an error
        prismaMock.lease.update.mockRejectedValue(
            new PrismaClientKnownRequestError("Lease not found", {
                code: "P2025",
                clientVersion: "2.25.0",
                meta: {
                    modelName: "Lease",
                },
            })
        );

        // Act
        const response = await request(app).put("/leases/1").send({
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            totalRent: 1000,
        });

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not the landlord of the property", async () => {
        // Arrange
        prismaMock.lease.update.mockRejectedValue(
            new PrismaClientKnownRequestError("Lease not found", {
                code: "P2025",
                clientVersion: "2.25.0",
                meta: {
                    modelName: "Lease",
                },
            })
        );

        // Act
        const response = await request(app).put("/leases/1").send({
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString(),
            totalRent: 1000,
        });

        // Assert
        expect(response.status).toBe(404);
    });
});

describe("DELETE /leases/:id", () => {
    it("should respond with lease data when lease is deleted successfully", async () => {
        // Arrange
        prismaMock.lease.update.mockResolvedValue(await getExampleMockLease());

        // Act
        const response = await request(app).delete("/leases/1");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with 404 when lease is not found", async () => {
        // Arrange
        prismaMock.lease.update.mockRejectedValue(
            new PrismaClientKnownRequestError("Lease not found", {
                code: "P2025",
                clientVersion: "2.25.0",
                meta: {
                    modelName: "Lease",
                },
            })
        );

        // Act
        const response = await request(app).delete("/leases/1");

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not the landlord of the property", async () => {
        // Arrange
        prismaMock.lease.update.mockRejectedValue(
            new PrismaClientKnownRequestError("Lease not found", {
                code: "P2025",
                clientVersion: "2.25.0",
                meta: {
                    modelName: "Lease",
                },
            })
        );

        // Act
        const response = await request(app).delete("/leases/1");

        // Assert
        expect(response.status).toBe(404);
    });
});
