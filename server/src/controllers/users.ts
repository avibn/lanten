import * as argon2 from "argon2";

import { PrismaClient, userType } from "@prisma/client";

import { RequestHandler } from "express";
import createHttpError from "http-errors";
import { z } from "zod";

const prisma = new PrismaClient();

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

        // Return user
        const { id, name, userType } = user;
        res.json({ id, email, name, userType });
    } catch (error) {
        next(error);
    }
};
