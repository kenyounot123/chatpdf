import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  chats: defineTable({
    document: v.string(),
  }).index("byId", ["document"]),

  messages: defineTable({
    chatId: v.id('chats'),
    content: v.string(),
    sender: v.string(),
  }).index('by_chatId', ["chatId"])
})