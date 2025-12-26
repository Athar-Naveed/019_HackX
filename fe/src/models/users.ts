import { IUser } from "@/types";
import mongoose, { Schema, Model } from "mongoose";

// Define the schema
const userSchema = new Schema<IUser>(
  {
    fullName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 50,
    },
    gender: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: false,
      unique: true,
      match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, "Invalid email"],
    },
    cnic: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (value) {
          const digits = value.replace(/-/g, "");
          if (!/^\d{13}$/.test(digits)) return false;

          const lastDigit = parseInt(digits[12], 10);
          return lastDigit % 1 === 0; // ensures numeric, odd/even usable
        },
        message: "Invalid CNIC number",
      },
    },
    password: {
      type: String,
      required: true,
      minlength: 8,
    },
    role: {
      type: String,
      enum: ["admin", "user", "owner", "employee"],
      default: "user",
      required: true,
    },

    orgID: {
      type: [String],
      default: null,
      validate: {
        validator: function (this: IUser) {
          return this.role !== "employee" || !!this.orgID; // If employee, orgID must be present
        },
        message: "Organization ID is required if role is 'employee'.",
      },
    },

    lastLogin: {
      type: Date,
      default: null,
    },
    otp: {
      type: Number,
      default: null,
    },
    otpCreationTime: {
      type: Date,
      default: null,
      index: { expires: "30m" }, // OTP expires in 30 minutes
    },
    plan: {
      type: String,
      default: "free",
    },
    planExpiration: {
      type: Date,
      default: null,
    },
    allowedUse: {
      type: Boolean,
      default: false,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    ipAddress: {
      type: [String], // Store multiple IPs
      default: [],
    },
    location: {
      type: [
        {
          country: { type: String },
          city: { type: String },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

// Export the model
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
