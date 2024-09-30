import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import { Id } from "./_generated/dataModel";
import { getCurrentUserOrThrow } from "./users";
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

export const getLatestChats = query({
  handler: async (ctx) => {
    // Given userId as the arguments i want to fetch the latest chat Created for that user
    // get all user Files, get the latest file
    // get the associated chat with that file
    const currentUser = await getCurrentUserOrThrow(ctx)
    
    if (!currentUser) {
      throw new Error("User does not exist");
    }

    const latestFiles = await ctx.db
    .query("files")
    .withIndex("byUser", (q) => q.eq("user", currentUser?._id))
    .order("desc")
    .collect()
    
    if (!latestFiles) {
      return null;
    }
    
    const chats = await Promise.all(
      latestFiles.map(async (file) => {
        const chat = await ctx.db
          .query("chats")
          .filter((q) => q.eq(q.field("fileId"), file._id))
          .first();
        return chat || null; // Return null if no chat is found
      })
    );
    return chats
  }
})