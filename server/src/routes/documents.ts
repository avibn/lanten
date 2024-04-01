import * as DocumentController from "../controllers/documents";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get("/:id", requiresAuth, DocumentController.getDocument);
router.put("/:id", requiresAuth, DocumentController.updateDocument);
router.delete("/:id", requiresAuth, DocumentController.deleteDocument);

export default router;
