// api/order/route.ts
import dbConnect from "@/db";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/orders";
import mongoose from "mongoose";
import { getUserFromRequest } from "@/utils/functions";

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequest(request);
    if (error) return error; // short-circuit if unauthenticated
    const data = await request.json();
    await dbConnect();

    // Validate required fields
    if (!data.organizationId || !data.products || data.products.length === 0) {
      return NextResponse.json(
        { message: "Organization ID and at least one product are required." },
        { status: 400 }
      );
    }

    // Validate each product
    for (const product of data.products) {
      if (
        !product.productName ||
        !product.productPrice ||
        !product.productQuantity
      ) {
        return NextResponse.json(
          { message: "Each product must have name, price, and quantity." },
          { status: 400 }
        );
      }
    }

    const orderData = {
      organizationId: new mongoose.Types.ObjectId(data.organizationId),
      //   personName: data.personName || null,
      //   personNumber: data.personNumber || null,
      orderStatus: data.orderStatus || "Pending",
      products: data.products.map((p: any) => ({
        productName: p.productName,
        productPrice: Number(p.productPrice),
        productQuantity: Number(p.productQuantity),
        productUnit: p.productUnit || null,
        priceUnit: p.priceUnit || null,
      })),
    };

    const order = await Order.create(orderData);
    return NextResponse.json(
      { message: "Order placed successfully!", orderId: order._id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Order creation error:", error);
    return NextResponse.json(
      {
        message: `An error occurred while processing your request. ${error.message}`,
      },
      { status: 500 }
    );
  }
}
