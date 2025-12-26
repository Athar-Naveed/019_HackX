import dbConnect from "@/db";
import { NextRequest, NextResponse } from "next/server";
import Inventory from "@/models/inventory";
import { getUserFromRequest } from "@/utils/functions";

export async function POST(request: NextRequest) {
  try {
    const { user, error } = await getUserFromRequest(request);
    if (error) return error; // short-circuit if unauthenticated
    const data = await request.json();
    await dbConnect();

    const newProduct = await Inventory.create({
      organizationId: data.organizationId,
      productImage: data.productImage,
      productName: data.productName,
      productPrice: data.productPrice,
      productQuantity: data.productQuantity,
      productUnit: data.productUnit,
      priceUnit: data.priceUnit,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    try {
      await newProduct.validate();
    } catch (error) {
      return NextResponse.json(
        {
          message: `An error occurred while processing your request. ${error}`,
        },
        { status: 500 }
      );
    }
    await newProduct.save();
    return NextResponse.json(
      { message: "Product added successfully!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: `An error occurred while processing your request. ${error}` },
      { status: 500 }
    );
  }
}

// export async function GET(request:NextRequest){
//     try {
//         const authToken = request.headers.get("Authorization")?.split(" ")[1];
//         if (!authToken) {
//             return NextResponse.json({ message: "Authorization token is required." }, { status: 401 });
//         }
//         const { searchParams } = new URL(request.url);
//         const page = searchParams.get("page") || 1;
//         const limit = searchParams.get("limit") || 10;
//         const decodedJWT = decodeJWT(authToken);
//         if (!decodedJWT){
//             return NextResponse.json({message:"Authentication failed!"},{status:401})
//         }
//         await dbConnect();

//     } catch (error) {
//         return NextResponse.json({message:`An error occurred while processing your request. ${error}`},{status:500})
//     }
// }
