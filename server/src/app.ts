import "dotenv/config";

import createHttpError, { isHttpError } from "http-errors";
import express, { NextFunction, Request, Response } from "express";

import { PrismaClient } from '@prisma/client'
import morgan from "morgan";

const prisma = new PrismaClient();

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// Endpoints
app.get("/users", async (req, res) => {
    // todo:: testing
    // Get all users (email, name, id)
    const users = await prisma.user.findMany({
        select: {
            email: true,
            name: true,
            id: true
        }
    });
    res.json(users)
});

// Routers
// app.use("/api", apiRouter);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    res.status(statusCode).json({ error: errorMessage });
});

export default app;
