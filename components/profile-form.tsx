"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useRef, useState, useEffect } from "react";
import { useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import HoverSlatButton from "@/components/ui/hover-button";

const formSchema = z.object({
    fullName: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    status: z.string(),
    image: z.instanceof(File).optional(),
});

interface ProfileFormProps {
    voterId: string;
    userStatus: "single" | "relationship";
    onProfileCreated: () => void;
    existingProfile?: {
        fullName: string;
        imageUrl?: string;
    } | null;
}

export function ProfileForm({ voterId, userStatus, onProfileCreated, existingProfile }: ProfileFormProps) {
    const [imagePreview, setImagePreview] = useState<string | null>(existingProfile?.imageUrl || null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const createProfile = useMutation(api.profiles.createProfile);
    const generateUploadUrl = useMutation(api.profiles.generateUploadUrl);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            fullName: existingProfile?.fullName || "",
            status: userStatus === "single" ? "Single" : "In Relationship",
            image: undefined,
        },
    });

    // Update form when existingProfile changes
    useEffect(() => {
        if (existingProfile) {
            form.setValue("fullName", existingProfile.fullName);
            if (existingProfile.imageUrl) {
                setImagePreview(existingProfile.imageUrl);
            }
        }
    }, [existingProfile, form]);

    // Update status when userStatus changes
    useEffect(() => {
        form.setValue("status", userStatus === "single" ? "Single" : "In Relationship");
    }, [userStatus, form]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            form.setValue("image", file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            let imageId: any = undefined;

            // Upload image if provided
            if (values.image) {
                const uploadUrl = await generateUploadUrl();
                const result = await fetch(uploadUrl, {
                    method: "POST",
                    headers: { "Content-Type": values.image.type },
                    body: values.image,
                });
                const { storageId } = await result.json();
                imageId = storageId;
            }

            // Create profile
            await createProfile({
                voterId,
                fullName: values.fullName,
                status: userStatus,
                imageId,
            });

            onProfileCreated();
        } catch (error) {
            console.error("Failed to create profile:", error);
        }
    }

    return (
        <div className="w-full max-w-md space-y-6">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900">Create Your Profile</h2>
                <p className="mt-2 text-sm text-gray-600">
                    Complete your profile to get started
                </p>
            </div>

            <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="fullName"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Full Name</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-white"
                                        placeholder="John Doe"
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Status</FormLabel>
                                <FormControl>
                                    <Input
                                        className="bg-gray-100"
                                        {...field}
                                        disabled
                                        readOnly
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormItem>
                        <FormLabel>Profile Image</FormLabel>
                        <FormControl>
                            <div className="space-y-2">
                                <Input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageChange}
                                    className="bg-white"
                                />
                                {imagePreview && (
                                    <div className="mt-2 flex justify-center">
                                        <img
                                            src={imagePreview}
                                            alt="Preview"
                                            className="h-24 w-24 rounded-full object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                        </FormControl>
                    </FormItem>

                    <div className="flex justify-center pt-4">
                        <HoverSlatButton
                            initialText="BUILD"
                            hoverText="START"
                            onClick={() => form.handleSubmit(onSubmit)()}
                        />
                    </div>
                </form>
            </Form>
        </div>
    );
}
