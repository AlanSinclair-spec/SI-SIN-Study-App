import { NextResponse } from "next/server";
import { searchContent } from "@/data/content";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface SearchResult {
  type: string;
  title: string;
  text: string;
  bookRef?: string;
  chapterRef?: string;
  book?: string;
  chapter?: number;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");

  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  // Search static content (concepts, quotes, flashcards)
  const contentResults: SearchResult[] = searchContent(q).map((r) => ({
    type: r.type,
    title: r.title,
    text: r.text,
    bookRef: r.bookRef,
    chapterRef: r.chapterRef,
  }));

  // Optionally search user's notes and highlights if authenticated
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const searchPattern = `%${q}%`;

      // Search notes
      const { data: notes } = await supabase
        .from("notes")
        .select("content, book, chapter, tags")
        .eq("user_id", user.id)
        .ilike("content", searchPattern)
        .limit(10);

      for (const note of notes ?? []) {
        contentResults.push({
          type: "note",
          title: `Note - ${note.book} Ch.${note.chapter}`,
          text: note.content,
          book: note.book,
          chapter: note.chapter,
        });
      }

      // Search highlights
      const { data: highlights } = await supabase
        .from("highlights")
        .select("highlighted_text, note, book, chapter")
        .eq("user_id", user.id)
        .ilike("highlighted_text", searchPattern)
        .limit(10);

      for (const highlight of highlights ?? []) {
        contentResults.push({
          type: "highlight",
          title: `Highlight - ${highlight.book} Ch.${highlight.chapter}`,
          text: highlight.highlighted_text,
          book: highlight.book,
          chapter: highlight.chapter,
        });
      }
    }
  } catch {
    // Not authenticated or Supabase unavailable -- just return static results
  }

  return NextResponse.json(contentResults.slice(0, 20));
}
