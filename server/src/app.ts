import "dotenv/config";

import cors from "cors";
import { corsOptions } from "./configs/corsOptions";
import createHttpError from "http-errors";
import { errorHandler } from "./configs/errorHandler";
import express from "express";
import morgan from "morgan";
import propertiesRouter from "./routes/properties";
import { sessionMiddleware } from "./configs/sessions";
import usersRouter from "./routes/users";

const app = express();

// Middlewares
app.use(morgan("dev"));
app.use(cors(corsOptions));
app.use(express.json());

// Session middleware with redis
app.use(sessionMiddleware);

// Endpoints
app.get("/", (req, res) => {
    res.send("Hello World");
});

// Routers
app.use("/users", usersRouter);
app.use("/properties", propertiesRouter);

// Error handling
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

app.use(errorHandler);

export default app;
