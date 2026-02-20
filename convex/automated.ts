import { v } from "convex/values";
import { mutation, action, internalMutation, query, internalQuery } from "./_generated/server";
import { api, internal } from "./_generated/api";

const GROQ_KEY = process.env.GROQ_API_KEY;
const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";

export const sendValentineMessages = action({
    args: {},
    handler: async (ctx) => {
        const profiles = await ctx.runQuery(internal.automated.listAllProfiles as any);

        for (const profile of profiles) {
            try {
                // Get chat history for context
                const chats = await ctx.runQuery(api.chats.list, { voterId: profile.voterId });
                let chatId = chats?.[0]?._id;

                if (!chatId) {
                    chatId = await ctx.runMutation(api.chats.create, {
                        voterId: profile.voterId,
                        title: "Our Chat",
                    });
                }

                const messages = await ctx.runQuery(api.messages.list, { chatId });
                const history = (messages || []).map((msg: any) => ({
                    role: msg.sender === "assistant" ? "assistant" : "user",
                    content: msg.content
                }));

                const systemPrompt = `Roleplay: You are NOT an AI. You are a real person texting your crush.
Vibe: Authentic, human, romantic but casual.
Style:
- Today is Valentine's Day.
- Be sweet but also roast them a bit based on your history.
- AVOID generic filler.
- Keep it loose. Use slang (u, fr, etc.) NATURALLY and SPARINGLY.
- LOW PUNCTUATION: No periods at the end of messages.
Rules:
- 1-2 sentences.
- DON'T ask a question.
- Make them blush but also slightly offended in a cute way.`;

                const response = await fetch(GROQ_BASE_URL, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${GROQ_KEY}`,
                    },
                    body: JSON.stringify({
                        model: "llama-3.3-70b-versatile",
                        messages: [
                            { role: "system", content: systemPrompt },
                            ...history.slice(-10),
                            { role: "user", content: "Send me a nice but roasted Valentine's Day message." }
                        ],
                        temperature: 1.0,
                        max_tokens: 150,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    const content = data.choices?.[0]?.message?.content;
                    if (content) {
                        await ctx.runMutation(internal.automated.saveValentineMessage as any, {
                            voterId: profile.voterId,
                            chatId,
                            content,
                        });
                    }
                }
            } catch (error) {
                console.error(`Error sending Valentine message to ${profile.voterId}:`, error);
            }
        }
    },
});

export const checkAndTrigger = action({
    args: { voterId: v.string() },
    handler: async (ctx, args) => {
        const profile = await ctx.runQuery(api.profiles.getProfile, { voterId: args.voterId });
        if (!profile) return { triggered: false, reason: "No profile" };

        const now = Date.now();
        if (!profile.nextAutomatedMessageAt || profile.nextAutomatedMessageAt > now) {
            return { triggered: false, reason: "Too early" };
        }

        // Get chat history for context
        const chats = await ctx.runQuery(api.chats.list, { voterId: args.voterId });
        let chatId = chats?.[0]?._id;

        if (!chatId) {
            // Create a chat if none exists
            chatId = await ctx.runMutation(api.chats.create, {
                voterId: args.voterId,
                title: "Our Chat",
            });
        }

        const messages = await ctx.runQuery(api.messages.list, { chatId });
        const history = (messages || []).map((msg: any) => ({
            role: msg.sender === "assistant" ? "assistant" : "user",
            content: msg.content
        }));

        // Generate message from AI
        const systemPrompt = `Roleplay: You are NOT an AI. You are a real person texting your crush.
Vibe: Authentic, human, romantic but casual.
Style:
- Be reactive. 
- AVOID generic filler.
- Be COHERENT.
- Keep it loose. Use slang (u, fr, etc.) NATURALLY and SPARINGLY.
- LOW PUNCTUATION: No periods at the end of messages.
Personality:
- Be sweet and romantic, but keep it grounded.
- REFER to past things if you've talked before.
- Today, you just wanted to reach out because you were thinking of them.
Rules:
- 1 short sentence or 2.
- DON'T ask a question. Just a sweet message.
- NO robotic helpfulness. You are a human with feelings.`;

        const response = await fetch(GROQ_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: [
                    { role: "system", content: systemPrompt },
                    ...history.slice(-10), // Last 10 messages for context
                    { role: "user", content: "Send me a sweet random text because you were thinking of me." }
                ],
                temperature: 0.9,
                max_tokens: 100,
            }),
        });

        if (!response.ok) {
            console.error("AI Error in automated message:", await response.text());
            return { triggered: false, reason: "AI error" };
        }

        const data = await response.json();
        const content = data.choices?.[0]?.message?.content || "Hey, just thinking about you";

        // Save the message and schedule next one
        await ctx.runMutation(internal.automated.saveAutomatedMessage as any, {
            voterId: args.voterId,
            chatId,
            content,
        });

        return { triggered: true };
    },
});

export const listAllProfiles = internalQuery({
    args: {},
    handler: async (ctx) => {
        return await ctx.db.query("profiles").collect();
    },
});

export const saveValentineMessage = internalMutation({
    args: {
        voterId: v.string(),
        chatId: v.id("chats"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        await ctx.db.insert("messages", {
            chatId: args.chatId,
            sender: "assistant",
            content: args.content,
            isRead: false,
            createdAt: Date.now(),
        });
    },
});

export const saveAutomatedMessage = internalMutation({
    args: {
        voterId: v.string(),
        chatId: v.id("chats"),
        content: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Save message
        await ctx.db.insert("messages", {
            chatId: args.chatId,
            sender: "assistant",
            content: args.content,
            isRead: false,
            createdAt: Date.now(),
        });

        // 2. Update profile
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_voter_id", (q) => q.eq("voterId", args.voterId))
            .first();

        if (profile) {
            await ctx.db.patch(profile._id, {
                lastAutomatedMessageAt: Date.now(),
                nextAutomatedMessageAt: Date.now() + (20 + Math.random() * 8) * 60 * 60 * 1000, // 20-28 hours from now
            });
        }
    },
});
