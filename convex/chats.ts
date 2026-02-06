import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const create = mutation({
    args: {
        voterId: v.string(),
        title: v.string(),
    },
    handler: async (ctx, args) => {
        const chatId = await ctx.db.insert("chats", {
            voterId: args.voterId,
            title: args.title,
            createdAt: Date.now(),
        });
        return chatId;
    },
});

export const list = query({
    args: { voterId: v.string() },
    handler: async (ctx, args) => {
        return await ctx.db
            .query("chats")
            .withIndex("by_voter_id", (q) => q.eq("voterId", args.voterId))
            .order("desc")
            .collect();
    },
});

export const get = query({
    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {
        return await ctx.db.get(args.chatId);
    },
});

export const togglePin = mutation({
    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {
        const chat = await ctx.db.get(args.chatId);
        if (!chat) throw new Error("Chat not found");
        await ctx.db.patch(args.chatId, {
            isPinned: !chat.isPinned,
        });
    },
});

export const remove = mutation({
    args: { chatId: v.id("chats") },
    handler: async (ctx, args) => {
        const messages = await ctx.db
            .query("messages")
            .withIndex("by_chat_id", (q) => q.eq("chatId", args.chatId))
            .collect();
        for (const message of messages) {
            await ctx.db.delete(message._id);
        }
        await ctx.db.delete(args.chatId);
    },
});
