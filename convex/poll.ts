import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const vote = mutation({
  args: {
    status: v.union(v.literal("single"), v.literal("relationship")),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("votes", { status: args.status });
  },
});

export const getTotalVotes = query({
  handler: async (ctx) => {
    const votes = await ctx.db.query("votes").collect();
    return votes.length;
  },
});
