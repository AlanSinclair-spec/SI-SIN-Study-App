"use client";

import { useEffect, useState, useCallback } from "react";
import { useUser } from "@/contexts/user-context";
import { cn } from "@/lib/utils";
import { RATING_LABELS } from "@/lib/sm2";
import { ArrowLeft, RotateCcw, Check } from "lucide-react";
import Link from "next/link";

interface FlashcardData {
  id: string;
  front: string;
  back: string;
  difficulty: string;
  bookTitle: string;
  chapterTitle: string;
  tags: string[];
}

interface ReviewResult {
  cardId: string;
  quality: number;
}

export default function FlashcardReviewPage() {
  const { user, loading: authLoading } = useUser();
  const [cards, setCards] = useState<FlashcardData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [results, setResults] = useState<ReviewResult[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    fetch("/api/flashcards/due?limit=20")
      .then((r) => r.json())
      .then((data: FlashcardData[]) => {
        setCards(data);
        setLoading(false);
      });
  }, [user]);

  const currentCard = cards[currentIndex];

  const handleRate = useCallback(
    async (quality: number) => {
      if (!user || !currentCard) return;

      // Submit review
      await fetch("/api/flashcards/review", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          flashcardId: currentCard.id,
          quality,
        }),
      });

      setResults((prev) => [...prev, { cardId: currentCard.id, quality }]);

      if (currentIndex < cards.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsFlipped(false);
      } else {
        setIsComplete(true);
      }
    },
    [user, currentCard, currentIndex, cards.length]
  );

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === " " || e.key === "Enter") {
        e.preventDefault();
        if (!isFlipped) setIsFlipped(true);
      }
      if (isFlipped && e.key >= "0" && e.key <= "5") {
        handleRate(Number(e.key));
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [isFlipped, handleRate]);

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-12 h-12 rounded-lg bg-muted animate-pulse mx-auto mb-3" />
          <p className="text-muted-foreground">Loading cards...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Please sign in to review flashcards.</p>
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <Check className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h2 className="text-xl font-bold">All caught up!</h2>
          <p className="text-muted-foreground mt-1">No cards due for review right now.</p>
          <Link
            href="/flashcards"
            className="inline-flex items-center gap-2 mt-4 text-sm text-primary hover:underline"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Flashcards
          </Link>
        </div>
      </div>
    );
  }

  if (isComplete) {
    const avgQuality =
      results.reduce((sum, r) => sum + r.quality, 0) / results.length;
    const passCount = results.filter((r) => r.quality >= 3).length;

    return (
      <div className="max-w-lg mx-auto mt-8 space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Review Complete!</h2>
          <p className="text-muted-foreground mt-1">
            You reviewed {results.length} cards.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-green-400">{passCount}</p>
            <p className="text-xs text-muted-foreground">Passed</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold text-red-400">
              {results.length - passCount}
            </p>
            <p className="text-xs text-muted-foreground">Need Review</p>
          </div>
          <div className="rounded-lg border border-border bg-card p-4 text-center">
            <p className="text-2xl font-bold">{avgQuality.toFixed(1)}</p>
            <p className="text-xs text-muted-foreground">Avg Quality</p>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/flashcards"
            className="px-4 py-2 rounded-md border border-border text-sm hover:bg-accent transition-colors"
          >
            Back to Flashcards
          </Link>
          <button
            onClick={() => {
              setCurrentIndex(0);
              setIsFlipped(false);
              setResults([]);
              setIsComplete(false);
              // Reload due cards
              fetch("/api/flashcards/due?limit=20")
                .then((r) => r.json())
                .then(setCards);
            }}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            Review More
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto space-y-6">
      {/* Progress */}
      <div className="flex items-center justify-between">
        <Link
          href="/flashcards"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Exit
        </Link>
        <span className="text-sm text-muted-foreground">
          {currentIndex + 1} / {cards.length}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full bg-muted rounded-full h-1.5">
        <div
          className="bg-primary h-1.5 rounded-full transition-all"
          style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
        />
      </div>

      {/* Card */}
      <div
        className="flip-card cursor-pointer min-h-[280px]"
        onClick={() => !isFlipped && setIsFlipped(true)}
      >
        <div className={cn("flip-card-inner relative w-full min-h-[280px]", isFlipped && "flipped")}>
          {/* Front */}
          <div className="flip-card-front absolute inset-0 rounded-lg border border-border bg-card p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                  {currentCard.bookTitle}
                </span>
                {currentCard.chapterTitle && (
                  <span className="text-xs text-muted-foreground">
                    {currentCard.chapterTitle}
                  </span>
                )}
              </div>
              <p className="text-lg font-medium leading-relaxed">{currentCard.front}</p>
            </div>
            <p className="text-sm text-muted-foreground text-center mt-4">
              Tap to reveal answer · Space
            </p>
          </div>

          {/* Back */}
          <div className="flip-card-back absolute inset-0 rounded-lg border border-primary/30 bg-card p-6 flex flex-col justify-between">
            <div>
              <p className="text-xs text-primary mb-3 uppercase tracking-wider font-medium">
                Answer
              </p>
              <p className="text-base leading-relaxed">{currentCard.back}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Rating buttons - only show when flipped */}
      {isFlipped && (
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground text-center">
            How well did you know this?
          </p>
          <div className="grid grid-cols-6 gap-2">
            {[0, 1, 2, 3, 4, 5].map((q) => (
              <button
                key={q}
                onClick={() => handleRate(q)}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-md border border-border hover:bg-accent transition-colors text-center",
                  q < 2 && "hover:border-red-500/50",
                  q === 2 && "hover:border-yellow-500/50",
                  q >= 3 && "hover:border-green-500/50"
                )}
              >
                <span className={cn("text-lg font-bold", RATING_LABELS[q].color)}>
                  {q}
                </span>
                <span className="text-[10px] text-muted-foreground leading-tight">
                  {RATING_LABELS[q].label}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
