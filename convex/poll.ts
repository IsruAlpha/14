import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const vote = mutation({
  args: {
    voterId: v.string(),
    status: v.union(v.literal("single"), v.literal("relationship")),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("votes")
      .filter((q) => q.eq(q.field("voterId"), args.voterId))
      .first();
    if (existing) {
      throw new Error("You already voted!");
    }
    await ctx.db.insert("votes", {
      voterId: args.voterId,
      status: args.status,
    });
  },
});

export const getTotalVotes = query({
  handler: async (ctx) => {
    const votes = await ctx.db.query("votes").collect();
    return votes.length;
  },
});

export const hasVoted = query({
  args: { voterId: v.string() },
  handler: async (ctx, args) => {
    const vote = await ctx.db
      .query("votes")
      .filter((q) => q.eq(q.field("voterId"), args.voterId))
      .first();
    return vote !== null;
  },
});
