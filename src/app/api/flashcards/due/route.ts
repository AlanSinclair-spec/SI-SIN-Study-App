import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const limit = searchParams.get("limit") || "20";

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const db = getDb();
  const today = new Date().toISOString().split("T")[0];

  // Cards due for review OR never reviewed (new cards)
  const dueCards = db
    .prepare(
      `SELECT f.*, b.title as book_title, ch.title as chapter_title,
              s.easiness_factor, s.interval_days, s.repetitions, s.next_review, s.last_quality
       FROM flashcards f
       JOIN books b ON f.book_id = b.id
       LEFT JOIN chapters ch ON f.chapter_id = ch.id
       LEFT JOIN user_flashcard_state s ON f.id = s.flashcard_id AND s.user_id = ?
       WHERE s.next_review IS NULL OR s.next_review <= ?
       ORDER BY
         CASE WHEN s.next_review IS NULL THEN 1 ELSE 0 END,
         s.next_review ASC,
         RANDOM()
       LIMIT ?`
    )
    .all(Number(userId), today, Number(limit));

  return NextResponse.json(dueCards);
}
