import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/db";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "@/models/users";
import { getLocation } from "@/utils/functions";

export async function POST(request: NextRequest) {
  try {
    await dbConnect();

    const { identifier, password, ipAddress } = await request.json();
    const location = await getLocation(ipAddress);

    if (!identifier || !password) {
      return NextResponse.json(
        { message: "Identifier and password are required", status: 400 },
        { status: 400 }
      );
    }

    // Determine identifier type
    const isEmail = identifier.includes("@");
    const normalizedCNIC = !isEmail ? identifier.replace(/-/g, "") : null;

    // Build query
    const query = isEmail
      ? { email: identifier.toLowerCase() }
      : { cnic: normalizedCNIC };

    // Find user
    const user = await User.findOne(query).select("+password");

    if (!user) {
      return NextResponse.json(
        { message: "User not found", status: 404 },
        { status: 404 }
      );
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials", status: 401 },
        { status: 401 }
      );
    }

    // Email-based users must verify email
    if (user.email && !user.isVerified) {
      return NextResponse.json(
        { message: "Please verify your email", status: 403 },
        { status: 403 }
      );
    }

    // Ensure arrays exist
    if (!Array.isArray(user.ipAddress)) user.ipAddress = [];
    if (!Array.isArray(user.location)) user.location = [];

    const isIpNew = !user.ipAddress.includes(ipAddress);

    if (isIpNew) {
      await User.updateOne(
        { _id: user._id },
        {
          $push: {
            ipAddress,
            location: {
              country: location.country,
              city: location.city,
            },
          },
        }
      );
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email || null,
        cnic: user.cnic,
        fullName: user.fullName,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return NextResponse.json(
      {
        message: "Logged In",
        token: token,
        fullName: user.fullName,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        message: `An error occurred during login: ${error.message}`,
        status: 500,
      },
      { status: 500 }
    );
  }
}
