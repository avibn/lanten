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

// Tenant invite accept route
router.post("/join", requiresAuth, TenantController.acceptInvite);

// Tenant routes
const tenantRouter = express.Router();
tenantRouter.get("/", requiresAuth, TenantController.getTenants);
tenantRouter.put("/", requiresAuth, TenantController.updateTenant);
tenantRouter.post("/invite", requiresAuth, TenantController.inviteTenant);
tenantRouter.post("/leave", requiresAuth, TenantController.leaveLease);
tenantRouter.post("/remove", requiresAuth, TenantController.removeTenant);

router.use("/:id/tenants", tenantRouter);

export default router;
