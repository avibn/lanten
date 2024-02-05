import * as UserController from "../controllers/users";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.post("/signup", UserController.signUp);
router.post("/login", UserController.login);
router.post("/logout", UserController.logout);
router.get("/me", requiresAuth, UserController.me);

export default router;
