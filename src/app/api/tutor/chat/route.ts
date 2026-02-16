import { buildSystemPrompt, loadBookContext, streamTutorResponse } from "@/lib/ai";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Json } from "@/lib/supabase-types";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export async function POST(request: Request) {
  const body = await request.json() as {
    conversationId?: string;
    message?: string;
    difficulty?: "beginner" | "intermediate" | "advanced";
  };

  const { conversationId, message, difficulty = "intermediate" } = body;

  if (!message) {
    return new Response(JSON.stringify({ error: "message is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  // Load or create conversation
  let conversation: { id: string; messages: Json } | null = null;
  if (conversationId) {
    const { data } = await supabase
      .from("tutor_conversations")
      .select("id, messages")
      .eq("id", conversationId)
      .eq("user_id", user.id)
      .single();

    if (data) {
      conversation = data;
    }
  }

  const existingMessages: ChatMessage[] = conversation
    ? (conversation.messages as unknown as ChatMessage[])
    : [];

  // Add user message
  existingMessages.push({
    role: "user",
    content: message,
  });

  // Build context
  const bookContext = loadBookContext(message);

  // Get student weak areas from quiz results
  let weakAreasText: string | undefined;
  const { data: quizResults } = await supabase
    .from("quiz_results")
    .select("answers, book")
    .eq("user_id", user.id);

  if (quizResults && quizResults.length > 0) {
    const wrongCounts: Record<string, number> = {};
    for (const qr of quizResults) {
      const answers = qr.answers as Json;
      if (!Array.isArray(answers)) continue;
      for (const rawAnswer of answers) {
        const answer = rawAnswer as Record<string, Json>;
        if (answer && answer.isCorrect === false) {
          const questionId = String(answer.questionId ?? "unknown");
          wrongCounts[questionId] = (wrongCounts[questionId] ?? 0) + 1;
        }
      }
    }

    const weakAreas = Object.entries(wrongCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([qId, count]) => `- Question ${qId} (missed ${count} times)`);

    if (weakAreas.length > 0) {
      weakAreasText = weakAreas.join("\n");
    }
  }

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

          const messagesJson = existingMessages as unknown as Json;

          let savedConversationId = conversation?.id;

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

            savedConversationId = newConv?.id;
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, conversationId: savedConversationId })}\n\n`
            )
          );
          controller.close();
        } catch (_err) {
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
