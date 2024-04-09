import * as argon2 from "argon2";

import { RequestHandler } from "express";
import createHttpError from "http-errors";
import prisma from "../utils/prismaClient";
import { userType } from "@prisma/client";
import { z } from "zod";

const SignUpBody = z.object({
    email: z.string().email(),
    name: z.string().min(2).max(40),
    password: z
        .string()
        .min(8)
        .max(100)
        .refine((password) => /[A-Z]/.test(password), {
            message: "Password must contain at least one uppercase letter",
        })
        .refine((password) => /\d/.test(password), {
            message: "Password must contain at least one number",
        }),
    type: z.enum(["tenant", "landlord"]),
});

export const signUp: RequestHandler = async (req, res, next) => {
    try {
        const { email, name, password, type } = SignUpBody.parse(req.body);

        // Check if email is already in use
        const existingUser = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUser) {
            throw createHttpError(409, "Email already in use");
        }

        // Hash password
        const hashedPassword = await argon2.hash(password);

        // Create user
        const user = await prisma.user.create({
            data: {
                email,
                name,
                password: hashedPassword,
                userType: type.toUpperCase() as userType,
            },
            select: {
                email: true,
                name: true,
                id: true,
                userType: true,
            },
        });

        // Create session
        req.session.userId = user.id;

        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

const LoginBody = z.object({
    email: z.string().email(),
    password: z.string(),
});

export const login: RequestHandler = async (req, res, next) => {
    try {
        const { email, password } = LoginBody.parse(req.body);

        // Get user
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw createHttpError(401, "Invalid email or password");
        }

        // Verify password
        if (!(await argon2.verify(user.password, password))) {
            throw createHttpError(401, "Invalid email or password");
        }

        // Create session
        req.session.userId = user.id;

        // Return user
        const { id, name, userType } = user;

        res.status(201).json({ id, email, name, userType });
    } catch (error) {
        next(error);
    }
};

export const logout: RequestHandler = (req, res, next) => {
    req.session.destroy((error) => {
        if (error) {
            next(error);
        } else {
            // Clear cookie
            res.clearCookie("connect.sid");
            res.sendStatus(204);
        }
    });
};

const UpdatePasswordBody = z.object({
    oldPassword: z.string(),
    newPassword: z
        .string()
        .min(8)
        .max(100)
        .refine((password) => /[A-Z]/.test(password), {
            message: "Password must contain at least one uppercase letter",
        })
        .refine((password) => /\d/.test(password), {
            message: "Password must contain at least one number",
        }),
});

export const updatePassword: RequestHandler = async (req, res, next) => {
    try {
        const { oldPassword, newPassword } = UpdatePasswordBody.parse(req.body);

        // Get user
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: {
                password: true,
            },
        });

        if (!user) {
            throw createHttpError(401, "Not authenticated");
        }

        // Verify password
        if (!(await argon2.verify(user.password, oldPassword))) {
            throw createHttpError(401, "Current password is incorrect.");
        }

        // Hash new password
        const hashedPassword = await argon2.hash(newPassword);

        // Update password
        await prisma.user.update({
            where: { id: req.session.userId },
            data: {
                password: hashedPassword,
            },
        });

        res.sendStatus(204);
    } catch (error) {
        next(error);
    }
};

export const me: RequestHandler = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.session.userId },
            select: {
                email: true,
                name: true,
                id: true,
                userType: true,
            },
        });
        if (!user) {
            throw createHttpError(401, "Not authenticated");
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
};
