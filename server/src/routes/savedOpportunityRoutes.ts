import { Router } from "express";
import {
  getSavedOpportunities,
  removeSavedOpportunity,
  saveOpportunity,
} from "../controllers/savedOpportunityController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = Router();

router.use(protect);

router.post("/", saveOpportunity);
router.get("/", getSavedOpportunities);
router.delete("/:opportunityId", removeSavedOpportunity);

export default router;