import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface SearchResult {
  id: string;
  type: string;
  title: string;
  snippet: string;
  book: string;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q || q.length < 2) return NextResponse.json([]);

  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  const pattern = `%${q}%`;

  // Search concepts
  const { data: concepts } = await supabase
    .from("concepts")
    .select("id, title, description, chapters(title, books(title))")
    .or(`title.ilike.${pattern},description.ilike.${pattern}`)
    .limit(5);

  // Search flashcards
  const { data: flashcards } = await supabase
    .from("flashcards")
    .select("id, front, back, books(title)")
    .or(`front.ilike.${pattern},back.ilike.${pattern}`)
    .limit(5);

  // Search quotes
  const { data: quotes } = await supabase
    .from("quotes")
    .select("id, text, context, chapters(title, books(title))")
    .ilike("text", pattern)
    .limit(5);

  const results: SearchResult[] = [];

  concepts?.forEach((c) => {
    const ch = c.chapters as unknown as { title: string; books: { title: string } | null } | null;
    results.push({
      id: c.id,
      type: "concept",
      title: c.title as string,
      snippet: (c.description as string).slice(0, 120),
      book: ch?.books?.title ?? "",
    });
  });

  flashcards?.forEach((f) => {
    results.push({
      id: f.id,
      type: "flashcard",
      title: (f.front as string).slice(0, 60),
      snippet: (f.back as string).slice(0, 120),
      book: (f.books as unknown as { title: string } | null)?.title ?? "",
    });
  });

  quotes?.forEach((qt) => {
    const ch = qt.chapters as unknown as { title: string; books: { title: string } | null } | null;
    results.push({
      id: qt.id,
      type: "quote",
      title: (qt.text as string).slice(0, 60),
      snippet: (qt.context as string | null) ?? (qt.text as string).slice(0, 120),
      book: ch?.books?.title ?? "",
    });
  });

  // Search user notes if authenticated
  if (user) {
    const { data: notes } = await supabase
      .from("notes")
      .select("id, content, book, chapter")
      .eq("user_id", user.id)
      .ilike("content", pattern)
      .limit(5);

    notes?.forEach((n) => {
      results.push({
        id: n.id,
        type: "note",
        title: `Note — ${n.book} Ch.${n.chapter}`,
        snippet: n.content.slice(0, 120),
        book: n.book,
      });
    });

    const { data: highlights } = await supabase
      .from("highlights")
      .select("id, highlighted_text, book, chapter")
      .eq("user_id", user.id)
      .ilike("highlighted_text", pattern)
      .limit(5);

    highlights?.forEach((h) => {
      results.push({
        id: h.id,
        type: "highlight",
        title: `Highlight — ${h.book} Ch.${h.chapter}`,
        snippet: h.highlighted_text.slice(0, 120),
        book: h.book,
      });
    });
  }

  return NextResponse.json(results);
}
