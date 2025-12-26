import dbConnect from "@/db";
import { NextRequest, NextResponse } from "next/server";
import Inventory from "@/models/inventory";
import { getUserFromRequest } from "@/utils/functions";

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequest(request);
    if (error) return error; // short-circuit if unauthenticated
    const organizationId = request.nextUrl.searchParams.get("organizationId");
    await dbConnect();

    const inventory = await Inventory.find({ organizationId: organizationId });
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
