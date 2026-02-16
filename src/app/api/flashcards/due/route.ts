import { NextResponse } from "next/server";
import { getAllFlashcards, getFlashcardById } from "@/data/content";
import type { FlashcardWithBookInfo } from "@/data/content/types";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface FlashcardProgressRow {
  flashcard_id: string;
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
  last_quality: number | null;
}

interface DueFlashcard extends FlashcardWithBookInfo {
  easiness_factor: number | null;
  interval_days: number | null;
  repetitions: number | null;
  next_review: string | null;
  last_quality: number | null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const limit = Number(searchParams.get("limit") || "20");

  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      // No authenticated user -- return all flashcards as "new" (no progress)
      const allFlashcards = getAllFlashcards();
      const dueCards: DueFlashcard[] = allFlashcards.slice(0, limit).map((fc) => ({
        ...fc,
        easiness_factor: null,
        interval_days: null,
        repetitions: null,
        next_review: null,
        last_quality: null,
      }));
      return NextResponse.json(dueCards);
    }

    const today = new Date().toISOString();

    // Fetch flashcard_progress rows where next_review <= now
    const { data: progressRows, error } = await supabase
      .from("flashcard_progress")
      .select("flashcard_id, easiness_factor, interval_days, repetitions, next_review, last_quality")
      .eq("user_id", user.id)
      .lte("next_review", today);

    if (error) {
      return NextResponse.json({ error: "Failed to fetch flashcard progress" }, { status: 500 });
    }

    // Get all flashcard IDs that the user has reviewed (to know which are "new")
    const { data: allProgressRows } = await supabase
      .from("flashcard_progress")
      .select("flashcard_id")
      .eq("user_id", user.id);

    const reviewedIds = new Set(
      (allProgressRows ?? []).map((r: { flashcard_id: string }) => r.flashcard_id)
    );

    // Build due cards from progress data
    const dueCards: DueFlashcard[] = [];

    // Cards due for review
    for (const progress of (progressRows ?? []) as FlashcardProgressRow[]) {
      const fc = getFlashcardById(progress.flashcard_id);
      if (!fc) continue;

      const book = getAllFlashcards().find((f) => f.id === fc.id);
      dueCards.push({
        ...fc,
        bookTitle: book?.bookTitle ?? "",
        chapterTitle: book?.chapterTitle ?? "",
        easiness_factor: progress.easiness_factor,
        interval_days: progress.interval_days,
        repetitions: progress.repetitions,
        next_review: progress.next_review,
        last_quality: progress.last_quality,
      });
    }

    // New cards (never reviewed) -- fill remaining slots
    if (dueCards.length < limit) {
      const allFlashcards = getAllFlashcards();
      for (const fc of allFlashcards) {
        if (dueCards.length >= limit) break;
        if (reviewedIds.has(fc.id)) continue;

        dueCards.push({
          ...fc,
          easiness_factor: null,
          interval_days: null,
          repetitions: null,
          next_review: null,
          last_quality: null,
        });
      }
    }

    return NextResponse.json(dueCards.slice(0, limit));
  } catch {
    // Fallback: return all flashcards as new
    const allFlashcards = getAllFlashcards();
    const dueCards: DueFlashcard[] = allFlashcards.slice(0, limit).map((fc) => ({
      ...fc,
      easiness_factor: null,
      interval_days: null,
      repetitions: null,
      next_review: null,
      last_quality: null,
    }));
    return NextResponse.json(dueCards);
  }
}
