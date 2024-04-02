import "dotenv/config";

import announcementsRouter from "./routes/announcements";
import cors from "cors";
import { corsOptions } from "./configs/corsOptions";
import createHttpError from "http-errors";
import documentRouter from "./routes/documents";
import { errorHandler } from "./configs/errorHandler";
import express from "express";
import leasesRouter from "./routes/leases";
import maintenanceRouter from "./routes/maintenance";
import messagesRouter from "./routes/messages";
import morgan from "morgan";
import paymentsRouter from "./routes/payments";
import propertiesRouter from "./routes/properties";
import remindersRouter from "./routes/reminders";
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
app.use("/leases", leasesRouter);
app.use("/announcements", announcementsRouter);
app.use("/payments", paymentsRouter);
app.use("/maintenance", maintenanceRouter);
app.use("/reminders", remindersRouter);
app.use("/documents", documentRouter);
app.use("/messages", messagesRouter);

// Error handling
app.use((req, res, next) => {
    next(createHttpError(404, "Endpoint not found"));
});

app.use(errorHandler);

export default app;
