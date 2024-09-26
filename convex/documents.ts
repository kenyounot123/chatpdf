import { mutation } from "./_generated/server";
import { v } from "convex/values"
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

export const saveImage = mutation({
  args: {
    storageId: v.id("_storage"),
    fileName: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("documents", {
      storageId: args.storageId,
      fileName: args.fileName
    })
  }
})