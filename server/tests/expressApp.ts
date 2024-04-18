import express from "express";
import session from "express-session";

const app = express();
app.use(express.json());
app.use(session({ secret: "test", resave: false, saveUninitialized: false }));

export default app;
