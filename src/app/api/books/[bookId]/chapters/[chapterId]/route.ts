import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string; chapterId: string }> }
) {
  const { bookId, chapterId } = await params;
  const supabase = await createServerSupabaseClient();

  // Get book
  const { data: book } = await supabase
    .from("books")
    .select("id, title, slug")
    .or(`id.eq.${bookId},slug.eq.${bookId}`)
    .single();

  if (!book) return NextResponse.json({ error: "Book not found" }, { status: 404 });

  // Get chapter with concepts (with arguments) and quotes
  const { data: chapter, error } = await supabase
    .from("chapters")
    .select("*, concepts(*, arguments(*)), quotes(*)")
    .eq("book_id", book.id)
    .or(`id.eq.${chapterId},slug.eq.${chapterId}`)
    .single();

  if (error || !chapter) return NextResponse.json({ error: "Chapter not found" }, { status: 404 });

  return NextResponse.json({
    ...chapter,
    book_title: book.title,
    book_slug: book.slug,
  });
}
