"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";

interface BookWithCount {
  id: number;
  title: string;
  author: string;
  slug: string;
  description: string;
  year: number;
  chapter_count: number;
}

export default function KnowledgePage() {
  const [books, setBooks] = useState<BookWithCount[]>([]);

  useEffect(() => {
    fetch("/api/books")
      .then((r) => r.json())
      .then(setBooks);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Knowledge Base</h1>
        <p className="text-muted-foreground mt-1">
          Explore the key concepts, arguments, and quotes from both books.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {books.map((book) => (
          <Link
            key={book.id}
            href={`/knowledge/${book.slug}`}
            className="group block rounded-lg border border-border bg-card p-6 hover:border-primary/50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BookOpen className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="font-semibold group-hover:text-primary transition-colors">
                    {book.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">{book.author}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
            </div>
            <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
              {book.description}
            </p>
            <div className="flex items-center gap-4 mt-4 text-xs text-muted-foreground">
              <span>{book.chapter_count} chapters</span>
              <span>{book.year}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
