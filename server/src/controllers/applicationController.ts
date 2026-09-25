import { Request, Response } from "express";
import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    role?: string;
  };
};

// ==========================================
// CREATE APPLICATION
// ==========================================

export const createApplication = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const { opportunityId } = req.body;
    const userId = req.user?.userId;

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

    // Check whether opportunity exists
    const opportunity = await Opportunity.findById(opportunityId);

    if (!opportunity) {
      res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
      return;
    }

    // Prevent duplicate applications
    const existingApplication = await Application.findOne({
      userId,
      opportunityId,
    });

    if (existingApplication) {
      res.status(409).json({
        success: false,
        message: "You have already applied to this opportunity",
      });
      return;
    }

    const application = await Application.create({
      userId,
      opportunityId,
      status: "applied",
      appliedAt: new Date(),
    });

    res.status(201).json({
      success: true,
      message: "Application created successfully",
      data: application,
    });
  } catch (error) {
    console.error("Create application error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create application",
    });
  }
};


// ==========================================
// GET MY APPLICATIONS
// ==========================================

export const getMyApplications = async (
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

    const applications = await Application.find({
      userId,
    })
      .populate(
        "opportunityId",
        "title organization type location workMode deadline"
      )
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (error) {
    console.error("Get my applications error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};


// ==========================================
// UPDATE MY APPLICATION STATUS
// ==========================================

export const updateApplicationStatus = async (
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

    const { status, notes } = req.body;

    const allowedStatuses = [
      "saved",
      "applied",
      "under_review",
      "interview",
      "offer",
      "rejected",
      "withdrawn",
    ];

    if (!status || !allowedStatuses.includes(status)) {
      res.status(400).json({
        success: false,
        message: "Invalid application status",
        allowedStatuses,
      });
      return;
    }

    const application = await Application.findOneAndUpdate(
      {
        _id: req.params.id,
        userId,
      },
      {
        status,
        ...(notes !== undefined ? { notes } : {}),
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate(
        "opportunityId",
        "title organization type location workMode deadline"
      );

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Application not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Application updated successfully",
      data: application,
    });
  } catch (error) {
    console.error("Update application status error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update application",
    });
  }
};