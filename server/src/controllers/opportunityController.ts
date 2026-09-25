import { Request, Response } from "express";
import Opportunity from "../models/Opportunity.js";
import Application from "../models/Application.js";

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    role?: string;
  };
};

// ==========================================
// GET PUBLISHED OPPORTUNITIES
// ==========================================

export const getOpportunities = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const {
      type,
      workMode,
      search,
      status = "published",
    } = req.query;

    const filter: Record<string, unknown> = {
      status,
    };

    if (type) {
      filter.type = type;
    }

    if (workMode) {
      filter.workMode = workMode;
    }

    if (search) {
      const searchRegex = new RegExp(String(search), "i");

      filter.$or = [
        { title: searchRegex },
        { organization: searchRegex },
        { skills: searchRegex },
      ];
    }

    const opportunities = await Opportunity.find(filter)
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({
      success: true,
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    console.error("Get opportunities error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch opportunities",
    });
  }
};


// ==========================================
// GET ADMIN'S OWN OPPORTUNITIES
// ==========================================

export const getAdminOpportunities = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const opportunities = await Opportunity.find({
      createdBy: adminId,
    })
      .sort({ createdAt: -1 })
      .lean();

    // Get applicant count for every opportunity
    const opportunitiesWithApplicantCount =
      await Promise.all(
        opportunities.map(async (opportunity) => {
          const applicantCount =
            await Application.countDocuments({
              opportunityId: opportunity._id,
            });

          return {
            ...opportunity,
            applicantCount,
          };
        })
      );

    res.status(200).json({
      success: true,
      count: opportunitiesWithApplicantCount.length,
      data: opportunitiesWithApplicantCount,
    });
  } catch (error) {
    console.error(
      "Get admin opportunities error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch admin opportunities",
    });
  }
};


// ==========================================
// GET SINGLE OPPORTUNITY
// ==========================================

export const getOpportunityById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const opportunity = await Opportunity.findById(
      req.params.id
    ).lean();

    if (!opportunity) {
      res.status(404).json({
        success: false,
        message: "Opportunity not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: opportunity,
    });
  } catch (error) {
    console.error("Get opportunity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch opportunity",
    });
  }
};


// ==========================================
// CREATE SINGLE OPPORTUNITY
// ==========================================

export const createOpportunity = async (
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

    const opportunity = await Opportunity.create({
      ...req.body,
      createdBy: userId,
      status: req.body.status || "published",
    });

    res.status(201).json({
      success: true,
      message: "Opportunity created successfully",
      data: opportunity,
    });
  } catch (error) {
    console.error("Create opportunity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to create opportunity",
    });
  }
};


// ==========================================
// CREATE MULTIPLE OPPORTUNITIES
// ==========================================

export const createOpportunitiesBulk = async (
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

    if (!Array.isArray(req.body) || req.body.length === 0) {
      res.status(400).json({
        success: false,
        message: "Request body must be a non-empty array",
      });
      return;
    }

    const opportunities = await Opportunity.insertMany(
      req.body.map((item) => ({
        ...item,
        createdBy: userId,
        status: item.status || "published",
      }))
    );

    res.status(201).json({
      success: true,
      message: `${opportunities.length} opportunities created successfully`,
      count: opportunities.length,
      data: opportunities,
    });
  } catch (error) {
    console.error(
      "Bulk create opportunities error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to create opportunities",
    });
  }
};


// ==========================================
// UPDATE OPPORTUNITY
// ==========================================

export const updateOpportunity = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const opportunity =
      await Opportunity.findOneAndUpdate(
        {
          _id: req.params.id,
          createdBy: adminId,
        },
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!opportunity) {
      res.status(404).json({
        success: false,
        message:
          "Opportunity not found or you are not authorized to edit it",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Opportunity updated successfully",
      data: opportunity,
    });
  } catch (error) {
    console.error("Update opportunity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update opportunity",
    });
  }
};


// ==========================================
// DELETE OPPORTUNITY
// ==========================================

export const deleteOpportunity = async (
  req: AuthenticatedRequest,
  res: Response
): Promise<void> => {
  try {
    const adminId = req.user?.userId;

    if (!adminId) {
      res.status(401).json({
        success: false,
        message: "Authentication required",
      });
      return;
    }

    const opportunity =
      await Opportunity.findOneAndDelete({
        _id: req.params.id,
        createdBy: adminId,
      });

    if (!opportunity) {
      res.status(404).json({
        success: false,
        message:
          "Opportunity not found or you are not authorized to delete it",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Opportunity deleted successfully",
    });
  } catch (error) {
    console.error("Delete opportunity error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to delete opportunity",
    });
  }
};