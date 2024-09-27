import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
    email: v.string(),
    externalId: v.string(),
  }).index("byExternalId", ["externalId"]),
  files: defineTable({
    user: v.id('users'),
    storageId: v.id("_storage"),
    fileName: v.string(),
  }),
  chats: defineTable({
    fileId: v.id('files'),
  }),
  messages: defineTable({
    chatId: v.id('chats'),
    content: v.string(),
    sender: v.string(),
  }).index('by_chatId', ["chatId"]),
  documents: defineTable({
    fileId: v.optional(v.id('files')),
    embedding: v.array(v.number()),
    text: v.string(),
    metadata: v.any(),
  }).vectorIndex("byEmbedding", {
    vectorField: "embedding",
    dimensions: 1536,
  }),
  cache: defineTable({
    key: v.string(),
    value: v.any(),
  }).index("byKey", ["key"]),
})
