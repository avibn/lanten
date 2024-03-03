import { CurrencySchema } from "../utils/schemas";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { nanoid } from "../utils/nanoid";
import prisma from "../utils/prismaClient";
import { z } from "zod";

const CreateLeaseBody = z.object({
    propertyId: z.string(),
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    totalRent: CurrencySchema,
});

export const createLease: RequestHandler = async (req, res, next) => {
    try {
        const { propertyId, startDate, endDate, totalRent } =
            CreateLeaseBody.parse(req.body);

        // Fetch the property using the propertyId and include the user
        const property = await prisma.property.findUnique({
            where: {
                id: propertyId,
            },
            include: {
                landlord: true,
            },
        });

        // Check if property exists
        if (!property) {
            throw createHttpError(404, "Specified property not found");
        }

        // Check if user is landlord
        if (property?.landlord.userType !== "LANDLORD") {
            throw createHttpError(403, "Only landlords can create leases");
        }

        // Check if the user is the landlord of the property
        if (property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "You are not the landlord of this property"
            );
        }

        // Create property and connect it to the landlord
        const lease = await prisma.lease.create({
            data: {
                startDate,
                endDate,
                totalRent,
                property: {
                    connect: {
                        id: propertyId,
                    },
                },
                inviteCode: nanoid(10), // todo:: check if invite code exists already
            },
        });

        res.status(201).json(lease);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getLeases: RequestHandler = async (req, res, next) => {
    try {
        // Get all leases of of the user (landlord or tenant)
        const leases = await prisma.lease.findMany({
            where: {
                OR: [
                    // Find leases where the user is the landlord
                    {
                        property: {
                            landlordId: req.session.userId,
                        },
                    },
                    // Find leases where the user is the tenant
                    {
                        tenants: {
                            some: {
                                AND: {
                                    tenantId: req.session.userId,
                                    isDeleted: false,
                                },
                            },
                        },
                    },
                ],
            },
            include: {
                property: {
                    select: {
                        name: true,
                        address: true,
                    },
                },
                _count: {
                    select: {
                        tenants: { where: { isDeleted: false } },
                        payments: true,
                    },
                },
            },
        });

        res.status(200).json(leases);
    } catch (error) {
        next(error);
    }
};

export const getLease: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check the user
        const user = await prisma.user.findUnique({
            where: {
                id: req.session.userId,
            },
        });

        // Get lease by id
        // todo:: Split this for separate queries for landlord and tenant
        const lease = await prisma.lease.findUnique({
            where: {
                id,
                isDeleted: false,
                OR: [
                    {
                        property: {
                            landlordId: req.session.userId,
                        },
                    },
                    {
                        tenants: {
                            some: {
                                isDeleted: false,
                                tenantId: req.session.userId,
                            },
                        },
                    },
                ],
            },
            include: {
                property: {
                    select: {
                        name: true,
                        address: true,
                    },
                },
                // tenants: user?.userType === "LANDLORD",
                tenants: {
                    select: {
                        id: true,
                        tenant: user?.userType === "LANDLORD",
                    },
                },
                payments: true,
                _count: {
                    select: {
                        tenants: { where: { isDeleted: false } },
                        payments: true,
                    },
                },
            },
        });
        // todo:: don't return everything for tenants (e.g. invite code for landlord only, etc.)

        // Check if lease exists
        if (!lease) {
            throw createHttpError(404, "Specified lease not found");
        }

        res.status(200).json(lease);
    } catch (error) {
        next(error);
    }
};

const UpdateLeaseBody = z.object({
    startDate: z.string().datetime(),
    endDate: z.string().datetime(),
    totalRent: CurrencySchema,
});

export const updateLease: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { startDate, endDate, totalRent } = UpdateLeaseBody.parse(
            req.body
        );

        // Update lease by id
        // todo:: error message for "landlord only"
        const lease = await prisma.lease.update({
            where: {
                id,
                isDeleted: false,
                property: {
                    landlordId: req.session.userId,
                },
            },
            data: {
                startDate,
                endDate,
                totalRent,
            },
        });

        res.status(200).json(lease);
    } catch (error) {
        next(error);
    }
};

export const deleteLease: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Delete lease by id
        // todo:: landlord only error message
        const lease = await prisma.lease.update({
            where: {
                id,
                isDeleted: false,
                property: {
                    landlordId: req.session.userId,
                },
            },
            data: {
                isDeleted: true,
            },
        });

        // Delete all lease tenants
        await prisma.leaseTenant.updateMany({
            where: {
                leaseId: id,
            },
            data: {
                isDeleted: true,
            },
        });

        // todo:: delete all lease payments, reminders, etc.

        res.status(200).json(lease);
    } catch (error) {
        next(error);
    }
};

const UpdateLeaseDescriptionBody = z.object({
    description: z.string().max(500),
});

export const updateLeaseDescription: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;
        const { description } = UpdateLeaseDescriptionBody.parse(req.body);

        // Get lease by id
        const lease = await prisma.lease.findUnique({
            where: {
                id,
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

        // Check if lease exists
        if (!lease) {
            throw createHttpError(404, "Specified lease not found");
        }

        // Check if user is landlord
        if (lease.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "Only landlords can update lease description"
            );
        }

        // Update lease description
        const updatedLease = await prisma.lease.update({
            where: {
                id,
            },
            data: {
                description,
            },
        });

        res.status(200).json(updatedLease);
    } catch (error) {
        next(error);
    }
};
