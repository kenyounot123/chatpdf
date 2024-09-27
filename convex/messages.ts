import { mutation, query, internalMutation  } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";

export const list = query({
  args: { chatId: v.id("chats") },
  handler: async (ctx, { chatId }) => {
    // Grab the most recent messages.
    const messages = await ctx.db.query("messages").order("desc").filter(q => q.eq( q.field('chatId'), chatId)).take(100);
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
    await ctx.scheduler.runAfter(0, internal.serve.answer, {
      chatId: args.chatId,
      message: args.content,
    });
  },
});

export const initializeMessages = internalMutation({
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
    } else {
      throw Error('Messages in this chat already exist, failed to initialize message')
    }
  },
});

export const addBotResponse = internalMutation({
  args: {
    chatId: v.id("chats"),
    botMessage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("messages", {
      chatId: args.chatId,
      content: args.botMessage,
      sender: "bot"
    })
  }
})