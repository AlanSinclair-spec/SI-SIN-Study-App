import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("bookId");
  const chapterId = searchParams.get("chapterId");

  const db = getDb();
  let query = `
    SELECT f.*, b.title as book_title, ch.title as chapter_title
    FROM flashcards f
    JOIN books b ON f.book_id = b.id
    LEFT JOIN chapters ch ON f.chapter_id = ch.id
    WHERE 1=1
  `;
  const params: (string | number)[] = [];

  if (bookId) {
    query += " AND f.book_id = ?";
    params.push(Number(bookId));
  }
  if (chapterId) {
    query += " AND f.chapter_id = ?";
    params.push(Number(chapterId));
  }

  query += " ORDER BY f.id";
  const flashcards = db.prepare(query).all(...params);
  return NextResponse.json(flashcards);
}
