import * as UserController from "../controllers/users";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.post("/signup", requiresAuth, UserController.signUp);
router.post("/login", UserController.login);

export default router;
