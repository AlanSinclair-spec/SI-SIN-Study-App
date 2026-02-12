import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const db = getDb();
  const uid = Number(userId);

  // Flashcard stats
  const flashcardStats = db
    .prepare(
      `SELECT
        COUNT(*) as total_reviews,
        ROUND(AVG(CASE WHEN quality >= 3 THEN 1.0 ELSE 0.0 END) * 100, 1) as accuracy,
        COUNT(DISTINCT flashcard_id) as unique_cards
       FROM flashcard_reviews WHERE user_id = ?`
    )
    .get(uid) as { total_reviews: number; accuracy: number; unique_cards: number };

  // Quiz stats
  const quizStats = db
    .prepare(
      `SELECT
        COUNT(*) as total_quizzes,
        ROUND(AVG(score), 1) as avg_score,
        MAX(score) as best_score
       FROM quizzes WHERE user_id = ? AND completed_at IS NOT NULL`
    )
    .get(uid) as { total_quizzes: number; avg_score: number; best_score: number };

  // Study streak (consecutive days with activity)
  const recentSessions = db
    .prepare(
      `SELECT DISTINCT date(started_at) as study_date
       FROM study_sessions WHERE user_id = ?
       UNION
       SELECT DISTINCT date(reviewed_at) as study_date
       FROM flashcard_reviews WHERE user_id = ?
       UNION
       SELECT DISTINCT date(started_at) as study_date
       FROM quizzes WHERE user_id = ?
       ORDER BY study_date DESC
       LIMIT 365`
    )
    .all(uid, uid, uid) as Array<{ study_date: string }>;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < recentSessions.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expected = expectedDate.toISOString().split("T")[0];

    if (recentSessions[i].study_date === expected) {
      streak++;
    } else if (i === 0 && recentSessions[0]?.study_date !== expected) {
      // No activity today - check if yesterday started the streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      if (recentSessions[0]?.study_date === yesterdayStr) {
        streak = 1;
        continue;
      }
      break;
    } else {
      break;
    }
  }

  // Chapters studied (has at least one flashcard review or quiz for that chapter)
  const chaptersStudied = db
    .prepare(
      `SELECT COUNT(DISTINCT chapter_id) as count FROM (
        SELECT f.chapter_id FROM flashcard_reviews fr
        JOIN flashcards f ON fr.flashcard_id = f.id
        WHERE fr.user_id = ? AND f.chapter_id IS NOT NULL
        UNION
        SELECT q.chapter_id FROM quizzes q
        WHERE q.user_id = ? AND q.chapter_id IS NOT NULL
      )`
    )
    .get(uid, uid) as { count: number };

  // Total study sessions
  const sessionCount = db
    .prepare("SELECT COUNT(*) as count FROM study_sessions WHERE user_id = ?")
    .get(uid) as { count: number };

  // Weak concepts (most missed in quizzes)
  const weakConcepts = db
    .prepare(
      `SELECT c.title, c.id, COUNT(*) as miss_count,
              ch.title as chapter_title, b.title as book_title
       FROM quiz_answers qa
       JOIN quiz_questions qq ON qa.question_id = qq.id
       JOIN concepts c ON qq.concept_id = c.id
       JOIN chapters ch ON c.chapter_id = ch.id
       JOIN books b ON ch.book_id = b.id
       WHERE qa.is_correct = 0
       AND qa.quiz_id IN (SELECT id FROM quizzes WHERE user_id = ?)
       GROUP BY c.id
       ORDER BY miss_count DESC
       LIMIT 5`
    )
    .all(uid);

  // Recent activity
  const user = db.prepare("SELECT * FROM users WHERE id = ?").get(uid) as { name: string };

  return NextResponse.json({
    user_id: uid,
    user_name: user?.name || "Unknown",
    total_flashcards_reviewed: flashcardStats.total_reviews,
    unique_cards_reviewed: flashcardStats.unique_cards,
    flashcard_accuracy: flashcardStats.accuracy || 0,
    total_quizzes_taken: quizStats.total_quizzes,
    avg_quiz_score: quizStats.avg_score || 0,
    best_quiz_score: quizStats.best_score || 0,
    study_streak: streak,
    chapters_studied: chaptersStudied.count,
    total_study_sessions: sessionCount.count,
    weak_concepts: weakConcepts,
  });
}
