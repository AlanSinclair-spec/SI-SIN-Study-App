import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();

  const users = db.prepare("SELECT id, name FROM users ORDER BY name").all() as Array<{
    id: number;
    name: string;
  }>;

  const leaderboard = users.map((user) => {
    const flashcardStats = db
      .prepare(
        `SELECT
          COUNT(*) as total_reviews,
          ROUND(AVG(CASE WHEN quality >= 3 THEN 1.0 ELSE 0.0 END) * 100, 1) as accuracy
         FROM flashcard_reviews WHERE user_id = ?`
      )
      .get(user.id) as { total_reviews: number; accuracy: number };

    const quizStats = db
      .prepare(
        `SELECT COUNT(*) as total, ROUND(AVG(score), 1) as avg_score
         FROM quizzes WHERE user_id = ? AND completed_at IS NOT NULL`
      )
      .get(user.id) as { total: number; avg_score: number };

    // Composite score: weighted average of activity and accuracy
    const activityScore = Math.min(flashcardStats.total_reviews / 5, 20); // Up to 20 pts
    const accuracyScore = (flashcardStats.accuracy || 0) * 0.3; // Up to 30 pts
    const quizScore = (quizStats.avg_score || 0) * 0.5; // Up to 50 pts

    return {
      user_id: user.id,
      user_name: user.name,
      total_reviews: flashcardStats.total_reviews,
      flashcard_accuracy: flashcardStats.accuracy || 0,
      total_quizzes: quizStats.total,
      avg_quiz_score: quizStats.avg_score || 0,
      composite_score: Math.round((activityScore + accuracyScore + quizScore) * 10) / 10,
    };
  });

  leaderboard.sort((a, b) => b.composite_score - a.composite_score);

  return NextResponse.json(leaderboard);
}
