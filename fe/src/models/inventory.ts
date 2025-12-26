import { InventoryType } from "@/types";
import mongoose, { Model, Schema } from "mongoose";

const inventorySchema = new Schema<InventoryType>(
    {
        productImage: {
        type: String,
        required: false,
    },
    productName: {
        type: String,
        required: true,
        trim: true,
    },
    productPrice: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: function (value: number) {
                return value >= 0;
            },
            message: "Product price must be a positive number",
        }
    },
    productQuantity: {
        type: Number,
        required: true,
        min: 0,
        validate:{
            validator: function (value: number) {
                return value >= 0;
            },
            message: "Product quantity must be a positive number",
        }
    },
    productUnit: {
        type: String,
        required: false,
        default: "kg"
    },
    priceUnit: {
        type: String,
        required: true,
        default: "PKR"
    },
    organizationId: {
        type: Schema.Types.ObjectId,
        ref: "Company",
        required: true,
    },
    productSeller: {
        type: Schema.Types.ObjectId,
        ref: "Customers",
        required: false,
    },
    productSellerNumber: {
        type: String,
        required: false,
    },
    },
    {
        timestamps: true,
    }
)

const Inventory: Model<InventoryType> = mongoose.models.Inventory || mongoose.model<InventoryType>("Inventory", inventorySchema);

export default Inventory;