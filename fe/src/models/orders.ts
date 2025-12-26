// models/order.ts
import { OrderStatusEnum, OrderType } from "@/types";
import mongoose, { Model, Schema } from "mongoose";

const productSchema = new Schema({
  productName: {
    type: String,
    required: true
  },
  productPrice: {
    type: Number,
    required: true
  },
  productQuantity: {
    type: Number,
    required: true
  },
  productUnit: {
    type: String,
    required: false
  },
  priceUnit: {
    type: String,
    required: false
  }
}, { _id: false });

const orderSchema = new Schema<OrderType>({
  organizationId: {
    type: Schema.Types.ObjectId,
    ref: "Company",
    required: false
  },
  personName: {
    type: String,
    required: false
  },
  personNumber: {
    type: String,
    required: false
  },
  orderStatus: {
    type: String,
    enum: Object.values(OrderStatusEnum),
    required: true,
    default: OrderStatusEnum.Pending
  },
  products: [productSchema], // Array of products
  inventoryId: {
    type: Schema.Types.ObjectId,
    ref: "Inventory",
    required: false
  }
}, {
  timestamps: true
});

const Order: Model<OrderType> = mongoose.models.Order || mongoose.model<OrderType>("Order", orderSchema);
export default Order;