import { CurrencySchema } from "../utils/schemas";
import { RequestHandler } from "express";
import assertIsDefined from "../utils/assertIsDefined";
import createHttpError from "http-errors";
import { nanoid } from "../utils/nanoid";
import prisma from "../utils/prismaClient";
import { userType } from "@prisma/client";
import { z } from "zod";

const InviteTenantBody = z.object({
    tenantEmail: z.string().email(),
});

export const inviteTenant: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);
        const leaseId = req.params.id;
        const { tenantEmail } = InviteTenantBody.parse(req.body);

        // check if lease exists
        const lease = await prisma.lease.findUnique({
            where: {
                id: leaseId,
                isDeleted: false,
            },
            include: {
                tenants: {
                    include: {
                        tenant: true,
                    },
                },
                property: {
                    select: {
                        landlord: {
                            select: {
                                id: true,
                                email: true,
                            },
                        },
                    },
                },
            },
        });

        // Check if lease exists
        if (!lease) {
            throw createHttpError(404, "Specified lease not found");
        }
        // Check if user is landlord
        if (lease.property.landlord.id !== req.session.userId) {
            throw createHttpError(403, "Only landlords can invite tenants");
        }
        // check if landlord is inviting themselves
        if (lease.property.landlord.email === tenantEmail) {
            throw createHttpError(400, "You cannot invite yourself to a lease");
        }

        // check email against existing tenants
        const existingTenant = lease.tenants.some(
            (leaseTenant) => leaseTenant.tenant.email === tenantEmail
        );
        if (existingTenant) {
            throw createHttpError(400, "Tenant already in lease");
        }

        // check if tenant already has an invite
        const existingInvite = await prisma.leaseTenantInvite.findFirst({
            where: {
                email: tenantEmail,
                leaseId,
                OR: [
                    {
                        expiresAt: {
                            gt: new Date(),
                        },
                    },
                    {
                        createdAt: {
                            gt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
                        },
                    },
                ],
            },
            orderBy: {
                createdAt: "desc", // get the most recent invite
            },
        });

        if (existingInvite) {
            throw createHttpError(
                400,
                "You have already invited this tenant. Please try again later."
            );
        }

        // add invite to database
        await prisma.leaseTenantInvite.create({
            data: {
                email: tenantEmail,
                inviteCode: nanoid(10),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
                lease: {
                    connect: {
                        id: leaseId,
                    },
                },
            },
        });

        // todo: add to email queue

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const AcceptInviteBody = z.object({
    inviteCode: z.string(),
});

export const acceptInvite: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);
        const { inviteCode } = AcceptInviteBody.parse(req.body);

        // check user is a tenant
        const user = await prisma.user.findUnique({
            where: {
                id: req.session.userId,
            },
        });

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        if (user.userType !== userType.TENANT) {
            throw createHttpError(403, "Only tenants can accept lease invites");
        }

        // try get lease from global invite code or tenant invite code (email invite)
        const lease =
            (await prisma.lease.findFirst({
                where: {
                    inviteCode,
                    isDeleted: false,
                },
                include: {
                    tenants: true,
                },
            })) ||
            (
                await prisma.leaseTenantInvite.findFirst({
                    where: {
                        inviteCode,
                        email: user.email,
                        isUsed: false,
                        isDeleted: false,
                        expiresAt: {
                            gt: new Date(),
                        },
                    },
                    select: {
                        lease: {
                            include: {
                                tenants: true,
                            },
                        },
                    },
                })
            )?.lease;

        if (!lease) {
            throw createHttpError(404, "Lease with invite code not found");
        }

        // check if tenant is already in lease
        if (
            lease.tenants.some(
                (tenant) => tenant.tenantId === req.session.userId
            )
        ) {
            throw createHttpError(
                403,
                "You are already a tenant in this lease"
            );
        }

        // update invite to used
        await prisma.leaseTenantInvite.updateMany({
            where: {
                leaseId: lease.id,
                email: user.email,
                isUsed: false,
                isDeleted: false,
                expiresAt: {
                    gt: new Date(),
                },
            },
            data: {
                isUsed: true,
            },
        });

        // create lease tenant connection
        const leaseTenant = await prisma.leaseTenant.create({
            data: {
                lease: {
                    connect: {
                        id: lease?.id,
                    },
                },
                tenant: {
                    connect: {
                        id: req.session.userId,
                    },
                },
            },
        });

        res.status(201).json(leaseTenant);
    } catch (error) {
        next(error);
    }
};

export const getInvites: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);
        const leaseId = req.params.id;

        // get lease to check if user is landlord
        const lease = await prisma.lease.findUnique({
            where: {
                id: leaseId,
                isDeleted: false,
            },
            include: {
                property: {
                    select: {
                        landlordId: true,
                    },
                },
            },
        });

        if (!lease) {
            throw createHttpError(404, "Lease not found");
        }

        // check if user is landlord of lease
        if (lease.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "You are not the landlord of this lease"
            );
        }

        // get invites for tenant
        const invites = await prisma.leaseTenantInvite.findMany({
            where: {
                leaseId,
                isUsed: false,
                expiresAt: {
                    gt: new Date(),
                }, // todo:: maybe add a resend invite button
                isDeleted: false,
            },
        });

        res.status(200).json(invites);
    } catch (error) {
        next(error);
    }
};

