import "dotenv/config";

import createHttpError, { isHttpError } from "http-errors";
import express, { NextFunction, Request, Response } from "express";

import RedisStore from "connect-redis";
import { ZodError } from "zod";
import { createClient } from "redis";
import env from "./utils/validateEnv";
import morgan from "morgan";
import session from "express-session";
import usersRouter from "./routes/users";

const app = express();

// Redis
const redisClient = createClient({
    url: env.REDIS_URL,
});
redisClient.connect().catch(console.error);

// Initialize redis store
const redisStore = new RedisStore({
    client: redisClient,
    prefix: "lanten:",
});

// Middlewares
app.use(morgan("dev"));
app.use(express.json());

// Session middleware with redis
app.use(
    session({
        store: redisStore,
        resave: false,
        saveUninitialized: false,
        secret: env.SESSION_SECRET,
        rolling: true,
        cookie: {
            maxAge: 1000 * 60 * 60 * 24 * 5, // 15 days
            httpOnly: true,
            secure: false,
            sameSite: "lax",
        },
    })
);

// Endpoints
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Routers
app.use("/users", usersRouter);

// Error handling
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
