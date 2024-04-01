import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { documentType } from "@prisma/client";
import prisma from "../utils/prismaClient";
import { uploadDocument } from "../azure/blobs/documents";
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
                const createdBlob = await uploadDocument(
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

        res.status(200).json({
            uploadedFiles,
            failedFiles,
        });
    } catch (error) {
        console.error(error);
        next(error);
    }
};
