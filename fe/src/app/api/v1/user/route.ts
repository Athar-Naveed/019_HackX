import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db";
import User from "@/models/users";
import { decodeJWT } from "@/utils/functions";

export async function GET(request: NextRequest) {
  const authHeader = await request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { message: "Authentication Failed" },
      { status: 401 }
    );
  }

  const token = authHeader.replace("Bearer ", "");
  const authToken = decodeJWT(token);
  if (!authToken || typeof authToken === "string") {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }
  await dbConnect();

  try {
    const userInfo = await User.findById(authToken.id)
      .select("-password")
      .lean();
    return NextResponse.json(userInfo, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ message: error }, { status: error.status });
  }
}
