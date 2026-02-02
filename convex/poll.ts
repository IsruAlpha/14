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

export const getUserVote = query({
  args: { voterId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("votes")
      .filter((q) => q.eq(q.field("voterId"), args.voterId))
      .first();
  },
});
export const getVoteStats = query({
  handler: async (ctx) => {
    const votes = await ctx.db.query("votes").collect();
    const stats = votes.reduce(
      (acc, vote) => {
        if (vote.status === "single") acc.single++;
        else if (vote.status === "relationship") acc.relationship++;
        return acc;
      },
      { single: 0, relationship: 0 }
    );
    return stats;
  },
});
