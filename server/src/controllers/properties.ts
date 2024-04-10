import {
    deletePropertyImageFromBlob,
    uploadPropertyImageToBlob,
} from "../azure/blobs/properties";

import { RequestHandler } from "express";
import { UploadFileResponse } from "../azure/blobs/blobHelper";
import createHttpError from "http-errors";
import prisma from "../utils/prismaClient";
import { z } from "zod";

// Schema for form data
const PropertyImageFiles = z
    .array(
        z.object({
            originalname: z.string(),
            mimetype: z.string(),
            buffer: z.instanceof(Buffer),
        })
    )
    .max(1)
    .default([]);

const CreatePropertyBody = z.object({
    name: z.string().min(2).max(100),
    description: z.string().max(1000),
    address: z.string().min(2).max(100),
});

export const createProperty: RequestHandler = async (req, res, next) => {
    try {
        const { name, description, address } = CreatePropertyBody.parse(
            req.body
        );
        const files = PropertyImageFiles.parse(req.files);

        // Check if user is a landlord
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
        });
        if (user?.userType !== "LANDLORD") {
            throw createHttpError(403, "Only landlords can create properties");
        }

        let createdBlob: UploadFileResponse;
        if (files.length > 0) {
            const uploadedImage = files[0];

            // Upload image
            console.log("Uploading image to blob");
            try {
                // Upload image to blob
                createdBlob = await uploadPropertyImageToBlob(
                    uploadedImage.buffer,
                    uploadedImage.mimetype
                );

                // Add property to database with image
                const property = await prisma.property.create({
                    data: {
                        name,
                        description,
                        address,
                        landlord: {
                            connect: {
                                id: req.session.userId,
                            },
                        },
                        propertyImage: {
                            create: {
                                url: createdBlob.url,
                                fileName: createdBlob.fileName,
                                fileType: uploadedImage.mimetype,
                            },
                        },
                    },
                });

                return res.status(201).json(property);
            } catch (error) {
                console.error("Error uploading image to blob", error);
                throw createHttpError(500, `Error uploading image: ${error}`);
            }
        }

        // Create property and connect it to the landlord (without image)
        const property = await prisma.property.create({
            data: {
                name,
                description,
                address,
                landlord: {
                    connect: {
                        id: req.session.userId,
                    },
                },
            },
        });

        res.status(201).json(property);
    } catch (error) {
        next(error);
    }
};

export const getProperties: RequestHandler = async (req, res, next) => {
    try {
        // Check if user is a landlord
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
        });
        if (user?.userType !== "LANDLORD") {
            throw createHttpError(403, "Only landlords can get properties");
        }

        // Get all properties for the logged in landlord
        const properties = await prisma.property.findMany({
            where: {
                landlordId: req.session.userId,
                isDeleted: false,
            },
            include: {
                propertyImage: true,
            },
            orderBy: {
                updatedAt: "desc",
            },
        });

        res.status(200).json(properties);
    } catch (error) {
        next(error);
    }
};

export const getProperty: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if user is a landlord
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
        });
        if (user?.userType !== "LANDLORD") {
            throw createHttpError(403, "Only landlords can get properties");
        }

        // Get property by id
        const property = await prisma.property.findUnique({
            where: { id, isDeleted: false, landlordId: req.session.userId },
            include: {
                leases: {
                    select: {
                        id: true,
                        startDate: true,
                        endDate: true,
                        totalRent: true,
                        isDeleted: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                },
                _count: {
                    select: {
                        leases: true,
                    },
                },
                propertyImage: true,
            },
        });

        // Check if property exists
        if (!property) {
            throw createHttpError(404, "No property found with id");
        }

        res.status(200).json(property);
    } catch (error) {
        next(error);
    }
};

const UpdatePropertyBody = CreatePropertyBody.extend({
    updateImage: z.coerce.boolean().default(false),
});

export const updateProperty: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, address, updateImage } =
            UpdatePropertyBody.parse(req.body);
        const files = PropertyImageFiles.parse(req.files);

        // Check if user is a landlord
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
        });
        if (user?.userType !== "LANDLORD") {
            throw createHttpError(403, "Only landlords can update properties");
        }

        // Check if property exists
        const property = await prisma.property.findUnique({
            where: { id, isDeleted: false, landlordId: req.session.userId },
            include: {
                propertyImage: true,
            },
        });

        if (!property) {
            throw createHttpError(404, "No property found with id");
        }

        let createdBlob: UploadFileResponse;
        // Update image
        if (updateImage && files.length > 0) {
            const uploadedImage = files[0];

            try {
                // Upload image to blob
                console.log("Uploading image to blob");
                createdBlob = await uploadPropertyImageToBlob(
                    uploadedImage.buffer,
                    uploadedImage.mimetype
                );

                // Delete existing image from blob
                console.log("Deleting existing image from blob");
                if (property.propertyImage) {
                    await deletePropertyImageFromBlob(
                        property.propertyImage.fileName
                    );

                    // Update property with new image
                    const updatedProperty = await prisma.property.update({
                        where: { id: id },
                        data: {
                            name,
                            description,
                            address,
                            propertyImage: {
                                update: {
                                    url: createdBlob.url,
                                    fileName: createdBlob.fileName,
                                    fileType: uploadedImage.mimetype,
                                },
                            },
                        },
                    });

                    return res.status(200).json(updatedProperty);
                } else {
                    // add image to property
                    const updatedProperty = await prisma.property.update({
                        where: { id: id },
                        data: {
                            name,
                            description,
                            address,
                            propertyImage: {
                                create: {
                                    url: createdBlob.url,
                                    fileName: createdBlob.fileName,
                                    fileType: uploadedImage.mimetype,
                                },
                            },
                        },
                    });
                    return res.status(200).json(updatedProperty);
                }
            } catch (error) {
                console.error("Error uploading image to blob", error);
                throw createHttpError(500, `Error uploading image: ${error}`);
            }
        }

        // Update property by id
        const updatedProperty = await prisma.property.update({
            where: { id: id, isDeleted: false, landlordId: req.session.userId },
            data: {
                name,
                description,
                address,
            },
        });

        res.status(200).json(updatedProperty);
    } catch (error) {
        next(error);
    }
};

export const deleteProperty: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if user is a landlord
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
        });
        if (user?.userType !== "LANDLORD") {
            throw createHttpError(403, "Only landlords can delete properties");
        }

        // Check if property exists
        const property = await prisma.property.findUnique({
            where: { id, isDeleted: false, landlordId: req.session.userId },
            include: {
                propertyImage: true,
            },
        });
        if (!property) {
            throw createHttpError(404, "No property found with id");
        }

        // Set deleted property to true
        await prisma.property.update({
            where: { id: id, landlordId: req.session.userId },
            data: {
                isDeleted: true,
            },
        });

        // Check if property has an image
        if (property.propertyImage) {
            console.log("Deleting image from blob");

            try {
                // Delete image from blob
                await deletePropertyImageFromBlob(
                    property.propertyImage.fileName
                );

                // Delete image from database
                if (property.propertyImage) {
                    await prisma.propertyImage.delete({
                        where: { id: property.propertyImage.id },
                    });
                }
            } catch (error) {
                console.error("Error deleting image from blob", error);
            }
        }

        // Delete all leases for the property
        await prisma.lease.updateMany({
            where: { propertyId: id },
            data: {
                isDeleted: true,
            },
        });

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
