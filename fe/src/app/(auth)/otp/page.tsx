import Otp from "@/components/auth/OTPPage";
import { Metadata } from "next";

export const metadata:Metadata = {
    title: 'OTP Page',
    description: 'OTP Page for admin login',
    keywords: ['admin', 'login', 'otp'],
    icons: "/Logo/hisaab.png"
}
export default function OTP(){
    return (
        <>
        <Otp />
        </>
    )
}