import {
    deleteDocumentFromBlob,
    getTemporaryDocumentUrl,
    uploadDocumentToBlob,
} from "../azure/blobs/documents";

import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { documentType } from "@prisma/client";
import prisma from "../utils/prismaClient";
import { z } from "zod";

// Schema for form data
const AddDocumentFiles = z.array(
    z.object({
        originalname: z.string(),
        mimetype: z.string(),
        buffer: z.instanceof(Buffer),
    })
);

const AddDocumentBody = z.object({
    name: z.string().min(1).max(30),
});

export const addDocument: RequestHandler = async (req, res, next) => {
    try {
        const files = AddDocumentFiles.parse(req.files);
        const { name } = AddDocumentBody.parse(req.body);
        const { id: leaseId } = req.params;

        // Check if the files[] is empty
        if (files.length === 0) {
            throw createHttpError(400, "No files were uploaded");
        }

        // For now, we just want 1 file to be uploaded
        if (files.length > 1) {
            throw createHttpError(400, "Only 1 file can be uploaded at a time");
        }

        const failedFiles: string[] = [];
        const uploadedFiles: object[] = [];
        console.log("Number of files uploaded:", files.length);

        if (req.session.userId === undefined) {
            throw createHttpError(403, "User not authenticated");
        }

        // Check if the lease exists
        const lease = await prisma.lease.findUnique({
            where: {
                id: leaseId,
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

        // Check if the user is the landlord or a tenant
        if (
            lease.property.landlordId !== req.session.userId &&
            lease.tenants.length === 0
        ) {
            throw createHttpError(
                403,
                "You are not a tenant or landlord of this lease"
            );
        }

        // Check max uploads
        const documents = await prisma.document.findMany({
            where: {
                leaseId,
                isDeleted: false,
                // todo: check if this is correct
                authorId: req.session.userId,
            },
            select: {
                id: true,
            },
        });

        if (documents.length >= 5) {
            throw createHttpError(400, "Maximum number of documents reached");
        }

        const type =
            lease.property.landlordId === req.session.userId
                ? documentType.LANDLORD
                : documentType.TENANT;

        // Upload each file
        for (const file of files) {
            console.log(
                "Uploading file:",
                file.originalname,
                file.mimetype,
                file.buffer.length
            );
            try {
                // Upload the file
                const createdBlob = await uploadDocumentToBlob(
                    file.buffer,
                    file.originalname,
                    file.mimetype
                );
                const blobName = createdBlob.fileName;

                // Add the document to the database
                const createdDoc = await prisma.document.create({
                    data: {
                        name,
                        leaseId,
                        type: type,
                        fileName: blobName,
                        fileType: file.mimetype,
                        authorId: req.session.userId,
                    },
                    select: {
                        id: true,
                        name: true,
                        fileName: true,
                        fileType: true,
                        type: true,
                        createdAt: true,
                    },
                });

                // Add the document to the response
                uploadedFiles.push(createdDoc);
            } catch (error) {
                failedFiles.push(file.originalname);
            }
        }

        if (failedFiles.length > 0) {
            throw createHttpError(
                400,
                `Failed to upload file. Make sure correct file type and size is uploaded.`
            );
        }

        res.status(200).json({
            uploadedFiles,
            failedFiles,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getDocuments: RequestHandler = async (req, res, next) => {
    try {
        const { id: leaseId } = req.params;

        // Check if the lease exists
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
                        isDeleted: false,
                    },
                },
            },
        });

        if (!lease) {
            throw createHttpError(404, "Specified lease not found");
        }

        // Check if the user is the landlord or a tenant
        if (
            lease.property.landlordId !== req.session.userId &&
            lease.tenants.length === 0
        ) {
            throw createHttpError(
                403,
                "You are not a tenant or landlord of this lease"
            );
        }

        // Get all documents for the lease
        const documents = await prisma.document.findMany({
            where: {
                leaseId,
                isDeleted: false,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });

        const landlordDocs = documents.filter(
            (doc) => doc.type === documentType.LANDLORD
        );

        // Only include all tenant documents if the user is the landlord else only include their own documents
        const includeAllTenantDocs =
            lease.property.landlordId === req.session.userId;
        const tenantDocs = documents.filter(
            (doc) =>
                doc.type === documentType.TENANT &&
                (includeAllTenantDocs || doc.authorId === req.session.userId)
        );

        res.status(200).json({
            landlordDocs,
            tenantDocs,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const getDocument: RequestHandler = async (req, res, next) => {
    try {
        const { id: docId } = req.params;

        // Check if the document exists
        const document = await prisma.document.findUnique({
            where: {
                id: docId,
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

        if (!document) {
            throw createHttpError(404, "Document not found");
        }

        // Check if the user is the landlord or the author of the document
        if (
            document.authorId !== req.session.userId &&
            document.lease?.property.landlordId !== req.session.userId
        ) {
            throw createHttpError(
                403,
                "You do not have access to this document"
            );
        }

        if (!document.fileName) {
            throw createHttpError(404, "Document not found");
        }

        // Get the SAS URL for the document
        const tempUrl = await getTemporaryDocumentUrl(document.fileName);

        res.status(200).json({
            id: document.id,
            name: document.name,
            url: tempUrl,
            fileName: document.fileName,
            fileType: document.fileType,
            type: document.type,
            createdAt: document.createdAt,
            updatedAt: document.updatedAt,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const updateDocument: RequestHandler = async (req, res, next) => {
    try {
        const { id: docId } = req.params;
        const { name } = AddDocumentBody.parse(req.body);

        // Check if the document exists
        const document = await prisma.document.findUnique({
            where: {
                id: docId,
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

        if (!document) {
            throw createHttpError(404, "Document not found");
        }

        // Check if the user is the landlord or the author of the document
        if (
            document.authorId !== req.session.userId &&
            document.lease?.property.landlordId !== req.session.userId
        ) {
            throw createHttpError(
                403,
                "You do not have access to this document"
            );
        }

        // Update the document
        const updatedDocument = await prisma.document.update({
            where: {
                id: docId,
            },
            data: {
                name,
            },
            select: {
                id: true,
                name: true,
                fileName: true,
                fileType: true,
                type: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(200).json(updatedDocument);
    } catch (error) {
        console.error(error);
        next(error);
    }
};

export const deleteDocument: RequestHandler = async (req, res, next) => {
    try {
        const { id: docId } = req.params;

        // Check if the document exists
        const document = await prisma.document.findUnique({
            where: {
                id: docId,
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

        if (!document) {
            throw createHttpError(404, "Document not found");
        }

        // Check if the user is the landlord or the author of the document
        if (
            document.authorId !== req.session.userId &&
            document.lease?.property.landlordId !== req.session.userId
        ) {
            throw createHttpError(
                403,
                "You do not have access to this document"
            );
        }

        if (!document.fileName) {
            throw createHttpError(404, "Document not found");
        }

        // Delete the document from the blob storage
        await deleteDocumentFromBlob(document.fileName);

        // Soft delete the document
        await prisma.document.update({
            where: {
                id: docId,
            },
            data: {
                isDeleted: true,
            },
        });

        res.status(204).send();
    } catch (error) {
        console.error(error);
        next(error);
    }
};
