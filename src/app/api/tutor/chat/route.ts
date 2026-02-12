import { getDb } from "@/lib/db";
import { buildSystemPrompt, loadBookContext, streamTutorResponse } from "@/lib/ai";

export async function POST(request: Request) {
  const { userId, conversationId, message, difficulty = "intermediate" } = await request.json();

  if (!userId || !message) {
    return new Response(JSON.stringify({ error: "userId and message required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  const db = getDb();

  // Load or create conversation
  let conversation: { id: number; messages: string } | undefined;
  if (conversationId) {
    conversation = db
      .prepare("SELECT id, messages FROM tutor_conversations WHERE id = ? AND user_id = ?")
      .get(conversationId, Number(userId)) as { id: number; messages: string } | undefined;
  }

  const existingMessages: Array<{ role: "user" | "assistant"; content: string }> =
    conversation ? JSON.parse(conversation.messages) : [];

  // Add user message
  existingMessages.push({
    role: "user",
    content: message,
  });

  // Build context
  const bookContext = loadBookContext(message);

  // Get student weak areas from quiz history
  const weakAreas = db
    .prepare(
      `SELECT c.title, COUNT(*) as wrong_count
       FROM quiz_answers qa
       JOIN quiz_questions qq ON qa.question_id = qq.id
       JOIN concepts c ON qq.concept_id = c.id
       WHERE qa.is_correct = 0
       AND qa.quiz_id IN (SELECT id FROM quizzes WHERE user_id = ?)
       GROUP BY c.id
       ORDER BY wrong_count DESC
       LIMIT 5`
    )
    .all(Number(userId)) as Array<{ title: string; wrong_count: number }>;

  const weakAreasText = weakAreas.length > 0
    ? weakAreas.map((w) => `- ${w.title} (missed ${w.wrong_count} times)`).join("\n")
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
                const data = JSON.parse(trimmed.slice(6));
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
              const data = JSON.parse(buffer.trim().slice(6));
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
            db.prepare(
              "UPDATE tutor_conversations SET messages = ?, updated_at = datetime('now') WHERE id = ?"
            ).run(messagesJson, conversation.id);
          } else {
            const result = db
              .prepare(
                "INSERT INTO tutor_conversations (user_id, difficulty, topic, messages) VALUES (?, ?, ?, ?)"
              )
              .run(Number(userId), difficulty, message.slice(0, 100), messagesJson);
            conversation = { id: Number(result.lastInsertRowid), messages: messagesJson };
          }

          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ done: true, conversationId: conversation.id })}\n\n`
            )
          );
          controller.close();
        } catch (err) {
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
