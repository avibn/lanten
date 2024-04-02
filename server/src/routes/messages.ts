import * as MessageController from "../controllers/messages";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get("/channels", requiresAuth, MessageController.getAllMessagedUsers);

// Specific user messages
router.delete("/:id", requiresAuth, MessageController.deleteMessage);

export default router;
