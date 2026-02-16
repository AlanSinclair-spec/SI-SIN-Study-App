"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { HelpCircle } from "lucide-react";

interface BookOption {
  ref: string;
  title: string;
  slug: string;
}

export default function QuizConfigPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [books, setBooks] = useState<BookOption[]>([]);
  const [bookRef, setBookRef] = useState<string>("");
  const [quizType, setQuizType] = useState("mixed");
  const [questionCount, setQuestionCount] = useState(10);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then(setBooks);
  }, []);

  const startQuiz = async () => {
    if (!user) return;
    setStarting(true);

    const res = await fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        bookRef: bookRef || undefined,
        quizType,
        count: questionCount,
      }),
    });

    const data = await res.json();
    // The generate endpoint returns { questions }; add bookRef for submission
    const quizData = {
      ...data,
      quizId: `quiz-${Date.now()}`,
      bookRef: bookRef || "cross",
    };
    sessionStorage.setItem("activeQuiz", JSON.stringify(quizData));
    router.push("/quiz/session");
  };

  if (loading) {
    return (
      <div className="max-w-lg mx-auto space-y-6">
        <div className="h-12 w-12 bg-muted rounded-lg animate-pulse mx-auto" />
        <div className="h-8 w-48 bg-muted rounded animate-pulse mx-auto" />
        <div className="h-64 bg-muted rounded-lg animate-pulse" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Please sign in to take a quiz.</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      <div className="text-center">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mx-auto mb-3">
          <HelpCircle className="w-6 h-6 text-primary" />
        </div>
        <h1 className="text-2xl font-bold">Start a Quiz</h1>
        <p className="text-muted-foreground mt-1">
          Test your knowledge with multiple choice and short answer questions.
        </p>
      </div>

      <div className="space-y-4 rounded-lg border border-border bg-card p-6">
        {/* Book selection */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Book</label>
          <select
            value={bookRef}
            onChange={(e) => setBookRef(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Both Books (Cross-Book)</option>
            {books.map((book) => (
              <option key={book.ref} value={book.ref}>
                {book.title}
              </option>
            ))}
          </select>
        </div>

        {/* Quiz type */}
        <div className="space-y-2">
          <label className="text-sm font-medium">Question Type</label>
          <select
            value={quizType}
            onChange={(e) => setQuizType(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="mixed">Mixed</option>
            <option value="multiple_choice">Multiple Choice Only</option>
            <option value="short_answer">Short Answer Only</option>
          </select>
        </div>

        {/* Question count */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            Number of Questions: {questionCount}
          </label>
          <input
            type="range"
            min="5"
            max="20"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>5</span>
            <span>20</span>
          </div>
        </div>

        <button
          onClick={startQuiz}
          disabled={starting}
          className="w-full px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {starting ? "Generating Quiz..." : "Start Quiz"}
        </button>
      </div>
    </div>
  );
}
