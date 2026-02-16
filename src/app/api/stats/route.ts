import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import type { Json } from "@/lib/supabase-types";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Flashcard stats from flashcard_progress
  const { data: flashcardRows } = await supabase
    .from("flashcard_progress")
    .select("flashcard_id, last_quality, updated_at")
    .eq("user_id", user.id);

  const totalReviews = flashcardRows?.length ?? 0;
  const uniqueCards = totalReviews;
  const accurateReviews = (flashcardRows ?? []).filter(
    (r) => r.last_quality !== null && r.last_quality >= 3
  ).length;
  const flashcardAccuracy = totalReviews > 0
    ? Math.round((accurateReviews / totalReviews) * 1000) / 10
    : 0;

  // Quiz stats from quiz_results
  const { data: quizRows } = await supabase
    .from("quiz_results")
    .select("score, completed_at")
    .eq("user_id", user.id);

  const totalQuizzes = quizRows?.length ?? 0;
  const avgQuizScore = totalQuizzes > 0
    ? Math.round(
        ((quizRows ?? []).reduce((sum, q) => sum + q.score, 0) / totalQuizzes) * 10
      ) / 10
    : 0;
  const bestQuizScore = totalQuizzes > 0
    ? Math.max(...(quizRows ?? []).map((q) => q.score))
    : 0;

  // Study streak -- gather unique activity dates from quiz_results and flashcard_progress
  const activityDates = new Set<string>();

  for (const q of quizRows ?? []) {
    if (q.completed_at) {
      activityDates.add(q.completed_at.split("T")[0]);
    }
  }
  for (const f of flashcardRows ?? []) {
    if (f.updated_at) {
      activityDates.add(f.updated_at.split("T")[0]);
    }
  }

  const sortedDates = Array.from(activityDates).sort().reverse();
  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);
    const expected = expectedDate.toISOString().split("T")[0];

    if (sortedDates[i] === expected) {
      streak++;
    } else if (i === 0 && sortedDates[0] !== expected) {
      // No activity today -- check if yesterday started the streak
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split("T")[0];
      if (sortedDates[0] === yesterdayStr) {
        streak = 1;
        continue;
      }
      break;
    } else {
      break;
    }
  }

  // Chapters studied from study_progress
  const { count: chaptersStudied } = await supabase
    .from("study_progress")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id)
    .eq("status", "completed");

  // Total notes
  const { count: notesCount } = await supabase
    .from("notes")
    .select("id", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Weak concepts: look at quiz_results answers for incorrect answers, aggregate
  const { data: quizResultsWithAnswers } = await supabase
    .from("quiz_results")
    .select("answers, book, chapter")
    .eq("user_id", user.id);

  const wrongByChapter: Record<string, { book: string; chapter: number | null; count: number }> = {};
  for (const qr of quizResultsWithAnswers ?? []) {
    const answers = qr.answers as Json;
    if (!Array.isArray(answers)) continue;
    for (const rawAnswer of answers) {
      const answer = rawAnswer as Record<string, Json>;
      if (answer && answer.isCorrect === false) {
        const key = `${qr.book}-${qr.chapter ?? "all"}`;
        if (!wrongByChapter[key]) {
          wrongByChapter[key] = { book: qr.book, chapter: qr.chapter, count: 0 };
        }
        wrongByChapter[key].count++;
      }
    }
  }

  const weakConcepts = Object.values(wrongByChapter)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5)
    .map((w) => ({
      book: w.book,
      chapter: w.chapter,
      miss_count: w.count,
    }));

  return NextResponse.json({
    user_id: user.id,
    user_name: user.user_metadata?.display_name ?? user.email ?? "Unknown",
    total_flashcards_reviewed: totalReviews,
    unique_cards_reviewed: uniqueCards,
    flashcard_accuracy: flashcardAccuracy,
    total_quizzes_taken: totalQuizzes,
    avg_quiz_score: avgQuizScore,
    best_quiz_score: bestQuizScore,
    study_streak: streak,
    chapters_studied: chaptersStudied ?? 0,
    total_notes: notesCount ?? 0,
    weak_concepts: weakConcepts,
  });
}
