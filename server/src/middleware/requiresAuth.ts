import { RequestHandler } from "express";
import createHttpError from "http-errors";

export const requiresAuth: RequestHandler = (req, res, next) => {
    // Check authenticated user
    if (req.session.userId) {
        next();
    } else {
        // Remove session cookie
        // res.clearCookie("connect.sid"); // todo - does this work?
        next(createHttpError(401, "User not authenticated"));
    }
};
