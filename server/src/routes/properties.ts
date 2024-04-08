import * as PropertyController from "../controllers/properties";

import express from "express";
import multer from "multer";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

// Multer
const upload = multer();

router.get("/", requiresAuth, PropertyController.getProperties);
router.post("/", requiresAuth, upload.any(), PropertyController.createProperty);
router.get("/:id", requiresAuth, PropertyController.getProperty);
router.put(
    "/:id",
    requiresAuth,
    upload.any(),
    PropertyController.updateProperty
);
router.delete("/:id", requiresAuth, PropertyController.deleteProperty);

export default router;
