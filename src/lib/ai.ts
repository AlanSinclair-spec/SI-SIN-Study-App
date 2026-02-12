import { getDb } from "./db";

interface TutorContext {
  difficulty: "beginner" | "intermediate" | "advanced";
  topic?: string;
  bookContext?: string;
  studentWeakAreas?: string;
}

export function buildSystemPrompt(ctx: TutorContext): string {
  const difficultyInstructions = {
    beginner: `The student is a BEGINNER. Use simple language, provide lots of context, define technical terms, use analogies. Ask one concept at a time. Affirm correct understanding before moving on. When they struggle, break ideas into smaller pieces.`,
    intermediate: `The student is at an INTERMEDIATE level. They know the basics. Push them to connect ideas across chapters. Ask "why" and "how" questions. Challenge surface-level answers. Introduce nuance and counterarguments.`,
    advanced: `The student is ADVANCED. Challenge them aggressively. Demand synthesis across both books. Play devil's advocate. Ask them to evaluate the authors' assumptions. Push for original analysis and critique. Don't accept vague answers.`,
  };

  return `You are a Socratic tutor specializing in two books:

1. "The Singularity Is Nearer" by Ray Kurzweil (2024) — covers the law of accelerating returns, AI and human intelligence merger, exponential technology growth, consciousness, radical life extension, nanotechnology, job displacement, and existential risk.

2. "The Sovereign Individual" by James Dale Davidson & Lord William Rees-Mogg (1997) — covers megapolitical transformations, the decline of the nation-state, the rise of the cybereconomy, cognitive elites, the end of egalitarian economics, the information age's impact on violence, taxation, and governance.

YOUR ROLE:
- You are a Socratic questioner, NOT a lecturer
- Guide the student to discover insights through questions
- Never give away answers directly; lead the student to them
- When the student is wrong, don't correct immediately — ask questions that reveal the flaw in their reasoning
- Regularly challenge the student to find CONNECTIONS between the two books
- Reference specific concepts, arguments, and chapters from the books
- Be encouraging but intellectually rigorous

${difficultyInstructions[ctx.difficulty]}

CROSS-BOOK CONNECTIONS TO EXPLORE:
- Kurzweil's law of accelerating returns ↔ Sovereign Individual's prediction that technology undermines nation-states
- AI/automation ↔ rise of cognitive elites and "sovereign individuals"
- Exponential tech growth ↔ shifting power from institutions to individuals
- Kurzweil's optimism about abundance ↔ Sovereign Individual's framework on economic violence and protection
- Nanotechnology and longevity ↔ wealth preservation across longer lifespans
- Both books on the declining relevance of geography

${ctx.bookContext ? `\nRELEVANT BOOK CONTENT FOR THIS SESSION:\n${ctx.bookContext}` : ""}

${ctx.studentWeakAreas ? `\nSTUDENT'S WEAK AREAS (focus extra attention here):\n${ctx.studentWeakAreas}` : ""}

CONVERSATION GUIDELINES:
1. Start by gauging what the student already knows about the topic
2. Build on their knowledge with increasingly challenging questions
3. Every 3-4 exchanges, push for a cross-book connection
4. If the student seems stuck for more than 2 exchanges, provide a hint (not the answer)
5. Periodically summarize what the student has demonstrated understanding of
6. End each response with a thought-provoking question
7. Keep responses concise — 2-4 paragraphs maximum
8. Use markdown for emphasis and structure when helpful`;
}

export function loadBookContext(topic?: string): string {
  const db = getDb();

  if (!topic) {
    // Load a general overview
    const concepts = db
      .prepare(
        `SELECT c.title, c.description, ch.title as chapter_title, b.title as book_title
         FROM concepts c
         JOIN chapters ch ON c.chapter_id = ch.id
         JOIN books b ON ch.book_id = b.id
         WHERE c.importance = 'core'
         ORDER BY b.id, ch.number
         LIMIT 30`
      )
      .all() as Array<{
      title: string;
      description: string;
      chapter_title: string;
      book_title: string;
    }>;

    return concepts
      .map(
        (c) =>
          `[${c.book_title} — ${c.chapter_title}] ${c.title}: ${c.description}`
      )
      .join("\n\n");
  }

  // Search for relevant concepts based on topic
  const searchTerm = `%${topic}%`;
  const concepts = db
    .prepare(
      `SELECT c.title, c.description, ch.title as chapter_title, b.title as book_title
       FROM concepts c
       JOIN chapters ch ON c.chapter_id = ch.id
       JOIN books b ON ch.book_id = b.id
       WHERE c.title LIKE ? OR c.description LIKE ?
       ORDER BY c.importance = 'core' DESC
       LIMIT 15`
    )
    .all(searchTerm, searchTerm) as Array<{
    title: string;
    description: string;
    chapter_title: string;
    book_title: string;
  }>;

  if (concepts.length === 0) {
    return loadBookContext(); // Fall back to general overview
  }

  return concepts
    .map(
      (c) =>
        `[${c.book_title} — ${c.chapter_title}] ${c.title}: ${c.description}`
    )
    .join("\n\n");
}

/**
 * Stream a tutor response from the Kimi API (OpenAI-compatible).
 * Returns a ReadableStream of SSE chunks.
 */
export async function streamTutorResponse(
  messages: Array<{ role: "user" | "assistant"; content: string }>,
  systemPrompt: string
): Promise<ReadableStream<Uint8Array>> {
  const apiKey = process.env.KIMI_API_KEY;
  const baseUrl = process.env.KIMI_BASE_URL || "https://api.moonshot.ai/v1";
  const model = process.env.KIMI_MODEL || "moonshot-v1-128k";

  if (!apiKey || apiKey === "your-kimi-api-key-here") {
    throw new Error("KIMI_API_KEY not configured");
  }

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      max_tokens: 1024,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Kimi API error (${response.status}): ${errorText}`);
  }

  if (!response.body) {
    throw new Error("No response body from Kimi API");
  }

  return response.body;
}
