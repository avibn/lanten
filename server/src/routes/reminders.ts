import * as ReminderController from "../controllers/reminders";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.put("/:id", requiresAuth, ReminderController.updateReminder);
router.delete("/:id", requiresAuth, ReminderController.deleteReminder);

export default router;
