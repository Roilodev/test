import { streamText, convertToModelMessages } from "ai";
import { anthropic } from "@ai-sdk/anthropic";
import { buildSystemPrompt } from "@/lib/claude";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json();
  // AI SDK v6: messages arrive as UIMessage[] from DefaultChatTransport
  const messages = body.messages ?? [];

  const system = await buildSystemPrompt();

  const result = streamText({
    model: anthropic("claude-haiku-4-5-20251001"),
    system,
    messages: await convertToModelMessages(messages),
  });

  return result.toUIMessageStreamResponse();
}
