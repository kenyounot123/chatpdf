import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  documents: defineTable({
    storageId: v.id("_storage"),
    fileName: v.string()
  }),
  chats: defineTable({
    document: v.string(),
  }),
  messages: defineTable({
    chatId: v.id('chats'),
    content: v.string(),
    sender: v.string(),
  }).index('by_chatId', ["chatId"])
})