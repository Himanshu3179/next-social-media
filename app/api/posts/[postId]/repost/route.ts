import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import db from "@/lib/db";
export async function POST(req: Request, context: any) {
  const { params } = context;
  const postId = params.postId;
  console.log(postId);

  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json(
      { message: "You have to be logged in to repost" },
      { status: 401 }
    );
  }

  try {
    const user = session.user;
    const post = await db.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ message: "Post not found" }, { status: 404 });
    }

    const repost = await db.post.create({
      data: {
        authorId: user.id,
        imageUri: post.imageUri,
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(repost);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}
