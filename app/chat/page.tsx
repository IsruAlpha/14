import { Suspense } from "react";
import { ChatContent } from "@/components/chat-content";

export default function ChatPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-transparent">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted" />
                    <div className="h-4 w-32 bg-muted rounded" />
                </div>
            </div>
        }>
            <ChatContent />
        </Suspense>
    );
}
