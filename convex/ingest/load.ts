"use node";

import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { OpenAIEmbeddings } from "@langchain/openai";
import { internalAction, mutation, query } from "../_generated/server";
import { v } from "convex/values";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { internal } from "../_generated/api";
import { CacheBackedEmbeddings } from "langchain/embeddings/cache_backed";
import { ConvexKVStore } from "@langchain/community/storage/convex";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

export const parseAndEmbedFile = internalAction({
  args: { fileId: v.id("files") },
  handler: async (ctx, args) => {
    const storageId = await ctx.runQuery(internal.files.getStorageIdFromFile, {
      fileId: args.fileId,
    });
    if (!storageId) {
      throw new Error("Storage ID not found for the given file ID.");
    }
    const blob = await ctx.storage.get(storageId);
    const loader = new PDFLoader(blob as Blob);
    const docs = await loader.load();

    const embeddings = new CacheBackedEmbeddings({
      underlyingEmbeddings: new OpenAIEmbeddings(),
      documentEmbeddingStore: new ConvexKVStore({ ctx }),
    });
    const textSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500, // Set your desired chunk size
      chunkOverlap: 50, // Set overlap size to maintain context (optional)
    });
    const chunks = await textSplitter.splitDocuments(docs)
    await ConvexVectorStore.fromDocuments(
      chunks,
      embeddings,
      { ctx }
    );

    await ctx.scheduler.runAfter(
      0,
      internal.documents.addFileAssociationToDocuments,
      {
        fileId: args.fileId,
      }
    );
  },
});