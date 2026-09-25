import mongoose, { Document, Schema } from "mongoose";

export interface IStudentProfile extends Document {
  userId: mongoose.Types.ObjectId;

  name: string;

  bio?: string;

  college?: string;

  degree?: string;

  branch?: string;

  currentYear?: string;

  graduationYear?: number;

  githubUrl?: string;

  linkedinUrl?: string;

  skills: string[];

  interests: string[];

  // Resume
  resumeFileName?: string;

  resumeMimeType?: string;

  resumeData?: Buffer;

  createdAt: Date;

  updatedAt: Date;
}

const studentProfileSchema = new Schema<IStudentProfile>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    bio: {
      type: String,
      trim: true,
    },

    college: {
      type: String,
      trim: true,
    },

    degree: {
      type: String,
      trim: true,
    },

    branch: {
      type: String,
      trim: true,
    },

    currentYear: {
      type: String,
      trim: true,
    },

    graduationYear: {
      type: Number,
    },

    githubUrl: {
      type: String,
      trim: true,
    },

    linkedinUrl: {
      type: String,
      trim: true,
    },

    skills: {
      type: [String],
      default: [],
    },

    interests: {
      type: [String],
      default: [],
    },

    // ==========================================
    // RESUME
    // ==========================================

    resumeFileName: {
      type: String,
      trim: true,
    },

    resumeMimeType: {
      type: String,
      trim: true,
    },

    resumeData: {
      type: Buffer,
    },
  },
  {
    timestamps: true,
  }
);

const StudentProfile = mongoose.model<IStudentProfile>(
  "StudentProfile",
  studentProfileSchema
);

export default StudentProfile;