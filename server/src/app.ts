import "dotenv/config";

import createHttpError, { isHttpError } from "http-errors";
import express, { NextFunction, Request, Response } from "express";

import { ZodError } from "zod";
import morgan from "morgan";
import usersRouter from "./routes/users";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// Endpoints
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Routers
app.use("/users", usersRouter);

app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((error: unknown, req: Request, res: Response, next: NextFunction) => {
    console.error(error);
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

    res.status(statusCode).json({ error: errorMessage });
});

export default app;
