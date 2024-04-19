import {
    acceptInvite,
    getAllTenants,
    getInvites,
    getLeaseTenants,
    inviteTenant,
    leaveLease,
    removeInvite,
    removeTenant,
    updateTenant,
} from "../../../src/controllers/tenants";

import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
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
app.post("/leases/join", acceptInvite);
app.get("/leases/tenants", getAllTenants);
const tenantRouter = express.Router({ mergeParams: true });
tenantRouter.get("/", getLeaseTenants);
tenantRouter.put("/", updateTenant);
tenantRouter.get("/invites", getInvites);
tenantRouter.post("/invites", inviteTenant);
tenantRouter.delete("/invites/:inviteId", removeInvite);
tenantRouter.post("/leave", leaveLease);
tenantRouter.post("/remove", removeTenant);
app.use("/leases/:id/tenants", tenantRouter);
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

async function getExampleMockLeaseTenant(lanlord: boolean = true) {
    return {
        id: "1",
        individualRent: 500,
        isDeleted: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        leaseId: "1",
        lease: await getExampleMockLease(lanlord),
        tenantId: "1",
        tenant: await getExampleMockUser(!lanlord),
    };
}

async function getExampleMockLeaseTenantInvite(lanlord: boolean = true) {
    return {
        id: "1",
        email: "invited@email.com",
        inviteCode: "test-invite-code",
        isUsed: false,
        isDeleted: false,
        expiresAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        leaseId: "1",
        lease: await getExampleMockLease(lanlord),
    };
}

describe("POST /leases/:id/tenants/invites", () => {
    it("should respond with 204 when tenant is invited successfully", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);
        prismaMock.leaseTenantInvite.findFirst.mockResolvedValue(null);
        prismaMock.leaseTenantInvite.create.mockResolvedValue(
            await getExampleMockLeaseTenantInvite()
        );

        // Act
        const response = await request(app)
            .post("/leases/1/tenants/invites")
            .send({
                tenantEmail: "invite@email.com",
            });

        // Assert
        expect(response.status).toBe(204);
    });

    it("should respond with 404 when lease is not found", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app)
            .post("/leases/1/tenants/invites")
            .send({
                tenantEmail: "invite@email.com",
            });

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not landlord", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        exampleMockLease.property.landlord.id = "2";
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);

        // Act
        const response = await request(app)
            .post("/leases/1/tenants/invites")
            .send({
                tenantEmail: "invite@email.com",
            });

        // Assert
        expect(response.status).toBe(403);
    });

    it("should respond with 400 when landlord is inviting themselves", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        (exampleMockLease.property.landlord.email = "invite@email.com"),
            prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);

        // Act
        const response = await request(app)
            .post("/leases/1/tenants/invites")
            .send({
                tenantEmail: "invite@email.com",
            });

        // Assert
        expect(response.status).toBe(400);
    });

    it("should respond with 400 when tenant is already in lease", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        exampleMockLease.tenants = [await getExampleMockLeaseTenant()];
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);

        // Act
        const response = await request(app)
            .post("/leases/1/tenants/invites")
            .send({
                tenantEmail: "test@test.com",
            });

        // Assert
        expect(response.status).toBe(400);
    });

    it("should respond with 400 when tenant already has an invite", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(
            await getExampleMockLease()
        );
        prismaMock.leaseTenantInvite.findFirst.mockResolvedValue(
            await getExampleMockLeaseTenantInvite()
        );

        // Act
        const response = await request(app)
            .post("/leases/1/tenants/invites")
            .send({
                tenantEmail: "invite@email.com",
            });

        // Assert
        expect(response.status).toBe(400);
    });
});

