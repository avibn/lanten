import "dotenv/config";

import createHttpError, { isHttpError } from "http-errors";
import express, { NextFunction, Request, Response } from "express";

import morgan from "morgan";

const app = express();

app.use(morgan("dev"));
app.use(express.json());

// Endpoints
app.get("/", (req, res) => {
    res.send("Hello, world!");
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
