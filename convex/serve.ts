import { v } from "convex/values";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { ConvexChatMessageHistory } from "@langchain/community/stores/message/convex";
import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { internalAction } from "./_generated/server";
import {
  ChatPromptTemplate,
} from "@langchain/core/prompts";
import { createStuffDocumentsChain } from "langchain/chains/combine_documents";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { internal } from "./_generated/api";
export const answer = internalAction({
  args: {
    chatId: v.id("chats"),
    message: v.string(),
  },
  handler: async (ctx, { chatId, message }) => {
    try {
      console.log(`Chat ID: ${chatId}, Message: ${message}`);
      
      const vectorStore = new ConvexVectorStore(new OpenAIEmbeddings(), { ctx });

      const model = new ChatOpenAI()
      const memory = new BufferMemory({
        chatHistory: new ConvexChatMessageHistory({
          ctx,                
          sessionId: chatId,
          table: "messages",
          index: "by_chatId", 
          sessionIdField: "chatId"
        }),
        memoryKey: "chat_history",
        outputKey: "text",
        returnMessages: true,
      });
      const retriever = vectorStore.asRetriever()
      const prompt = ChatPromptTemplate.fromMessages([
        [
          "system",
          "You are an intelligent assistant that helps users answer questions based on a document they have uploaded and previous interactions in this chat. Please consider the context from the uploaded document as well as the ongoing conversation when formulating your responses. Your task is to respond accurately and concisely based on the provided context.",
        ],
        [
          "human",
          "Here is the context from the uploaded document: {context}\n\nNow, answer the following question: {question} Based on the provided document and the chat history, answer the user's question. If the answer cannot be found in the document or the chat history, politely inform the user that the information they are asking for is not available.",
        ],
      ]);
      
      const ragChain = await createStuffDocumentsChain({
        llm: model,
        prompt,
        outputParser: new StringOutputParser(),
      });

      const context = await retriever.invoke(message);
      const response = await ragChain.invoke({
        question: message,
        context,
        memory: memory,
      });
      
      await ctx.runMutation(internal.messages.addBotResponse, {
        chatId: chatId,
        botMessage: response,
      });
      
    } catch (error) {
      console.error("Error in processing the answer:", error);
      throw new Error("Failed to generate a response.");
    }
  },
});
