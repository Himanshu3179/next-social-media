import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
export async function POST(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "You must be logged in to like a post." },
      { status: 401 }
    );
  }
  try {
    const { postId } = context.params;
    const body = await req.json();
    const { content } = body;

    if (!content) {
      return NextResponse.json(
        { message: "Content is required" },
        { status: 400 }
      );
    }
    const comment = await db.comment.create({
      data: {
        content,
        postId,
        userId: session.user.id,
      },
    });
    return NextResponse.json(comment, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}

// get

export async function GET(req: NextRequest, context: any) {
  try {
    const { postId } = context.params;
    const comments = await db.comment.findMany({
      where: {
        postId,
      },
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            profilePhoto: true,
          },
        },
      },
    });
    return NextResponse.json(comments, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 }
    );
  }
}
