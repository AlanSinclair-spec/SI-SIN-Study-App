"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Quote, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIFFICULTY_COLORS } from "@/lib/constants";

interface ConceptArg {
  id: number;
  title: string;
  description: string;
}

interface ConceptData {
  id: number;
  title: string;
  description: string;
  importance: "core" | "supporting" | "supplementary";
  arguments: ConceptArg[];
}

interface QuoteData {
  id: number;
  text: string;
  page_ref: string | null;
  context: string | null;
}

interface ChapterData {
  id: number;
  number: number;
  title: string;
  summary: string;
  book_title: string;
  book_slug: string;
  concepts: ConceptData[];
  quotes: QuoteData[];
}

export default function ChapterDetailPage() {
  const params = useParams();
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [expandedConcepts, setExpandedConcepts] = useState<Set<number>>(new Set());

  useEffect(() => {
    // We need to look up book by slug, then chapter by slug
    fetch(`/api/books/${params.bookSlug}`)
      .then((r) => r.json())
      .then((book) => {
        if (book.chapters) {
          const ch = book.chapters.find(
            (c: { slug: string }) => c.slug === params.chapterSlug
          );
          if (ch) {
            fetch(`/api/books/${book.id}/chapters/${ch.id}`)
              .then((r) => r.json())
              .then(setChapter);
          }
        }
      });
  }, [params.bookSlug, params.chapterSlug]);

  const toggleConcept = (id: number) => {
    setExpandedConcepts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (!chapter) {
    return (
      <div className="space-y-4">
        <div className="h-8 w-64 bg-muted rounded animate-pulse" />
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-muted rounded animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const coreConcepts = chapter.concepts.filter((c) => c.importance === "core");
  const supportingConcepts = chapter.concepts.filter(
    (c) => c.importance !== "core"
  );

  return (
    <div className="space-y-6">
      <div>
        <Link
          href={`/knowledge/${chapter.book_slug}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {chapter.book_title}
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
            {chapter.number}
          </span>
          <div>
            <h1 className="text-2xl font-bold">{chapter.title}</h1>
            <p className="text-sm text-muted-foreground">{chapter.book_title}</p>
          </div>
        </div>
        {chapter.summary && (
          <p className="text-muted-foreground mt-3">{chapter.summary}</p>
        )}
      </div>

      {/* Core Concepts */}
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">
          Core Concepts ({coreConcepts.length})
        </h2>
        {coreConcepts.map((concept) => (
          <div
            key={concept.id}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            <button
              onClick={() => toggleConcept(concept.id)}
              className="w-full text-left p-4 flex items-start justify-between gap-2 hover:bg-accent/30 transition-colors"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium">{concept.title}</h3>
                  <span
                    className={cn(
                      "text-[10px] px-1.5 py-0.5 rounded border font-medium",
                      DIFFICULTY_COLORS.beginner
                    )}
                  >
                    CORE
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  {concept.description}
                </p>
              </div>
              {expandedConcepts.has(concept.id) ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
            </button>
            {expandedConcepts.has(concept.id) && concept.arguments.length > 0 && (
              <div className="border-t border-border p-4 bg-muted/30 space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Key Arguments
                </h4>
                {concept.arguments.map((arg) => (
                  <div key={arg.id} className="pl-3 border-l-2 border-primary/30">
                    <h5 className="text-sm font-medium">{arg.title}</h5>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {arg.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Supporting Concepts */}
      {supportingConcepts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            Supporting Concepts ({supportingConcepts.length})
          </h2>
          {supportingConcepts.map((concept) => (
            <div
              key={concept.id}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => toggleConcept(concept.id)}
                className="w-full text-left p-4 flex items-start justify-between gap-2 hover:bg-accent/30 transition-colors"
              >
                <div>
                  <h3 className="font-medium">{concept.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {concept.description}
                  </p>
                </div>
                {expandedConcepts.has(concept.id) ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                )}
              </button>
              {expandedConcepts.has(concept.id) && concept.arguments.length > 0 && (
                <div className="border-t border-border p-4 bg-muted/30 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Key Arguments
                  </h4>
                  {concept.arguments.map((arg) => (
                    <div key={arg.id} className="pl-3 border-l-2 border-primary/30">
                      <h5 className="text-sm font-medium">{arg.title}</h5>
                      <p className="text-sm text-muted-foreground mt-0.5">
                        {arg.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Notable Quotes */}
      {chapter.quotes.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-semibold">
            Notable Quotes ({chapter.quotes.length})
          </h2>
          {chapter.quotes.map((quote) => (
            <div
              key={quote.id}
              className="rounded-lg border border-border bg-card p-4"
            >
              <div className="flex gap-3">
                <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm italic leading-relaxed">
                    &ldquo;{quote.text}&rdquo;
                  </p>
                  {quote.context && (
                    <p className="text-xs text-muted-foreground mt-2">
                      {quote.context}
                    </p>
                  )}
                  {quote.page_ref && (
                    <p className="text-xs text-muted-foreground mt-1">
                      p. {quote.page_ref}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
