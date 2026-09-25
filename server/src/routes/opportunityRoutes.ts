import { Router } from "express";

import {
  getOpportunities,
  getAdminOpportunities,
  getOpportunityById,
  createOpportunity,
  createOpportunitiesBulk,
  updateOpportunity,
  deleteOpportunity,
} from "../controllers/opportunityController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/roleMiddleware.js";

const router = Router();

/*
 * ADMIN ROUTES
 * All admin actions require:
 * 1. A valid login token
 * 2. Admin role
 */

// Get only opportunities created by the logged-in admin
router.get("/admin", protect, adminOnly, getAdminOpportunities);

// Create multiple opportunities
router.post(
  "/admin/bulk",
  protect,
  adminOnly,
  createOpportunitiesBulk
);

// Create a new opportunity
router.post(
  "/admin",
  protect,
  adminOnly,
  createOpportunity
);

// Update an opportunity
router.put(
  "/admin/:id",
  protect,
  adminOnly,
  updateOpportunity
);

// Delete an opportunity
router.delete(
  "/admin/:id",
  protect,
  adminOnly,
  deleteOpportunity
);


/*
 * PUBLIC ROUTES
 */

// Get published opportunities
router.get("/", getOpportunities);

// Get one opportunity by ID
router.get("/:id", getOpportunityById);

export default router;