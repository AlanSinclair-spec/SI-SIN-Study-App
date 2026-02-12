import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const db = getDb();
  const today = new Date().toISOString().split("T")[0];

  // Check for existing daily session today
  const existingSession = db
    .prepare(
      `SELECT * FROM study_sessions
       WHERE user_id = ? AND session_type = 'daily' AND date(started_at) = ?`
    )
    .get(Number(userId), today);

  if (existingSession) {
    return NextResponse.json(existingSession);
  }

  return NextResponse.json(null);
}

export async function POST(request: Request) {
  const { userId, action, sessionId, flashcardsReviewed, quizScore } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const db = getDb();

  if (action === "start") {
    const result = db
      .prepare(
        "INSERT INTO study_sessions (user_id, session_type) VALUES (?, 'daily')"
      )
      .run(Number(userId));

    const session = db
      .prepare("SELECT * FROM study_sessions WHERE id = ?")
      .get(result.lastInsertRowid);

    return NextResponse.json(session, { status: 201 });
  }

  if (action === "update" && sessionId) {
    const updates: string[] = [];
    const params: (string | number)[] = [];

    if (flashcardsReviewed !== undefined) {
      updates.push("flashcards_reviewed = ?");
      params.push(flashcardsReviewed);
    }
    if (quizScore !== undefined) {
      updates.push("quiz_score = ?");
      params.push(quizScore);
    }

    if (updates.length > 0) {
      params.push(sessionId);
      db.prepare(
        `UPDATE study_sessions SET ${updates.join(", ")} WHERE id = ?`
      ).run(...params);
    }

    const session = db
      .prepare("SELECT * FROM study_sessions WHERE id = ?")
      .get(sessionId);
    return NextResponse.json(session);
  }

  if (action === "complete" && sessionId) {
    db.prepare(
      `UPDATE study_sessions SET completed_at = datetime('now'),
       duration_minutes = ROUND((julianday('now') - julianday(started_at)) * 1440)
       WHERE id = ?`
    ).run(sessionId);

    const session = db
      .prepare("SELECT * FROM study_sessions WHERE id = ?")
      .get(sessionId);
    return NextResponse.json(session);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
