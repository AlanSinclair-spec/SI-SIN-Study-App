import { NextResponse } from "next/server";
import { getQuizQuestions } from "@/data/content";

export async function POST(request: Request) {
  const body = await request.json() as {
    bookRef?: string;
    quizType?: string;
    questionCount?: number;
  };

  const { bookRef, quizType, questionCount = 10 } = body;

  const questions = getQuizQuestions({
    bookRef: bookRef || undefined,
    questionType: quizType === "mixed" ? undefined : quizType,
    limit: questionCount,
  });

  return NextResponse.json({
    questions,
  });
}
