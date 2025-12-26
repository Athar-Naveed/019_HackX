import dbConnect from "@/db";
import User from "@/models/users";
import { JwtPayload } from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { DecodedJWTType } from "@/types";
import jwt from "jsonwebtoken";

export const getLocation = async (ipAddress: any) => {
  const url = `https://ip-geolocation-ipwhois-io.p.rapidapi.com/json/?ip=${ipAddress}`;
  if (!process.env.RAPID_API_KEY) {
    throw new Error("RAPID_API_KEY is not defined");
  }

  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": process.env.RAPID_API_KEY,
      "x-rapidapi-host": "ip-geolocation-ipwhois-io.p.rapidapi.com",
    },
  };
  try {
    const response = await fetch(url, options);
    const result = await response.json();
    return result;
  } catch (error) {
    return error;
  }
};

export const decodeJWT = (token: string | undefined): DecodedJWTType | any => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not defined");
  }
  if (token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET) as DecodedJWTType;
    } catch (error: any) {
      return { error: error.message, status: error.status };
    }
  }
};

export const generateOrgID = (orgName: string) => {
  const number = Math.floor(10000 + Math.random() * 99999);
  if (orgName.length > 3) {
    const splittedName = orgName.slice(0, 2);
    return splittedName + "-" + number;
  }
  return orgName + "-" + number;
};

export const generateOTP = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp;
};
export async function getUserFromRequest(request: NextRequest) {
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) {
    return {
      error: NextResponse.json({ message: "Unauthenticated" }, { status: 401 }),
    };
  }

  const decodedToken = (await decodeJWT(token)) as JwtPayload;
  if (!decodedToken) {
    return {
      error: NextResponse.json({ message: "Invalid token" }, { status: 401 }),
    };
  }
  await dbConnect();
  const user = await User.findById(decodedToken.id);
  if (!user) {
    return {
      error: NextResponse.json({ message: "User not found" }, { status: 404 }),
    };
  }

  return { user };
}

export const sendVerificationEmail = async (
  email: string,
  otp: number,
  senderEmail?: string,
  senderPass?: string
) => {
  const logoUrl = "/Logo/hisaab.png";
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      user: senderEmail,
      pass: senderPass,
    },
    headers: {
      Precedence: "Bulk",
      "X-Auto-Response-Suppress": "OOF, AutoReply",
    },
  });
  try {
    await transporter.sendMail({
      from: `Hisaab Kitaab ${senderEmail}`,
      to: email,
      subject: "OTP Verification",
      html: `
          <!DOCTYPE html>
          <html lang="en">
          <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>OTP Verification</title>
          </head>
          <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb; color: #333;">
            <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0">
              <tr>
                <td align="center" style="padding: 20px 0;">
                  <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0" style="background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);">
                    <!-- Header -->
                    <tr>
                      <td style="background-color: #4f46e5; padding: 30px 40px; text-align: center;">
                        <img src=${logoUrl} alt="Hisaab Kitaab" style="max-height: 60px; width: auto; margin-bottom: 20px;">
                        <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600;">Verify Your Account</h1>
                      </td>
                    </tr>
                    
                    <!-- Content -->
                    <tr>
                      <td style="padding: 40px;">
                        <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; line-height: 1.5; color: #4b5563;">Hello,</p>
                        <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; line-height: 1.5; color: #4b5563;">Thank you for using Hisaab Kitaab. To complete your verification, please use the following One-Time Password (OTP):</p>
                        
                        <!-- OTP Box -->
                        <div style="background-color: #f3f4f6; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                          <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">Your OTP Code</p>
                          <div style="font-family: 'Courier New', monospace; font-size: 32px; font-weight: 700; letter-spacing: 5px; color: #4f46e5;">
                            ${otp}
                          </div>
                          <p style="margin: 10px 0 0 0; font-size: 14px; color: #6b7280;">Valid for 30 minutes</p>
                        </div>
                        
                        <p style="margin-top: 0; margin-bottom: 24px; font-size: 16px; line-height: 1.5; color: #4b5563;">If you didn't request this OTP, please ignore this email or contact our support team if you have concerns.</p>
                        
                        <p style="margin-top: 0; margin-bottom: 0; font-size: 16px; line-height: 1.5; color: #4b5563;">Best regards,<br>The Hisaab Kitaab Team</p>
                      </td>
                    </tr>
                    
                    <!-- Security Note -->
                    <tr>
                      <td style="padding: 0 40px 30px 40px;">
                        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px;">
                          <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #6b7280;">
                            <strong style="color: #4b5563;">Security Tip:</strong> Hisaab Kitaab will never ask for your password or full account details via email.
                          </p>
                        </div>
                      </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                      <td style="background-color: #f3f4f6; padding: 20px 40px; text-align: center;">
                        <p style="margin: 0 0 10px 0; font-size: 14px; color: #6b7280;">
                          Need help? Contact us at <a href="mailto:${senderEmail}" style="color: #4f46e5; text-decoration: none;">${senderEmail}</a>
                        </p>
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">
                          &copy; ${new Date().getFullYear()} Hisaab Kitaab. All rights reserved.
                        </p>
                        <p style="margin: 10px 0 0 0;">
                          <a href="https://apna-hisaab.vercel.app/" style="display: inline-block; color: #4f46e5; text-decoration: none; font-size: 14px;">Visit our website</a>
                        </p>
                      </td>
                    </tr>
                  </table>
                </td>
              </tr>
            </table>
          </body>
          </html>
            `,
    });
  } catch (error: any) {
    return error;
  }
};
