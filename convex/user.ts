import { v } from "convex/values"
import {mutation} from "./_generated/server"
export const createUser = mutation({
  args: {
    userName: v.string()
  },
  handler: async (ctx, args) => {
    await ctx.db.insert('user', {
      userName: args.userName
    })
  }
})