import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  const books = db
    .prepare(
      `SELECT b.*,
        (SELECT COUNT(*) FROM chapters WHERE book_id = b.id) as chapter_count
       FROM books b ORDER BY b.id`
    )
    .all();
  return NextResponse.json(books);
}
