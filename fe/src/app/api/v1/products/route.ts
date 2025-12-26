import dbConnect from "@/db";
import { getUserFromRequest } from "@/utils/functions";
import { NextRequest, NextResponse } from "next/server";

import mongoose from "mongoose";
import Company from "@/models/company";
import Inventory from "@/models/inventory";
import Order from "@/models/orders";

export async function GET(request: NextRequest) {
  try {
    // 1️⃣ Get logged-in user
    const { user, error } = await getUserFromRequest(request);
    if (error || !user) {
      return NextResponse.json(
        { message: `Error! ${error || "User not found"}` },
        { status: 401 }
      );
    }

    await dbConnect();
    const userId = new mongoose.Types.ObjectId(user._id as string);

    // 2️⃣ Fetch companies owned by this user
    const companies = await Company.find({
      "owners.userId": userId, // Query within the array of objects
    }).select("_id");

    const companyIds = companies.map((c) => c._id);

    if (companyIds.length === 0) {
      return NextResponse.json({ inventories: [] });
    }

    // 3️⃣ Fetch inventories for these companies
    const inventories = await Inventory.find({
      organizationId: { $in: companyIds },
    });
    const orders = await Order.find({
      organizationId: { $in: companyIds },
    });

    return NextResponse.json({ inventories, orders });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: `Error! ${error}` }, { status: 500 });
  }
}
