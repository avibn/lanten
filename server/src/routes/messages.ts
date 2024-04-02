import * as MessageController from "../controllers/messages";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.delete("/:id", requiresAuth, MessageController.deleteMessage);

export default router;
