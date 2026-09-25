import { Router } from "express";
import multer from "multer";

import {
  getMyProfile,
  updateMyProfile,
  uploadResume,
} from "../controllers/profileController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = Router();

/*
|--------------------------------------------------------------------------
| Resume Upload Configuration
|--------------------------------------------------------------------------
*/

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB
  },

  fileFilter: (_req, file, callback) => {
    const isPdf =
      file.mimetype === "application/pdf" &&
      file.originalname.toLowerCase().endsWith(".pdf");

    if (!isPdf) {
      callback(
        new Error("Only PDF resume files are allowed")
      );
      return;
    }

    callback(null, true);
  },
});

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.use(protect);

/*
|--------------------------------------------------------------------------
| Get Profile
|--------------------------------------------------------------------------
*/

// GET /api/profile
router.get("/", getMyProfile);

// GET /api/profile/me
router.get("/me", getMyProfile);

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

// PUT /api/profile
router.put("/", updateMyProfile);

// PUT /api/profile/me
router.put("/me", updateMyProfile);

// PATCH /api/profile
router.patch("/", updateMyProfile);

// PATCH /api/profile/me
router.patch("/me", updateMyProfile);

/*
|--------------------------------------------------------------------------
| Resume
|--------------------------------------------------------------------------
*/

// PUT /api/profile/me/resume
router.put(
  "/me/resume",
  upload.single("resume"),
  uploadResume
);

export default router;