import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  votes: defineTable({
    status: v.union(v.literal("single"), v.literal("relationship")),
  }),
});
