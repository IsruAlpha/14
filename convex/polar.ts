import { v } from "convex/values";
export { Polar } from "@convex-dev/polar";
import { Polar } from "@convex-dev/polar";
import { api, components } from "./_generated/api";
import { action } from "./_generated/server";
import { customersCreate } from "@polar-sh/sdk/funcs/customersCreate.js";
import { customersList } from "@polar-sh/sdk/funcs/customersList.js";

export const polar = new Polar(components.polar as any, {
    // Required: provide a function the component can use to get the current user's ID and
    // email - this will be used for retrieving the correct subscription data for the
    // current user.
    getUserInfo: async (ctx) => {
        // Fallback for Polar component's internal calls
        return {
            userId: "anonymous",
            email: "anonymous@example.com",
        };
    },
    products: {
        premium: process.env.NEXT_PUBLIC_POLAR_PRODUCT_ID || "e0098014-e57d-4ee0-bed5-70fd9800c449",
    },
    // Explicitly set to production as requested by user in previous session
    server: "production",
});

// Export API functions from the Polar client
export const {
    changeCurrentSubscription,
    cancelCurrentSubscription,
    getConfiguredProducts,
    listAllProducts,
    generateCheckoutLink,
    generateCustomerPortalUrl,
} = polar.api();

export const syncProducts = action({
    args: {},
    handler: async (ctx) => {
        await polar.syncProducts(ctx);
    },
});

export const generateCheckout = action({
    args: {
        email: v.string(),
        voterId: v.string(),
        productId: v.string(),
    },
    handler: async (ctx, args) => {
        const origin = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

        // DIAGNOSTIC: Try to check if token exists
        if (!process.env.POLAR_ORGANIZATION_TOKEN) {
            throw new Error("POLAR_ORGANIZATION_TOKEN is not set.");
        }

        try {
            // 1. Check if customer already exists in our local Convex DB component
            let dbCustomer = await polar.getCustomerByUserId(ctx as any, args.voterId);
            let customerId = dbCustomer?.id;

            if (!customerId) {
                console.log(`Linking/Creating customer for ${args.email}...`);

                // 2. Try to create the customer in Polar
                const createResponse = await customersCreate((polar as any).polar, {
                    email: args.email,
                    metadata: { userId: args.voterId },
                });

                if (createResponse.value) {
                    customerId = createResponse.value.id;
                    console.log("Created new Polar customer:", customerId);
                } else {
                    // 3. If creation failed because they exist, look them up
                    const isAlreadyExists = JSON.stringify(createResponse).includes("already exists");

                    if (isAlreadyExists) {
                        console.log("Customer already exists in Polar, fetching ID...");
                        const listResponse = await customersList((polar as any).polar, {
                            email: args.email,
                        });

                        // Note: listResponse is a results object with an iterator
                        const results = (listResponse as any).value?.result?.items;
                        if (results && results.length > 0) {
                            customerId = results[0].id;
                            console.log("Found existing Polar customer ID:", customerId);
                        }
                    }

                    if (!customerId) {
                        console.error("Failed to link customer:", createResponse);
                        throw new Error(`Could not create or find customer for ${args.email}. Please try a different email.`);
                    }
                }

                // 4. Link the Polar ID to our local voterId in the Convex component
                await ctx.runMutation((polar as any).component.lib.insertCustomer, {
                    id: customerId,
                    userId: args.voterId,
                });
            }

            // 5. Generate the checkout session
            const checkout = await polar.createCheckoutSession(ctx as any, {
                productIds: [args.productId],
                userId: args.voterId,
                email: args.email,
                origin: origin,
                successUrl: `${origin}/chat`,
            });

            return { url: checkout.url };
        } catch (error: any) {
            console.error("Polar Checkout Error:", error);
            throw new Error(error.message || "Failed to start checkout. Please try again.");
        }
    },
});
