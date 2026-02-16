"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/contexts/user-context";
import { Layers, Play, BookOpen } from "lucide-react";

interface DeckStats {
  total: number;
  due: number;
  reviewed: number;
}

interface BookDeck {
  ref: string;
  title: string;
  slug: string;
  total: number;
}

export default function FlashcardsPage() {
  const { user, loading } = useUser();
  const [stats, setStats] = useState<DeckStats>({ total: 0, due: 0, reviewed: 0 });
  const [books, setBooks] = useState<BookDeck[]>([]);

  useEffect(() => {
    if (!user) return;

    // Get total flashcards
    fetch("/api/flashcards")
      .then((r) => r.json())
      .then((cards: unknown[]) => {
        setStats((prev) => ({ ...prev, total: cards.length }));
      });

    // Get due cards count
    fetch("/api/flashcards/due?limit=999")
      .then((r) => r.json())
      .then((due: unknown[]) => {
        setStats((prev) => ({
          ...prev,
          due: due.length,
          reviewed: prev.total - due.length,
        }));
      });

    // Get books for filtering
    fetch("/api/books")
      .then((r) => r.json())
      .then((booksData: Array<{ ref: string; title: string; slug: string }>) => {
        // Enrich with flashcard count per book
        const enriched = booksData.map((book) => ({
          ref: book.ref,
          title: book.title,
          slug: book.slug,
          total: 0,
        }));
        setBooks(enriched);
        // Get per-book counts
        for (const book of enriched) {
          fetch(`/api/flashcards?bookRef=${book.ref}`)
            .then((r) => r.json())
            .then((cards: unknown[]) => {
              setBooks((prev) =>
                prev.map((b) =>
                  b.ref === book.ref ? { ...b, total: cards.length } : b
                )
              );
            });
        }
      });
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Flashcards</h1>
          <p className="text-muted-foreground mt-1">
            Spaced repetition powered by the SM-2 algorithm.
          </p>
        </div>
        {stats.due > 0 && (
          <Link
            href="/flashcards/review"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
          >
            <Play className="w-4 h-4" />
            Review {stats.due} Due Cards
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold">{stats.total}</p>
          <p className="text-sm text-muted-foreground">Total Cards</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-yellow-400">{stats.due}</p>
          <p className="text-sm text-muted-foreground">Due for Review</p>
        </div>
        <div className="rounded-lg border border-border bg-card p-4 text-center">
          <p className="text-2xl font-bold text-green-400">
            {stats.total > 0
              ? Math.round(((stats.total - stats.due) / stats.total) * 100)
              : 0}
            %
          </p>
          <p className="text-sm text-muted-foreground">Mastered</p>
        </div>
      </div>

      {/* Book decks */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Decks by Book</h2>
        {books.map((book) => (
          <div
            key={book.ref}
            className="flex items-center justify-between rounded-lg border border-border bg-card p-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-medium">{book.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {book.total || "—"} cards
                </p>
              </div>
            </div>
            <Link
              href={`/flashcards/review?bookRef=${book.ref}`}
              className="text-sm text-primary hover:underline"
            >
              Study
            </Link>
          </div>
        ))}
      </div>

      {/* All cards review */}
      <Link
        href="/flashcards/review"
        className="block rounded-lg border border-dashed border-border p-6 text-center hover:border-primary/50 transition-colors"
      >
        <Layers className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
        <p className="font-medium">Review All Due Cards</p>
        <p className="text-sm text-muted-foreground mt-1">
          Mix cards from both books for comprehensive review.
        </p>
      </Link>
    </div>
  );
}
