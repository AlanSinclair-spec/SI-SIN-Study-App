import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";
import { calculateSM2, DEFAULT_SM2_STATE } from "@/lib/sm2";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { flashcardId, quality } = body as { flashcardId: string; quality: number };

  if (!flashcardId || quality === undefined) {
    return NextResponse.json({ error: "flashcardId and quality required" }, { status: 400 });
  }

  if (quality < 0 || quality > 5) {
    return NextResponse.json({ error: "Quality must be between 0 and 5" }, { status: 400 });
  }

  // Get current state
  const { data: currentState } = await supabase
    .from("user_flashcard_state")
    .select("*")
    .eq("user_id", user.id)
    .eq("flashcard_id", flashcardId)
    .maybeSingle();

  const state = currentState
    ? {
        easinessFactor: currentState.easiness_factor,
        intervalDays: currentState.interval_days,
        repetitions: currentState.repetitions,
      }
    : DEFAULT_SM2_STATE;

  const newState = calculateSM2(quality, state);

  // Upsert flashcard state
  const { error: upsertError } = await supabase.from("user_flashcard_state").upsert(
    {
      user_id: user.id,
      flashcard_id: flashcardId,
      easiness_factor: newState.easinessFactor,
      interval_days: newState.intervalDays,
      repetitions: newState.repetitions,
      next_review: newState.nextReview,
      last_quality: quality,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id,flashcard_id" }
  );

  if (upsertError) {
    return NextResponse.json({ error: upsertError.message }, { status: 500 });
  }

  // Record review
  const { error: reviewError } = await supabase.from("flashcard_reviews").insert({
    user_id: user.id,
    flashcard_id: flashcardId,
    quality,
    easiness_factor: newState.easinessFactor,
    interval_days: newState.intervalDays,
    repetitions: newState.repetitions,
    next_review: newState.nextReview,
  });

  if (reviewError) {
    return NextResponse.json({ error: reviewError.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    nextReview: newState.nextReview,
    intervalDays: newState.intervalDays,
  });
}
