import { Response, Request } from "express";
import Application from "../models/Application.js";
import Opportunity from "../models/Opportunity.js";
import StudentProfile from "../models/StudentProfile.js";

type AuthenticatedRequest = Request & {
  user?: {
    userId: string;
    role?: string;
  };
};

// ==========================================
// GET ALL APPLICATIONS FOR ADMIN'S JOBS
// ==========================================

export const getAllApplications = async (
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

    // Get only opportunities created by this admin
    const opportunities = await Opportunity.find({
      createdBy: adminId,
    })
      .select("_id")
      .lean();

    const opportunityIds = opportunities.map(
      (opportunity) => opportunity._id
    );

    // Get applications only for those opportunities
    const applications = await Application.find({
      opportunityId: {
        $in: opportunityIds,
      },
    })
      .populate("userId", "email")
      .populate(
        "opportunityId",
        "title organization type location workMode"
      )
      .sort({ createdAt: -1 })
      .lean();

    // Get all applicant user IDs
    const studentIds = applications
      .map((application) => {
        const user = application.userId as unknown as {
          _id: string;
        };

        return user?._id;
      })
      .filter(Boolean);

    // Get student profiles
    const profiles = await StudentProfile.find({
      userId: {
        $in: studentIds,
      },
    })
      .select("-resumeData")
      .lean();

    // Create quick lookup map
    const profileMap = new Map(
      profiles.map((profile) => [
        String(profile.userId),
        profile,
      ])
    );

    // Combine application + applicant profile information
    const applicationsWithApplicantDetails =
      applications.map((application) => {
        const user = application.userId as unknown as {
          _id: string;
          email: string;
        };

        const profile = profileMap.get(
          String(user?._id)
        );

        return {
          ...application,

          applicant: {
            userId: user?._id || "",
            email: user?.email || "",

            name: profile?.name || "",
            bio: profile?.bio || "",

            college: profile?.college || "",
            degree: profile?.degree || "",
            branch: profile?.branch || "",
            currentYear: profile?.currentYear || "",

            graduationYear:
              profile?.graduationYear || null,

            githubUrl: profile?.githubUrl || "",
            linkedinUrl: profile?.linkedinUrl || "",

            skills: profile?.skills || [],
            interests: profile?.interests || [],

            resumeFileName:
              profile?.resumeFileName || "",

            resumeMimeType:
              profile?.resumeMimeType || "",

            hasResume: Boolean(
              profile?.resumeFileName
            ),
          },
        };
      });

    res.status(200).json({
      success: true,
      count: applicationsWithApplicantDetails.length,
      data: applicationsWithApplicantDetails,
    });
  } catch (error) {
    console.error(
      "Get admin applications error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch applications",
    });
  }
};

// ==========================================
// UPDATE APPLICATION STATUS BY ADMIN
// ==========================================

export const updateApplicationStatusByAdmin = async (
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

    // Find application
    const application = await Application.findById(
      req.params.id
    );

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Application not found",
      });
      return;
    }

    // Make sure the application belongs
    // to an opportunity created by this admin
    const opportunity = await Opportunity.findOne({
      _id: application.opportunityId,
      createdBy: adminId,
    });

    if (!opportunity) {
      res.status(403).json({
        success: false,
        message:
          "You are not authorized to manage this application",
      });
      return;
    }

    // Update application
    const updatedApplication =
      await Application.findByIdAndUpdate(
        req.params.id,
        {
          status,
          ...(notes !== undefined ? { notes } : {}),
        },
        {
          new: true,
          runValidators: true,
        }
      )
        .populate("userId", "email")
        .populate(
          "opportunityId",
          "title organization type location workMode"
        );

    res.status(200).json({
      success: true,
      message:
        "Application status updated successfully",
      data: updatedApplication,
    });
  } catch (error) {
    console.error(
      "Update application status by admin error:",
      error
    );

    res.status(500).json({
      success: false,
      message:
        "Failed to update application status",
    });
  }
};

// ==========================================
// VIEW APPLICANT RESUME
// ==========================================

export const getAdminApplicationResume = async (
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

    // Find the application
    const application = await Application.findById(
      req.params.id
    ).lean();

    if (!application) {
      res.status(404).json({
        success: false,
        message: "Application not found",
      });
      return;
    }

    // Check whether this application belongs
    // to a job created by the logged-in admin
    const opportunity = await Opportunity.findOne({
      _id: application.opportunityId,
      createdBy: adminId,
    }).lean();

    if (!opportunity) {
      res.status(403).json({
        success: false,
        message:
          "You are not authorized to access this resume",
      });
      return;
    }

    // Find student's profile and resume
    const profile = await StudentProfile.findOne({
      userId: application.userId,
    }).select(
      "resumeData resumeMimeType resumeFileName"
    );

    if (!profile || !profile.resumeData) {
      res.status(404).json({
        success: false,
        message: "Resume not found",
      });
      return;
    }

    // Tell browser what file type it is
    res.setHeader(
      "Content-Type",
      profile.resumeMimeType || "application/pdf"
    );

    // Open resume directly in browser
    res.setHeader(
      "Content-Disposition",
      `inline; filename="${
        profile.resumeFileName || "resume.pdf"
      }"`
    );

    // Send resume binary data
    res.send(profile.resumeData);
  } catch (error) {
    console.error(
      "Get admin application resume error:",
      error
    );

    res.status(500).json({
      success: false,
      message: "Failed to fetch resume",
    });
  }
};