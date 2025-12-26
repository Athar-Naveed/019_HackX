import dbConnect from "@/db";
import Pockets from "@/models/pockets";
import { getUserFromRequest } from "@/utils/functions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequest(request);
    if (error) return error; // short-circuit if unauthenticated

    await dbConnect();
    const pockets = await Pockets.find({ userId: user._id });
    if (pockets.length === 0) {
      return NextResponse.json(
        { message: "No pockets found", pockets: [] },
        { status: 200 }
      );
    }
    return NextResponse.json(
      { message: "Pockets fetched successfully", pockets },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.error();
  }
}
