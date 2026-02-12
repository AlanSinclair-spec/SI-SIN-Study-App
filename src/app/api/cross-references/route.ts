import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const sourceBook = searchParams.get("source_book");
  const targetBook = searchParams.get("target_book");

  let query = supabase
    .from("cross_references")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (sourceBook) query = query.eq("source_book", sourceBook);
  if (targetBook) query = query.eq("target_book", targetBook);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json(data ?? []);
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const {
    source_book,
    source_chapter,
    target_book,
    target_chapter,
    connection_note,
  } = body as {
    source_book: string;
    source_chapter: number;
    target_book: string;
    target_chapter: number;
    connection_note: string;
  };

  if (!source_book || source_chapter === undefined || !target_book || target_chapter === undefined || !connection_note) {
    return NextResponse.json(
      { error: "source_book, source_chapter, target_book, target_chapter, and connection_note are required" },
      { status: 400 }
    );
  }

  const { data, error } = await supabase
    .from("cross_references")
    .insert({
      user_id: user.id,
      source_book,
      source_chapter,
      target_book,
      target_chapter,
      connection_note,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}
