import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { calculateSM2, DEFAULT_SM2_STATE } from "@/lib/sm2";

export async function POST(request: Request) {
  const { userId, flashcardId, quality } = await request.json();

  if (!userId || !flashcardId || quality === undefined) {
    return NextResponse.json(
      { error: "userId, flashcardId, and quality are required" },
      { status: 400 }
    );
  }

  if (quality < 0 || quality > 5) {
    return NextResponse.json(
      { error: "Quality must be between 0 and 5" },
      { status: 400 }
    );
  }

  const db = getDb();

  // Get current state or use defaults
  const currentState = db
    .prepare(
      "SELECT easiness_factor, interval_days, repetitions FROM user_flashcard_state WHERE user_id = ? AND flashcard_id = ?"
    )
    .get(Number(userId), Number(flashcardId)) as {
    easiness_factor: number;
    interval_days: number;
    repetitions: number;
  } | undefined;

  const sm2Input = currentState
    ? {
        easinessFactor: currentState.easiness_factor,
        intervalDays: currentState.interval_days,
        repetitions: currentState.repetitions,
      }
    : DEFAULT_SM2_STATE;

  const result = calculateSM2(quality, sm2Input);

  // Upsert user_flashcard_state
  db.prepare(
    `INSERT INTO user_flashcard_state (user_id, flashcard_id, easiness_factor, interval_days, repetitions, next_review, last_quality, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT(user_id, flashcard_id)
     DO UPDATE SET easiness_factor = ?, interval_days = ?, repetitions = ?, next_review = ?, last_quality = ?, updated_at = datetime('now')`
  ).run(
    Number(userId),
    Number(flashcardId),
    result.easinessFactor,
    result.intervalDays,
    result.repetitions,
    result.nextReview,
    quality,
    result.easinessFactor,
    result.intervalDays,
    result.repetitions,
    result.nextReview,
    quality
  );

  // Insert review audit log
  db.prepare(
    `INSERT INTO flashcard_reviews (user_id, flashcard_id, quality, easiness_factor, interval_days, repetitions, next_review)
     VALUES (?, ?, ?, ?, ?, ?, ?)`
  ).run(
    Number(userId),
    Number(flashcardId),
    quality,
    result.easinessFactor,
    result.intervalDays,
    result.repetitions,
    result.nextReview
  );

  return NextResponse.json({
    ...result,
    message: `Next review: ${result.nextReview} (${result.intervalDays} days)`,
  });
}
