import { IPocket } from "@/types";
import mongoose, { Model, Schema } from "mongoose";

const pocketSchema = new Schema<IPocket>(
  {
    userId: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
    organizationId: {
      type: mongoose.Schema.ObjectId,
      ref: "Company",
      default: null,
    },
    pocketType: {
      type: String,
      required: false,
    },

    pocketBalance: { type: Number, required: false, default: 0 },
    pocketName: { type: String, required: true },
  },
  { timestamps: true }
);

// Export the model
const Pockets: Model<IPocket> =
  mongoose.models.Pockets || mongoose.model<IPocket>("Pockets", pocketSchema);

export default Pockets;
