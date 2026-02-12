import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string; chapterId: string }> }
) {
  const { bookId, chapterId } = await params;
  const db = getDb();

  const book = db.prepare("SELECT * FROM books WHERE id = ? OR slug = ?").get(bookId, bookId) as { id: number; title: string; slug: string } | undefined;
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const chapter = db
    .prepare("SELECT * FROM chapters WHERE (id = ? OR slug = ?) AND book_id = ?")
    .get(chapterId, chapterId, book.id) as { id: number } | undefined;
  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  const concepts = db
    .prepare("SELECT * FROM concepts WHERE chapter_id = ? ORDER BY importance = 'core' DESC, id")
    .all(chapter.id) as Array<{ id: number }>;

  // Fetch arguments for each concept
  const conceptsWithArgs = concepts.map((concept) => {
    const args = db
      .prepare("SELECT * FROM arguments WHERE concept_id = ?")
      .all(concept.id);
    return { ...concept, arguments: args };
  });

  const quotes = db
    .prepare("SELECT * FROM quotes WHERE chapter_id = ? ORDER BY id")
    .all(chapter.id);

  return NextResponse.json({
    ...chapter,
    book_title: book.title,
    book_slug: book.slug,
    concepts: conceptsWithArgs,
    quotes,
  });
}
