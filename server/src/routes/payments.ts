import * as PaymentController from "../controllers/payments";
import * as ReminderController from "../controllers/reminders";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get("/:id", requiresAuth, PaymentController.getPayment);
router.put("/:id", requiresAuth, PaymentController.updatePayment);
router.delete("/:id", requiresAuth, PaymentController.deletePayment);

// Reminder routes
router.get("/:id/reminders", requiresAuth, ReminderController.getReminders);
router.post("/:id/reminders", requiresAuth, ReminderController.createReminder);

export default router;
