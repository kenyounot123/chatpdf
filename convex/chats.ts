import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
export const createChat = mutation({
  args: {
    document: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("chats", {
      document: args.document,
    });
  },
});

export const getChat = query({
  args: {
    document: v.string(), // Assuming chatId is a string
  },
  handler: async (ctx, args) => {
    // Query the chat using the provided chatId
    console.log(`Chat ID to query: ${args.document.trim()}`);
    const chat = await ctx.db.query("chats")
      .withIndex("byId", (q) => q.eq("document", args.document))
      .collect();
    
    // Log the result
    console.log("Filtered chat:", chat);
    
    return chat
  },
});
