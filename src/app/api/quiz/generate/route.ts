import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { bookId, chapterId, quizType, count = 10 } = body as {
    bookId?: string;
    chapterId?: string;
    quizType?: string;
    count?: number;
  };

  let query = supabase.from("quiz_questions").select("*");

  if (bookId) query = query.eq("book_id", bookId);
  if (chapterId) query = query.eq("chapter_id", chapterId);
  if (quizType === "multiple_choice") query = query.eq("question_type", "multiple_choice");
  if (quizType === "short_answer") query = query.eq("question_type", "short_answer");

  const { data: questions, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  if (!questions || questions.length === 0) {
    return NextResponse.json({ error: "No questions available" }, { status: 404 });
  }

  // Shuffle and limit
  const shuffled = questions.sort(() => Math.random() - 0.5).slice(0, count);

  return NextResponse.json({ questions: shuffled });
}
