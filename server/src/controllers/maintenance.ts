import {
    deleteMaintenanceDocFromBlob,
    uploadMaintenanceDocToBlob,
} from "../azure/blobs/maintenance";

import { RequestHandler } from "express";
import assertIsDefined from "../utils/assertIsDefined";
import createHttpError from "http-errors";
import prisma from "../utils/prismaClient";
import { userType } from "@prisma/client";
import { z } from "zod";

// Form data schema
const CreateRequestFiles = z
    .array(
        z.object({
            originalname: z.string(),
            mimetype: z.string(),
            buffer: z.instanceof(Buffer),
        })
    )
    .max(5)
    .default([]);

const CreateRequestBody = z.object({
    requestTypeId: z.string(),
    description: z.string().min(20).max(500),
});

export const createRequest: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);

        const { requestTypeId, description } = CreateRequestBody.parse(
            req.body
        );
        const files = CreateRequestFiles.parse(req.files);
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

        // Check if request type exists
        const requestType = await prisma.requestType.findUnique({
            where: {
                id: requestTypeId,
            },
        });
        if (!requestType) {
            throw createHttpError(404, "Specified request type not found");
        }

        const request = await prisma.maintenanceRequest.create({
            data: {
                leaseId,
                requestTypeId,
                description,
                authorId: req.session.userId,
            },
        });

        const failedUploads: string[] = [];
        const successfulUploads: string[] = [];

        // Upload files to blob storage
        for (const file of files) {
            try {
                const createdBlob = await uploadMaintenanceDocToBlob(
                    file.buffer,
                    file.originalname,
                    file.mimetype
                );
                const blobName = createdBlob.fileName;

                // Add blob info to database
                await prisma.maintenanceImage.create({
                    data: {
                        url: createdBlob.url,
                        fileName: blobName,
                        fileType: file.mimetype,
                        maintenanceRequestId: request.id,
                    },
                });

                successfulUploads.push(file.originalname);
            } catch (error) {
                failedUploads.push(file.originalname);
            }
        }

        res.status(201).json({
            ...request,
            successfulUploads,
            failedUploads,
        });
    } catch (error) {
        next(error);
    }
};

const GetRequestTypesQuery = z
    .object({
        max: z.coerce.number().min(1).max(100).optional(),
    })
    .partial();

export const getRequests: RequestHandler = async (req, res, next) => {
    try {
        const { id: leaseId } = req.params;
        const { max } = GetRequestTypesQuery.parse(req.query);

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
                isDeleted: false,
            },
            include: {
                requestType: {
                    select: {
                        name: true,
                    },
                },
                images: true,
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                sharedRequest: true,
            },
            take: max,
            orderBy: {
                createdAt: "desc",
            },
        });

        res.status(200).json(requests);
    } catch (error) {
        next(error);
    }
};

export const getRequestTypes: RequestHandler = async (req, res, next) => {
    try {
        const { max } = GetRequestTypesQuery.parse(req.query);

        const requestTypes = await prisma.requestType.findMany({
            take: max,
            select: {
                id: true,
                name: true,
            },
        });

        res.status(200).json(requestTypes);
    } catch (error) {
        next(error);
    }
};

export const getAllRequests: RequestHandler = async (req, res, next) => {
    try {
        const { max } = GetRequestTypesQuery.parse(req.query);

        // Get user
        const user = await prisma.user.findUnique({
            where: {
                id: req.session.userId,
            },
        });

        if (!user) {
            throw createHttpError(404, "User not found");
        }

        // Check if user is tenant
        if (user.userType === userType.TENANT) {
            // Get all requests for tenant
            const requests = await prisma.maintenanceRequest.findMany({
                take: max,
                where: {
                    authorId: req.session.userId,
                    isDeleted: false,
                },
                include: {
                    requestType: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    lease: {
                        select: {
                            id: true,
                            startDate: true,
                            endDate: true,
                            property: {
                                select: {
                                    id: true,
                                    name: true,
                                    address: true,
                                },
                            },
                        },
                    },
                    images: true,
                    sharedRequest: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return res.status(200).json(requests);
        } else if (user.userType === userType.LANDLORD) {
            const requests = await prisma.maintenanceRequest.findMany({
                take: max,
                where: {
                    isDeleted: false,
                    lease: {
                        property: {
                            landlordId: req.session.userId,
                        },
                    },
                },
                include: {
                    requestType: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                    author: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                    images: true,
                    lease: {
                        select: {
                            id: true,
                            startDate: true,
                            endDate: true,
                            property: {
                                select: {
                                    id: true,
                                    name: true,
                                    address: true,
                                },
                            },
                        },
                    },
                    sharedRequest: true,
                },
                orderBy: {
                    createdAt: "desc",
                },
            });

            return res.status(200).json(requests);
        }

        throw createHttpError(
            403,
            "You are not authorized to view this resource"
        );
    } catch (error) {
        console.log(error);
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
                lease: {
                    include: {
                        property: true,
                        tenants: {
                            where: {
                                tenantId: req.session.userId,
                                isDeleted: false,
                            },
                        },
                    },
                },
                images: true,
                author: {
                    select: {
                        name: true,
                        email: true,
                    },
                },
                sharedRequest: true,
            },
        });

        if (!request) {
            throw createHttpError(404, "Specified request not found");
        }

        // Check if user is landlord or tenant
        if (
            request.lease.property.landlordId !== req.session.userId &&
            request.lease.tenants.length === 0
        ) {
            throw createHttpError(403, "You are not the landlord or tenant");
        }

        res.status(200).json(request);
    } catch (error) {
        next(error);
    }
};

