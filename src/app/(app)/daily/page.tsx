"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/contexts/user-context";
import { useRouter } from "next/navigation";
import {
  Zap,
  Layers,
  HelpCircle,
  MessageSquare,
  Check,
  ChevronRight,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { RATING_LABELS } from "@/lib/sm2";

type Step = "flashcards" | "quiz" | "tutor";

interface FlashcardData {
  id: number;
  front: string;
  back: string;
  book_title: string;
  chapter_title: string;
}

export default function DailySessionPage() {
  const { currentUser } = useUser();
  const router = useRouter();
  const [sessionId, setSessionId] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState<Step>("flashcards");
  const [started, setStarted] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedMinutes, setElapsedMinutes] = useState(0);

  // Flashcard state
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [flashcardsComplete, setFlashcardsComplete] = useState(false);
  const [flashcardsReviewed, setFlashcardsReviewed] = useState(0);

  // Quiz state
  const [quizData, setQuizData] = useState<{ quizId: number; questions: Array<{
    id: number; question_type: string; question_text: string; correct_answer: string;
    option_a: string; option_b: string; option_c: string; option_d: string;
  }> } | null>(null);
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizAnswers, setQuizAnswers] = useState<Array<{ questionId: number; userAnswer: string }>>([]);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizScore, setQuizScore] = useState<number | null>(null);

  // Tutor state
  const [tutorMessages, setTutorMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [tutorInput, setTutorInput] = useState("");
  const [tutorStreaming, setTutorStreaming] = useState(false);
  const [tutorExchanges, setTutorExchanges] = useState(0);
  const [tutorComplete, setTutorComplete] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);

  // Timer
  useEffect(() => {
    if (!startTime) return;
    const interval = setInterval(() => {
      setElapsedMinutes(Math.floor((Date.now() - startTime) / 60000));
    }, 10000);
    return () => clearInterval(interval);
  }, [startTime]);

  const startSession = async () => {
    if (!currentUser) return;
    const res = await fetch("/api/daily", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id, action: "start" }),
    });
    const session = await res.json();
    setSessionId(session.id);
    setStarted(true);
    setStartTime(Date.now());

    // Load flashcards
    const cardsRes = await fetch(`/api/flashcards/due?userId=${currentUser.id}&limit=15`);
    const dueCards = await cardsRes.json();
    setCards(dueCards);
    if (dueCards.length === 0) {
      setFlashcardsComplete(true);
      setCurrentStep("quiz");
      loadQuiz();
    }
  };

  const loadQuiz = async () => {
    if (!currentUser) return;
    const res = await fetch("/api/quiz/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.id,
        quizType: "mixed",
        count: 8,
      }),
    });
    const data = await res.json();
    setQuizData(data);
  };

  const handleFlashcardRate = async (quality: number) => {
    if (!currentUser || !cards[cardIndex]) return;
    await fetch("/api/flashcards/review", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        userId: currentUser.id,
        flashcardId: cards[cardIndex].id,
        quality,
      }),
    });
    setFlashcardsReviewed((p) => p + 1);
    if (cardIndex < cards.length - 1) {
      setCardIndex((p) => p + 1);
      setIsFlipped(false);
    } else {
      setFlashcardsComplete(true);
      setCurrentStep("quiz");
      loadQuiz();
    }
  };

  const handleQuizAnswer = () => {
    if (!quizData || !quizAnswer) return;
    const currentQ = quizData.questions[quizIndex];
    const newAnswers = [...quizAnswers, { questionId: currentQ.id, userAnswer: quizAnswer }];
    setQuizAnswers(newAnswers);
    setQuizAnswer("");

    if (quizIndex < quizData.questions.length - 1) {
      setQuizIndex((p) => p + 1);
    } else {
      finishQuiz(newAnswers);
    }
  };

  const finishQuiz = async (answers: Array<{ questionId: number; userAnswer: string }>) => {
    if (!quizData) return;
    const res = await fetch("/api/quiz/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ quizId: quizData.quizId, answers }),
    });
    const data = await res.json();
    setQuizScore(data.score);
    setQuizComplete(true);
    setCurrentStep("tutor");
  };

  const sendTutorMessage = async (content: string) => {
    if (!content.trim() || !currentUser || tutorStreaming) return;
    setTutorInput("");
    setTutorStreaming(true);
    setTutorMessages((prev) => [...prev, { role: "user", content: content.trim() }]);

    try {
      const res = await fetch("/api/tutor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser.id,
          conversationId,
          message: content.trim(),
          difficulty: "intermediate",
        }),
      });

      const reader = res.body?.getReader();
      if (!reader) return;
      const decoder = new TextDecoder();
      let assistantContent = "";
      setTutorMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        for (const line of chunk.split("\n")) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.text) {
                assistantContent += data.text;
                setTutorMessages((prev) => {
                  const updated = [...prev];
                  updated[updated.length - 1] = { role: "assistant", content: assistantContent };
                  return updated;
                });
              }
              if (data.conversationId) setConversationId(data.conversationId);
            } catch {}
          }
        }
      }
      setTutorExchanges((p) => p + 1);
    } catch {}
    setTutorStreaming(false);
  };

  const completeSession = async () => {
    if (sessionId) {
      await fetch("/api/daily", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: currentUser?.id,
          action: "complete",
          sessionId,
        }),
      });
    }
    router.push("/dashboard");
  };

  const steps = [
    { key: "flashcards" as const, label: "Flashcards", icon: Layers, complete: flashcardsComplete },
    { key: "quiz" as const, label: "Quiz", icon: HelpCircle, complete: quizComplete },
    { key: "tutor" as const, label: "AI Tutor", icon: MessageSquare, complete: tutorComplete },
  ];

  if (!started) {
    return (
      <div className="max-w-lg mx-auto mt-8 text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
          <Zap className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold">Daily Study Session</h1>
          <p className="text-muted-foreground mt-2">
            A focused 15-20 minute session mixing flashcard review, a quick quiz,
            and an AI tutor conversation.
          </p>
        </div>
        <div className="space-y-3 text-left rounded-lg border border-border bg-card p-5">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                {i + 1}
              </span>
              <step.icon className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm">{step.label}</span>
            </div>
          ))}
        </div>
        <button
          onClick={startSession}
          disabled={!currentUser}
          className="w-full px-4 py-3 rounded-md bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 inline-flex items-center justify-center gap-2"
        >
          <Zap className="w-5 h-5" />
          Start Session
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-4">
      {/* Step indicator */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          {steps.map((step, i) => (
            <div key={step.key} className="flex items-center">
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                  step.complete
                    ? "bg-green-500/20 text-green-400"
                    : currentStep === step.key
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                )}
              >
                {step.complete ? <Check className="w-4 h-4" /> : i + 1}
              </div>
              {i < steps.length - 1 && (
                <div className={cn("w-8 h-0.5 mx-1", step.complete ? "bg-green-500/50" : "bg-muted")} />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3.5 h-3.5" />
          {elapsedMinutes}m
        </div>
      </div>

      {/* Step content */}
      {currentStep === "flashcards" && !flashcardsComplete && cards.length > 0 && (
        <div className="space-y-4">
          <h2 className="font-semibold">Flashcard Review ({cardIndex + 1}/{cards.length})</h2>
          <div
            className="flip-card cursor-pointer min-h-[200px]"
            onClick={() => !isFlipped && setIsFlipped(true)}
          >
            <div className={cn("flip-card-inner relative w-full min-h-[200px]", isFlipped && "flipped")}>
              <div className="flip-card-front absolute inset-0 rounded-lg border border-border bg-card p-5 flex flex-col justify-between">
                <p className="text-base font-medium">{cards[cardIndex]?.front}</p>
                <p className="text-xs text-muted-foreground text-center">Tap to reveal</p>
              </div>
              <div className="flip-card-back absolute inset-0 rounded-lg border border-primary/30 bg-card p-5">
                <p className="text-xs text-primary mb-2 uppercase font-medium">Answer</p>
                <p className="text-sm">{cards[cardIndex]?.back}</p>
              </div>
            </div>
          </div>
          {isFlipped && (
            <div className="grid grid-cols-6 gap-2">
              {[0, 1, 2, 3, 4, 5].map((q) => (
                <button
                  key={q}
                  onClick={() => handleFlashcardRate(q)}
                  className={cn("p-2 rounded-md border border-border hover:bg-accent text-center", RATING_LABELS[q].color)}
                >
                  <span className="text-lg font-bold">{q}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {currentStep === "quiz" && !quizComplete && quizData && (
        <div className="space-y-4">
          <h2 className="font-semibold">Quick Quiz ({quizIndex + 1}/{quizData.questions.length})</h2>
          <div className="rounded-lg border border-border bg-card p-5">
            <p className="font-medium">{quizData.questions[quizIndex]?.question_text}</p>
          </div>
          {quizData.questions[quizIndex]?.question_type === "multiple_choice" ? (
            <div className="space-y-2">
              {["option_a", "option_b", "option_c", "option_d"].map((key) => {
                const val = quizData.questions[quizIndex]?.[key as keyof typeof quizData.questions[0]] as string;
                if (!val) return null;
                return (
                  <button
                    key={key}
                    onClick={() => setQuizAnswer(val)}
                    className={cn(
                      "w-full text-left p-3 rounded-lg border text-sm transition-colors",
                      quizAnswer === val ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                    )}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          ) : (
            <textarea
              value={quizAnswer}
              onChange={(e) => setQuizAnswer(e.target.value)}
              placeholder="Your answer..."
              rows={2}
              className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
            />
          )}
          <button
            onClick={handleQuizAnswer}
            disabled={!quizAnswer}
            className="w-full px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50 inline-flex items-center justify-center gap-2"
          >
            {quizIndex === quizData.questions.length - 1 ? "Finish Quiz" : "Next"} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {currentStep === "tutor" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">AI Tutor ({tutorExchanges}/3 exchanges)</h2>
            {tutorExchanges >= 3 && (
              <button
                onClick={() => { setTutorComplete(true); completeSession(); }}
                className="text-xs text-primary hover:underline"
              >
                Finish Session
              </button>
            )}
          </div>
          <div className="rounded-lg border border-border bg-card p-4 max-h-64 overflow-y-auto space-y-3">
            {tutorMessages.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                Start a conversation about something from today&apos;s review.
              </p>
            )}
            {tutorMessages.map((msg, i) => (
              <div key={i} className={cn("text-sm rounded-md px-3 py-2", msg.role === "user" ? "bg-primary text-primary-foreground ml-8" : "bg-muted mr-8")}>
                {msg.content}
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              value={tutorInput}
              onChange={(e) => setTutorInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") sendTutorMessage(tutorInput); }}
              placeholder="Ask or answer..."
              className="flex-1 px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring"
            />
            <button
              onClick={() => sendTutorMessage(tutorInput)}
              disabled={!tutorInput.trim() || tutorStreaming}
              className="px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {/* Completion between steps */}
      {currentStep === "quiz" && !quizData && (
        <div className="text-center py-8">
          <div className="w-8 h-8 bg-muted rounded animate-pulse mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Loading quiz...</p>
        </div>
      )}

      {quizComplete && currentStep === "quiz" && (
        <div className="text-center space-y-3">
          <Check className="w-8 h-8 text-green-400 mx-auto" />
          <p className="font-medium">Quiz done! Score: {Math.round(quizScore || 0)}%</p>
          <button
            onClick={() => setCurrentStep("tutor")}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm"
          >
            Continue to AI Tutor <ChevronRight className="w-4 h-4 inline ml-1" />
          </button>
        </div>
      )}
    </div>
  );
}
