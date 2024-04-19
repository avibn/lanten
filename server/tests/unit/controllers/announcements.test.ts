import {
    createAnnouncement,
    deleteAnnouncement,
    getAnnouncement,
    getAnnouncements,
    getLatestAnnouncements,
    updateAnnouncement,
} from "../../../src/controllers/announcements";

import { User } from "@prisma/client";
import app from "../../utils/expressApp";
import argon2 from "argon2";
import { errorHandler } from "../../../src/configs/errorHandler";
import express from "express";
import prismaMock from "../../utils/prismaMock";
import request from "supertest";

// Mock session user id
app.use((req, res, next) => {
    req.session.userId = "1"; // Mock the session object
    next();
});

// Create an Express app for testing
app.post("/leases/:id/announcements", createAnnouncement);
app.get("/leases/:id/announcements", getAnnouncements);
const announcementsRouter = express.Router();
announcementsRouter.get("/latest", getLatestAnnouncements);
announcementsRouter.get("/:id", getAnnouncement);
announcementsRouter.put("/:id", updateAnnouncement);
announcementsRouter.delete("/:id", deleteAnnouncement);
app.use("/announcements", announcementsRouter);
app.use(errorHandler);

async function getExampleMockUser(landord: boolean = true): Promise<User> {
    return {
        id: "1",
        email: "test@test.com",
        name: "Test User",
        userType: landord ? "LANDLORD" : "TENANT",
        password: await argon2.hash("correctPassword123"),
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
    };
}

async function getExampleMockProperty(lanlord: boolean = true) {
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
        landlord: await getExampleMockUser(lanlord),
    };
}

async function getExampleMockLease(lanlord: boolean = true) {
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
        property: await getExampleMockProperty(lanlord),
        tenants: [] as unknown[],
    };
}

async function getExampleMockAnnouncement() {
    return {
        id: "1",
        title: "Test Announcement",
        message: "Test Message",
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        leaseId: "1",
        lease: await getExampleMockLease(),
    };
}

describe("POST /leases/:id/announcements", () => {
    it("should respond with announcement data when announcement is created successfully", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);
        prismaMock.announcement.create.mockResolvedValue(
            await getExampleMockAnnouncement()
        );

        // Act
        const response = await request(app)
            .post("/leases/1/announcements")
            .send({
                title: "Test Announcement",
                message: "Test Message",
            });

        // Assert
        expect(response.status).toBe(201);
    });

    it("should respond with 404 when lease is not found", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app)
            .post("/leases/1/announcements")
            .send({
                title: "Test Announcement",
                message: "Test Message",
            });

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not a landlord", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        exampleMockLease.property.landlordId = "2";
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);

        // Act
        const response = await request(app)
            .post("/leases/1/announcements")
            .send({
                title: "Test Announcement",
                message: "Test Message",
            });

        // Assert
        expect(response.status).toBe(403);
    });
});

describe("GET /leases/:id/announcements", () => {
    it("should respond with announcements data when user is landlord", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);
        prismaMock.announcement.findMany.mockResolvedValue([
            await getExampleMockAnnouncement(),
        ]);

        // Act
        const response = await request(app).get("/leases/1/announcements");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with announcements data when user is tenant", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease(false);
        exampleMockLease.tenants = [{ tenantId: "1" }];
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);
        prismaMock.announcement.findMany.mockResolvedValue([
            await getExampleMockAnnouncement(),
        ]);

        // Act
        const response = await request(app).get("/leases/1/announcements");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with 404 when lease is not found", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).get("/leases/1/announcements");

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not landlord or tenant", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        exampleMockLease.property.landlordId = "2";
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);

        // Act
        const response = await request(app).get("/leases/1/announcements");

        // Assert
        expect(response.status).toBe(403);
    });
});

describe("GET /announcements/latest", () => {
    it("should respond with announcements data when user is landlord", async () => {
        // Arrange
        prismaMock.announcement.findMany.mockResolvedValue([
            await getExampleMockAnnouncement(),
        ]);

        // Act
        const response = await request(app).get("/announcements/latest");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with announcements data when user is tenant", async () => {
        // Arrange
        prismaMock.announcement.findMany.mockResolvedValue([
            await getExampleMockAnnouncement(),
        ]);

        // Act
        const response = await request(app).get("/announcements/latest");

        // Assert
        expect(response.status).toBe(200);
    });
});

describe("GET /announcements/:id", () => {
    it("should respond with announcement data when user is landlord", async () => {
        // Arrange
        prismaMock.announcement.findUnique.mockResolvedValue(
            await getExampleMockAnnouncement()
        );

        // Act
        const response = await request(app).get("/announcements/1");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with announcement data when user is tenant", async () => {
        // Arrange
        prismaMock.announcement.findUnique.mockResolvedValue(
            await getExampleMockAnnouncement()
        );

        // Act
        const response = await request(app).get("/announcements/1");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with 404 when announcement is not found", async () => {
        // Arrange
        prismaMock.announcement.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).get("/announcements/1");

        // Assert
        expect(response.status).toBe(404);
    });
});

describe("PUT /announcements/:id", () => {
    it("should respond with announcement data when announcement is updated successfully", async () => {
        // Arrange
        prismaMock.announcement.findUnique.mockResolvedValue(
            await getExampleMockAnnouncement()
        );
        prismaMock.announcement.update.mockResolvedValue(
            await getExampleMockAnnouncement()
        );

        // Act
        const response = await request(app).put("/announcements/1").send({
            title: "Test Announcement",
            message: "Test Message",
        });

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with 404 when announcement is not found", async () => {
        // Arrange
        prismaMock.announcement.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).put("/announcements/1").send({
            title: "Test Announcement",
            message: "Test Message",
        });

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not landlord", async () => {
        // Arrange
        const exampleMockAnnouncement = await getExampleMockAnnouncement();
        exampleMockAnnouncement.lease.property.landlordId = "2";
        prismaMock.announcement.findUnique.mockResolvedValue(
            exampleMockAnnouncement
        );

        // Act
        const response = await request(app).put("/announcements/1").send({
            title: "Test Announcement",
            message: "Test Message",
        });

        // Assert
        expect(response.status).toBe(403);
    });
});

describe("DELETE /announcements/:id", () => {
    it("should respond with 204 when announcement is deleted successfully", async () => {
        // Arrange
        prismaMock.announcement.findUnique.mockResolvedValue(
            await getExampleMockAnnouncement()
        );
        prismaMock.announcement.update.mockResolvedValue(
            await getExampleMockAnnouncement()
        );

        // Act
        const response = await request(app).delete("/announcements/1");

        // Assert
        expect(response.status).toBe(204);
    });

    it("should respond with 404 when announcement is not found", async () => {
        // Arrange
        prismaMock.announcement.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).delete("/announcements/1");

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not landlord", async () => {
        // Arrange
        const exampleMockAnnouncement = await getExampleMockAnnouncement();
        exampleMockAnnouncement.lease.property.landlordId = "2";
        prismaMock.announcement.findUnique.mockResolvedValue(
            exampleMockAnnouncement
        );

        // Act
        const response = await request(app).delete("/announcements/1");

        // Assert
        expect(response.status).toBe(403);
    });
});
