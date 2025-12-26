import dbConnect from "@/db";
import User from "@/models/users";
import { generateOTP, sendVerificationEmail } from "@/utils/functions";
import { NextRequest,NextResponse } from "next/server";



export async function POST(request:NextRequest){
    try {
        const data = await request.json();
        if (data.otp) {
            await dbConnect();
            const user = await User.findOne({email:data.email}).select("otp");
            if (user?.otp == data.otp){
                await User.updateOne({email:data.email}, {$set: {otp: null,isVerified:true,allowedUse:true,otpCreationTime:null}});
                return NextResponse.json({message:"OTP verified successfully!"},{status:200})
            }
            else {
                return NextResponse.json({message:"Invalid OTP!"},{status:401})
            }
        }
        else{
            const newOTP = generateOTP();
            await sendVerificationEmail(data.email,newOTP,process.env.ADMIN_EMAIL,process.env.ADMIN_PASSWORD);
            await User.updateOne({email:data.email}, {$set: {otp: newOTP,otpCreationTime:new Date()}});
            return NextResponse.json({message:"OTP sent successfully!"},{status:200})
        }
    } catch (error:any) {
        
        return NextResponse.json({message: `An error occurred while processing your request. ${error}`},{status:500});
    }
}