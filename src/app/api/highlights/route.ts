import { NextRequest, NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const book = searchParams.get("book");
  const chapter = searchParams.get("chapter");
  const color = searchParams.get("color");

  let query = supabase
    .from("highlights")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (book) {
    query = query.eq("book", book);
  }

  if (chapter) {
    query = query.eq("chapter", Number(chapter));
  }

  if (color) {
    query = query.eq("color", color);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body: {
    book?: string;
    chapter?: number;
    highlightedText?: string;
    note?: string;
    color?: string;
  } = await request.json();

  if (!body.book || body.chapter === undefined || !body.highlightedText) {
    return NextResponse.json(
      { error: "Missing required fields: book, chapter, highlightedText" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("highlights")
    .insert({
      user_id: user.id,
      book: body.book,
      chapter: body.chapter,
      highlighted_text: body.highlightedText,
      note: body.note ?? null,
      color: body.color ?? "yellow",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data, { status: 201 });
}
