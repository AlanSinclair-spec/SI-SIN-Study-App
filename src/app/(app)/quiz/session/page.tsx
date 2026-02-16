"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { ArrowLeft, Check, X, ChevronRight } from "lucide-react";
import Link from "next/link";

interface Question {
  id: string;
  questionType: "multiple_choice" | "short_answer";
  questionText: string;
  correctAnswer: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  explanation: string;
  difficulty: string;
  // Legacy field names (from old API) - support both formats
  question_type?: string;
  question_text?: string;
  correct_answer?: string;
  option_a?: string;
  option_b?: string;
  option_c?: string;
  option_d?: string;
}

interface QuizData {
  quizId: string;
  bookRef?: string;
  questions: Question[];
}

interface SubmitResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string | null;
}

function getQuestionType(q: Question): "multiple_choice" | "short_answer" {
  return q.questionType || (q.question_type as "multiple_choice" | "short_answer") || "multiple_choice";
}

function getQuestionText(q: Question): string {
  return q.questionText || q.question_text || "";
}

function getCorrectAnswer(q: Question): string {
  return q.correctAnswer || q.correct_answer || "";
}

function getOptions(q: Question): Array<{ key: string; value: string }> {
  const opts = [
    { key: "A", value: q.optionA || q.option_a || "" },
    { key: "B", value: q.optionB || q.option_b || "" },
    { key: "C", value: q.optionC || q.option_c || "" },
    { key: "D", value: q.optionD || q.option_d || "" },
  ];
  return opts.filter((o) => o.value);
}

