"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/contexts/user-context";
import { HelpCircle } from "lucide-react";

interface BookOption {
  id: number;
  title: string;
  slug: string;
}

export default function QuizConfigPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [books, setBooks] = useState<BookOption[]>([]);
  const [bookId, setBookId] = useState<string>("");
  const [quizType, setQuizType] = useState("mixed");
  const [questionCount, setQuestionCount] = useState(10);
  const [starting, setStarting] = useState(false);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then(setBooks);
  }, []);

  const startQuiz = async () => {
    if (!currentUser) return;
    setStarting(true);

    const res = await fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.id,
        bookId: bookId || undefined,
        quizType,
        count: questionCount,
      }),
    });

    const data = await res.json();
    // Store quiz data in sessionStorage for the quiz session page
    sessionStorage.setItem("activeQuiz", JSON.stringify(data));
    router.push("/quiz/session");
  };

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
            value={bookId}
            onChange={(e) => setBookId(e.target.value)}
            className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
          >
            <option value="">Both Books (Cross-Book)</option>
            {books.map((book) => (
              <option key={book.id} value={book.id}>
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
          disabled={starting || !currentUser}
          className="w-full px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors disabled:opacity-50"
        >
          {starting ? "Generating Quiz..." : "Start Quiz"}
        </button>
      </div>
    </div>
  );
}
