import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import fs from "fs";
import path from "path";
import { NextResponse, NextRequest } from "next/server";
export async function GET() {
  // the file path needs to be dynamically handled
  try {
    const loader = new PDFLoader("public/uploads/1725913914104-Ken Resume.pdf");
    const docs = await loader.load();
    return NextResponse.json({
      content: docs[0].pageContent,
      metadata: docs[0].metadata,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load and parse PDF" },
      { status: 500 }
    );
  }
}
export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("file");

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }
  try {
    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Save the file
    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);
    const buffer = Buffer.from(await file.arrayBuffer());

    fs.writeFileSync(filePath, buffer);

    return NextResponse.json({ filePath: filePath.replace("public/", "") });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
