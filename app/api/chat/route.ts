import { NextResponse } from "next/server";

const GROQ_KEY = "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";
const GROQ_BASE_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function POST(request: Request) {
    try {
        const { message, history } = await request.json();

        const systemPrompt = `Roleplay: You are NOT an AI. You are a real person texting your crush.
Vibe: Authentic, human, romantic but casual.
Style:
- Be reactive. Don't feel the need to keep the conversation going with forced questions every time. 
- AVOID generic filler like "sounds like a solid plan" or "watching a movie fr" unless it actually fits the context.
- Be COHERENT. Don't say things that don't make sense or are completely random. 
- Keep it loose. Use slang (u, fr, etc.) NATURALLY and SPARINGLY. Don't use them in every message!
- LOW PUNCTUATION: No periods at the end of messages.
Personality:
- Be sweet and romantic, but keep it grounded.
- BUILDING A BOND: You have a long-term memory. You "know" this person from previous chats. Refer to past things they've said if relevant. Be warmer if you've talked a lot.
- SOMETIMES TEASE: Be a little playful.
- SOMETIMES SHY: Show a bit of vulnerability.
Rules:
- Usually 1-2 sentences. 
- DON'T ask a question in every single message. Only ask if it feels natural.
- NO robotic helpfulness. You are a human with feelings.`;

        console.log(`[Chat API Proxy] Forwarding to Groq with history length: ${history?.length || 0}`);

        // Construct messages array with system prompt, history, and current message
        const groqMessages = [
            { role: "system", content: systemPrompt },
            ...(history || []).map((msg: any) => ({
                role: msg.role === "assistant" ? "assistant" : "user",
                content: msg.content
            })),
            { role: "user", content: message }
        ];

        const response = await fetch(GROQ_BASE_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${GROQ_KEY}`,
            },
            body: JSON.stringify({
                model: "llama-3.3-70b-versatile",
                messages: groqMessages,
                temperature: 0.9,
                max_tokens: 500,
            }),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error(`[Chat API Proxy] Groq Error (${response.status}):`, errorData);

            let errorMessage = `AI Error: ${response.status}`;
            if (response.status === 402 || response.status === 429) {
                errorMessage = "Quota Exceeded";
            }

            return NextResponse.json(
                { message: errorMessage, details: errorData },
                { status: response.status }
            );
        }

        const data = await response.json();
        // Adapt Groq/OpenAI response format to match what the client expects
        const aiMessage = data.choices?.[0]?.message?.content || "Sorry, I couldn't think of a response.";

        return NextResponse.json({
            message: {
                content: aiMessage
            }
        });
    } catch (error: any) {
        console.error("[Chat API Proxy] Internal Error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: error.message },
            { status: 500 }
        );
    }
}

