import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import * as z from "zod";

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
export async function POST(req: Request) {
  const session = await getServerSession(authOptions);
  // if (!session) {
  //   return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  // }
  // const user = session.user;
  try {
    const formData = await req.formData();
    const body = await req.json();
    const { title, content } = requestBodySchema.parse(body);
    console.log("title:", title);
    console.log("content:", content);
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json(
        { message: "No file provided" },
        { status: 400 }
      );
    }
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Invalid file type. Only images are supported." },
        { status: 400 }
      );
    }
    console.log("file:", file);
    console.log("title:", title);
    console.log("content:", content);
      return NextResponse.json({
        message: "fetch data successfully",
      });
    // const buffer = Buffer.from(await file.arrayBuffer());

    // const fileName = await uploadFileToS3(buffer);
    // const url = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${fileName}`;
    // console.log("this is a url: ", url);

    // console.log("this is the session: ", session.user.id);

    // await db.user.update({
    //   where: { id: user.id },
    //   data: {
    //     Post: {
    //       create: {
    //         imageUri: url,
    //       },
    //     },
    //   },
    // });

    // return NextResponse.json({
    //   message: "File uploaded successfully",
    //   fileName,
    // });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}

// model User {
//   id                     String          @id @default(cuid())
//   username               String          @unique
//   email                  String          @unique
//   password               String
//   profilePhoto           String?         @db.VarChar(255)
//   createdAt              DateTime        @default(now())
//   updatedAt              DateTime        @updatedAt
//   posts                  Post[]
//   comments               Comment[]
//   likes                  Like[]
//   sentFriendRequests     FriendRequest[] @relation("SentFriendRequests")
//   receivedFriendRequests FriendRequest[] @relation("ReceivedFriendRequests")
//   friends                Friend[]        @relation("Me")
//   friendOf               Friend[]        @relation("FriendOf")
// }

// model Post {
//   id         String     @id @default(cuid())
//   userId     String
//   user       User       @relation(fields: [userId], references: [id])
//   title      String
//   content    String?
//   imageUri   String?
//   createdAt  DateTime   @default(now())
//   updatedAt  DateTime   @updatedAt
//   visibility VISIBILITY @default(PUBLIC)
//   deletedAt  DateTime?  @db.Timestamp
//   comments   Comment[]
//   likes      Like[]
// }