export const removeInvite: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);
        const leaseId = req.params.id;
        const inviteId = req.params.inviteId;

        // get lease to check if user is landlord
        const lease = await prisma.lease.findUnique({
            where: {
                id: leaseId,
                isDeleted: false,
            },
            include: {
                property: {
                    select: {
                        landlordId: true,
                    },
                },
            },
        });

        if (!lease) {
            throw createHttpError(404, "Lease not found");
        }

        // check if user is landlord of lease
        if (lease.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "You are not the landlord of this lease"
            );
        }

        // remove invite
        await prisma.leaseTenantInvite.update({
            where: {
                id: inviteId,
                isDeleted: false,
                isUsed: false,
            },
            data: {
                isDeleted: true,
            },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const leaveLease: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);
        const leaseId = req.params.id;

        // set lease tenant to deleted
        const leaseTenants = await prisma.leaseTenant.deleteMany({
            where: {
                leaseId,
                tenantId: req.session.userId,
                isDeleted: false,
                lease: {
                    isDeleted: false,
                },
            },
        }); // todo:: delete directly or isDeleted to true

        if (leaseTenants.count === 0) {
            throw createHttpError(404, "Lease tenant not found");
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

const RemoveTenantBody = z.object({
    leaseTenantId: z.string(),
});

export const removeTenant: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);
        const leaseId = req.params.id;
        const { leaseTenantId } = RemoveTenantBody.parse(req.body);

        // get lease to remove tenant from
        const lease = await prisma.lease.findUnique({
            where: {
                id: leaseId,
                isDeleted: false,
            },
            include: {
                property: true,
            },
        });

        if (!lease) {
            throw createHttpError(404, "Lease not found");
        }

        // check if user is landlord of lease
        if (lease.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "You are not the landlord of this lease"
            );
        }

        // remove tenant from lease
        const leaseTenants = await prisma.leaseTenant.update({
            where: {
                id: leaseTenantId,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
            },
        }); // todo - just delete, you don't need this later

        // check if tenant was removed
        if (!leaseTenants) {
            throw createHttpError(404, "Tenant not found in lease");
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export const getLeaseTenants: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);
        const leaseId = req.params.id;

        // check if lease exists
        const lease = await prisma.lease.findUnique({
            where: {
                id: leaseId,
                isDeleted: false,
            },
            include: {
                property: {
                    select: {
                        landlordId: true,
                    },
                },
            },
        });

        if (!lease) {
            throw createHttpError(404, "Lease not found");
        }

        // Check if user is landlord of lease
        if (lease.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "You are not the landlord of this lease"
            );
        }

        // get lease tenants
        const tenants = await prisma.leaseTenant.findMany({
            where: {
                leaseId,
                isDeleted: false,
            },
            include: {
                tenant: true,
                _count: {
                    select: {
                        payments: true,
                    },
                },
            },
        });

        res.status(200).json(tenants);
    } catch (error) {
        next(error);
    }
};

const UpdateTenantBody = z.object({
    leaseTenantId: z.string(),
    individualRent: CurrencySchema,
});

export const updateTenant: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);
        const leaseId = req.params.id;
        const { leaseTenantId, individualRent } = UpdateTenantBody.parse(
            req.body
        );

        // get the lease to update tenant in
        const lease = await prisma.lease.findUnique({
            where: {
                id: leaseId,
                isDeleted: false,
            },
            include: {
                property: true,
            },
        });

        if (!lease) {
            throw createHttpError(404, "Lease not found");
        }

        // check if user is landlord of lease
        if (lease.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "You are not the landlord of this lease"
            );
        }

        // update lease tenant
        const leaseTenant = await prisma.leaseTenant.updateMany({
            where: {
                id: leaseTenantId,
            },
            data: {
                individualRent,
            },
        });

        if (leaseTenant.count === 0) {
            throw createHttpError(404, "Tenant not found in lease");
        }

        res.status(200).json(leaseTenant);
    } catch (error) {
        next(error);
    }
};

export const getAllTenants: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);

        // Get logged in user
        const user = await prisma.user.findUnique({
            where: {
                id: req.session.userId,
            },
        });

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        // Ensure user is a landlord
        if (user.userType !== userType.LANDLORD) {
            throw createHttpError(403, "Only landlords can view tenants");
        }

        const tenants = await prisma.leaseTenant.findMany({
            where: {
                isDeleted: false,
                lease: {
                    property: {
                        landlordId: req.session.userId,
                    },
                },
            },
            include: {
                tenant: true,
            },
        });

        res.status(200).json(tenants);
    } catch (error) {
        next(error);
    }
};
