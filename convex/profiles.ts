import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Generate upload URL for profile images
export const generateUploadUrl = mutation({
    args: {},
    handler: async (ctx) => {
        return await ctx.storage.generateUploadUrl();
    },
});

// Create or update profile
export const createProfile = mutation({
    args: {
        voterId: v.string(),
        yourName: v.string(),
        fullName: v.string(),
        status: v.union(v.literal("single"), v.literal("relationship")),
        imageId: v.optional(v.id("_storage")),
    },

    handler: async (ctx, args) => {
        // Check if profile already exists
        const existing = await ctx.db
            .query("profiles")
            .withIndex("by_voter_id", (q) => q.eq("voterId", args.voterId))
            .first();

        if (existing) {
            // Update existing profile
            const updates: any = {
                yourName: args.yourName,
                fullName: args.fullName,
            };
            if (args.imageId !== undefined) {
                updates.imageId = args.imageId;
            }
            await ctx.db.patch(existing._id, updates);
            return existing._id;
        }


        // Create new profile
        const profileId = await ctx.db.insert("profiles", {
            voterId: args.voterId,
            yourName: args.yourName,
            fullName: args.fullName,
            status: args.status,
            imageId: args.imageId,
            nextAutomatedMessageAt: Date.now() + Math.random() * 24 * 60 * 60 * 1000,
            createdAt: Date.now(),
        });


        return profileId;
    },
});

// Get profile by voter ID
export const getProfile = query({
    args: {
        voterId: v.string(),
    },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_voter_id", (q) => q.eq("voterId", args.voterId))
            .first();

        if (!profile) {
            return null;
        }

        // Get image URL if imageId exists
        let imageUrl = undefined;
        if (profile.imageId) {
            imageUrl = await ctx.storage.getUrl(profile.imageId);
        }

        return {
            ...profile,
            imageUrl,
        };
    },
});

// Update profile
export const updateProfile = mutation({
    args: {
        voterId: v.string(),
        fullName: v.optional(v.string()),
        imageId: v.optional(v.id("_storage")),
    },
    handler: async (ctx, args) => {
        const profile = await ctx.db
            .query("profiles")
            .withIndex("by_voter_id", (q) => q.eq("voterId", args.voterId))
            .first();

        if (!profile) {
            throw new Error("Profile not found");
        }

        const updates: any = {};
        if (args.fullName !== undefined) updates.fullName = args.fullName;
        if (args.imageId !== undefined) updates.imageId = args.imageId;

        await ctx.db.patch(profile._id, updates);
    },
});
