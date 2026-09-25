import mongoose, { Document, Schema } from "mongoose";

export interface IOpportunity extends Document {
  title: string;
  description: string;
  organization: string;

  type:
    | "internship"
    | "job"
    | "hackathon"
    | "scholarship"
    | "competition"
    | "workshop"
    | "conference"
    | "other";

  location?: string;

  workMode: "remote" | "hybrid" | "onsite";

  eligibility?: string;

  skills: string[];

  stipend?: string;

  salary?: string;

  applicationUrl: string;

  startDate?: Date;

  endDate?: Date;

  deadline?: Date;

  status: "draft" | "published" | "expired" | "archived";

  createdBy: mongoose.Types.ObjectId;

  createdAt: Date;

  updatedAt: Date;
}

const opportunitySchema = new Schema<IOpportunity>(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      required: true,
    },

    organization: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: [
        "internship",
        "job",
        "hackathon",
        "scholarship",
        "competition",
        "workshop",
        "conference",
        "other",
      ],
      required: true,
    },

    location: {
      type: String,
      trim: true,
    },

    workMode: {
      type: String,
      enum: ["remote", "hybrid", "onsite"],
      default: "remote",
    },

    eligibility: {
      type: String,
    },

    skills: {
      type: [String],
      default: [],
    },

    stipend: {
      type: String,
    },

    salary: {
      type: String,
    },

    applicationUrl: {
      type: String,
      required: true,
      trim: true,
    },

    startDate: {
      type: Date,
    },

    endDate: {
      type: Date,
    },

    deadline: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["draft", "published", "expired", "archived"],
      default: "draft",
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Opportunity = mongoose.model<IOpportunity>(
  "Opportunity",
  opportunitySchema
);

export default Opportunity;