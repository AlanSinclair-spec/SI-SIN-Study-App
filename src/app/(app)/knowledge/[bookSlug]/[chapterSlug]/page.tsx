"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Quote, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIFFICULTY_COLORS } from "@/lib/constants";

interface ConceptArg {
  title: string;
  description: string;
}

interface ConceptData {
  ref: string;
  title: string;
  description: string;
  importance: "core" | "supporting" | "supplementary";
  arguments: ConceptArg[];
}

interface QuoteData {
  text: string;
  context?: string;
}

interface ChapterData {
  ref: string;
  number: number;
  title: string;
  summary: string;
  bookTitle: string;
  bookSlug: string;
  concepts: ConceptData[];
  quotes: QuoteData[];
}

export default function ChapterDetailPage() {
  const params = useParams();
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [expandedConcepts, setExpandedConcepts] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Directly fetch chapter using bookSlug and chapterSlug
    fetch(`/api/books/${params.bookSlug}/chapters/${params.chapterSlug}`)
      .then((r) => {
        if (r.ok) return r.json();
        return null;
      })
      .then((data) => {
        if (data) {
          setChapter(data);
        }
      });
  }, [params.bookSlug, params.chapterSlug]);

  const toggleConcept = (ref: string) => {
    setExpandedConcepts((prev) => {
      const next = new Set(prev);
      if (next.has(ref)) next.delete(ref);
      else next.add(ref);
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
          href={`/knowledge/${chapter.bookSlug}`}
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-3 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to {chapter.bookTitle}
        </Link>
        <div className="flex items-center gap-3">
          <span className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-lg font-semibold text-primary">
            {chapter.number}
          </span>
          <div>
            <h1 className="text-2xl font-bold">{chapter.title}</h1>
            <p className="text-sm text-muted-foreground">{chapter.bookTitle}</p>
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
            key={concept.ref}
            className="rounded-lg border border-border bg-card overflow-hidden"
          >
            <button
              onClick={() => toggleConcept(concept.ref)}
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
              {expandedConcepts.has(concept.ref) ? (
                <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              ) : (
                <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
              )}
            </button>
            {expandedConcepts.has(concept.ref) && concept.arguments.length > 0 && (
              <div className="border-t border-border p-4 bg-muted/30 space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Key Arguments
                </h4>
                {concept.arguments.map((arg, i) => (
                  <div key={i} className="pl-3 border-l-2 border-primary/30">
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
              key={concept.ref}
              className="rounded-lg border border-border bg-card overflow-hidden"
            >
              <button
                onClick={() => toggleConcept(concept.ref)}
                className="w-full text-left p-4 flex items-start justify-between gap-2 hover:bg-accent/30 transition-colors"
              >
                <div>
                  <h3 className="font-medium">{concept.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {concept.description}
                  </p>
                </div>
                {expandedConcepts.has(concept.ref) ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                )}
              </button>
              {expandedConcepts.has(concept.ref) && concept.arguments.length > 0 && (
                <div className="border-t border-border p-4 bg-muted/30 space-y-3">
                  <h4 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Key Arguments
                  </h4>
                  {concept.arguments.map((arg, i) => (
                    <div key={i} className="pl-3 border-l-2 border-primary/30">
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
          {chapter.quotes.map((quote, i) => (
            <div
              key={i}
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
