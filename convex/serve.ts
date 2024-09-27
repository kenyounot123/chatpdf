import { v } from "convex/values";
import { createRetrievalChain } from "langchain/chains/retrieval"; // Updated import
import { ChatOpenAI } from "@langchain/openai";
import { OpenAIEmbeddings } from "@langchain/openai";
import { BufferMemory } from "langchain/memory";
import { ConvexChatMessageHistory } from "@langchain/community/stores/message/convex";
import { ConvexVectorStore } from "@langchain/community/vectorstores/convex";
import { internalAction } from "./_generated/server";

export const answer = internalAction({
  args: {
    sessionId: v.string(),
    message: v.string(),
  },
  handler: async (ctx, { sessionId, message }) => {
    try {
      console.log(`Session ID: ${sessionId}, Message: ${message}`);
      
      const vectorStore = new ConvexVectorStore(new OpenAIEmbeddings(), { ctx });

      const model = new ChatOpenAI();
      const memory = new BufferMemory({
        chatHistory: new ConvexChatMessageHistory({ sessionId, ctx }),
        memoryKey: "chat_history",
        outputKey: "text",
        returnMessages: true,
      });

      // Using createRetrievalChain instead of ConversationalRetrievalQAChain
      // const chain = createRetrievalChain(model, vectorStore.asRetriever(), {
      //   memory,
      // });

      // const response = await chain.call({ question: message });
      // return response.text; // Adjust according to your output structure

    } catch (error) {
      console.error("Error in processing the answer:", error);
      throw new Error("Failed to generate a response.");
    }
  },
});
