import db from "@/lib/db";
import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import * as z from "zod";

// Define the schema for the request body
const requestBodySchema = z.object({
  email: z.string().email().min(1, "Email cannot be empty"),
  username: z.string().min(1, "Username cannot be empty"),
  password: z.string().min(1, "Password cannot be empty"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email, username, password } = requestBodySchema.parse(body);

    const existingUser = await db.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json(
        { user: null, message: "User with this email already exists" },
        { status: 400 }
      );
    }

    // username is unique
    const existingUsername = await db.user.findUnique({
      where: { username },
    });
    if (existingUsername) {
      return NextResponse.json(
        { user: null, message: "User with this username already exists" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    await db.user.create({
      data: {
        email,
        username,
        password: hashedPassword,
      },
    });

    return NextResponse.json(
      { message: "User created Successfully" },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { user: null, message: error.message },
      { status: 500 }
    );
  }
}
