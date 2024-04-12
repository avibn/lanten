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

type AllRemindersQueryResult = {
    id: string;
    amount: number;
    name: string;
    description?: string | null;
    type: string;
    paymentDate: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
    leaseId?: string | null;
    leaseTenantId?: string | null;
    recurringInterval: string;
    daysBefore: number;
    paymentId: string;
}[];

const getAllRemindersQuery = async (): Promise<AllRemindersQueryResult> => {
    return prisma.$queryRaw`
        -- Recurring reminders
        WITH recurring_dates AS (
        SELECT p."id", g.date::date
        FROM "Payment" p
        CROSS JOIN LATERAL
        generate_series(
            p."paymentDate", 
            (CURRENT_DATE AT TIME ZONE 'UTC') + INTERVAL '10 days', 
            CASE 
            WHEN p."recurringInterval" = 'DAILY' THEN '1 day'::interval
            WHEN p."recurringInterval" = 'WEEKLY' THEN '7 days'::interval
            WHEN p."recurringInterval" = 'MONTHLY' THEN '1 month'::interval
            WHEN p."recurringInterval" = 'YEARLY' THEN '1 year'::interval
            END
        ) g(date)
        WHERE p."recurringInterval" != 'NONE'
        )
        SELECT p.*, r.*
        FROM recurring_dates rd
        JOIN "Payment" p ON rd."id" = p."id"
        JOIN "Reminder" r ON p."id" = r."paymentId"
        WHERE DATE(rd.date) - r."daysBefore" = (CURRENT_DATE AT TIME ZONE 'UTC')

        UNION

        -- Non-recurring reminders
        SELECT p.*, r.*
        FROM "Payment" p
        JOIN "Reminder" r ON p."id" = r."paymentId"
        WHERE DATE(p."paymentDate") - r."daysBefore" = CURRENT_DATE;`;
};

export const getAllReminders: RequestHandler = async (req, res, next) => {
    try {
        const reminders = await getAllRemindersQuery();

        // Filter out deleted payments
        const filteredReminders = reminders.filter(
            (reminder) => !reminder.isDeleted
        );

        // Add tenants names and emails to the response
        const remindersWithTenants = await Promise.all(
            filteredReminders.map(async (reminder) => {
                if (!reminder.leaseId) {
                    return reminder;
                }

                const tenants = await prisma.leaseTenant.findMany({
                    where: {
                        leaseId: reminder.leaseId,
                        isDeleted: false,
                        tenant: {
                            isActive: true,
                        },
                    },
                    include: {
                        tenant: {
                            select: {
                                id: true,
                                name: true,
                                email: true,
                            },
                        },
                    },
                });

                return {
                    ...reminder,
                    tenants: tenants.map((tenant) => ({
                        id: tenant.tenant.id,
                        name: tenant.tenant.name,
                        email: tenant.tenant.email,
                    })),
                };
            })
        );

        res.json(remindersWithTenants);
    } catch (error) {
        next(error);
    }
};
