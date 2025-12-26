import dbConnect from "@/db";
import Pockets from "@/models/pockets";
import { getUserFromRequest } from "@/utils/functions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequest(request);
    if (error) return error; // short-circuit if unauthenticated

    await dbConnect();
    const data = await request.json();

    const pocket = await new Pockets({
      userId: user._id,
      pocketName: data.pocketName,
      pocketbalance: data.pocketBalance || 0,
      pocketType: data.pocketType,
      organizationId: data.organizationId || undefined,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await pocket.save();
    const pockets = await Pockets.find({ userId: user._id });
    return NextResponse.json(
      { message: "Pocket created successfully", pockets },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.error();
  }
}
