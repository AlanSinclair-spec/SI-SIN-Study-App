import { NextResponse } from "next/server";
import { getChapter } from "@/data/content";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ bookId: string; chapterId: string }> }
) {
  const { bookId, chapterId } = await params;
  const chapter = getChapter(bookId, chapterId);

  if (!chapter) {
    return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
  }

  return NextResponse.json(chapter);
}
