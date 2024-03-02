import * as AnnouncementController from "../controllers/announcements";

import express from "express";
import { requiresAuth } from "../middleware/requiresAuth";

const router = express.Router();

router.get("/:id", requiresAuth, AnnouncementController.getAnnouncement);
router.put("/:id", requiresAuth, AnnouncementController.updateAnnouncement);
router.delete("/:id", requiresAuth, AnnouncementController.deleteAnnouncement);

export default router;
