import { NextResponse } from "next/server";
import { createServerSupabaseClient } from "@/lib/supabase-server";

interface SubmitAnswer {
  questionId: string;
  userAnswer: string;
}

export async function POST(request: Request) {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const { answers, bookId } = body as { answers: SubmitAnswer[]; bookId?: string };

  if (!answers || answers.length === 0) {
    return NextResponse.json({ error: "answers required" }, { status: 400 });
  }

  // Fetch the questions to check answers
  const questionIds = answers.map((a) => a.questionId);
  const { data: questions, error: qError } = await supabase
    .from("quiz_questions")
    .select("*")
    .in("id", questionIds);

  if (qError || !questions) {
    return NextResponse.json({ error: "Failed to fetch questions" }, { status: 500 });
  }

  const questionMap = new Map(questions.map((q) => [q.id, q]));
  let correctCount = 0;
  const detailedAnswers = answers.map((a) => {
    const q = questionMap.get(a.questionId);
    const isCorrect = q
      ? q.correct_answer.toLowerCase().trim() === a.userAnswer.toLowerCase().trim()
      : false;
    if (isCorrect) correctCount++;
    return {
      question_id: a.questionId,
      question_text: q?.question_text ?? "",
      user_answer: a.userAnswer,
      correct_answer: q?.correct_answer ?? "",
      is_correct: isCorrect,
      explanation: q?.explanation ?? null,
    };
  });

  const score = Math.round((correctCount / answers.length) * 100);

  // Get book name for the result
  let bookName = "mixed";
  if (bookId) {
    const { data: book } = await supabase.from("books").select("slug").eq("id", bookId).single();
    bookName = book?.slug ?? "mixed";
  }

  // Save result
  const { data: result, error: insertError } = await supabase
    .from("quiz_results")
    .insert({
      user_id: user.id,
      book: bookName,
      chapter: null,
      score,
      total_questions: answers.length,
      answers: detailedAnswers,
    })
    .select()
    .single();

  if (insertError) return NextResponse.json({ error: insertError.message }, { status: 500 });

  return NextResponse.json({
    id: result.id,
    score,
    total_questions: answers.length,
    correct_count: correctCount,
    answers: detailedAnswers,
  });
}
