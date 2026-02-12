import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string }> }
) {
  const { bookId } = await params;
  const db = getDb();

  const book = db.prepare("SELECT * FROM books WHERE id = ? OR slug = ?").get(bookId, bookId);
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }

  const chapters = db
    .prepare(
      `SELECT c.*,
        (SELECT COUNT(*) FROM concepts WHERE chapter_id = c.id) as concept_count
       FROM chapters c WHERE c.book_id = ? ORDER BY c.number`
    )
    .all((book as { id: number }).id);

  return NextResponse.json({ ...book, chapters });
}
