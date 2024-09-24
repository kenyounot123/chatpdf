import { chunkAndStore, createPineconeStore } from "@/utils/rag";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { NextResponse, NextRequest } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3"
import { s3Client } from "@/utils/s3";
import { Readable } from "stream";
export async function GET(req: NextRequest) {
  // Update this to get the file from s3 bucket then parse
  const { searchParams } = new URL(req.url);
  const file = searchParams.get("file") as string;
  const fileObject = {
    "Bucket": `${process.env.AWS_BUCKET_NAME}`,
    "Key": file
  }
  const command = new GetObjectCommand(fileObject)
  try {
    const response = await s3Client.send(command);

    if (response.Body instanceof Readable) {
      const chunks: Uint8Array[] = [];
      response.Body.on('data', (chunk) => {
        chunks.push(chunk);
      });

      response.Body.on('end', async () => {
        const fileBuffer = Buffer.concat(chunks);
        console.log("File buffer processed successfully");

        const fileBlob = new Blob([fileBuffer], { type: response.ContentType });

        // Load the PDF from buffer
        const loader = new PDFLoader(fileBlob); // Adjust based on how your PDFLoader handles buffers
        const docs = await loader.load();

        // Chunk and create vector embeddings and store in vector DB
        const pc = await createPineconeStore();
        await chunkAndStore(docs, pc);
        console.log("Documents chunked and stored successfully");

        return NextResponse.json({
          content: docs[0].pageContent,
          metadata: docs[0].metadata,
        });
      });

      response.Body.on('error', (err) => {
        console.error("Stream error:", err);
        return NextResponse.json({ error: "Failed to process stream" }, { status: 500 });
      });

    } else {
      throw new Error("Unexpected response.Body type");
    }
    return NextResponse.json({status: 500})
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to load and parse PDF: ${error}` },
      { status: 500 }
    );
  }
}
