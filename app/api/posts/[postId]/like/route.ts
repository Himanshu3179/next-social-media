import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest, context: any) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "You must be logged in to like a post." },
      { status: 401 }
    );
  }

  const user = session.user;
  const { postId } = context.params;

  try {
    const post = await db.post.findUnique({
      where: { id: postId },
      select: {
        id: true,
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const like = post.likes.find((like) => like.userId === user.id);

    if (like) {
      await db.like.delete({
        where: { id: like.id },
      });
    } else {
      await db.like.create({
        data: {
          post: {
            connect: {
              id: postId,
            },
          },
          user: {
            connect: {
              id: user.id,
            },
          },
        },
      });
    }

    return NextResponse.json({ message: "Success" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
