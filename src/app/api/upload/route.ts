import { NextResponse, NextRequest } from "next/server";
import { s3Client } from "@/utils/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";


// Need to create a presigned URL to handle file upload
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer())
  // Send the presigned URL back to client
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.name,
    Body: buffer,
    ContentType: file.type,
  });
  try {
    await s3Client.send(command);
    return NextResponse.json({ message: "File uploaded successfully" }, { status: 200 });
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: `Failed to upload file ${error}` },
      { status: 500 }
    );
  }
}
