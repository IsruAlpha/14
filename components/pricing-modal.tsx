"use client";

import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { VOTER_ID_KEY } from "@/lib/utils";

interface PricingModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
}

export function PricingModal({ isOpen, onClose, title, description }: PricingModalProps) {
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

    if (!isOpen) return null;

    // Try to get the configured 'premium' product, or fall back to the first available product
    const premiumProduct = configuredProducts?.premium || allProducts?.[0];

    const handleUpgrade = async () => {
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email address.");
            return;
        }

        if (!voterId) {
            toast.error("No user identity found.");
            return;
        }

        if (!premiumProduct) {
            toast.error("Premium product not found.");
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
            toast.error(error.message || "Failed to start checkout.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const features = [
        "Unlimited messages",
        "Fastest response time",
        "Priority support",
        "Exclusive AI persona features",
    ];

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative max-w-lg w-full bg-card border border-border/50 shadow-2xl rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-4 top-4 rounded-full z-10"
                    onClick={onClose}
                >
                    <X className="h-5 w-5" />
                </Button>

                <div className="p-8 text-center space-y-6">
                    <div className="space-y-2">
                        <h2 className="text-3xl font-bold font-serif">{title || "Upgrade to Premium"}</h2>
                        <p className="text-muted-foreground">{description || "You've reached your daily limit of 7 free messages."}</p>
                    </div>

                    <Card className="border-primary bg-primary/5 shadow-inner">
                        <CardHeader className="pb-2">
                            <div className="px-3 py-1 bg-primary text-primary-foreground text-[10px] font-bold rounded-full w-fit mx-auto mb-2 capitalize">Premium access</div>
                            <CardTitle className="text-2xl">{premiumProduct?.name || "Premium"}</CardTitle>
                            <CardDescription>Keep the spark alive</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="text-4xl font-bold">$15 <span className="text-sm font-normal text-muted-foreground">/ month</span></div>

                            <div className="space-y-2 text-left bg-background/50 p-4 rounded-xl border border-border/50">
                                <Label htmlFor="modal-email" className="text-xs text-muted-foreground px-1">Email for subscription</Label>
                                <Input
                                    id="modal-email"
                                    type="email"
                                    placeholder="your@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="rounded-lg bg-background border-border/50"
                                />
                            </div>

                            <ul className="space-y-2 text-sm text-left inline-block mx-auto">
                                {features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-2">
                                        <Check className="h-4 w-4 text-primary" /> {feature}
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button
                                className="w-full text-lg py-6 rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                                onClick={handleUpgrade}
                                disabled={isSubmitting || !premiumProduct}
                            >
                                {isSubmitting ? "Processing..." : "Upgrade Now"}
                            </Button>
                        </CardFooter>
                    </Card>

                    <Button variant="link" className="text-muted-foreground rounded-full" onClick={onClose}>
                        Maybe later
                    </Button>
                </div>
            </div>
        </div>
    );
}
