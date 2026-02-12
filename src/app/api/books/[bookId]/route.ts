import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(_request: Request, { params }: { params: Promise<{ bookId: string }> }) {
  const { bookId } = await params;
  const supabase = await createServerSupabaseClient();

  const { data: book, error } = await supabase
    .from("books")
    .select("*, chapters(*)")
    .or(`id.eq.${bookId},slug.eq.${bookId}`)
    .single();

  if (error || !book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

  return NextResponse.json({
    ...book,
    chapters: book.chapters?.sort((a: { number: number }, b: { number: number }) => a.number - b.number) ?? [],
    chapter_count: book.chapters?.length ?? 0,
  });
}
