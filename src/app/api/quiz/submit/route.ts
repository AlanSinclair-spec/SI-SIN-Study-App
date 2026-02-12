import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function POST(request: Request) {
  const { quizId, answers } = await request.json();

  if (!quizId || !answers || !Array.isArray(answers)) {
    return NextResponse.json(
      { error: "quizId and answers array required" },
      { status: 400 }
    );
  }

  const db = getDb();
  let correctCount = 0;

  const insertAnswer = db.prepare(
    `INSERT INTO quiz_answers (quiz_id, question_id, user_answer, is_correct)
     VALUES (?, ?, ?, ?)`
  );

  const getQuestion = db.prepare("SELECT * FROM quiz_questions WHERE id = ?");

  const results: Array<{
    questionId: number;
    userAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    explanation: string | null;
  }> = [];

  for (const answer of answers) {
    const question = getQuestion.get(answer.questionId) as {
      id: number;
      correct_answer: string;
      explanation: string | null;
    };

    if (!question) continue;

    const isCorrect =
      answer.userAnswer.trim().toLowerCase() ===
      question.correct_answer.trim().toLowerCase();

    if (isCorrect) correctCount++;

    insertAnswer.run(quizId, answer.questionId, answer.userAnswer, isCorrect ? 1 : 0);

    results.push({
      questionId: question.id,
      userAnswer: answer.userAnswer,
      correctAnswer: question.correct_answer,
      isCorrect,
      explanation: question.explanation,
    });
  }

  const score = answers.length > 0 ? (correctCount / answers.length) * 100 : 0;

  // Update quiz record
  db.prepare(
    `UPDATE quizzes SET score = ?, correct_count = ?, completed_at = datetime('now')
     WHERE id = ?`
  ).run(Math.round(score * 100) / 100, correctCount, quizId);

  return NextResponse.json({
    quizId,
    score: Math.round(score * 100) / 100,
    correctCount,
    totalQuestions: answers.length,
    results,
  });
}
