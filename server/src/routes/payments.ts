import * as PaymentController from "../controllers/payments";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get("/:id", requiresAuth, PaymentController.getPayment);
router.put("/:id", requiresAuth, PaymentController.updatePayment);
router.delete("/:id", requiresAuth, PaymentController.deletePayment);

export default router;