describe("POST /leases/join", () => {
    it("should respond with lease tenant data when invite is accepted successfully", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser(false)
        );
        prismaMock.lease.findFirst.mockResolvedValue(exampleMockLease);
        prismaMock.leaseTenantInvite.findFirst.mockResolvedValue(
            await getExampleMockLeaseTenantInvite(false)
        );
        prismaMock.leaseTenant.create.mockResolvedValue(
            await getExampleMockLeaseTenant(false)
        );

        // Act
        const response = await request(app).post("/leases/join").send({
            inviteCode: "test-invite-code",
        });

        // Assert
        expect(response.status).toBe(201);
    });

    it("should respond with 404 when lease is not found", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser(false)
        );
        prismaMock.lease.findFirst.mockResolvedValue(null);

        // Act
        const response = await request(app).post("/leases/join").send({
            inviteCode: "test-invite-code",
        });

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 404 when lease tenant invite is not found", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser(false)
        );
        prismaMock.lease.findFirst.mockResolvedValue(
            await getExampleMockLease(false)
        );
        prismaMock.leaseTenantInvite.updateMany.mockRejectedValue(
            new PrismaClientKnownRequestError("Not found", {
                code: "P2025",
                clientVersion: "2.25.0",
                meta: {
                    target: "leaseTenantInvite",
                    key: "leaseId",
                },
            })
        );

        // Act
        const response = await request(app).post("/leases/join").send({
            inviteCode: "test-invite-code",
        });

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not a tenant", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser(true)
        );
        const exampleMockLease = await getExampleMockLease(true);
        prismaMock.lease.findFirst.mockResolvedValue(exampleMockLease);

        // Act
        const response = await request(app).post("/leases/join").send({
            inviteCode: "test-invite-code",
        });

        // Assert
        expect(response.status).toBe(403);
    });

    it("should respond with 403 when tenant is already in lease", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser(false)
        );
        const exampleMockLease = await getExampleMockLease(false);
        exampleMockLease.tenants = [await getExampleMockLeaseTenant(false)];
        prismaMock.lease.findFirst.mockResolvedValue(exampleMockLease);

        // Act
        const response = await request(app).post("/leases/join").send({
            inviteCode: "test-invite-code",
        });

        // Assert
        expect(response.status).toBe(403);
    });

    it("should respond with 400 when invite is expired", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser(false)
        );
        const exampleMockLease = await getExampleMockLease(false);
        prismaMock.lease.findFirst.mockResolvedValue(exampleMockLease);
        prismaMock.leaseTenantInvite.findFirst.mockResolvedValue({
            ...(await getExampleMockLeaseTenantInvite(false)),
            expiresAt: new Date(0),
        });
        prismaMock.leaseTenantInvite.updateMany.mockRejectedValue(
            // Greater than
            new PrismaClientKnownRequestError("Not found", {
                code: "P2025",
                clientVersion: "2.25.0",
                meta: {
                    target: "leaseTenantInvite",
                    key: "leaseId",
                },
            })
        );

        // Act
        const response = await request(app).post("/leases/join").send({
            inviteCode: "test-invite-code",
        });

        // Assert
        expect(response.status).toBe(404);
    });
});

describe("GET /leases/:id/tenants/invites", () => {
    it("should respond with invites data", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(
            await getExampleMockLease()
        );
        prismaMock.leaseTenantInvite.findMany.mockResolvedValue([
            await getExampleMockLeaseTenantInvite(),
        ]);

        // Act
        const response = await request(app).get("/leases/1/tenants/invites");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with 404 when lease is not found", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).get("/leases/1/tenants/invites");

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not landlord", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        exampleMockLease.property.landlordId = "2";
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);

        // Act
        const response = await request(app).get("/leases/1/tenants/invites");

        // Assert
        expect(response.status).toBe(403);
    });
});

describe("DELETE /leases/:id/tenants/invites/:inviteId", () => {
    it("should respond with 204 when invite is removed successfully", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);
        prismaMock.leaseTenantInvite.update.mockResolvedValue(
            await getExampleMockLeaseTenantInvite()
        );

        // Act
        const response = await request(app).delete(
            "/leases/1/tenants/invites/1"
        );

        // Assert
        expect(response.status).toBe(204);
    });

    it("should respond with 404 when lease is not found", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).delete(
            "/leases/1/tenants/invites/1"
        );

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not landlord", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        exampleMockLease.property.landlordId = "2";
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);

        // Act
        const response = await request(app).delete(
            "/leases/1/tenants/invites/1"
        );

        // Assert
        expect(response.status).toBe(403);
    });
});

describe("POST /leases/:id/tenants/leave", () => {
    it("should respond with 204 when tenant leaves lease successfully", async () => {
        // Arrange
        prismaMock.leaseTenant.deleteMany.mockResolvedValue({ count: 1 });

        // Act
        const response = await request(app).post("/leases/1/tenants/leave");

        // Assert
        expect(response.status).toBe(204);
    });

    it("should respond with 404 when lease tenant is not found", async () => {
        // Arrange
        prismaMock.leaseTenant.deleteMany.mockResolvedValue({ count: 0 });

        // Act
        const response = await request(app).post("/leases/1/tenants/leave");

        // Assert
        expect(response.status).toBe(404);
    });
});

