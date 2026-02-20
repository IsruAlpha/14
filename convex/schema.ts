// Valentine's Day Special Schema
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
  profiles: defineTable({
    voterId: v.string(),
    yourName: v.optional(v.string()),

    fullName: v.string(),
    status: v.union(v.literal("single"), v.literal("relationship")),
    imageId: v.optional(v.id("_storage")),
    lastAutomatedMessageAt: v.optional(v.number()),
    nextAutomatedMessageAt: v.optional(v.number()),
    messageCountToday: v.optional(v.number()),
    lastMessageAt: v.optional(v.number()),
    email: v.optional(v.string()),
    createdAt: v.number(),
  }).index("by_voter_id", ["voterId"]),

  chats: defineTable({
    voterId: v.string(),
    title: v.string(),
    isPinned: v.optional(v.boolean()),
    createdAt: v.number(),
  }).index("by_voter_id", ["voterId"]),

  messages: defineTable({
    chatId: v.id("chats"),
    sender: v.union(v.literal("user"), v.literal("assistant")),
    content: v.string(),
    isRead: v.optional(v.boolean()),
    createdAt: v.number(),
  }).index("by_chat_id", ["chatId"]),
});