export default function QuizSessionPage() {
  const router = useRouter();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [shortAnswer, setShortAnswer] = useState("");
  const [results, setResults] = useState<SubmitResult[] | null>(null);
  const [score, setScore] = useState<{ score: number; correctCount: number; totalQuestions: number } | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("activeQuiz");
    if (stored) {
      setQuiz(JSON.parse(stored));
    } else {
      router.push("/quiz");
    }
  }, [router]);

  if (!quiz) return null;

  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;
  const qType = getQuestionType(currentQuestion);
  const qText = getQuestionText(currentQuestion);

  const submitAnswer = () => {
    const answer = qType === "multiple_choice" ? selectedOption : shortAnswer;
    if (!answer) return;

    setAnswers((prev) => ({ ...prev, [currentQuestion.id]: answer }));

    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedOption("");
      setShortAnswer("");
    }
  };

  const finishQuiz = async () => {
    // Submit final answer
    const finalAnswers = {
      ...answers,
      [currentQuestion.id]: qType === "multiple_choice" ? selectedOption : shortAnswer,
    };

    // Build submission with isCorrect computed client-side
    const questionsWithAnswers = quiz.questions.map((q) => {
      const userAnswer = finalAnswers[q.id] || "";
      const correctAns = getCorrectAnswer(q);
      const isCorrect = userAnswer.trim().toLowerCase() === correctAns.trim().toLowerCase();
      return {
        questionId: q.id,
        userAnswer,
        isCorrect,
      };
    });

    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        book: quiz.bookRef || "cross",
        questions: questionsWithAnswers,
      }),
    });

    const data = await res.json();

    // Build results for display from the submission
    const displayResults: SubmitResult[] = quiz.questions.map((q) => {
      const userAnswer = finalAnswers[q.id] || "";
      const correctAns = getCorrectAnswer(q);
      const isCorrect = userAnswer.trim().toLowerCase() === correctAns.trim().toLowerCase();
      return {
        questionId: q.id,
        userAnswer,
        correctAnswer: correctAns,
        isCorrect,
        explanation: q.explanation || null,
      };
    });

    const correctCount = displayResults.filter((r) => r.isCorrect).length;
    const totalQ = displayResults.length;
    const computedScore = totalQ > 0 ? (correctCount / totalQ) * 100 : 0;

    setResults(data.results || displayResults);
    setScore({
      score: data.score ?? computedScore,
      correctCount: data.correctCount ?? correctCount,
      totalQuestions: data.totalQuestions ?? totalQ,
    });
    sessionStorage.removeItem("activeQuiz");
  };

  // Results view
  if (results && score) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Quiz Results</h2>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold">{Math.round(score.score)}%</p>
              <p className="text-sm text-muted-foreground">Score</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-green-400">{score.correctCount}</p>
              <p className="text-sm text-muted-foreground">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold text-red-400">
                {score.totalQuestions - score.correctCount}
              </p>
              <p className="text-sm text-muted-foreground">Wrong</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {results.map((result, i) => {
            const question = quiz.questions.find((q) => q.id === result.questionId);
            return (
              <div
                key={i}
                className={cn(
                  "rounded-lg border p-4",
                  result.isCorrect
                    ? "border-green-500/30 bg-green-500/5"
                    : "border-red-500/30 bg-red-500/5"
                )}
              >
                <div className="flex items-start gap-2">
                  {result.isCorrect ? (
                    <Check className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                  ) : (
                    <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      {question ? getQuestionText(question) : ""}
                    </p>
                    {!result.isCorrect && (
                      <div className="mt-2 text-sm">
                        <p className="text-red-400">
                          Your answer: {result.userAnswer}
                        </p>
                        <p className="text-green-400">
                          Correct: {result.correctAnswer}
                        </p>
                      </div>
                    )}
                    {result.explanation && (
                      <p className="mt-2 text-xs text-muted-foreground">
                        {result.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/quiz"
            className="px-4 py-2 rounded-md border border-border text-sm hover:bg-accent transition-colors"
          >
            New Quiz
          </Link>
          <Link
            href="/dashboard"
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const options = qType === "multiple_choice" ? getOptions(currentQuestion) : [];

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link
          href="/quiz"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit
        </Link>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {quiz.questions.length}
        </span>
      </div>

      {/* Progress */}
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{
            width: `${((currentIndex + 1) / quiz.questions.length) * 100}%`,
          }}
        />
      </div>

      {/* Question */}
      <div className="rounded-lg border border-border bg-card p-6">
        <span
          className={cn(
            "text-[10px] uppercase font-medium px-2 py-0.5 rounded",
            currentQuestion.difficulty === "beginner" && "bg-green-500/20 text-green-400",
            currentQuestion.difficulty === "intermediate" && "bg-yellow-500/20 text-yellow-400",
            currentQuestion.difficulty === "advanced" && "bg-red-500/20 text-red-400"
          )}
        >
          {currentQuestion.difficulty}
        </span>
        <p className="text-lg font-medium mt-3">{qText}</p>
      </div>

      {/* Answer input */}
      {qType === "multiple_choice" ? (
        <div className="space-y-2">
          {options.map((opt) => (
            <button
              key={opt.key}
              onClick={() => setSelectedOption(opt.value)}
              className={cn(
                "w-full text-left p-3 rounded-lg border transition-colors flex items-center gap-3",
                selectedOption === opt.value
                  ? "border-primary bg-primary/10"
                  : "border-border hover:border-primary/50"
              )}
            >
              <span
                className={cn(
                  "w-7 h-7 rounded-full flex items-center justify-center text-sm font-medium flex-shrink-0",
                  selectedOption === opt.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {opt.key}
              </span>
              <span className="text-sm">{opt.value}</span>
            </button>
          ))}
        </div>
      ) : (
        <textarea
          value={shortAnswer}
          onChange={(e) => setShortAnswer(e.target.value)}
          placeholder="Type your answer..."
          rows={3}
          className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
        />
      )}

      {/* Submit button */}
      <button
        onClick={isLastQuestion ? finishQuiz : submitAnswer}
        disabled={qType === "multiple_choice" ? !selectedOption : !shortAnswer.trim()}
        className="w-full px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
      >
        {isLastQuestion ? "Finish Quiz" : "Next Question"}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}
