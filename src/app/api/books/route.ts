import { NextResponse } from "next/server";
import { getBooks, getChaptersByBook } from "@/data/content";

export async function GET() {
  const books = getBooks();
  const booksWithChapterCount = books.map((book) => ({
    ...book,
    chapter_count: getChaptersByBook(book.ref).length,
  }));
  return NextResponse.json(booksWithChapterCount);
}
