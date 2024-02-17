import { NextFunction, Request, Response } from "express";

import { Prisma } from "@prisma/client";
import { ZodError } from "zod";
import { isHttpError } from "http-errors";

export const errorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    next: NextFunction
) => {
    let errorMessage = "An unknown error occurred";
    let statusCode = 500;

    // Check if http error
    if (isHttpError(error)) {
        statusCode = error.status;
        errorMessage = error.message;
    }
    // Check if zod validation error
    if (error instanceof ZodError) {
        statusCode = 400;
        errorMessage = error.errors
            .map((e) => `${e.path.join(".")}: ${e.message}`)
            .join(", ");
    }

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        statusCode = 404;
        errorMessage = `Specified ${error.meta?.modelName} could not be found.`;
    }

    res.status(statusCode).json({ error: errorMessage });
};
