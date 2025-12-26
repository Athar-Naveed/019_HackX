import dbConnect from "@/db";
import User from "@/models/users";
import { generateOTP, sendVerificationEmail } from "@/utils/functions";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    await dbConnect();
    const { email } = data;
    if (!email) {
      return NextResponse.json(
        { message: "Email is required." },
        { status: 400 }
      );
    }
    const user = await User.findOne({ email }).select("otp");
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    const newOTP = generateOTP();
    await User.updateOne(
      { email },
      { $set: { otp: newOTP, otpCreationTime: new Date() } }
    );
    await sendVerificationEmail(
      email,
      newOTP,
      process.env.ADMIN_EMAIL,
      process.env.ADMIN_PASSWORD
    );
    return NextResponse.json(
      { message: "OTP sent successfully!" },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { message: `An error occurred while processing your request. ${error}` },
      { status: 500 }
    );
  }
}
