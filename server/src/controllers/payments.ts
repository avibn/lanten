import { CurrencySchema } from "../utils/schemas";
import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { paymentType } from "@prisma/client";
import prisma from "../utils/prismaClient";
import { z } from "zod";

const CreatePaymentBody = z.object({
    amount: CurrencySchema,
    name: z.string().min(1).max(255),
    description: z.string().max(255).optional(),
    type: z.enum(["RENT", "DEPOSIT", "UTILITIES", "OTHER"]).optional(),
    paymentDate: z.string().datetime({ message: "Invalid date format" }),
    recurringInterval: z
        .enum(["DAILY", "WEEKLY", "MONTHLY", "YEARLY", "NONE"])
        .default("NONE")
        .optional(),
});

export const createPayment: RequestHandler = async (req, res, next) => {
    try {
        const {
            amount,
            name,
            description,
            type,
            paymentDate,
            recurringInterval,
        } = CreatePaymentBody.parse(req.body);
        const { id: leaseId } = req.params;

        // Check if lease exists
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
            },
        });
        if (!lease) {
            throw createHttpError(404, "Specified lease not found");
        }

        // Check if user is landlord
        if (lease?.property.landlord.userType !== "LANDLORD") {
            throw createHttpError(403, "Only landlords can create payments");
        }

        // Check if the user is the landlord of the property
        if (lease.property.landlordId !== req.session.userId) {
            throw createHttpError(
                403,
                "You are not the landlord of this property"
            );
        }

        // Create payment and connect it to the lease
        const payment = await prisma.payment.create({
            data: {
                amount,
                name,
                description,
                type: type as paymentType,
                paymentDate: new Date(paymentDate),
                recurringInterval,
                lease: {
                    connect: {
                        id: leaseId,
                    },
                },
            },
        });

        res.status(201).json(payment);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getPayments: RequestHandler = async (req, res, next) => {
    try {
        const { id: leaseId } = req.params; // todo:: change to "id:leaseId"

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
                        AND: {
                            tenantId: req.session.userId,
                            isDeleted: false,
                        },
                    },
                },
            },
        });

        if (!lease) {
            throw createHttpError(404, "Specified lease not found");
        }

        // Check if user is landlord or tenant
        if (
            lease.property.landlordId !== req.session.userId &&
            lease.tenants.length === 0
        ) {
            throw createHttpError(403, "You are not the landlord or tenant");
        }

        // Get all payments of the lease
        const payments = await prisma.payment.findMany({
            where: {
                leaseId,
            },
            include: {
                reminders: true,
            },
        });

        res.json(payments);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const getPayment: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        // Check if payment exists
        const payment = await prisma.payment.findUnique({
            where: {
                id,
                isDeleted: false,
            },
            include: {
                reminders: true,
            },
        });

        if (!payment) {
            throw createHttpError(404, "Specified payment not found");
        }

        res.json(payment);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const updatePayment: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const {
            amount,
            name,
            description,
            type,
            paymentDate,
            recurringInterval,
        } = CreatePaymentBody.parse(req.body);

        // Check if payment exists
        const payment = await prisma.payment.findUnique({
            where: {
                id,
                isDeleted: false,
            },
        });

        if (!payment) {
            throw createHttpError(404, "Specified payment not found");
        }

        // Update payment
        const updatedPayment = await prisma.payment.update({
            where: {
                id,
            },
            data: {
                amount,
                name,
                description,
                type: type as paymentType,
                paymentDate: new Date(paymentDate),
                recurringInterval,
            },
        });

        res.json(updatedPayment);
    } catch (error) {
        console.log(error);
        next(error);
    }
};

export const deletePayment: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;

        await prisma.payment.update({
            where: {
                id,
                isDeleted: false,
            },
            data: {
                isDeleted: true,
            },
        });

        res.status(204).send();
    } catch (error) {
        console.log(error);
        next(error);
    }
};
