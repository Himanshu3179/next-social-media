import { NextRequest, NextResponse } from "next/server";
import { URL } from "url";
import db from "@/lib/db";
export const GET = async (req: Request, context: any) => {
  const url = new URL(req.url);
  const take = url.searchParams.get("take");
  const skip = url.searchParams.get("skip");

  const totalPosts = await db.post.count();

  // if skip is greater than total posts, return empty array
  if (skip && parseInt(skip) > totalPosts) {
    return NextResponse.json([]);
  }

  const posts = await db.post.findMany({
    take: take ? parseInt(take) : 10,
    skip: skip ? parseInt(skip) : 0,
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
      
  return NextResponse.json(posts);
};
