import { NextRequest, NextResponse } from "next/server";
import db from "@/lib/db";
import * as z from "zod";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { VISIBILITY } from "@prisma/client";
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
});
const requestBodySchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().min(1, "Content is required"),
  visibility: z.string().min(1, "Visibility is required"),
});
async function uploadFileToS3(buffer: Buffer) {
  const newFileName = `myFolder/${"picture"}-${Date.now()}`;
  const params = {
    Bucket: process.env.AWS_BUCKET as string,
    Key: newFileName,
    Body: buffer,
    ContentType: "image/jpg",
  };
  const command = new PutObjectCommand(params);
  const response = await s3Client.send(command);
  console.log("response:", response);
  return newFileName;
}
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }

    const data = {
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      visibility: formData.get("visibility") as VISIBILITY,
    };

    // Validate the data
    const validatedData = requestBodySchema.safeParse(data);

    if (!validatedData.success) {
      return NextResponse.json(
        { message: "Invalid data", errors: validatedData.error.errors },
        { status: 400 }
      );
    }
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const user = session.user;
    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = await uploadFileToS3(buffer);
    const url = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${fileName}`;
    console.log("this is a url: ", url);

    await db.user.update({
      where: { id: user.id },
      data: {
        posts: {
          create: {
            title: data.title,
            content: data.content,
            imageUri: url,
            visibility: data.visibility,
          },
        },
      },
    });
    return NextResponse.json({
      message: "File uploaded successfully",
      fileName,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "Error fetching data" },
      { status: 500 }
    );
  }
}

// get
// const response = await fetch(`/api/posts?take=${take}&skip=${skip}`);
export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const take = searchParams.get("take")
    ? parseInt(searchParams.get("take") as string)
    : 10;
  const skip = searchParams.get("skip")
    ? parseInt(searchParams.get("skip") as string)
    : 0;

  try {
    const posts = await db.post.findMany({
      take,
      skip,
      orderBy: {
        createdAt: "desc",
      },
      where: {
        visibility: VISIBILITY.PUBLIC,
      },
      select: {
        title: true,
        content: true,
        visibility: true,
        user: {
          select: {
            id: true,
            username: true,
            profilePhoto: true,
          },
        },
        id: true,
        imageUri: true,
        createdAt: true,
        likes: {
          select: {
            id: true,
            userId: true,
          },
        },
      },
    });

    return NextResponse.json(posts);
  } catch (error) {
    console.log(error);
    return NextResponse.json({ message: "An error occurred" }, { status: 500 });
  }
}

