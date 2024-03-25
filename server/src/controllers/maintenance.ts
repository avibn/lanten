import { RequestHandler } from "express";
import createHttpError from "http-errors";
import prisma from "../utils/prismaClient";
import { z } from "zod";

const CreateRequestBody = z.object({
    requestTypeId: z.string(),
    description: z.string().min(20).max(500),
});

export const createRequest: RequestHandler = async (req, res, next) => {
    try {
        const { requestTypeId, description } = CreateRequestBody.parse(
            req.body
        );
        const { id: leaseId } = req.params;

        // Check if lease exists
        const lease = await prisma.lease.findUnique({
            where: {
                id: leaseId,
                isDeleted: false,
            },
            include: {
                property: {
                    include: {
                        landlord: true,
                    },
                },
                tenants: {
                    where: {
                        tenantId: req.session.userId,
                    },
                },
            },
        });
        if (!lease) {
            throw createHttpError(404, "Specified lease not found");
        }

        // Check if user is the landlord
        if (lease.property.landlordId === req.session.userId) {
            throw createHttpError(
                403,
                "Landlord cannot create maintenance request"
            );
        }

        // Check if user is a tenant
        if (lease.tenants.length === 0) {
            throw createHttpError(403, "You are not a tenant of this lease");
        }

        const request = await prisma.maintenanceRequest.create({
            data: {
                leaseId,
                requestTypeId,
                description,
            },
        });

        res.status(201).json(request);
    } catch (error) {
        next(error);
    }
};

export const getRequests: RequestHandler = async (req, res, next) => {
    try {
        const { id: leaseId } = req.params;

        // Check if lease exists
        const lease = await prisma.lease.findUnique({
            where: {
                id: leaseId,
                isDeleted: false,
            },
            include: {
                property: {
                    include: {
                        landlord: true,
                    },
                },
                tenants: {
                    where: {
                        tenantId: req.session.userId,
                    },
                },
            },
        });
        if (!lease) {
            throw createHttpError(404, "Specified lease not found");
        }

        // Check if user is the landlord OR tenant
        if (
            lease.property.landlordId !== req.session.userId &&
            lease.tenants.length === 0
        ) {
            throw createHttpError(403, "You are not the landlord or tenant");
        }

        const requests = await prisma.maintenanceRequest.findMany({
            where: {
                leaseId,
            },
            include: {
                requestType: {
                    select: {
                        name: true,
                    },
                },
            },
        });

        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};

export const getRequest: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if request exists
        const request = await prisma.maintenanceRequest.findUnique({
            where: {
                id,
                isDeleted: false,
            },
            include: {
                requestType: true,
            },
        });

        if (!request) {
            throw createHttpError(404, "Specified request not found");
        }

        res.status(200).json(request);
    } catch (error) {
        next(error);
    }
};

export const updateRequest: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { description } = CreateRequestBody.parse(req.body);

        const request = await prisma.maintenanceRequest.update({
            where: {
                id,
                isDeleted: false,
            },
            data: {
                description,
            },
        });

        res.status(200).json(request);
    } catch (error) {
        next(error);
    }
};

const UpdateRequestStatusBody = z.object({
    status: z.enum([
        "PENDING",
        "IN_PROGRESS",
        "RESOLVED",
        "REJECTED",
        "CANCELLED",
    ]),
});

export const updateRequestStatus: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = UpdateRequestStatusBody.parse(req.body);

        const request = await prisma.maintenanceRequest.update({
            where: {
                id,
                isDeleted: false,
            },
            data: {
                status,
            },
        });

        res.status(200).json(request);
    } catch (error) {
        next(error);
    }
};

export const deleteRequest: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        const request = await prisma.maintenanceRequest.update({
            where: {
                id,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
            },
        });

        if (!request) {
            throw createHttpError(404, "Specified request not found");
        }

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
