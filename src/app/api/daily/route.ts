import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const today = new Date().toISOString().split("T")[0];

  // Check for existing study progress today
  const { data: todayProgress } = await supabase
    .from("study_progress")
    .select("*")
    .eq("user_id", user.id)
    .gte("last_studied_at", `${today}T00:00:00`)
    .lte("last_studied_at", `${today}T23:59:59`)
    .limit(1)
    .maybeSingle();

  if (todayProgress) {
    return NextResponse.json(todayProgress);
  }

  return NextResponse.json(null);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as {
    action?: string;
    book?: string;
    chapter?: number;
  };

  const { action, book, chapter } = body;

  if (!action) {
    return NextResponse.json({ error: "action is required" }, { status: 400 });
  }

  if (action === "start") {
    if (!book || chapter === undefined) {
      return NextResponse.json(
        { error: "book and chapter are required for start action" },
        { status: 400 }
      );
    }

    // Upsert into study_progress
    const { data: progress, error: upsertError } = await supabase
      .from("study_progress")
      .upsert(
        {
          user_id: user.id,
          book,
          chapter,
          status: "in_progress" as const,
          last_studied_at: new Date().toISOString(),
        },
        { onConflict: "user_id,book,chapter" }
      )
      .select()
      .single();

    if (upsertError) {
      return NextResponse.json(
        { error: "Failed to create study progress" },
        { status: 500 }
      );
    }

    return NextResponse.json(progress, { status: 201 });
  }

  if (action === "complete") {
    if (!book || chapter === undefined) {
      return NextResponse.json(
        { error: "book and chapter are required for complete action" },
        { status: 400 }
      );
    }

    const { data: progress, error: updateError } = await supabase
      .from("study_progress")
      .upsert(
        {
          user_id: user.id,
          book,
          chapter,
          status: "completed" as const,
          completion_percentage: 100,
          last_studied_at: new Date().toISOString(),
        },
        { onConflict: "user_id,book,chapter" }
      )
      .select()
      .single();

    if (updateError) {
      return NextResponse.json(
        { error: "Failed to update study progress" },
        { status: 500 }
      );
    }

    return NextResponse.json(progress);
  }

  return NextResponse.json({ error: "Invalid action" }, { status: 400 });
}
