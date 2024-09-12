import fs from "fs";
import path from "path";
import { redirect } from "next/navigation";
import { NextResponse, NextRequest } from "next/server";
import { s3Client } from "@/utils/s3";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// Need to create a presigned URL to handle file upload
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  // Send the presigned URL back to client
  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: file.name,
    ContentType: file.type,
  });
  try {
    const url = await getSignedUrl(s3Client, command, {
      expiresIn: 3600,
    });
    return NextResponse.json(url, {status: 200})
  } catch (error) {
    console.log(error)
    return NextResponse.json(
      { error: `Failed to upload file ${error}` },
      { status: 500 }
    );
  }
}
