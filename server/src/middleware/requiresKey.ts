import { RequestHandler } from "express";
import createHttpError from "http-errors";
import env from "../utils/validateEnv";

export const requiresKey: RequestHandler = (req, res, next) => {
    // Check for API key in Authorization header
    const apiKey = req.headers.authorization;
    if (apiKey === env.EXPRESS_SECRET_KEY) {
        next();
    } else {
        next(createHttpError(401, "API key required"));
    }
};
