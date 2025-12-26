import { ICompany } from "@/types";
import mongoose, { Schema, Model } from "mongoose";

// Define the schema
const companySchema = new Schema<ICompany>(
  {
    orgId: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value: string) {
            
            return typeof value === "string" && value.length === 8;
        },
        message: "Organization ID must be exactly 6 characters long",
    },
    },
    orgName: {
      type: String,
      required: true,
      trim: true, // Removes leading/trailing spaces
    },
    orgType: {
      type: String,
      required: true,
      trim: true, // Removes leading/trailing spaces
    },
    numberOfEmployees: {
      type: Number,
      default: null,
      min: 1,
    },
    orgLocation: {
      city: { type: String, default: null },
      country: { type: String, default: null },
    },
    owners: {
      type: [
        {
          userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // References the User model
            default: null, },
        }
      ],
      default: [],
    },
    employees: {
      type: [
        {
          userId: { 
            type: mongoose.Schema.Types.ObjectId,
            ref: "User", // References the User model
            default: null, },
        }
      ],
      default: [],
    },
    email: {
      type: String,
      default: null,
      match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Invalid email"],
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt fields automatically
  }
);

// Export the model
const Company: Model<ICompany> = mongoose.models.Company || mongoose.model<ICompany>("Company", companySchema);

export default Company;
