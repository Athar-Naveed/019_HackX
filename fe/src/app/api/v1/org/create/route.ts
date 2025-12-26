import dbConnect from "@/db";
import { NextRequest, NextResponse } from "next/server";
import User from "@/models/users";
import Company from "@/models/company";
import { decodeJWT, generateOrgID } from "@/utils/functions";

export async function POST(request: NextRequest) {
  try {
    // 1️⃣ Get token
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required." },
        { status: 401 }
      );
    }

    // 2️⃣ Decode JWT
    const decodedJWT = decodeJWT(token);
    if (!decodedJWT || typeof decodedJWT === "string") {
      return NextResponse.json(
        { message: "Authentication failed!" },
        { status: 401 }
      );
    }

    const data = await request.json();
    await dbConnect();

    // 3️⃣ Fetch user (ONLY plan & role)
    const user = await User.findById(decodedJWT.id).select("plan role");

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // 4️⃣ Count existing organizations from Company collection
    const existingOrgsCount = await Company.countDocuments({
      "owners.userId": decodedJWT.id,
    });

    // 5️⃣ Plan-based validation
    let allow = false;
    let message = "You can't create an organization! Please contact support.";

    switch (user.plan) {
      case "free":
        if (existingOrgsCount < 1) allow = true;
        else message = "On Free plan, you can't create more than 1 dukaan.";
        break;

      case "premium":
        if (existingOrgsCount < 2) allow = true;
        else message = "On Premium plan, you can't create more than 2 dukaans.";
        break;

      default:
        message = "Your plan does not allow creating organizations.";
        break;
    }

    if (!allow) {
      return NextResponse.json({ message }, { status: 403 });
    }

    // 6️⃣ Create organization
    const generatedOrgID = generateOrgID(data.orgName);

    const newCompany = new Company({
      orgId: generatedOrgID,
      orgName: data.orgName,
      orgType: data.orgType,
      numberOfEmployees: data.noOfEmployees ?? null,
      orgLocation: {
        country: data.orgCountry,
        city: data.orgCity,
      },
      owners: [{ userId: decodedJWT.id }],
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    await newCompany.validate();
    await newCompany.save();

    // 7️⃣ Optional: mark user as owner
    await User.updateOne({ _id: decodedJWT.id }, { $set: { role: "owner" } });

    return NextResponse.json(
      {
        message: "Dukaan created successfully!",
        orgId: newCompany._id,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create organization error:", error);
    return NextResponse.json(
      { message: "Something went wrong", error: error.message },
      { status: 500 }
    );
  }
}
