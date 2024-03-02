import * as AnnouncementController from "../controllers/announcements";
import * as LeaseController from "../controllers/leases";
import * as TenantController from "../controllers/tenants";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

// Lease routes
router.get("/", requiresAuth, LeaseController.getLeases);
router.post("/", requiresAuth, LeaseController.createLease);
router.get("/:id", requiresAuth, LeaseController.getLease);
router.put("/:id", requiresAuth, LeaseController.updateLease);
router.delete("/:id", requiresAuth, LeaseController.deleteLease);
router.put(
    "/:id/description",
    requiresAuth,
    LeaseController.updateLeaseDescription
);

// Announcements
router.get(
    "/:id/announcements",
    requiresAuth,
    AnnouncementController.getAnnouncements
);
router.post(
    "/:id/announcements",
    requiresAuth,
    AnnouncementController.createAnnouncement
);

// Tenants
router.get("/tenants", requiresAuth, TenantController.getAllTenants);
router.post("/join", requiresAuth, TenantController.acceptInvite); // Accept invite to lease

// Tenant routes
const tenantRouter = express.Router({ mergeParams: true });
tenantRouter.get("/", requiresAuth, TenantController.getLeaseTenants);
tenantRouter.put("/", requiresAuth, TenantController.updateTenant);
tenantRouter.post("/invite", requiresAuth, TenantController.inviteTenant);
tenantRouter.post("/leave", requiresAuth, TenantController.leaveLease);
tenantRouter.post("/remove", requiresAuth, TenantController.removeTenant);

router.use("/:id/tenants", tenantRouter);

export default router;
