"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/user-context";
import Link from "next/link";
import {
  Zap,
  Layers,
  HelpCircle,
  Target,
  Flame,
  BookOpen,
  TrendingUp,
} from "lucide-react";

interface Stats {
  user_name: string;
  total_flashcards_reviewed: number;
  unique_cards_reviewed: number;
  flashcard_accuracy: number;
  total_quizzes_taken: number;
  avg_quiz_score: number;
  best_quiz_score: number;
  study_streak: number;
  chapters_studied: number;
  total_study_sessions: number;
  weak_concepts: Array<{
    title: string;
    id: string;
    miss_count: number;
    chapter_title: string;
    book_title: string;
  }>;
}

export default function DashboardPage() {
  const { user, loading } = useUser();
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    if (!user) return;
    fetch("/api/stats")
      .then((r) => r.json())
      .then(setStats);
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="h-48 bg-muted rounded-lg animate-pulse" />
          <div className="h-48 bg-muted rounded-lg animate-pulse" />
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Please sign in to view your dashboard.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">
            {stats ? `Welcome back, ${stats.user_name}` : `Welcome back, ${user.displayName}`}
          </h1>
          <p className="text-muted-foreground mt-0.5">Track your study progress.</p>
        </div>
        <Link
          href="/daily"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          <Zap className="w-4 h-4" />
          Daily Session
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-xs font-medium">Study Streak</span>
          </div>
          <p className="text-2xl font-bold">{stats?.study_streak || 0}</p>
          <p className="text-xs text-muted-foreground">days</p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <Layers className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-medium">Cards Reviewed</span>
          </div>
          <p className="text-2xl font-bold">{stats?.total_flashcards_reviewed || 0}</p>
          <p className="text-xs text-muted-foreground">
            {stats?.flashcard_accuracy || 0}% accuracy
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <HelpCircle className="w-4 h-4 text-green-400" />
            <span className="text-xs font-medium">Quizzes Taken</span>
          </div>
          <p className="text-2xl font-bold">{stats?.total_quizzes_taken || 0}</p>
          <p className="text-xs text-muted-foreground">
            avg {stats?.avg_quiz_score || 0}%
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center gap-2 text-muted-foreground mb-2">
            <BookOpen className="w-4 h-4 text-purple-400" />
            <span className="text-xs font-medium">Chapters</span>
          </div>
          <p className="text-2xl font-bold">{stats?.chapters_studied || 0}</p>
          <p className="text-xs text-muted-foreground">of 19 studied</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Weak concepts */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Target className="w-5 h-5 text-red-400" />
            <h2 className="font-semibold">Needs Improvement</h2>
          </div>
          {stats?.weak_concepts && stats.weak_concepts.length > 0 ? (
            <div className="space-y-3">
              {stats.weak_concepts.map((concept) => (
                <div
                  key={concept.id}
                  className="flex items-start justify-between gap-2"
                >
                  <div>
                    <p className="text-sm font-medium">{concept.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {concept.book_title} — {concept.chapter_title}
                    </p>
                  </div>
                  <span className="text-xs text-red-400 flex-shrink-0">
                    {concept.miss_count} misses
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              Take some quizzes to see which concepts need work.
            </p>
          )}
        </div>

        {/* Study tips instead of leaderboard */}
        <div className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-green-400" />
            <h2 className="font-semibold">Study Tips</h2>
          </div>
          <div className="space-y-3 text-sm text-muted-foreground">
            <p>Review flashcards daily to build long-term retention with spaced repetition.</p>
            <p>Take quizzes after each chapter to identify weak areas early.</p>
            <p>Use the AI Tutor to explore connections between concepts from both books.</p>
            <p>Aim for at least one Daily Session per day to maintain your streak.</p>
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link
          href="/flashcards/review"
          className="rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-accent/20 transition-colors text-center"
        >
          <Layers className="w-6 h-6 mx-auto mb-2 text-blue-400" />
          <p className="text-sm font-medium">Review Cards</p>
        </Link>
        <Link
          href="/quiz"
          className="rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-accent/20 transition-colors text-center"
        >
          <HelpCircle className="w-6 h-6 mx-auto mb-2 text-green-400" />
          <p className="text-sm font-medium">Take Quiz</p>
        </Link>
        <Link
          href="/tutor"
          className="rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-accent/20 transition-colors text-center"
        >
          <TrendingUp className="w-6 h-6 mx-auto mb-2 text-purple-400" />
          <p className="text-sm font-medium">AI Tutor</p>
        </Link>
        <Link
          href="/knowledge"
          className="rounded-lg border border-border p-4 hover:border-primary/50 hover:bg-accent/20 transition-colors text-center"
        >
          <BookOpen className="w-6 h-6 mx-auto mb-2 text-orange-400" />
          <p className="text-sm font-medium">Browse Books</p>
        </Link>
      </div>
    </div>
  );
}
