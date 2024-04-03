import { RequestHandler } from "express";
import createHttpError from "http-errors";
import prisma from "../utils/prismaClient";
import { z } from "zod";

const CreateReminderBody = z.object({
    daysBefore: z.number().int().min(0).max(7),
});

export const createReminder: RequestHandler = async (req, res, next) => {
    try {
        const { daysBefore } = CreateReminderBody.parse(req.body);
        const { id: paymentId } = req.params;

        // Check if payment exists
        const payment = await prisma.payment.findUnique({
            where: {
                id: paymentId,
            },
            include: {
                lease: {
                    include: {
                        property: {
                            include: {
                                landlord: true,
                            },
                        },
                    },
                },
            },
        });

        if (!payment) {
            throw createHttpError(404, "Specified payment not found");
        }

        // Check if the user is the landlord of the property
        if (payment.lease?.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "You are not the landlord of this property"
            );
        }

        // Check if reminder with same daysBefore already exists
        const existingReminder = await prisma.reminder.findFirst({
            where: {
                daysBefore,
                paymentId,
            },
        });

        if (existingReminder) {
            throw createHttpError(
                400,
                "A reminder with the same daysBefore already exists"
            );
        }

        // Create reminder
        const reminder = await prisma.reminder.create({
            data: {
                daysBefore,
                paymentId,
            },
        });

        res.json(reminder);
    } catch (error) {
        next(error);
    }
};

export const getReminders: RequestHandler = async (req, res, next) => {
    try {
        const { id: paymentId } = req.params;

        // Check if payment exists
        const payment = await prisma.payment.findUnique({
            where: {
                id: paymentId,
            },
            include: {
                reminders: true,
                lease: {
                    include: {
                        property: {
                            include: {
                                landlord: true,
                            },
                        },
                        tenants: {
                            where: {
                                AND: {
                                    tenantId: req.session.userId,
                                    isDeleted: false,
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!payment) {
            throw createHttpError(404, "Specified payment not found");
        }

        // Check if user is landlord or tenant
        if (
            payment.lease?.property.landlordId !== req.session.userId &&
            payment.lease?.tenants.length === 0
        ) {
            throw createHttpError(403, "You are not the landlord or tenant");
        }

        res.json(payment.reminders);
    } catch (error) {
        next(error);
    }
};

export const updateReminder: RequestHandler = async (req, res, next) => {
    try {
        const { id: reminderId } = req.params;
        const { daysBefore } = CreateReminderBody.parse(req.body);

        // Check if reminder exists
        const reminder = await prisma.reminder.findUnique({
            where: {
                id: reminderId,
            },
            include: {
                payment: {
                    include: {
                        lease: {
                            include: {
                                property: {
                                    include: {
                                        landlord: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!reminder) {
            throw createHttpError(404, "Specified reminder not found");
        }

        // Check if the user is the landlord of the property
        if (
            reminder.payment.lease?.property.landlordId !== req.session.userId
        ) {
            throw createHttpError(
                403,
                "You are not the landlord of this property"
            );
        }

        // Update reminder
        const updatedReminder = await prisma.reminder.update({
            where: {
                id: reminderId,
            },
            data: {
                daysBefore,
            },
        });

        res.json(updatedReminder);
    } catch (error) {
        next(error);
    }
};

export const deleteReminder: RequestHandler = async (req, res, next) => {
    try {
        const { id: reminderId } = req.params;

        // Check if reminder exists
        const reminder = await prisma.reminder.findUnique({
            where: {
                id: reminderId,
            },
            include: {
                payment: {
                    include: {
                        lease: {
                            include: {
                                property: {
                                    include: {
                                        landlord: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!reminder) {
            throw createHttpError(404, "Specified reminder not found");
        }

        // Check if the user is the landlord of the property
        if (
            reminder.payment.lease?.property.landlordId !== req.session.userId
        ) {
            throw createHttpError(
                403,
                "You are not the landlord of this property"
            );
        }

        // Delete reminder
        await prisma.reminder.delete({
            where: {
                id: reminderId,
            },
        });

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};
