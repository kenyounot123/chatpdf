import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
export const createChat = mutation({
  args: {
    fileId: v.id('files'),
  },
  handler: async (ctx, args) => {
    const chatId = await ctx.db.insert("chats", {
      fileId: args.fileId,
    });
    await ctx.scheduler.runAfter(0, internal.messages.initializeMessages, {
      chatId: chatId,
    });
  },
});

export const getChat = query({
  args: {
    chatId: v.id('chats'), // Assuming chatId is a string
  },
  handler: async (ctx, args) => {
    // Query the chat using the provided chatId
    const chat = await ctx.db.get(args.chatId)
    
    // Log the result
    console.log("Filtered chat:", chat);
    
    return chat
  },
});
