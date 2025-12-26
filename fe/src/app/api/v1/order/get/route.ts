import dbConnect from "@/db";
import { NextRequest, NextResponse } from "next/server";
import Order from "@/models/orders";
import { getUserFromRequest } from "@/utils/functions";

export async function GET(request: NextRequest) {
  try {
    const organizationId = request.nextUrl.searchParams.get("organizationId");
    const { user, error } = await getUserFromRequest(request);
    if (error) return error; // short-circuit if unauthenticated
    await dbConnect();

    const inventory = await Order.find({ organizationId: organizationId });
    if (inventory.length < 0) {
      return NextResponse.json(
        { message: "Nothing in inventory" },
        { status: 404 }
      );
    }
    return NextResponse.json({ data: inventory }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message },
      { status: error.status }
    );
  }
}
