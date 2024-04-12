import * as ReminderController from "../controllers/reminders";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";
import { requiresKey } from "../middleware/requiresKey";

const router = express.Router();

// Get all reminders (for notifs) - KEY REQUIRED
router.get("/all", requiresKey, ReminderController.getAllReminders);

router.put("/:id", requiresAuth, ReminderController.updateReminder);
router.delete("/:id", requiresAuth, ReminderController.deleteReminder);

export default router;
