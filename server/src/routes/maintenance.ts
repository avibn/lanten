import * as MaintenanceController from "../controllers/maintenance";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get("/requests/all", requiresAuth, MaintenanceController.getAllRequests);
router.get("/requests/:id", requiresAuth, MaintenanceController.getRequest);
router.put("/requests/:id", requiresAuth, MaintenanceController.updateRequest);
router.put(
    "/requests/:id/status",
    requiresAuth,
    MaintenanceController.updateRequestStatus
);
router.delete(
    "/requests/:id",
    requiresAuth,
    MaintenanceController.deleteRequest
);

// Shared requests
router.post(
    "/requests/:id/share",
    requiresAuth,
    MaintenanceController.shareMaintenanceRequest
);
router.get("/shared/:id", MaintenanceController.getSharedMaintenanceRequests);

// Request types
router.get("/types", requiresAuth, MaintenanceController.getRequestTypes);

export default router;