const UpdateRequestBody = z.object({
    description: z.string().min(20).max(500),
});

export const updateRequest: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { description } = UpdateRequestBody.parse(req.body);

        // Get
        const request = await prisma.maintenanceRequest.findUnique({
            where: {
                id,
                isDeleted: false,
            },
        });

        if (!request) {
            throw createHttpError(404, "Specified request not found");
        }

        // Check if user is author
        if (request.authorId !== req.session.userId) {
            throw createHttpError(
                403,
                "You are not the author of this request"
            );
        }

        // Update the request
        const updatedRequest = await prisma.maintenanceRequest.update({
            where: {
                id,
            },
            data: {
                description,
            },
        });

        res.status(200).json(updatedRequest);
    } catch (error) {
        console.log(error);
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

        const request = await prisma.maintenanceRequest.findUnique({
            where: {
                id,
                isDeleted: false,
            },
            include: {
                lease: {
                    include: {
                        property: {
                            select: {
                                landlordId: true,
                            },
                        },
                    },
                },
            },
        });

        if (!request) {
            throw createHttpError(404, "Specified request not found");
        }

        // Check if user is landlord
        if (request.lease.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "You are not the landlord of this lease"
            );
        }

        const updatedRequest = await prisma.maintenanceRequest.update({
            where: {
                id,
            },
            data: {
                status,
            },
        });

        res.status(200).json(updatedRequest);
    } catch (error) {
        next(error);
    }
};

export const deleteRequest: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        const request = await prisma.maintenanceRequest.findUnique({
            where: {
                id,
                isDeleted: false,
            },
            include: {
                lease: {
                    include: {
                        property: {
                            select: {
                                landlordId: true,
                            },
                        },
                    },
                },
            },
        });

        if (!request) {
            throw createHttpError(404, "Specified request not found");
        }

        // Check if user is landlord or author
        if (
            request.lease.property.landlordId !== req.session.userId &&
            request.authorId !== req.session.userId
        ) {
            throw createHttpError(
                403,
                "You are not the landlord or author of this request"
            );
        }

        // Delete the maintenance images
        const images = await prisma.maintenanceImage.findMany({
            where: {
                maintenanceRequestId: id,
            },
        });

        // Delete images from blob storage
        for (const image of images) {
            if (image.fileName) {
                await deleteMaintenanceDocFromBlob(image.fileName);
            }
        }

        // Set images as deleted
        await prisma.maintenanceImage.updateMany({
            where: {
                maintenanceRequestId: id,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
            },
        });

        await prisma.maintenanceRequest.update({
            where: {
                id,
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

export const shareMaintenanceRequest: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const { id } = req.params;

        const request = await prisma.maintenanceRequest.findUnique({
            where: {
                id,
                isDeleted: false,
            },
            include: {
                lease: {
                    include: {
                        property: true,
                    },
                },
            },
        });

        if (!request) {
            throw createHttpError(404, "Specified request not found");
        }

        // Check if user is landlord
        if (request.lease.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "You are not the landlord of this lease"
            );
        }

        // Check if shared request already exists
        const sharedRequest = await prisma.sharedMaintenanceRequest.findFirst({
            where: {
                maintenanceRequestId: id,
                isDeleted: false,
            },
        });

        if (sharedRequest) {
            res.status(200).json(sharedRequest);
            return;
        }

        // Add to shared
        const newSharedRequest = await prisma.sharedMaintenanceRequest.create({
            data: {
                maintenanceRequestId: id,
                authorId: req.session.userId,
            },
        });

        res.status(201).json(newSharedRequest);
    } catch (error) {
        next(error);
    }
};

export const getSharedMaintenanceRequests: RequestHandler = async (
    req,
    res,
    next
) => {
    try {
        const { id: sharedId } = req.params;

        // Check if shared request exists
        const sharedRequest = await prisma.sharedMaintenanceRequest.findUnique({
            where: {
                id: sharedId,
                isDeleted: false,
            },
            include: {
                maintenanceRequest: {
                    include: {
                        requestType: {
                            select: {
                                name: true,
                            },
                        },
                        images: true,
                        lease: {
                            select: {
                                property: {
                                    select: {
                                        name: true,
                                        address: true,
                                        landlord: {
                                            select: {
                                                email: true,
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!sharedRequest) {
            throw createHttpError(404, "Specified shared request not found");
        }

        res.status(200).json(sharedRequest);
    } catch (error) {
        next(error);
    }
};
