import { chunkAndStore, createPineconeStore } from "@/utils/rag";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { NextResponse, NextRequest } from "next/server";
import path from "path"
export async function GET(req: NextRequest) {
  // the file path needs to be dynamically handled
  // We get the file name from the query params and then parse the pdf
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file") as string;
  const filePath = path.join(process.cwd(), "public", file)
  try {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();
    // Chunk and create vector embeddings and store in vector db
    const pc = await createPineconeStore()
    await chunkAndStore(docs, pc)
    console.log("Documents chunked and stored successfully");

    return NextResponse.json({
      content: docs[0].pageContent,
      metadata: docs[0].metadata,
    });
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to load and parse PDF: ${error}` },
      { status: 500 }
    );
  }
}
