import { api } from "./_generated/api";
import { mutation } from "./_generated/server";
import { v } from "convex/values"
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const saveImage = mutation({
  args: {
    user: v.id('users'),
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    const docId = await ctx.db.insert("documents", {
      user: args.user,
      storageId: args.storageId,
      fileName: args.fileName
    })
    await ctx.scheduler.runAfter(0, api.chats.createChat, {
      document: docId,
    });
  }
})