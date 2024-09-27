import { api, internal } from "./_generated/api";
import { internalQuery, mutation, query } from "./_generated/server";
import { v } from "convex/values";
import { getCurrentUserOrThrow } from "./users";
import { Id } from "./_generated/dataModel";

export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const saveImage = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    const currentUser = await getCurrentUserOrThrow(ctx);
    const fileId = await ctx.db.insert("files", {
      user: currentUser._id,
      storageId: args.storageId,
      fileName: args.fileName,
    });
    await ctx.scheduler.runAfter(0, internal.ingest.load.parseAndEmbedFile, {
      fileId: fileId,
    })
    const chatId = await ctx.runMutation(api.chats.createChat, {
      fileId: fileId,
    }) as Id<"chats">;
    return chatId
  },
});

export const getStorageIdFromFile = internalQuery({
  args: {
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const file = await ctx.db
      .query("files")
      .filter((q) => q.eq(q.field("_id"), args.fileId))
      .unique();
    return file?.storageId;
  },
});
