import { internalQuery, internalMutation, query } from "./_generated/server";
import { v } from "convex/values";

export const addFileAssociationToDocuments = internalMutation({
  args: {
    // docId: v.id("documents"),
    fileId: v.id("files"),
  },
  handler: async (ctx, args) => {
    const documents = await ctx.db
      .query("documents")
      // .filter((q) => q.eq(q.field("_id"), args.docId))
      .collect();

    await Promise.all(
      documents.map((doc) =>
        ctx.db.patch(doc._id, {
          fileId: args.fileId,
        })
      )
    );
    return {
      success: true,
      message: `${documents.length} documents updated with file ID ${args.fileId}.`,
    };
  },
});
