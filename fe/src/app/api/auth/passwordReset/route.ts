import dbConnect from "@/db";
import User from "@/models/users";
import bcrypt from "bcryptjs";
import { NextRequest,NextResponse } from "next/server";


export async function POST(request: NextRequest) {
try {
    const data = await request.json();
    const { email,password } = data;
    if (!password) {
        return NextResponse.json({ message: "Password is required." }, { status: 400 });
    }
    await dbConnect();
    const user = await User.findOne({email });
    if (!user) {
        return NextResponse.json({ message: "User not found." }, { status: 404 });
    }
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const updatedUser = await User.updateOne(
        { email },
        { $set: { password:hashedPassword } }
    );
    if (updatedUser.modifiedCount === 0) {
        return NextResponse.json({ message: "Failed to update password." }, { status: 500 });
    }
    return NextResponse.json({ message: "Password updated successfully!" }, { status: 200 });
} catch (error:any) {
    return NextResponse.json({ message: `An error occurred while processing your request. ${error}` }, { status: 500 });
}
}