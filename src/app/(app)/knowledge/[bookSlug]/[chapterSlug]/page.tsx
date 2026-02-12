"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import Link from "next/link";
import { ArrowLeft, Quote, ChevronDown, ChevronUp, Highlighter, FileText, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { DIFFICULTY_COLORS } from "@/lib/constants";

interface ConceptArg {
  id: string;
  title: string;
  description: string;
}

interface ConceptData {
  id: string;
  title: string;
  description: string;
  importance: "core" | "supporting" | "supplementary";
  arguments: ConceptArg[];
}

interface QuoteData {
  id: string;
  text: string;
  page_ref: string | null;
  context: string | null;
}

interface HighlightData {
  id: string;
  quote_id: string;
  color: string;
  note: string | null;
  created_at: string;
}

interface NoteData {
  id: string;
  content: string;
  chapter_id: string;
  created_at: string;
}

interface ChapterData {
  id: string;
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
  const { user } = useAuth();
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [expandedConcepts, setExpandedConcepts] = useState<Set<string>>(new Set());
  const [highlights, setHighlights] = useState<HighlightData[]>([]);
  const [notes, setNotes] = useState<NoteData[]>([]);
  const [showNoteForm, setShowNoteForm] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [savingNote, setSavingNote] = useState(false);

  useEffect(() => {
    // Look up book by slug, then chapter by slug
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
              .then((chapterData) => {
                setChapter(chapterData);
                // Load highlights and notes for this chapter
                if (user) {
                  fetch(`/api/highlights?chapterId=${ch.id}`)
                    .then((r) => r.json())
                    .then(setHighlights)
                    .catch(() => {});
                  fetch(`/api/notes?chapterId=${ch.id}`)
                    .then((r) => r.json())
                    .then(setNotes)
                    .catch(() => {});
                }
              })
              .catch(() => {});
          }
        }
      })
      .catch(() => {});
  }, [params.bookSlug, params.chapterSlug, user]);

  const toggleConcept = (id: string) => {
    setExpandedConcepts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleHighlightQuote = async (quoteId: string) => {
    if (!user) return;
    // Check if already highlighted
    const existing = highlights.find((h) => h.quote_id === quoteId);
    if (existing) {
      // Remove highlight
      try {
        const res = await fetch(`/api/highlights/${existing.id}`, { method: "DELETE" });
        if (res.ok) {
          setHighlights((prev) => prev.filter((h) => h.id !== existing.id));
        }
      } catch {}
    } else {
      // Create highlight
      try {
        const res = await fetch("/api/highlights", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            quoteId,
            color: "yellow",
          }),
        });
        if (res.ok) {
          const newHighlight = await res.json();
          setHighlights((prev) => [...prev, newHighlight]);
        }
      } catch {}
    }
  };

  const handleCreateNote = async () => {
    if (!noteContent.trim() || !chapter) return;
    setSavingNote(true);
    try {
      const res = await fetch("/api/notes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chapterId: chapter.id,
          content: noteContent.trim(),
        }),
      });
      if (res.ok) {
        const newNote = await res.json();
        setNotes((prev) => [newNote, ...prev]);
        setNoteContent("");
        setShowNoteForm(false);
      }
    } catch {}
    setSavingNote(false);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      const res = await fetch(`/api/notes/${noteId}`, { method: "DELETE" });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== noteId));
      }
    } catch {}
  };

  const isQuoteHighlighted = (quoteId: string) => {
    return highlights.some((h) => h.quote_id === quoteId);
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
              className={cn(
                "rounded-lg border bg-card p-4",
                isQuoteHighlighted(quote.id)
                  ? "border-yellow-500/50 bg-yellow-500/5"
                  : "border-border"
              )}
            >
              <div className="flex gap-3">
                <Quote className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <div className="flex-1">
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
                {user && (
                  <button
                    onClick={() => handleHighlightQuote(quote.id)}
                    className={cn(
                      "p-1.5 rounded-md transition-colors flex-shrink-0",
                      isQuoteHighlighted(quote.id)
                        ? "text-yellow-400 hover:text-yellow-500 bg-yellow-500/10"
                        : "text-muted-foreground hover:text-foreground hover:bg-accent"
                    )}
                    title={isQuoteHighlighted(quote.id) ? "Remove highlight" : "Highlight quote"}
                  >
                    <Highlighter className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* User Notes Section */}
      {user && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Your Notes ({notes.length})
            </h2>
            <button
              onClick={() => setShowNoteForm(!showNoteForm)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              Add Note
            </button>
          </div>

          {/* Note creation form */}
          {showNoteForm && (
            <div className="rounded-lg border border-border bg-card p-4 space-y-3">
              <textarea
                value={noteContent}
                onChange={(e) => setNoteContent(e.target.value)}
                placeholder="Write your note about this chapter..."
                rows={3}
                className="w-full px-3 py-2 rounded-md border border-border bg-background text-sm focus:outline-none focus:ring-1 focus:ring-ring resize-none"
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={() => { setShowNoteForm(false); setNoteContent(""); }}
                  className="px-3 py-1.5 rounded-md border border-border text-sm hover:bg-accent transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  disabled={savingNote || !noteContent.trim()}
                  className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
                >
                  {savingNote ? "Saving..." : "Save Note"}
                </button>
              </div>
            </div>
          )}

          {/* Existing notes */}
          {notes.length > 0 ? (
            <div className="space-y-2">
              {notes.map((note) => (
                <div
                  key={note.id}
                  className="rounded-lg border border-border bg-card p-4 flex items-start justify-between gap-3"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm whitespace-pre-wrap">{note.content}</p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(note.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="p-1 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors flex-shrink-0"
                    title="Delete note"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            !showNoteForm && (
              <p className="text-sm text-muted-foreground">
                No notes yet for this chapter. Click &ldquo;Add Note&rdquo; to create one.
              </p>
            )
          )}
        </div>
      )}
    </div>
  );
}
