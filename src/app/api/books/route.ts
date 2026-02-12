import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET() {
  const supabase = await createServerSupabaseClient();
  const { data: books, error } = await supabase
    .from("books")
    .select("*, chapters(id)")
    .order("title");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  const result = books.map((b) => ({
    ...b,
    chapter_count: b.chapters?.length ?? 0,
    chapters: undefined,
  }));

  return NextResponse.json(result);
}
