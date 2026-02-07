"use client";

import { useState, useEffect, FormEvent } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { getOrCreateVoterId } from "@/lib/utils";
import { CornerDownLeft, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    ChatBubble,
    ChatBubbleAvatar,
    ChatBubbleMessage,
} from "@/components/ui/chat-bubble";
import { ChatMessageList } from "@/components/ui/chat-message-list";
import { ChatInput } from "@/components/ui/chat-input";
import { ProfileDropdown } from "@/components/profile-dropdown";
import { ThemeToggle } from "@/components/ThemeToggle";
import { sendChatMessage } from "@/lib/hasab";
import Link from "next/link";
import { Facehash } from "facehash";
import { useSearchParams, useRouter } from "next/navigation";
import { Id } from "../convex/_generated/dataModel";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { toast } from "sonner";
import { NotificationBell } from "@/components/notification-bell";
import { useAutomatedMessages } from "@/hooks/use-automated-messages";

export function ChatContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const chatIdFromUrl = searchParams.get("id") as Id<"chats"> | null;

    const [mounted, setMounted] = useState(false);
    const [voterId, setVoterId] = useState("");
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [activeChatId, setActiveChatId] = useState<Id<"chats"> | null>(chatIdFromUrl);

    useEffect(() => {
        setMounted(true);
        setVoterId(getOrCreateVoterId());
    }, []);

    useAutomatedMessages(voterId);

    useEffect(() => {
        setActiveChatId(chatIdFromUrl);
    }, [chatIdFromUrl]);

    const profile = useQuery(
        api.profiles.getProfile,
        voterId ? { voterId } : "skip"
    );

    const messages = useQuery(
        (api as any).messages.list,
        activeChatId ? { chatId: activeChatId } : "skip"
    );

    const allMessages = useQuery(
        (api as any).messages.listGlobal,
        voterId ? { voterId } : "skip"
    );

    const createChat = useMutation((api as any).chats.create);
    const sendMessage = useMutation((api as any).messages.send);
    const markAsRead = useMutation((api as any).messages.markAsRead);
    const unreadCount = useQuery((api as any).messages.countUnread, voterId ? { voterId } : "skip");

    // Mark as read when active chat changes or messages update
    useEffect(() => {
        if (activeChatId && messages?.length > 0) {
            markAsRead({ chatId: activeChatId });
        }
    }, [activeChatId, messages, markAsRead]);

    if (!mounted || !profile) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-transparent">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                    <div className="h-4 w-32 bg-muted rounded" />
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        let currentChatId = activeChatId;
        const userInput = input;
        setInput("");
        setIsLoading(true);

        try {
            // 1. Create a chat if it doesn't exist
            if (!currentChatId) {
                currentChatId = await createChat({
                    voterId,
                    title: userInput.slice(0, 30) + (userInput.length > 30 ? "..." : ""),
                });
                setActiveChatId(currentChatId);
                router.push(`/chat?id=${currentChatId}`);
            }

            // 2. Save user message
            await sendMessage({
                chatId: currentChatId,
                sender: "user",
                content: userInput,
            });

            // 3. Get AI response with memory
            const currentChatIds = new Set((messages || []).map((m: any) => m._id));
            const distinctGlobalMessages = (allMessages || []).filter((m: any) => !currentChatIds.has(m._id));

            const history = [...distinctGlobalMessages, ...(messages || [])].map((msg: any) => ({
                role: (msg.sender === "assistant" ? "assistant" : "user") as "assistant" | "user",
                content: msg.content
            }));
            const response = await sendChatMessage(userInput, history);

            // Add artificial delay for realism (5 seconds total typing time)
            await new Promise(resolve => setTimeout(resolve, 5000));

            // 4. Save AI message
            await sendMessage({
                chatId: currentChatId,
                sender: "assistant",
                content: response.message.content,
            });

        } catch (error: any) {
            console.error("Chat error:", error);

            if (error.message.includes("402") || error.message.includes("Quota")) {
                toast.error("AI Quota Exceeded", {
                    description: "The AI is taking a nap because we've hit the limit. Please try again later!",
                    duration: 5000,
                });
            } else {
                toast.error("Message Failed", {
                    description: error.message || "Something went wrong while sending your message.",
                });
            }

            setInput(userInput);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex min-h-screen flex-col bg-transparent selection:bg-primary/10">
            {/* Header */}
            <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/50 backdrop-blur-md">
                <div className="container flex h-16 items-center justify-between px-4 sm:px-8">
                    <div className="flex items-center gap-3">
                        <SidebarTrigger
                            className="-ml-2 h-10 w-10 text-foreground/70 hover:text-foreground hover:bg-muted/50 rounded-xl active:scale-95 transition-all"
                        />
                        <Button variant="ghost" size="icon" asChild className="rounded-full md:hidden">
                            <Link href="/">
                                <ArrowLeft className="h-5 w-5" />
                            </Link>
                        </Button>
                        <div className="flex items-center gap-3">
                            <div className="h-8 w-8 overflow-hidden rounded-full border border-border/50">
                                <Facehash name={profile.fullName} size={32} colors={["#87B1F9", "#CBDCFE", "#1E40AF"]} interactive />
                            </div>
                            <div className="hidden sm:block">
                                <h1 className="text-sm font-serif font-bold leading-none tracking-tight">
                                    {profile.fullName}
                                </h1>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <NotificationBell count={unreadCount || 0} />
                        <ThemeToggle />
                        <ProfileDropdown
                            yourName={profile.yourName || "User"}
                            crushName={profile.fullName}
                            status={profile.status === "single" ? "Single" : "In Relationship"}
                            imageUrl={profile.imageUrl ?? undefined}
                            onLogout={() => { }}
                            onEditProfile={() => { }}
                        />
                    </div>
                </div>
            </header>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col max-w-4xl w-full mx-auto overflow-hidden px-4 py-6 sm:px-8">
                <div className="flex-1 bg-card/30 backdrop-blur-sm border border-border/40 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                    <div className="flex-1 overflow-hidden">
                        <ChatMessageList smooth>
                            {(!messages || messages.length === 0) && (
                                <div className="flex flex-col items-center justify-center h-full text-center p-8 space-y-4">
                                    <div className="h-20 w-20 rounded-full bg-primary/5 flex items-center justify-center mb-2">
                                        <Facehash name={profile.fullName} size={64} colors={["#87B1F9", "#CBDCFE", "#1E40AF"]} interactive />
                                    </div>
                                    <h2 className="text-xl font-serif font-bold">Start your conversation with {profile.fullName}</h2>
                                    <p className="text-sm text-muted-foreground max-w-xs">
                                        Shoot your shot. safely. Everything said here is private and secure.
                                    </p>
                                </div>
                            )}
                            {messages?.map((message: any) => (
                                <ChatBubble
                                    key={message._id}
                                    variant={message.sender === "user" ? "sent" : "received"}
                                    className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                                >
                                    <ChatBubbleAvatar
                                        className="h-8 w-8 shrink-0 border border-border/50 shadow-sm"
                                        src={message.sender === "user" ? undefined : (profile.imageUrl || undefined)}
                                        name={message.sender === "user" ? (profile.yourName || "User") : profile.fullName}
                                    />
                                    <ChatBubbleMessage
                                        variant={message.sender === "user" ? "sent" : "received"}
                                        className={message.sender === "user" ? "bg-primary text-primary-foreground font-medium rounded-2xl rounded-tr-none px-4" : "bg-background/80 backdrop-blur-sm border border-border/40 font-medium rounded-2xl rounded-tl-none px-4"}
                                    >
                                        {message.content}
                                    </ChatBubbleMessage>
                                </ChatBubble>
                            ))}

                            {isLoading && (
                                <ChatBubble variant="received">
                                    <ChatBubbleAvatar
                                        className="h-8 w-8 shrink-0 border border-border/50 shadow-sm"
                                        src={profile.imageUrl || undefined}
                                        name={profile.fullName}
                                    />
                                    <ChatBubbleMessage isLoading className="bg-background/80 backdrop-blur-sm border border-border/40 rounded-2xl rounded-tl-none px-4" />
                                </ChatBubble>
                            )}
                        </ChatMessageList>
                    </div>

                    <div className="p-4 sm:p-6 border-t border-border/40 bg-background/50 backdrop-blur-md">
                        <form
                            onSubmit={handleSubmit}
                            className="relative flex items-center gap-2 max-w-2xl mx-auto"
                        >
                            <div className="relative flex-1 group">
                                <ChatInput
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    placeholder={`Reply to ${profile.fullName}...`}
                                    className="min-h-[56px] pr-14 resize-none rounded-2xl bg-background/50 backdrop-blur-sm border-border/40 p-4 shadow-sm focus-visible:ring-primary/20 transition-all group-focus-within:border-primary/50"
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter" && !e.shiftKey) {
                                            e.preventDefault();
                                            handleSubmit(e as any);
                                        }
                                    }}
                                />
                                <Button
                                    type="submit"
                                    size="icon"
                                    disabled={!input.trim() || isLoading}
                                    className="absolute right-2 top-2 h-10 w-10 rounded-xl shadow-lg active:scale-95 transition-all"
                                >
                                    <CornerDownLeft className="size-4" />
                                    <span className="sr-only">Send Message</span>
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
