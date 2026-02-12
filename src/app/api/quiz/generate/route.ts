import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const { userId, bookId, chapterId, quizType, count = 10 } = await request.json();

  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  const db = getDb();

  // Build query based on filters
  let query = "SELECT * FROM quiz_questions WHERE 1=1";
  const params: (string | number)[] = [];

  if (bookId) {
    query += " AND book_id = ?";
    params.push(Number(bookId));
  }
  if (chapterId) {
    query += " AND chapter_id = ?";
    params.push(Number(chapterId));
  }
  if (quizType === "multiple_choice") {
    query += " AND question_type = 'multiple_choice'";
  } else if (quizType === "short_answer") {
    query += " AND question_type = 'short_answer'";
  }

  query += " ORDER BY RANDOM() LIMIT ?";
  params.push(Number(count));

  const questions = db.prepare(query).all(...params);

  // Create quiz record
  const quizResult = db
    .prepare(
      `INSERT INTO quizzes (user_id, book_id, chapter_id, quiz_type, total_questions)
       VALUES (?, ?, ?, ?, ?)`
    )
    .run(
      Number(userId),
      bookId ? Number(bookId) : null,
      chapterId ? Number(chapterId) : null,
      quizType || "mixed",
      questions.length
    );

  return NextResponse.json({
    quizId: quizResult.lastInsertRowid,
    questions,
  });
}
