import { ITransaction } from "@/types";
import mongoose, { Schema, model, Model } from "mongoose";

const transactionSchema = new Schema<ITransaction>(
  {
    from: { type: String, required: false },
    to: { type: String, required: true },
    purpose: { type: String, required: true },
    expenseType: {
      type: String,
      enum: ["Earning", "Spending"],
      required: true,
    },
    txnAmount: { type: Number, required: true },
    newBalance: { type: Number, required: false },
    status: { type: String, enum: ["Pending", "Completed"], required: true },
    category: { type: String, enum: ["Personal", "Business"], required: true },
    pocketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pockets",
      required: true,
    }, // link to pocket
  },
  { timestamps: true }
);

const Transactions: Model<ITransaction> =
  mongoose.models.Transactions ||
  model<ITransaction>("Transactions", transactionSchema);

export default Transactions;
