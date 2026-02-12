import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q");
  if (!q || q.length < 2) {
    return NextResponse.json([]);
  }

  const db = getDb();
  const term = `%${q}%`;

  const results = db
    .prepare(
      `SELECT 'concept' as type, c.id, c.title, c.description, ch.title as chapter_title, b.title as book_title
       FROM concepts c
       JOIN chapters ch ON c.chapter_id = ch.id
       JOIN books b ON ch.book_id = b.id
       WHERE c.title LIKE ?1 OR c.description LIKE ?1

       UNION ALL

       SELECT 'flashcard' as type, f.id, f.front as title, f.back as description,
              COALESCE(ch.title, '') as chapter_title, b.title as book_title
       FROM flashcards f
       JOIN books b ON f.book_id = b.id
       LEFT JOIN chapters ch ON f.chapter_id = ch.id
       WHERE f.front LIKE ?1 OR f.back LIKE ?1

       UNION ALL

       SELECT 'quote' as type, q.id, SUBSTR(q.text, 1, 80) as title, q.text as description,
              ch.title as chapter_title, b.title as book_title
       FROM quotes q
       JOIN chapters ch ON q.chapter_id = ch.id
       JOIN books b ON ch.book_id = b.id
       WHERE q.text LIKE ?1

       LIMIT 20`
    )
    .all(term);

  return NextResponse.json(results);
}
