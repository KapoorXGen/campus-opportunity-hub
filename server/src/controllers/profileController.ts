import { Request, Response } from "express";
import StudentProfile from "../models/StudentProfile.js";
import User from "../models/User.js";

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
  };
};

export const getMyProfile = async (
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

    // Do not send the actual resume binary data
    // when fetching the profile.
    const profile = await StudentProfile.findOne({
      userId,
    })
      .select("-resumeData")
      .lean();

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Profile not found",
      });
      return;
    }

    const user = await User.findById(userId)
      .select("email")
      .lean();

    res.status(200).json({
      success: true,
      data: {
        ...profile,
        email: user?.email || "",
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
    });
  }
};

export const updateMyProfile = async (
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

    const allowedFields = [
      "name",
      "bio",
      "college",
      "degree",
      "branch",
      "currentYear",
      "graduationYear",
      "githubUrl",
      "linkedinUrl",
      "skills",
      "interests",
    ];

    const updates: Record<string, unknown> = {};

    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      updates,
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-resumeData")
      .lean();

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Profile not found",
      });
      return;
    }

    const user = await User.findById(userId)
      .select("email")
      .lean();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        ...profile,
        email: user?.email || "",
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

export const uploadResume = async (
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

    if (!req.file) {
      res.status(400).json({
        success: false,
        message: "Please upload a PDF resume",
      });
      return;
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { userId },
      {
        resumeFileName: req.file.originalname,
        resumeMimeType: req.file.mimetype,
        resumeData: req.file.buffer,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .select("-resumeData")
      .lean();

    if (!profile) {
      res.status(404).json({
        success: false,
        message: "Profile not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Resume uploaded successfully",
      data: {
        resumeFileName: profile.resumeFileName,
        resumeMimeType: profile.resumeMimeType,
        hasResume: Boolean(profile.resumeFileName),
      },
    });
  } catch (error) {
    console.error("Upload resume error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to upload resume",
    });
  }
};