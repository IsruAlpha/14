export const HASAB_KEY = "HASAB_KEY_Nj6esybd8jNvGxNrQ9yyCU1clrjpcO";
export const HASAB_BASE_URL = "https://hasab.co/api";

export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}

export async function sendChatMessage(message: string, history: ChatMessage[] = []) {
    const response = await fetch(`/api/chat`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            message,
            history,
        }),
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to send message to AI proxy");
    }

    return response.json();
}


export async function getChatHistory() {
    const response = await fetch(`${HASAB_BASE_URL}/v1/chat/history`, {
        headers: {
            "Authorization": `Bearer ${HASAB_KEY}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to fetch chat history");
    }

    return response.json();
}

export async function clearChatHistory() {
    const response = await fetch(`${HASAB_BASE_URL}/v1/chat/clear`, {
        method: "POST",
        headers: {
            "Authorization": `Bearer ${HASAB_KEY}`,
        },
    });

    if (!response.ok) {
        throw new Error("Failed to clear chat history");
    }

    return response.json();
}
