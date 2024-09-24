import { v } from "convex/values"
import {mutation} from "./_generated/server"
export const createChat = mutation({
  args: {
    chat: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('chats', {
      chat: args.chat
    })
  }
})