describe("POST /leases/:id/tenants/remove", () => {
    it("should respond with 204 when tenant is removed from lease successfully", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(
            await getExampleMockLease()
        );
        prismaMock.leaseTenant.update.mockResolvedValue(
            await getExampleMockLeaseTenant()
        );

        // Act
        const response = await request(app)
            .post("/leases/1/tenants/remove")
            .send({
                leaseTenantId: "1",
            });

        // Assert
        expect(response.status).toBe(204);
    });

    it("should respond with 404 when lease is not found", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app)
            .post("/leases/1/tenants/remove")
            .send({
                leaseTenantId: "1",
            });

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not landlord", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        exampleMockLease.property.landlordId = "2";
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);

        // Act
        const response = await request(app)
            .post("/leases/1/tenants/remove")
            .send({
                leaseTenantId: "1",
            });

        // Assert
        expect(response.status).toBe(403);
    });

    it("should respond with 404 when tenant is not found in lease", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(
            await getExampleMockLease()
        );
        prismaMock.leaseTenant.update.mockRejectedValue(
            new PrismaClientKnownRequestError("Not found", {
                code: "P2025",
                clientVersion: "2.25.0",
                meta: {
                    target: "leaseTenant",
                    key: "id",
                },
            })
        );

        // Act
        const response = await request(app)
            .post("/leases/1/tenants/remove")
            .send({
                leaseTenantId: "1",
            });

        // Assert
        expect(response.status).toBe(404);
    });
});

describe("GET /leases/:id/tenants", () => {
    it("should respond with lease tenants data", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(
            await getExampleMockLease()
        );
        prismaMock.leaseTenant.findMany.mockResolvedValue([
            await getExampleMockLeaseTenant(),
        ]);

        // Act
        const response = await request(app).get("/leases/1/tenants");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with 404 when lease is not found", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).get("/leases/1/tenants");

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not landlord", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        exampleMockLease.property.landlordId = "2";
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);

        // Act
        const response = await request(app).get("/leases/1/tenants");

        // Assert
        expect(response.status).toBe(403);
    });
});

describe("PUT /leases/:id/tenants", () => {
    it("should respond with lease tenant data when tenant is updated successfully", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(
            await getExampleMockLease()
        );
        prismaMock.leaseTenant.updateMany.mockResolvedValue({
            count: 1,
        });

        // Act
        const response = await request(app).put("/leases/1/tenants").send({
            leaseTenantId: "1",
            individualRent: 500,
        });

        // Assert
        console.log("response: ", response.body);
        expect(response.status).toBe(200);
    });

    it("should respond with 404 when lease is not found", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).put("/leases/1/tenants").send({
            leaseTenantId: "1",
            individualRent: 500,
        });

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not landlord", async () => {
        // Arrange
        const exampleMockLease = await getExampleMockLease();
        exampleMockLease.property.landlordId = "2";
        prismaMock.lease.findUnique.mockResolvedValue(exampleMockLease);

        // Act
        const response = await request(app).put("/leases/1/tenants").send({
            leaseTenantId: "1",
            individualRent: 500,
        });

        // Assert
        expect(response.status).toBe(403);
    });

    it("should respond with 404 when tenant is not found in lease", async () => {
        // Arrange
        prismaMock.lease.findUnique.mockResolvedValue(
            await getExampleMockLease()
        );
        prismaMock.leaseTenant.updateMany.mockRejectedValue(
            new PrismaClientKnownRequestError("Not found", {
                code: "P2025",
                clientVersion: "2.25.0",
                meta: {
                    target: "leaseTenant",
                    key: "id",
                },
            })
        );

        // Act
        const response = await request(app).put("/leases/1/tenants").send({
            leaseTenantId: "1",
            individualRent: 500,
        });

        // Assert
        expect(response.status).toBe(404);
    });
});

describe("GET /tenants", () => {
    it("should respond with tenants data", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser(true)
        );
        prismaMock.leaseTenant.findMany.mockResolvedValue([
            await getExampleMockLeaseTenant(true),
        ]);

        // Act
        const response = await request(app).get("/leases/tenants");

        // Assert
        expect(response.status).toBe(200);
    });

    it("should respond with 404 when user is not found", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue(null);

        // Act
        const response = await request(app).get("/leases/tenants");

        // Assert
        expect(response.status).toBe(404);
    });

    it("should respond with 403 when user is not landlord", async () => {
        // Arrange
        prismaMock.user.findUnique.mockResolvedValue(
            await getExampleMockUser(false)
        );

        // Act
        const response = await request(app).get("/leases/tenants");

        // Assert
        expect(response.status).toBe(403);
    });
});
