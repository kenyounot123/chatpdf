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
    return chatId
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

export const latestChat = query({
  args: {
    userId: v.id('users')
  },
  handler: async (ctx, args) => {
    // Given userId as the arguments i want to fetch the latest chat Created for that user

    // get all user Files, get the latest file
    // get the associated chat with that file
    const latestFile = await ctx.db
    .query("files")
    .withIndex("byUser", (q) => q.eq("user", args.userId))
    .order("desc")
    .first()

    if (!latestFile) {
      return null;
    }

    const latestChat = await ctx.db
      .query("chats")
      .filter((q) => q.eq(q.field("fileId"), latestFile._id))
      .first();

    return latestChat?._id ?? null
  }
})