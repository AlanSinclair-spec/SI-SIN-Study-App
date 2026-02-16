import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

function calculateSM2(
  quality: number,
  prevEF: number,
  prevInterval: number,
  prevReps: number
) {
  let ef = prevEF + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (ef < 1.3) ef = 1.3;

  let interval: number;
  let reps: number;

  if (quality < 3) {
    reps = 0;
    interval = 1;
  } else {
    reps = prevReps + 1;
    if (reps === 1) interval = 1;
    else if (reps === 2) interval = 6;
    else interval = Math.round(prevInterval * ef);
  }

  const nextReview = new Date();
  nextReview.setDate(nextReview.getDate() + interval);

  return {
    easinessFactor: ef,
    intervalDays: interval,
    repetitions: reps,
    nextReview: nextReview.toISOString(),
  };
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as { flashcardId?: string; quality?: number };
  const { flashcardId, quality } = body;

  if (!flashcardId || quality === undefined) {
    return NextResponse.json(
      { error: "flashcardId and quality are required" },
      { status: 400 }
    );
  }

  if (typeof quality !== "number" || quality < 0 || quality > 5) {
    return NextResponse.json(
      { error: "Quality must be a number between 0 and 5" },
      { status: 400 }
    );
  }

  // Get current state or use defaults
  const { data: currentState } = await supabase
    .from("flashcard_progress")
    .select("easiness_factor, interval_days, repetitions")
    .eq("user_id", user.id)
    .eq("flashcard_id", flashcardId)
    .single();

  const prevEF = currentState?.easiness_factor ?? 2.5;
  const prevInterval = currentState?.interval_days ?? 0;
  const prevReps = currentState?.repetitions ?? 0;

  const result = calculateSM2(quality, prevEF, prevInterval, prevReps);

  // Upsert flashcard_progress
  const { error: upsertError } = await supabase
    .from("flashcard_progress")
    .upsert(
      {
        user_id: user.id,
        flashcard_id: flashcardId,
        easiness_factor: result.easinessFactor,
        interval_days: result.intervalDays,
        repetitions: result.repetitions,
        next_review: result.nextReview,
        last_quality: quality,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,flashcard_id" }
    );

  if (upsertError) {
    return NextResponse.json(
      { error: "Failed to save review progress" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    easinessFactor: result.easinessFactor,
    intervalDays: result.intervalDays,
    repetitions: result.repetitions,
    nextReview: result.nextReview,
    message: `Next review: ${result.nextReview} (${result.intervalDays} days)`,
  });
}
