import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const book = searchParams.get("book");
  const chapter = searchParams.get("chapter");

  let query = supabase
    .from("highlights")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (book) query = query.eq("book", book);
  if (chapter) query = query.eq("chapter", parseInt(chapter, 10));

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { book, chapter, highlighted_text, note, color } = body as {
    book: string;
    chapter: number;
    highlighted_text: string;
    note?: string;
    color?: string;
  };

  if (!book || chapter === undefined || !highlighted_text) {
    return NextResponse.json(
      { error: "book, chapter, and highlighted_text are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("highlights")
    .insert({
      user_id: user.id,
      book,
      chapter,
      highlighted_text,
      note: note ?? null,
      color: color ?? "yellow",
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
