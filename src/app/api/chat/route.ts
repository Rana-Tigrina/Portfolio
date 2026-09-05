import { NextRequest } from "next/server";
import Groq from "groq-sdk";
import { CHATBOT_SYSTEM_PROMPT } from "@/lib/chatbot-knowledge";

export const runtime = "nodejs";

const CANDIDATE_MODELS = [
  "llama-3.3-70b-versatile",
  "llama-3.1-8b-instant",
  "openai/gpt-oss-120b",
  "groq/compound",
];

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GROQ_API_KEY || process.env.Groq_Api_key;

    if (!apiKey) {
      return new Response(
        JSON.stringify({
          error: "Missing Groq API key. Please configure GROQ_API_KEY in your environment.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    const body = await req.json();
    const { messages, model: requestedModel, effort } = body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(
        JSON.stringify({ error: "Invalid request: 'messages' array is required." }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Determine candidate model order based on user selection
    const modelsToTry = requestedModel && typeof requestedModel === "string"
      ? [requestedModel, ...CANDIDATE_MODELS.filter((m) => m !== requestedModel)]
      : CANDIDATE_MODELS;

    // Adjust system prompt and temperature based on reasoning effort
    let systemPrompt = CHATBOT_SYSTEM_PROMPT;
    let temperature = 0.6;
    if (effort === "high") {
      systemPrompt += "\n\n[REASONING LEVEL: HIGH / ARCHITECTURAL PROOF]\nProvide in-depth architectural rigor, explicit mathematical invariants, concrete latency trade-offs, and failure-mode audits based on Munawwar's real engineering accomplishments.";
      temperature = 0.4;
    } else if (effort === "low") {
      systemPrompt += "\n\n[REASONING LEVEL: LOW / DIRECT]\nKeep response concise, rapid, and directly answered with minimal preamble.";
      temperature = 0.7;
    }

    // Sanitize message history (keep last 4 turns to optimize token limits)
    const sanitizedMessages: Groq.Chat.ChatCompletionMessageParam[] = messages
      .slice(-4)
      .map((msg: { role: string; content: string }) => ({
        role: msg.role === "assistant" ? "assistant" : "user",
        content: String(msg.content || "").slice(0, 3000),
      }));

    const groq = new Groq({ apiKey, timeout: 20000 });

    // Try primary model with automated graceful fallback if rate-limited or busy
    let stream = null;
    let lastError: Error | null = null;

    for (const model of modelsToTry) {
      try {
        stream = await groq.chat.completions.create({
          model,
          messages: [
            {
              role: "system",
              content: systemPrompt,
            },
            ...sanitizedMessages,
          ],
          temperature,
          max_completion_tokens: effort === "high" ? 2048 : 1536,
          top_p: 0.95,
          ...(model.startsWith("qwen/")
            ? { reasoning_effort: "none" as unknown as undefined }
            : {}),
          stream: true,
        });
        if (stream) break;
      } catch (err: unknown) {
        lastError = err instanceof Error ? err : new Error(String(err));
        // Continue to fallback model on 429 rate limit, 503 capacity, or timeout
        continue;
      }
    }

    if (!stream) {
      throw lastError || new Error("Failed to initialize completion stream with Groq models.");
    }

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          let insideThink = false;
          let thinkBuffer = "";
          let totalEmitted = 0;

          for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            if (!content) continue;

            // Filter out reasoning chain-of-thought <think>...</think> tags if any
            if (insideThink) {
              thinkBuffer += content;
              if (thinkBuffer.includes("</think>")) {
                insideThink = false;
                const afterThink = thinkBuffer.split("</think>")[1] || "";
                thinkBuffer = "";
                if (afterThink.trim()) {
                  totalEmitted += afterThink.length;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content: afterThink.trimStart() })}\n\n`)
                  );
                }
              }
              continue;
            }

            if (content.includes("<think>")) {
              insideThink = true;
              thinkBuffer = content;
              if (thinkBuffer.includes("</think>")) {
                insideThink = false;
                const afterThink = thinkBuffer.split("</think>")[1] || "";
                thinkBuffer = "";
                if (afterThink.trim()) {
                  totalEmitted += afterThink.length;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ content: afterThink.trimStart() })}\n\n`)
                  );
                }
              }
              continue;
            }

            totalEmitted += content.length;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ content })}\n\n`)
            );
          }

          // Safety guard: If stream completed but zero tokens were emitted, salvage or provide fallback
          if (totalEmitted === 0) {
            const salvaged = thinkBuffer.replace(/<think>[\s\S]*?(<\/think>|$)/g, "").trim();
            if (salvaged) {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ content: salvaged })}\n\n`)
              );
            } else {
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ error: "No response generated by model. Please retry your inquiry." })}\n\n`)
              );
            }
          }

          controller.enqueue(encoder.encode("data: [DONE]\n\n"));
          controller.close();
        } catch (err: unknown) {
          const errorMsg =
            err instanceof Error ? err.message : "Error streaming response from Groq";
          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ error: errorMsg })}\n\n`)
          );
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error: unknown) {
    const errorMsg =
      error instanceof Error ? error.message : "Internal Server Error";
    return new Response(JSON.stringify({ error: errorMsg }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
