import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { components } from "./_generated/api";
import { polar } from "./polar";

export const send = mutation({
    args: {
        chatId: v.id("chats"),
        sender: v.union(v.literal("user"), v.literal("assistant")),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        const chat = await ctx.db.get(args.chatId);
        if (!chat) throw new Error("Chat not found");

        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_voter_id", (q) => q.eq("voterId", chat.voterId))
            .first();

        if (profile && args.sender === "user") {
            const now = Date.now();
            const lastMessageAt = profile.lastMessageAt || 0;
            const isNewDay = new Date(now).toDateString() !== new Date(lastMessageAt).toDateString();

            let messageCountToday = isNewDay ? 0 : (profile.messageCountToday || 0);

            // Check subscription status
            const subscription = await polar.getCurrentSubscription(ctx, {
                userId: profile.voterId,
            });

            const isPremium = subscription && subscription.status === "active";

            if (!isPremium && messageCountToday >= 7) {
                // Calculate time until tomorrow
                const tomorrow = new Date(now);
                tomorrow.setHours(24, 0, 0, 0);
                const waitTime = tomorrow.getTime() - now;
                const hours = Math.floor(waitTime / (1000 * 60 * 60));
                const minutes = Math.floor((waitTime % (1000 * 60 * 60)) / (1000 * 60));

                throw new Error(`Daily limit reached! Come back in ${hours}h ${minutes}m or upgrade to Premium for unlimited chat.`);
            }

            await ctx.db.patch(profile._id, {
                messageCountToday: messageCountToday + 1,
                lastMessageAt: now,
            });
        }

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

export const checkLimit = query({
    args: { voterId: v.string() },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_voter_id", (q) => q.eq("voterId", args.voterId))
            .first();

        if (!profile) return { isLimited: false, remaining: 7, waitTimeText: "" };

        const now = Date.now();
        const lastMessageAt = profile.lastMessageAt || 0;
        const isNewDay = new Date(now).toDateString() !== new Date(lastMessageAt).toDateString();

        let messageCountToday = isNewDay ? 0 : (profile.messageCountToday || 0);

        // Check subscription status
        const subscription = await polar.getCurrentSubscription(ctx, {
            userId: profile.voterId,
        });

        const isPremium = subscription && (subscription.status === "active" || subscription.status === "trialing");

        if (!isPremium && messageCountToday >= 7) {
            const tomorrow = new Date(now);
            tomorrow.setHours(24, 0, 0, 0);
            const waitTime = tomorrow.getTime() - now;
            const hours = Math.floor(waitTime / (1000 * 60 * 60));
            const minutes = Math.floor((waitTime % (1000 * 60 * 60)) / (1000 * 60));

            return {
                isLimited: true,
                remaining: 0,
                waitTimeText: `${hours}h ${minutes}m`
            };
        }

        return {
            isLimited: false,
            remaining: isPremium ? 999999 : (7 - messageCountToday),
            waitTimeText: ""
        };
    },
});
