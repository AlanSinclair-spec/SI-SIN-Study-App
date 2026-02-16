import { NextResponse } from "next/server";
import { getAllFlashcards, getFlashcardsByBook } from "@/data/content";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookRef = searchParams.get("bookId") || searchParams.get("bookRef");

  if (bookRef) {
    const flashcards = getFlashcardsByBook(bookRef);
    return NextResponse.json(flashcards);
  }

  const flashcards = getAllFlashcards();
  return NextResponse.json(flashcards);
}
