import mongoose, { Document, Schema } from "mongoose";

export interface IApplication extends Document {
  userId: mongoose.Types.ObjectId;
  opportunityId: mongoose.Types.ObjectId;
  status:
    | "saved"
    | "applied"
    | "under_review"
    | "interview"
    | "offer"
    | "rejected"
    | "withdrawn";
  appliedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const applicationSchema = new Schema<IApplication>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    opportunityId: {
      type: Schema.Types.ObjectId,
      ref: "Opportunity",
      required: true,
    },

    status: {
      type: String,
      enum: [
        "saved",
        "applied",
        "under_review",
        "interview",
        "offer",
        "rejected",
        "withdrawn",
      ],
      default: "applied",
    },

    appliedAt: {
      type: Date,
    },

    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// One student should have only one application record
// for a particular opportunity.
applicationSchema.index(
  { userId: 1, opportunityId: 1 },
  { unique: true }
);

const Application = mongoose.model<IApplication>(
  "Application",
  applicationSchema
);

export default Application;