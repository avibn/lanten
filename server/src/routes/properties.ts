import * as PropertyController from "../controllers/properties";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get("/", requiresAuth, PropertyController.getProperties);
router.post("/", requiresAuth, PropertyController.createProperty);
router.get("/:id", requiresAuth, PropertyController.getProperty);
router.put("/:id", requiresAuth, PropertyController.updateProperty);
router.delete("/:id", requiresAuth, PropertyController.deleteProperty);

export default router;
