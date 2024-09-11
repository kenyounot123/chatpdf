import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "langchain/document";
import {
  Pinecone as PineconeClient,
  IndexModel,
} from "@pinecone-database/pinecone";
import { PineconeStore } from "@langchain/pinecone";

const pinecone = new PineconeClient({
  apiKey: process.env.PINECONE_API_KEY!,
});

// Use a persistent vector database like Pinecone in the future.
export const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0,
  streaming: true,
});
export const embeddings = new OpenAIEmbeddings({
  model: "text-embedding-3-small",
});

export async function createPineconeStore() {
  const indexName = process.env.PINECONE_INDEX!;
  const listIndexesResponse = await pinecone.listIndexes();
  const indexes = listIndexesResponse.indexes ?? [];

  const indexExists = indexes.some((index) => index.name === indexName);

  if (!indexExists) {
    // Create a new index if it does not exist
    await pinecone.createIndex({
      name: indexName,
      dimension: 1536, // Ensure this matches the embedding dimension
      metric: "cosine", // or 'dotproduct' based on your needs
      spec: {
        serverless: {
          cloud: "aws",
          region: "us-east-1",
        },
      },
    });
    console.log(`Index ${indexName} created.`);
  } else {
    console.log(`Index ${indexName} already exists.`);
  }

  const pineconeIndex = pinecone.Index(indexName);
  // Create and return the PineconeStore instance
  const vectorStore = await PineconeStore.fromExistingIndex(embeddings, {
    pineconeIndex,
    maxConcurrency: 5,
    // Optionally, you can set a namespace
    // namespace: "foo",
  });
  return vectorStore;
}

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
export const chunkAndStore = async (
  docs: Document[],
  vectorStore: PineconeStore
) => {
  const splits = await textSplitter.splitDocuments(docs);
  let ids = [];
  for (let i = 0; i < splits.length; i++) {
    ids.push(`${i}`);
  }
  await vectorStore.addDocuments(splits, { ids });
};

export const ragProcess = async (
  llm: ChatOpenAI,
  vectorStore: PineconeStore,
  userQuery: string,
  onTokenChunk?: (chunk: string) => void
) => {
  // const splits = await textSplitter.splitDocuments(docs);
  // const vectorStore = await MemoryVectorStore.fromDocuments(
  //   splits,
  //   new OpenAIEmbeddings()
  // );
  const retriever = vectorStore.asRetriever({
    k: 3,
  });
  
  // We probably want to update this prompt with our own
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      "You are an intelligent assistant that helps users answer questions based on a document they have uploaded. The document content has been provided in the context below. Your task is to  respond to the user's questions as accurately and concisely as possible by using the provided context.",
    ],
    [
      "human",
      "Here is the context from the uploaded document: {context}\n\nNow, answer the following question: {question} Based on the provided document, answer the user's question. If the answer cannot be found in the document, politely inform the user that the information they are asking for is not in the document.",
    ],
  ]);

  const ragChain = await createStuffDocumentsChain({
    llm,
    prompt,
    outputParser: new StringOutputParser(),
  });

  const context = await retriever.invoke(`${userQuery}`);
  const response = await ragChain.invoke({
    question: `${userQuery}`,
    context,
  });

  return response;
};
