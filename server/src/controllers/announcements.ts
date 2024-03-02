import { RequestHandler } from "express";
import createHttpError from "http-errors";
import prisma from "../utils/prismaClient";
import { z } from "zod";

const CreateAnnouncementBody = z.object({
    title: z.string().min(5).max(50),
    message: z.string().min(5).max(300),
});

export const createAnnouncement: RequestHandler = async (req, res, next) => {
    try {
        const { title, message } = CreateAnnouncementBody.parse(req.body);
        const leaseId = req.params.id;

        // Get lease
        const lease = await prisma.lease.findUnique({
            where: {
                id: leaseId,
            },
            select: {
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

        // Check if user is landlord
        if (lease.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "Only landlords can create announcements"
            );
        }

        // Create announcement
        const announcement = await prisma.announcement.create({
            data: {
                title,
                message,
                lease: {
                    connect: {
                        id: leaseId,
                    },
                },
            },
        });

        res.status(201).json(announcement);
    } catch (error) {
        next(error);
    }
};

export const getAnnouncements: RequestHandler = async (req, res, next) => {
    try {
        const leaseId = req.params.id;

        // Get lease
        const lease = await prisma.lease.findUnique({
            where: {
                id: leaseId,
            },
            select: {
                property: {
                    select: {
                        landlordId: true,
                    },
                },
                tenants: {
                    select: {
                        tenantId: true,
                    },
                },
            },
        });

        if (!lease) {
            throw createHttpError(404, "Lease not found");
        }

        // Check if user is landlord or tenant of the lease
        if (
            lease.property.landlordId !== req.session.userId &&
            !lease.tenants.some(
                (tenant) => tenant.tenantId === req.session.userId
            )
        ) {
            throw createHttpError(403, "Unauthorized to view announcements");
        }

        const announcements = await prisma.announcement.findMany({
            where: {
                leaseId,
                isDeleted: false,
            },
        });

        res.status(200).json(announcements);
    } catch (error) {
        next(error);
    }
};

export const getAnnouncement: RequestHandler = async (req, res, next) => {
    try {
        const { id: announcementId } = req.params;

        const announcement = await prisma.announcement.findUnique({
            where: {
                id: announcementId,
                isDeleted: false,
                lease: {
                    // Check if user is landlord or tenant of the lease
                    OR: [
                        {
                            property: {
                                landlordId: req.session.userId,
                            },
                        },
                        {
                            tenants: {
                                some: {
                                    tenantId: req.session.userId,
                                },
                            },
                        },
                    ],
                },
            },
        });

        if (!announcement) {
            throw createHttpError(404, "Announcement not found");
        }

        res.status(200).json(announcement);
    } catch (error) {
        next(error);
    }
};

export const updateAnnouncement: RequestHandler = async (req, res, next) => {
    try {
        const { id: announcementId } = req.params;
        const { title, message } = CreateAnnouncementBody.parse(req.body);

        const announcement = await prisma.announcement.findUnique({
            where: {
                id: announcementId,
                isDeleted: false,
            },
            select: {
                id: true,
                lease: {
                    select: {
                        property: {
                            select: {
                                landlordId: true,
                            },
                        },
                    },
                },
            },
        });

        if (!announcement) {
            throw createHttpError(404, "Announcement not found");
        }

        // Check if user is landlord
        // todo:: ideally only author of the announcement should be able to update it
        if (announcement?.lease?.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "Only landlords can update announcements"
            );
        }

        const updatedAnnouncement = await prisma.announcement.update({
            where: {
                id: announcementId,
                isDeleted: false,
            },
            data: {
                title,
                message,
            },
        });

        res.status(200).json(updatedAnnouncement);
    } catch (error) {
        next(error);
    }
};

export const deleteAnnouncement: RequestHandler = async (req, res, next) => {
    try {
        const { id: announcementId } = req.params;

        const announcement = await prisma.announcement.findUnique({
            where: {
                id: announcementId,
                isDeleted: false,
            },
            select: {
                id: true,
                lease: {
                    select: {
                        property: {
                            select: {
                                landlordId: true,
                            },
                        },
                    },
                },
            },
        });

        if (!announcement) {
            throw createHttpError(404, "Announcement not found");
        }

        // Check if user is landlord
        if (announcement?.lease?.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "Only landlords can delete announcements"
            );
        }

        await prisma.announcement.update({
            where: {
                id: announcementId,
                isDeleted: false,
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
