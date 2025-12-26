import { NextRequest, NextResponse } from "next/server";

import dbConnect from "@/db";
import User from "@/models/users";
import Company from "@/models/company";
import { getUserFromRequest } from "@/utils/functions";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const { user, error } = await getUserFromRequest(request);
    if (error) return error; // short-circuit if unauthenticated
    const data = await request.json();
    const { inviteCode } = data;
    if (!inviteCode) {
      return NextResponse.json(
        { message: "Invitation code is required." },
        { status: 400 }
      );
    }
    const org = await Company.findOne({ orgId: inviteCode });
    if (!org) {
      return NextResponse.json(
        { message: "Invalid invitation code." },
        { status: 400 }
      );
    }
    if (user.orgID?.includes(org._id as string)) {
      return NextResponse.json(
        { message: "You are already a member of this organization." },
        { status: 400 }
      );
    }
    const orgOwner = await User.findById(org.owners[0].userId).select(
      "fullName"
    );

    const updatedUser = await User.updateOne({ _id: user._id }, [
      {
        $set: {
          orgID: {
            $ifNull: [{ $concatArrays: ["$orgID", [org._id]] }, [org._id]],
          },

          role: "employee", // Add this inside the $set stage
        },
      },
    ]);
    await Company.updateOne({ _id: org._id }, [
      {
        $set: {
          employees: {
            $ifNull: [
              { $concatArrays: ["$employees", [{ userId: user._id }]] },
              [{ userId: user._id }],
            ],
          },
        },
      },
    ]);

    if (updatedUser?.modifiedCount === 0) {
      return NextResponse.json(
        { message: "Failed to join organization." },
        { status: 500 }
      );
    }
    return NextResponse.json(
      {
        name: org.orgName,
        members: org.numberOfEmployees,
        owner: orgOwner?.fullName,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `An error occurred while processing your request. ${error}` },
      { status: 500 }
    );
  }
}
