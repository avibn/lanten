import { CurrencySchema } from "../utils/schemas";
import { RequestHandler } from "express";
import assertIsDefined from "../utils/assertIsDefined";
import createHttpError from "http-errors";
import prisma from "../utils/prismaClient";
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
                property: {
                    landlordId: req.session.userId, // check if user is landlord
                },
                isDeleted: false,
            },
            include: {
                tenants: {
                    include: {
                        tenant: true,
                    },
                },
            },
        });

        // Check if lease exists
        if (!lease) {
            throw createHttpError(404, "Specified lease not found");
        }

        // check email against existing tenants
        const existingTenant = lease.tenants.some(
            (leaseTenant) => leaseTenant.tenant.email === tenantEmail
        );

        if (existingTenant) {
            throw createHttpError(400, "Tenant already in lease");
        }

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

        if (user.userType !== "TENANT") {
            throw createHttpError(403, "Only tenants can accept lease invites");
        }

        // get lease from invite code
        const lease = await prisma.lease.findFirst({
            where: {
                inviteCode,
                isDeleted: false,
            },
            include: {
                tenants: true,
            },
        });

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
                400,
                "You are already a tenant in this lease"
            );
        }

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

export const leaveLease: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);
        const leaseId = req.params.id;

        // set lease tenant to deleted
        const leaseTenants = await prisma.leaseTenant.updateMany({
            where: {
                leaseId,
                tenantId: req.session.userId,
                isDeleted: false,
                lease: {
                    isDeleted: false,
                },
            },
            data: {
                isDeleted: true,
            },
        });

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

export const getTenants: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);
        const leaseId = req.params.id;

        // check if lease exists
        const lease = await prisma.lease.findUnique({
            where: {
                id: leaseId,
                isDeleted: false,
                property: {
                    landlordId: req.session.userId, // check if user is the landlord
                },
            },
        });

        if (!lease) {
            throw createHttpError(404, "Lease not found");
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

        if (tenants.length === 0) {
            throw createHttpError(404, "No tenants found in lease");
        }

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
