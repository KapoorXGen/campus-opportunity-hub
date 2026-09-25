import { Router } from "express";

import {
  createApplication,
  getMyApplications,
  updateApplicationStatus,
} from "../controllers/applicationController.js";

import {
  getAllApplications,
  updateApplicationStatusByAdmin,
  getAdminApplicationResume,
} from "../controllers/adminApplicationController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = Router();

// ==========================================
// AUTHENTICATION
// ==========================================

router.use(protect);

// ==========================================
// ADMIN ROUTES
// IMPORTANT: These must come BEFORE /:id
// ==========================================

router.get(
  "/admin/all",
  adminOnly,
  getAllApplications
);

router.get(
  "/admin/:id/resume",
  adminOnly,
  getAdminApplicationResume
);

router.patch(
  "/admin/:id",
  adminOnly,
  updateApplicationStatusByAdmin
);

// ==========================================
// STUDENT ROUTES
// ==========================================

router.post(
  "/",
  createApplication
);

router.get(
  "/",
  getMyApplications
);

router.patch(
  "/:id",
  updateApplicationStatus
);

export default router;