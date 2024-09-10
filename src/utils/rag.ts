import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { OpenAIEmbeddings } from "@langchain/openai";
import { pull } from "langchain/hub";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { ChatOpenAI } from "@langchain/openai";
import { Document } from "langchain/document";
// Use a persistent vector database like Pinecone in the future.

export const llm = new ChatOpenAI({
  model: "gpt-4o-mini",
  temperature: 0
});

export const textSplitter = new RecursiveCharacterTextSplitter({
  chunkSize: 1000,
  chunkOverlap: 200,
});
export const chunkAndStore = async (docs: Document[]) => {
  const splits = await textSplitter.splitDocuments(docs);
  const vectorStore = await MemoryVectorStore.fromDocuments(
    splits,
    new OpenAIEmbeddings()
  );
}
// export const ragProcess = async (docs: Document[]) => {
//   const splits = await textSplitter.splitDocuments(docs);
//   const vectorStore = await MemoryVectorStore.fromDocuments(
//     splits,
//     new OpenAIEmbeddings()
//   );
  // const retriever = vectorStore.asRetriever({
  //   searchType: "similarity",
  //   k: 3
  // });
  // const prompt = await pull<ChatPromptTemplate>("rlm/rag-prompt");
  
  // const ragChain = await createStuffDocumentsChain({
  //   llm,
  //   prompt,
  //   outputParser: new StringOutputParser(),
  // });
  
  // const context = await retriever.invoke("What was ken's major ?");
  // const response = await ragChain.invoke({
  //   question: "What is ken's major?",
  //   context,
  // })
// }