import mongoose, { Document } from "mongoose";

type Role = "admin" | "owner" | "employee";

export interface AdminType {
  fullName: string;
  email: string;
  role: Role;
  isActive: boolean;
  lastLogin: string | null;
  plan: "free" | "premium" | "enterprise";
  planExpiration: string | null;
  allowedUse: boolean;
  country: string;
  city: string;
  ipAddress: string[];
  createdAt: string;
  updatedAt: string;
  company?: string;
}

export interface AdminStateType {
  user: AdminType | null;
  email: string;
  unit: string;
  isChat: boolean;
  setUnit: (unit: string) => void;
  setEmail: (email: string) => void;
  setUser: (user: AdminType) => void;
  setIsChat: (isChat: boolean) => void;
}

export interface MessageType {
  prompt?: string;
  role: "user" | "ai";
  content?: string;
}

export interface ChatbotChatType {
  messages: Array<MessageType>;
  setMessages: (
    messages:
      | Array<MessageType>
      | ((prev: Array<MessageType>) => Array<MessageType>)
  ) => void;
}

export interface LoginType {
  identifier: string;
  password: string;
}
export interface RegisterType {
  fullName: string;
  email: string;
  password: string;
}
export interface FeatureType {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface StepType {
  icon: React.ElementType;
  title: string;
  description: string;
}

export interface StatType {
  icon: React.ElementType;
  value: string;
  label: string;
}
// Define the interface
export interface IUser extends Document {
  fullName: string;
  gender: string;
  email?: string;
  cnic: string;
  password: string;
  role: "admin" | "user" | "owner" | "employee";
  otp: number | null;
  lastLogin: Date;
  otpCreationTime: Date | null;
  plan: string;
  planExpiration: Date;
  allowedUse: boolean;
  isVerified: boolean;
  country: string;
  location: Array<{
    country: string;
    city: string;
  }>;
  ipAddress: string[];
  createdAt: Date;
  updatedAt: Date;
  orgID?: string[];
}

// Define the interface for TypeScript
export interface ICompany extends Document {
  orgId: string; // Unique 8-digit org ID
  orgName: string;
  orgType: string;
  orgLocation: {
    city: string;
    country: string;
  };
  owners: Array<{
    userId: mongoose.Types.ObjectId;
  }>;
  employees: Array<{
    userId: mongoose.Types.ObjectId;
  }>;
  numberOfEmployees?: number;
  email?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryType extends Document {
  productImage: string;
  productName: string;
  productPrice: number;
  priceUnit: string;
  productQuantity: number;
  productUnit: string;
  organizationId: mongoose.Types.ObjectId;
  productSeller?: mongoose.Types.ObjectId;
  productSellerNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum OrderStatusEnum {
  Pending = "Pending",
  Processing = "Processing",
  InTransit = "In Transit",
  Completed = "Completed",
  Return = "Return",
}

export interface OrderType {
  organizationId?: string;
  personName?: string;
  personNumber?: string;
  orderStatus: OrderStatusEnum;
  inventoryId?: string;
  products: {
    productName: string;
    productPrice: number;
    productQuantity: number;
    productUnit?: string;
    priceUnit?: string;
  }[];
}
export interface Organization {
  _id: string;
  orgName: string;
}

export interface IPocket extends Document {
  userId: mongoose.Types.ObjectId;
  pocketName: string;
  pocketBalance: number;
  pocketType?: "Personal" | "Business" | string;
  organizationId?: mongoose.Types.ObjectId;
}
export interface ITransaction extends Document {
  from: string;
  to: string;
  purpose: string;
  expenseType: "Earning" | "Spending";
  txnAmount: number;
  newBalance: number;
  category: "Personal" | "Business" | string;
  status: "Pending" | "Completed" | string;
  pocketId: mongoose.Types.ObjectId; // Reference to Pocket
  createdAt: Date;
  updatedAt: Date;
}
export interface DecodedJWTType {
  id: string;
  email: string;
  username: string;
  iat?: string;
  exp?: string;
}

export interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  text: string;
}
