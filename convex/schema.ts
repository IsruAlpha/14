import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  numbers: defineTable({
    value: v.number(),
  }),
  votes: defineTable({
    voterId: v.optional(v.string()),
    status: v.union(v.literal("single"), v.literal("relationship")),
  }),
});
