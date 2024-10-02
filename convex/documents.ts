import { internalQuery, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addFileAssociationToDocuments = internalMutation({
  args: {
    numberOfDocs: v.number(),
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const recentDocs = await ctx.db.query("documents").order('desc').collect()
    const kRecentDocs = recentDocs.slice(0, args.numberOfDocs)

    await Promise.all(
      kRecentDocs.map((doc) =>
        ctx.db.patch(doc._id, {
          fileId: args.fileId,
        })
      )
    );
    return {
      success: true,
      message: `${kRecentDocs.length} documents updated with file ID ${args.fileId}.`,
    };
  },
});

export const deleteAssociatedDocs = internalMutation({
  args: {
    fileId: v.id('files')
  },
  handler: async (ctx, args) => {
    const docs = await ctx.db.query('documents').filter((q) => q.eq(q.field('fileId'), args.fileId)).collect()
    docs.forEach(async (doc) => {
      await ctx.db.delete(doc._id)
    })
  }
})