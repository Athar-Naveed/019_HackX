import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db";
import Company from "@/models/company";
import { getUserFromRequest } from "@/utils/functions";

export async function GET(request: NextRequest) {
  try {
    // 1️⃣ Get authenticated user
    const { user, error } = await getUserFromRequest(request);
    if (error) return error; // unauthenticated

    await dbConnect();

    // 2️⃣ Fetch organizations from Company using userId
    const organizations = await Company.find({
      "owners.userId": user._id,
    }).select("_id orgId orgName");

    // 3️⃣ No dukaan found
    if (!organizations || organizations.length === 0) {
      return NextResponse.json(
        {
          message: "No dukaan found. Please create a dukaan first.",
          data: [],
        },
        { status: 200 } // ✅ important: frontend-friendly
      );
    }

    // 4️⃣ Return organizations
    return NextResponse.json(
      {
        message: "Dukaan(s) found!",
        data: organizations,
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Get organization error:", error);
    return NextResponse.json(
      {
        message: "An error occurred while fetching organizations.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
