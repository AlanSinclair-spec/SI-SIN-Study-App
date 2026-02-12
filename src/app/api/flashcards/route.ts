import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data, error } = await supabase
    .from("flashcards")
    .select("*, books(title), chapters(title)")
    .order("created_at");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const result = data.map((f) => ({
    ...f,
    book_title: (f.books as { title: string } | null)?.title ?? "",
    chapter_title: (f.chapters as { title: string } | null)?.title ?? "",
    books: undefined,
    chapters: undefined,
  }));

  return NextResponse.json(result);
}
