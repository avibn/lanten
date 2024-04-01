import * as AnnouncementController from "../controllers/announcements";
import * as DocumentController from "../controllers/documents";
import * as LeaseController from "../controllers/leases";
import * as MaintenanceController from "../controllers/maintenance";
import * as PaymentController from "../controllers/payments";
import * as TenantController from "../controllers/tenants";

import express from "express";
import multer from "multer";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

// Multer
const upload = multer();

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

// Payments
router.get("/:id/payments", requiresAuth, PaymentController.getPayments);
router.post("/:id/payments", requiresAuth, PaymentController.createPayment);

// Maintenance
router.get(
    "/:id/maintenance/requests",
    requiresAuth,
    MaintenanceController.getRequests
);
router.post(
    "/:id/maintenance/requests",
    requiresAuth,
    MaintenanceController.createRequest
);

// Documents
router.post(
    "/:id/documents",
    requiresAuth,
    upload.any(),
    DocumentController.addDocument
);

// Tenants
router.get("/tenants", requiresAuth, TenantController.getAllTenants);
router.post("/join", requiresAuth, TenantController.acceptInvite); // Accept invite to lease

// Tenant routes
const tenantRouter = express.Router({ mergeParams: true });
tenantRouter.get("/", requiresAuth, TenantController.getLeaseTenants);
tenantRouter.put("/", requiresAuth, TenantController.updateTenant);
tenantRouter.get("/invites", requiresAuth, TenantController.getInvites);
tenantRouter.post("/invites", requiresAuth, TenantController.inviteTenant);
tenantRouter.delete(
    "/invites/:inviteId",
    requiresAuth,
    TenantController.removeInvite
);
tenantRouter.post("/leave", requiresAuth, TenantController.leaveLease);
tenantRouter.post("/remove", requiresAuth, TenantController.removeTenant);
router.use("/:id/tenants", tenantRouter);

export default router;
