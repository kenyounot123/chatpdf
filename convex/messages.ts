import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").take(100);
    // Reverse the list so that it's in a chronological order.
    return messages.reverse();
  },
});

export const send = mutation({
  args: {
    chatId: v.id("chats"),
    content: v.string(),
    sender: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.content,
      sender: args.sender,
    });

    // call the AI action here
  },
});

export const initializeMessages = mutation({
  args: {
    chatId: v.id("chats"),
  },
  handler: async (ctx, args) => {
    const existingMessages = await ctx.db
      .query("messages")
      .withIndex("by_chatId", (q) => q.eq("chatId", args.chatId))
      .collect();

    if (existingMessages.length === 0) {
      await ctx.db.insert("messages", {
        chatId: args.chatId,
        content: "Hello! How can I help you today?",
        sender: "bot",
      });
    }
  },
});
