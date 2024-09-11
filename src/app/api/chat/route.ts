import { createPineconeStore, llm, ragProcess } from "@/utils/rag";
import { PineconeStore } from "@langchain/pinecone";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req:NextRequest) {
  // Get the latest message from request body
  const messageData = await req.json()
  const userMessage = messageData[messageData.length - 1]

  if (!messageData || messageData.length === 0) {
    return NextResponse.json("No message data provided", { status: 400 });
  }
  if (!userMessage || !userMessage.content) {
    return NextResponse.json("Invalid message format", { status: 400 });
  }
  const userQuery = userMessage.content
  const vectorStore = await createPineconeStore() as PineconeStore
  // create embedding with user message and conduct RAG then stream the response
  // for now lets just output the response to the frontend and do not stream it 
  const response = await ragProcess(llm, vectorStore, userQuery)
  return NextResponse.json(response)
}