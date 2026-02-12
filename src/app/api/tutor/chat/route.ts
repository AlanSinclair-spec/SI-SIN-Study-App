import { createServerSupabaseClient } from "@/lib/supabase-server";
import { buildSystemPrompt, loadBookContext, streamTutorResponse } from "@/lib/ai";

interface ChatRequestBody {
  conversationId?: string;
  message: string;
  difficulty?: "beginner" | "intermediate" | "advanced";
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const { conversationId, message, difficulty = "intermediate" } =
    (await request.json()) as ChatRequestBody;

  if (!message) {
    return new Response(JSON.stringify({ error: "message required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Load or create conversation
  let conversation: { id: string; messages: string } | null = null;
  if (conversationId) {
    const { data } = await supabase
      .from("tutor_conversations")
      .select("id, messages")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single();
    conversation = data;
  }

  const existingMessages: Array<{ role: "user" | "assistant"; content: string }> =
    conversation ? JSON.parse(conversation.messages) : [];

  // Add user message
  existingMessages.push({
    role: "user",
    content: message,
  });

  // Build context
  const bookContext = await loadBookContext(supabase, message);

  // Get student weak areas from quiz history
  const { data: weakConcepts } = await supabase.rpc("get_weak_concepts", {
    p_user_id: user.id,
  });

  const weakAreasText =
    weakConcepts && weakConcepts.length > 0
      ? (weakConcepts as Array<{ title: string; miss_count: number }>)
          .map((w) => `- ${w.title} (missed ${w.miss_count} times)`)
          .join("\n")
      : undefined;

  const systemPrompt = buildSystemPrompt({
    difficulty,
    topic: message,
    bookContext,
    studentWeakAreas: weakAreasText,
  });

  // Only send last 20 messages to avoid token limits
  const recentMessages = existingMessages.slice(-20);

  try {
    const kimiStream = await streamTutorResponse(recentMessages, systemPrompt);

    // Collect the full response for saving
    let fullResponse = "";

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    const readableStream = new ReadableStream({
      async start(controller) {
        const reader = kimiStream.getReader();
        let buffer = "";

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });

            // Process complete SSE lines from buffer
            const lines = buffer.split("\n");
            // Keep the last potentially incomplete line in the buffer
            buffer = lines.pop() || "";

            for (const line of lines) {
              const trimmed = line.trim();
              if (!trimmed || trimmed === "data: [DONE]") continue;
              if (!trimmed.startsWith("data: ")) continue;

              try {
                const data = JSON.parse(trimmed.slice(6)) as {
                  choices?: Array<{ delta?: { content?: string } }>;
                };
                const content = data.choices?.[0]?.delta?.content;
                if (content) {
                  fullResponse += content;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`)
                  );
                }
              } catch {
                // Skip malformed SSE chunks
              }
            }
          }

          // Process any remaining buffer
          if (buffer.trim() && buffer.trim() !== "data: [DONE]" && buffer.trim().startsWith("data: ")) {
            try {
              const data = JSON.parse(buffer.trim().slice(6)) as {
                choices?: Array<{ delta?: { content?: string } }>;
              };
              const content = data.choices?.[0]?.delta?.content;
              if (content) {
                fullResponse += content;
                controller.enqueue(
                  encoder.encode(`data: ${JSON.stringify({ text: content })}\n\n`)
                );
              }
            } catch {
              // Skip
            }
          }

          // Save conversation
          existingMessages.push({
            role: "assistant",
            content: fullResponse,
          });

          const messagesJson = JSON.stringify(existingMessages);

          if (conversation) {
            await supabase
              .from("tutor_conversations")
              .update({
                messages: messagesJson,
                updated_at: new Date().toISOString(),
              })
              .eq("id", conversation.id);
          } else {
            const { data: newConv } = await supabase
              .from("tutor_conversations")
              .insert({
                user_id: user.id,
                difficulty,
                topic: message.slice(0, 100),
                messages: messagesJson,
              })
              .select("id")
              .single();

            conversation = newConv
              ? { id: newConv.id, messages: messagesJson }
              : null;
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, conversationId: conversation?.id ?? null })}\n\n`
            )
          );
          controller.close();
        } catch {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ error: "Stream error" })}\n\n`
            )
          );
          controller.close();
        }
      },
    });

    return new Response(readableStream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to connect to AI service. Check your KIMI_API_KEY in .env.local" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
