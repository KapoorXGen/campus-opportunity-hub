import { Request, Response } from "express";
import SavedOpportunity from "../models/SavedOpportunity.js";
import Opportunity from "../models/Opportunity.js";

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
  };
};

export const saveOpportunity = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;
    const { opportunityId } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    if (!opportunityId) {
      res.status(400).json({
        success: false,
        message: "Opportunity ID is required",
      });
      return;
    }

    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
      return;
    }

    const existingSave = await SavedOpportunity.findOne({
      userId,
      opportunityId,
    });

    if (existingSave) {
      res.status(409).json({
        success: false,
        message: "Opportunity already saved",
      });
      return;
    }

    const savedOpportunity = await SavedOpportunity.create({
      userId,
      opportunityId,
    });

    res.status(201).json({
      success: true,
      message: "Opportunity saved successfully",
      data: savedOpportunity,
    });
  } catch (error) {
    console.error("Save opportunity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to save opportunity",
    });
  }
};

export const getSavedOpportunities = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const savedRecords = await SavedOpportunity.find({ userId })
      .populate("opportunityId")
      .sort({ createdAt: -1 })
      .lean();

    /*
     * Convert the database structure:
     *
     * {
     *   _id,
     *   userId,
     *   opportunityId: {...}
     * }
     *
     * into a frontend-friendly structure:
     *
     * {
     *   _id,
     *   opportunity: {...}
     * }
     */

    const savedOpportunities = savedRecords
      .filter(
        (record) =>
          record.opportunityId &&
          typeof record.opportunityId === "object"
      )
      .map((record) => ({
        _id: record._id,
        createdAt: record.createdAt,
        opportunity: record.opportunityId,
      }));

    res.status(200).json({
      success: true,
      count: savedOpportunities.length,
      data: savedOpportunities,
    });
  } catch (error) {
    console.error("Get saved opportunities error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch saved opportunities",
    });
  }
};

export const removeSavedOpportunity = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const savedOpportunity =
      await SavedOpportunity.findOneAndDelete({
        userId,
        opportunityId: req.params.opportunityId,
      });

    if (!savedOpportunity) {
      res.status(404).json({
        success: false,
        message: "Saved opportunity not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Opportunity removed from saved list",
    });
  } catch (error) {
    console.error("Remove saved opportunity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove saved opportunity",
    });
  }
};