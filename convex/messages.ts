import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const send = mutation({
    args: {
        chatId: v.id("chats"),
        sender: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            chatId: args.chatId,
            sender: args.sender,
            content: args.content,
            isRead: args.sender === "user" ? true : false,
            createdAt: Date.now(),
        });
    },
});

export const markAsRead = mutation({
    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {
        const unreadMessages = await ctx.db
            .query("messages")
            .withIndex("by_chat_id", (q) => q.eq("chatId", args.chatId))
            .filter((q) => q.eq(q.field("isRead"), false))
            .collect();

        for (const message of unreadMessages) {
            await ctx.db.patch(message._id, { isRead: true });
        }
    },
});

export const countUnread = query({
    args: { voterId: v.string() },
    handler: async (ctx, args) => {
        const chats = await ctx.db
            .query("chats")
            .withIndex("by_voter_id", (q) => q.eq("voterId", args.voterId))
            .collect();

        const chatIds = chats.map((c) => c._id);
        if (chatIds.length === 0) return 0;

        let totalUnread = 0;
        for (const chatId of chatIds) {
            const unread = await ctx.db
                .query("messages")
                .withIndex("by_chat_id", (q) => q.eq("chatId", chatId))
                .filter((q) => q.eq(q.field("isRead"), false))
                .collect();
            totalUnread += unread.length;
        }

        return totalUnread;
    },
});

export const list = query({
    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("messages")
            .withIndex("by_chat_id", (q) => q.eq("chatId", args.chatId))
            .order("asc")
            .collect();
    },
});
export const listGlobal = query({
    args: { voterId: v.string() },
    handler: async (ctx, args) => {
        // 1. Get all chats for this voter
        const chats = await ctx.db
            .query("chats")
            .withIndex("by_voter_id", (q) => q.eq("voterId", args.voterId))
            .collect();

        const chatIds = chats.map((c) => c._id);
        if (chatIds.length === 0) return [];

        // 2. Get messages from all these chats
        // We limit to the most recent 20 messages across all chats for context
        // to avoid hitting context window limits and keep it relevant
        const allMessages = await ctx.db
            .query("messages")
            .filter((q) =>
                q.or(...chatIds.map(id => q.eq(q.field("chatId"), id)))
            )
            .order("desc")
            .take(20);

        return allMessages.reverse(); // Return in chronological order
    },
});
