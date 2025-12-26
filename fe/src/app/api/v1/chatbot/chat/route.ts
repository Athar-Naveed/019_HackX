import { NextRequest, NextResponse } from "next/server";

const apiURL =
  process.env.NODE_ENV == "development"
    ? process.env.DEVELOPMENT_BACKEND_URL
    : process.env.PRODUCTION_BACKEND_URL;

export async function POST(request: NextRequest) {
  try {
    const token = await request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json(
        { message: "Authorization token is required." },
        { status: 401 }
      );
    }
    const data = await request.json();

    const resp = await fetch(`${apiURL}/api/v1/chat`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const response = await resp.json();

    return NextResponse.json({ message: response.response }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      { message: `Error! ${error}` },
      { status: error.status }
    );
  }
}
