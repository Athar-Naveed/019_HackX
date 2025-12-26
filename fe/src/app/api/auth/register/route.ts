import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import dbConnect from "@/db";
import User from "@/models/users";
import {
  generateOTP,
  getLocation,
  sendVerificationEmail,
} from "@/utils/functions";
// import Company from "@/models/company";
// import {nanoid} from "nanoid";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
  } catch (error: any) {
    return NextResponse.json(error, { status: error.status });
  }
  try {
    const data = await request.json();

    const location = await getLocation(data.ipAddress);
    const normalizedCNIC = data.cnic.replace(/-/g, "");
    const user = await User.findOne({
      $or: [
        { cnic: normalizedCNIC },
        ...(data.email ? [{ email: data.email }] : []),
      ],
    });

    if (user) {
      return NextResponse.json(
        { message: "Email already exists!" },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);
    const generatedOtp = generateOTP();
    await sendVerificationEmail(
      data.email,
      generatedOtp,
      process.env.ADMIN_EMAIL,
      process.env.ADMIN_PASSWORD
    );
    const newUser = new User({
      fullName: data.fullName,
      gender: data.gender,
      cnic: normalizedCNIC,
      email: data.email,
      otp: data.email ? generatedOtp : null,
      otpCreationTime: data.email ? new Date() : null,
      password: hashedPassword,
      location: [
        {
          country: location.country,
          city: location.city,
        },
      ],
      ipAddress: [data.ipAddress],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    try {
      await newUser.validate();
    } catch (error: any) {
      return NextResponse.json({ message: error }, { status: error.status });
    }
    await newUser.save();

    return NextResponse.json(
      { message: "User Created Successfully!", email: data.email },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json({ message: error }, { status: error.status });
  }
}
