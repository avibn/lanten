import { RequestHandler } from "express";
import prisma from "../utils/prismaClient";
import { z } from "zod";

const CreatePropertyBody = z.object({
    name: z.string().min(2).max(100),
    description: z.string().min(2).max(1000),
    address: z.string().min(2).max(100),
});

export const createProperty: RequestHandler = async (req, res, next) => {
    try {
        const { name, description, address } = CreatePropertyBody.parse(
            req.body
        );

        // Check if user is a landlord
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
        });
        if (user?.userType !== "LANDLORD") {
            return res
                .status(403)
                .json({ message: "Only landlords can create properties" });
        }

        // todo:: middleware to check if user is a landlord?

        // Create property and connect it to the landlord
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
            return res
                .status(403)
                .json({ message: "Only landlords can create properties" });
        }

        // Get all properties for the logged in landlord
        const properties = await prisma.property.findMany({
            where: {
                landlordId: req.session.userId,
                isDeleted: false,
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
            return res
                .status(403)
                .json({ message: "Only landlords can create properties" });
        }

        // Get property by id
        const property = await prisma.property.findUnique({
            where: { id, isDeleted: false },
        });

        // Check if property exists
        if (!property) {
            return res
                .status(404)
                .json({ message: "No property found with id" });
        }

        res.status(200).json(property);
    } catch (error) {
        next(error);
    }
};

export const updateProperty: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { name, description, address } = CreatePropertyBody.parse(
            req.body
        );

        // Check if user is a landlord
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
        });
        if (user?.userType !== "LANDLORD") {
            return res
                .status(403)
                .json({ message: "Only landlords can create properties" });
        }

        // Update property by id
        const property = await prisma.property.update({
            where: { id: id, isDeleted: false },
            data: {
                name,
                description,
                address,
            },
        });

        res.status(200).json(property);
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
            return res
                .status(403)
                .json({ message: "Only landlords can create properties" });
        }

        // Set deleted property to true
        await prisma.property.update({
            where: { id: id },
            data: {
                isDeleted: true,
            },
        });

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};
