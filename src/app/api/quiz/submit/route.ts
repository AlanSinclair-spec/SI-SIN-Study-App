import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface SubmittedAnswer {
  questionId: string;
  userAnswer: string;
  isCorrect: boolean;
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json() as {
    book?: string;
    chapter?: number;
    questions?: SubmittedAnswer[];
  };

  const { book, chapter, questions } = body;

  if (!book || !questions || !Array.isArray(questions)) {
    return NextResponse.json(
      { error: "book and questions array are required" },
      { status: 400 }
    );
  }

  const correctCount = questions.filter((q) => q.isCorrect).length;
  const totalQuestions = questions.length;
  const score = totalQuestions > 0
    ? Math.round((correctCount / totalQuestions) * 10000) / 100
    : 0;

  const { data: result, error: insertError } = await supabase
    .from("quiz_results")
    .insert({
      user_id: user.id,
      book,
      chapter: chapter ?? null,
      score,
      total_questions: totalQuestions,
      answers: questions.map((q) => ({
        questionId: q.questionId,
        userAnswer: q.userAnswer,
        isCorrect: q.isCorrect,
      })),
      completed_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError) {
    return NextResponse.json(
      { error: "Failed to save quiz results" },
      { status: 500 }
    );
  }

  return NextResponse.json({
    quizId: result.id,
    score,
    correctCount,
    totalQuestions,
    results: questions,
  });
}
