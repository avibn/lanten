import * as LeaseController from "../controllers/leases";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get("/", requiresAuth, LeaseController.getLeases);
router.post("/", requiresAuth, LeaseController.createLease);
router.get("/:id", requiresAuth, LeaseController.getLease);
router.put("/:id", requiresAuth, LeaseController.updateLease);
router.delete("/:id", requiresAuth, LeaseController.deleteLease);

export default router;
