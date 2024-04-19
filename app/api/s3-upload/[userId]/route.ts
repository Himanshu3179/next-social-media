import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
export async function GET(req: NextRequest, context: any) {
  const { params } = context;
  const userId = params.userId;

  try {
    const user = await db.user.findUnique({
      where: { id: userId },
      include: { Post: true },
    });
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
