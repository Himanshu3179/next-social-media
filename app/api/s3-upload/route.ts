import { NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
const s3Client = new S3Client({
  region: process.env.AWS_REGION as string,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY as string,
  },
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
  if (!session) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  const user = session.user;
  try {
    const formData = await req.formData();
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
    const buffer = Buffer.from(await file.arrayBuffer());

    const fileName = await uploadFileToS3(buffer);
    const url = `https://${process.env.AWS_BUCKET}.s3.amazonaws.com/${fileName}`;
    console.log("this is a url: ", url);

    console.log("this is the session: ", session.user.id);
    // add image url in images array of user
    await db.user.update({
      where: { id: user.id },
      data: {
        Post: {
          create: {
            imageUri: url,
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
      { message: "An error occurred", error },
      { status: 500 }
    );
  }
}

// model User {
//   id        String   @id @default(cuid())
//   email     String   @unique
//   name      String
//   password  String
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
//   Post      Post[]
// }

// model Post {
//   id        String   @id @default(cuid())
//   imageUri  String
//   author    User     @relation(fields: [authorId], references: [id])
//   authorId  String
//   createdAt DateTime @default(now())
//   updatedAt DateTime @updatedAt
// }
