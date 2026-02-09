"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { VOTER_ID_KEY } from "@/lib/utils";

export default function PricingPage() {
    const [voterId, setVoterId] = useState<string | null>(null);
    const [email, setEmail] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const id = localStorage.getItem(VOTER_ID_KEY);
        setVoterId(id);
    }, []);

    const profile = useQuery(api.profiles.getProfile, voterId ? { voterId } : "skip");
    const configuredProducts = useQuery(api.polar.getConfiguredProducts);
    const allProducts = useQuery(api.polar.listAllProducts);
    const generateCheckout = useAction(api.polar.generateCheckout);
    const updateProfile = useMutation(api.profiles.updateProfile);

    // Sync email from profile if it exists
    useEffect(() => {
        if (profile?.email && !email) {
            setEmail(profile.email);
        }
    }, [profile?.email]);

    // Try to get the configured 'premium' product, or fall back to the first available product
    const premiumProduct = configuredProducts?.premium || allProducts?.[0];

    // Format price if product exists
    const priceText = premiumProduct?.prices?.[0]?.priceAmount
        ? `$${premiumProduct.prices[0].priceAmount / 100}`
        : "$15";

    const handleUpgrade = async () => {
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (!voterId) {
            toast.error("No user identity found. Please start a chat first.");
            return;
        }

        if (!premiumProduct) {
            toast.error("Premium product not found. Please sync your Polar products.");
            return;
        }

        setIsSubmitting(true);
        try {
            // 1. Update profile with email
            await updateProfile({
                voterId,
                email,
            });

            // 2. Generate checkout link for guest
            const result = await generateCheckout({
                email,
                voterId,
                productId: premiumProduct.id,
            });

            if (result.url) {
                window.location.href = result.url;
            } else {
                throw new Error("No URL returned from checkout generation");
            }
        } catch (error: any) {
            console.error("Upgrade error:", error);
            toast.error(error.message || "Failed to start checkout. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const features = [
        "Unlimited messages",
        "Fastest response time",
        "Priority support",
        "Exclusive AI persona features"
    ];

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background selection:bg-primary/10">
            <div className="max-w-4xl w-full text-center space-y-12">
                <div className="space-y-4">
                    <h1 className="text-5xl md:text-7xl font-bold font-instrument-serif tracking-tight text-foreground">
                        Keep the spark alive
                    </h1>
                    <p className="text-muted-foreground text-xl md:text-2xl max-w-2xl mx-auto">
                        Upgrade for unlimited messages and exclusive features.
                    </p>
                </div>

                {!allProducts && (
                    <div className="p-4 border border-yellow-500/50 bg-yellow-500/10 rounded-2xl text-yellow-600 text-sm mb-4 max-w-md mx-auto backdrop-blur-sm">
                        <p className="font-bold">Notice: No products found.</p>
                        <p>Make sure you have created products in Polar and synced them.</p>
                    </div>
                )}

                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto items-stretch">
                    {/* Free Plan */}
                    <Card className="border-border/50 bg-muted/20 backdrop-blur-sm flex flex-col">
                        <CardHeader>
                            <CardTitle>Free</CardTitle>
                            <CardDescription>Basic experience</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow">
                            <div className="text-4xl font-bold mb-6">$0 <span className="text-sm font-normal text-muted-foreground">/ forever</span></div>
                            <ul className="space-y-3 text-sm text-left px-4">
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> 7 messages / day</li>
                                <li className="flex items-center gap-3"><Check className="h-4 w-4 text-primary" /> Standard AI persona</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant="outline" className="w-full rounded-full" disabled>Current Plan</Button>
                        </CardFooter>
                    </Card>

                    {/* Pro Plan */}
                    <Card className="border-primary bg-primary/5 shadow-2xl scale-105 flex flex-col relative z-10 overflow-hidden">
                        <div className="absolute top-0 right-0 left-0 h-1 bg-primary" />
                        <CardHeader>
                            <div className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-fit mx-auto mb-2 uppercase tracking-widest">Most Popular</div>
                            <CardTitle className="text-2xl">{premiumProduct?.name || "Premium"}</CardTitle>
                            <CardDescription>Everything included</CardDescription>
                        </CardHeader>
                        <CardContent className="flex-grow space-y-6">
                            <div className="text-4xl font-bold">{priceText} <span className="text-sm font-normal text-muted-foreground">/ month</span></div>

                            <div className="space-y-2 text-left bg-background/50 p-4 rounded-xl border border-border/50">
                                <Label htmlFor="email" className="text-xs text-muted-foreground px-1">Email for subscription</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-lg bg-background border-border/50"
                                />
                            </div>

                            <ul className="space-y-3 text-sm text-left">
                                {features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3">
                                        <Check className="h-4 w-4 text-primary" /> {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full text-lg py-6 rounded-full shadow-xl shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={handleUpgrade}
                                disabled={isSubmitting || !premiumProduct}
                            >
                                {isSubmitting ? "Processing..." : "Upgrade Now"}
                            </Button>
                        </CardFooter>
                    </Card>
                </div>

                <div className="pt-12">
                    <Button variant="ghost" className="rounded-full px-8" onClick={() => window.history.back()}>
                        Go back to chat
                    </Button>
                </div>
            </div>
        </div>
    );
}
