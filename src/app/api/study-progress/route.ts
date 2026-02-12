import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const book = searchParams.get("book");

  let query = supabase
    .from("study_progress")
    .select("*")
    .eq("user_id", user.id)
    .order("book")
    .order("chapter");

  if (book) query = query.eq("book", book);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { book, chapter, section, status, completion_percentage } = body as {
    book: string;
    chapter: number;
    section?: string;
    status?: "not_started" | "in_progress" | "completed";
    completion_percentage?: number;
  };

  if (!book || chapter === undefined) {
    return NextResponse.json({ error: "book and chapter are required" }, { status: 400 });
  }

  // Check if progress already exists for this book/chapter
  const { data: existing } = await supabase
    .from("study_progress")
    .select("id")
    .eq("user_id", user.id)
    .eq("book", book)
    .eq("chapter", chapter)
    .maybeSingle();

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from("study_progress")
      .update({
        section: section ?? null,
        status: status ?? "in_progress",
        completion_percentage: completion_percentage ?? 0,
        last_studied_at: new Date().toISOString(),
      })
      .eq("id", existing.id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json(data);
  }

  // Create new
  const { data, error } = await supabase
    .from("study_progress")
    .insert({
      user_id: user.id,
      book,
      chapter,
      section: section ?? null,
      status: status ?? "not_started",
      completion_percentage: completion_percentage ?? 0,
      last_studied_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PUT(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { id, status, completion_percentage, section } = body as {
    id: string;
    status?: "not_started" | "in_progress" | "completed";
    completion_percentage?: number;
    section?: string;
  };

  if (!id) {
    return NextResponse.json({ error: "id is required" }, { status: 400 });
  }

  const updates: Record<string, string | number | null> = {
    last_studied_at: new Date().toISOString(),
  };
  if (status !== undefined) updates.status = status;
  if (completion_percentage !== undefined) updates.completion_percentage = completion_percentage;
  if (section !== undefined) updates.section = section;

  const { data, error } = await supabase
    .from("study_progress")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error || !data) {
    return NextResponse.json({ error: "Progress not found or update failed" }, { status: 404 });
  }
  return NextResponse.json(data);
}
