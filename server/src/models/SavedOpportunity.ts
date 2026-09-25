import mongoose, { Document, Schema } from "mongoose";

export interface ISavedOpportunity extends Document {
  userId: mongoose.Types.ObjectId;
  opportunityId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const savedOpportunitySchema = new Schema<ISavedOpportunity>(
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
  },
  {
    timestamps: true,
  }
);

// Prevent the same user from saving the same opportunity twice
savedOpportunitySchema.index(
  { userId: 1, opportunityId: 1 },
  { unique: true }
);

const SavedOpportunity = mongoose.model<ISavedOpportunity>(
  "SavedOpportunity",
  savedOpportunitySchema
);

export default SavedOpportunity;