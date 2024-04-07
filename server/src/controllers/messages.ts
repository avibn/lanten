import { RequestHandler } from "express";
import assertIsDefined from "../utils/assertIsDefined";
import createHttpError from "http-errors";
import prisma from "../utils/prismaClient";
import { userType } from "@prisma/client";
import { z } from "zod";

const createMessageSchema = z.object({
    text: z.string().min(1).max(250),
});

export const createMessage: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);

        const { text } = createMessageSchema.parse(req.body);
        const { id: recipientId } = req.params;

        // Get the sender of the message
        const sender = await prisma.user.findUnique({
            where: {
                id: req.session.userId,
                isActive: true,
            },
            include: {
                properties: {
                    where: {
                        isDeleted: false,
                    },
                    select: {
                        id: true,
                        leases: {
                            where: {
                                isDeleted: false,
                            },
                            select: {
                                id: true,
                                tenants: {
                                    // Only select the recipient tenant
                                    where: {
                                        tenantId: recipientId,
                                        isDeleted: false,
                                    },
                                },
                            },
                        },
                    },
                },
                leases: {
                    select: {
                        id: true,
                        lease: {
                            select: {
                                property: true,
                            },
                        },
                    },
                },
            },
        });

        // Get the recipient of the message
        const recipient = await prisma.user.findUnique({
            where: {
                id: recipientId,
                isActive: true,
            },
        });

        if (!recipient) {
            throw createHttpError(404, "Recipient not found");
        }

        // Check if the recipient is the same as the author
        if (recipientId === req.session.userId) {
            throw createHttpError(400, "You cannot send a message to yourself");
        }

        if (sender?.userType === userType.LANDLORD) {
            // Check if the recipient is a tenant of the sender
            if (
                !sender.properties.some((property) =>
                    property.leases.some((lease) => lease.tenants.length > 0)
                )
            ) {
                throw createHttpError(
                    403,
                    "You can only send messages to your tenants"
                );
            }
        } else if (sender?.userType === userType.TENANT) {
            // Check if the recipient is a landlord of the sender
            if (
                !sender.leases.some(
                    (leaseTenant) =>
                        leaseTenant.lease.property.landlordId === recipientId
                )
            ) {
                throw createHttpError(
                    403,
                    "You can only send messages to your landlord"
                );
            }
        }

        const message = await prisma.message.create({
            data: {
                message: text,
                authorId: req.session.userId,
                recipientId,
            },
        });

        res.status(201).json(message);
    } catch (error) {
        next(error);
    }
};

const getMessagesQuerySchema = z
    .object({
        from: z.string().optional(),
        max: z.coerce.number().min(1).max(100).optional(),
    })
    .partial();

export const getMessages: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);

        const { id: recipientId } = req.params;
        const { from, max = 50 } = getMessagesQuerySchema.parse(req.query);

        // Check if the recipient exists
        const recipient = await prisma.user.findUnique({
            where: {
                id: recipientId,
                isActive: true,
            },
            select: {
                id: true,
                name: true,
                email: true,
                userType: true,
            },
        });

        if (!recipient) {
            throw createHttpError(404, "Recipient not found");
        }

        // Get all messages between the sender and recipient
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        authorId: req.session.userId,
                        recipientId,
                    },
                    {
                        authorId: recipientId,
                        recipientId: req.session.userId,
                    },
                ],
                isDeleted: false,
            },
            include: {
                author: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
                recipient: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
            orderBy: {
                createdAt: "asc",
            },
            // Get the last `max` messages
            take: -1 * max,
            ...(from && { cursor: { id: from } }),
            ...(from && { skip: 1 }),
        });

        res.json({
            recipient,
            messages,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllMessagedUsers: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);

        // Get all the messages that the user has sent or received
        const messages = await prisma.message.findMany({
            where: {
                OR: [
                    {
                        authorId: req.session.userId,
                    },
                    {
                        recipientId: req.session.userId,
                    },
                ],
                isDeleted: false,
            },
            select: {
                authorId: true,
                recipientId: true,
                updatedAt: true,
            },
            orderBy: {
                updatedAt: "asc",
            },
        });

        const userIds = new Set<string>();
        const lastMessages = new Map<string, Date>(); // User to last message mapping

        // Add all the ids to the set
        for (const message of messages) {
            if (message.authorId !== req.session.userId) {
                userIds.add(message.authorId);
                lastMessages.set(message.authorId, message.updatedAt);
            }

            if (message.recipientId !== req.session.userId) {
                userIds.add(message.recipientId);
                lastMessages.set(message.recipientId, message.updatedAt);
            }
        }

        interface UserWithLastMessaged {
            id: string;
            name: string | null;
            email: string;
            lastMessaged?: Date;
        }

        // Get the users from the ids
        const users: UserWithLastMessaged[] = await prisma.user.findMany({
            where: {
                id: {
                    in: Array.from(userIds),
                },
            },
            select: {
                id: true,
                email: true,
                name: true,
            },
        });

        // Add the last messaged time to the users
        for (const user of users) {
            user.lastMessaged = lastMessages.get(user.id);
        }

        res.status(200).json(users);
    } catch (error) {
        next(error);
    }
};

export const deleteMessage: RequestHandler = async (req, res, next) => {
    try {
        assertIsDefined(req.session.userId);

        const { id } = req.params;

        const message = await prisma.message.findUnique({
            where: {
                id,
                isDeleted: false,
            },
        });

        if (!message) {
            throw createHttpError(404, "Message not found");
        }

        if (message.authorId !== req.session.userId) {
            throw createHttpError(403, "You can only delete your own messages");
        }

        await prisma.message.update({
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
