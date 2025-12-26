import dbConnect from "@/db";
import Transactions from "@/models/transactions";
import Pockets from "@/models/pockets";
import { getUserFromRequest } from "@/utils/functions";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequest(request);
    if (error) return error; // short-circuit if unauthenticated

    const { searchParams } = new URL(request.url);
    const pocketId = searchParams.get("pocketId");

    if (!pocketId) {
      return NextResponse.json(
        { message: "pocketId is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Fetch the pocket itself
    const pocket = await Pockets.findOne({
      _id: pocketId,
      userId: user._id,
    }).select("pocketName pocketBalance");

    if (!pocket) {
      return NextResponse.json(
        { message: "Pocket not found" },
        { status: 404 }
      );
    }

    // Fetch transactions
    const transactions = await Transactions.find({
      pocketId,
    });

    return NextResponse.json(
      {
        message: "Transactions fetched successfully",
        pocket: {
          id: pocket._id,
          pocketName: pocket.pocketName,
          pocketBalance: pocket.pocketBalance,
        },
        transactions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequest(request);
    if (error) return error; // not logged in

    const data = await request.json();
    await dbConnect();

    // Ensure pocket belongs to user
    const pocket = await Pockets.findOne({
      _id: data.pocketId,
      userId: user._id,
    }).select("pocketName pocketBalance");

    if (!pocket) {
      return NextResponse.json(
        { message: "Pocket not found" },
        { status: 404 }
      );
    }

    // Calculate new balance
    let newBalance = pocket.pocketBalance;
    if (data.expenseType === "Spending") {
      newBalance -= data.txnAmount;
    } else if (data.expenseType === "Earning") {
      newBalance += data.txnAmount;
    }

    // Create transaction with newBalance
    const transaction = new Transactions({
      ...data,
      pocketId: pocket._id,
      newBalance,
    });

    await transaction.save();

    // Update pocket balance
    pocket.pocketBalance = newBalance;

    await pocket.save();

    return NextResponse.json(
      {
        message: "Transaction created successfully",
        transaction,
        pocket: {
          id: pocket._id,
          pocketName: pocket.pocketName,
          pocketBalance: pocket.pocketBalance,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating transaction:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
