"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight, BookOpen } from "lucide-react";

interface Chapter {
  id: string;
  number: number;
  title: string;
  slug: string;
  summary: string;
  concept_count: number;
}

interface BookData {
  id: string;
  title: string;
  author: string;
  slug: string;
  description: string;
  chapters: Chapter[];
}

export default function BookDetailPage() {
  const params = useParams();
  const [book, setBook] = useState<BookData | null>(null);

  useEffect(() => {
    fetch(`/api/books/${params.bookSlug}`)
      .then((r) => r.json())
      .then(setBook)
      .catch(() => {});
  }, [params.bookSlug]);

  if (!book) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-48 bg-muted rounded animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-20 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/knowledge"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Books
        </Link>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{book.title}</h1>
            <p className="text-muted-foreground">{book.author}</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground mt-3">{book.description}</p>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold">
          Chapters ({book.chapters.length})
        </h2>
        <div className="space-y-2">
          {book.chapters.map((chapter) => (
            <Link
              key={chapter.id}
              href={`/knowledge/${book.slug}/${chapter.slug}`}
              className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors"
            >
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <span className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
                  {chapter.number}
                </span>
                <div className="min-w-0">
                  <h3 className="font-medium group-hover:text-primary transition-colors">
                    {chapter.title}
                  </h3>
                  {chapter.summary && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {chapter.summary}
                    </p>
                  )}
                  <span className="text-xs text-muted-foreground mt-1 inline-block">
                    {chapter.concept_count} concepts
                  </span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors flex-shrink-0 ml-2" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
