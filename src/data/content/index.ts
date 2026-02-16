// Static content data layer for the SI-SIN Study App.
// Imports from existing seed files and provides query functions
// that replace the SQLite database for all reference/content data.

import { books } from "../seed/books";
import { sinChapters } from "../seed/sin-chapters";
import { siChapters } from "../seed/si-chapters";
import { sinConcepts } from "../seed/sin-concepts";
import { siConcepts } from "../seed/si-concepts";
import { sinArguments } from "../seed/sin-arguments";
import { siArguments } from "../seed/si-arguments";
import { sinQuotes } from "../seed/sin-quotes";
import { siQuotes } from "../seed/si-quotes";
import { sinFlashcards } from "../seed/flashcards-sin";
import { siFlashcards } from "../seed/flashcards-si";
import { quizQuestions } from "../seed/quiz-questions";
import { connections } from "../seed/connections";

import type {
  ContentBook,
  ContentChapter,
  ContentConcept,
  ContentArgument,
  ContentQuote,
  ContentFlashcard,
  ContentQuizQuestion,
  ContentConnection,
  BookWithChapters,
  ChapterWithContent,
  ConceptWithArguments,
  FlashcardWithBookInfo,
} from "./types";

// ---------------------------------------------------------------------------
// Build combined arrays
// ---------------------------------------------------------------------------

const allBooks: ContentBook[] = books.map((b) => ({
  ref: b.ref,
  title: b.title,
  author: b.author,
  slug: b.slug,
  description: b.description,
  year: b.year,
}));

const allChapters: ContentChapter[] = [
  ...sinChapters.map((ch) => ({
    ref: ch.ref,
    bookRef: "sin" as const,
    number: ch.number,
    title: ch.title,
    slug: ch.slug,
    summary: ch.summary,
  })),
  ...siChapters.map((ch) => ({
    ref: ch.ref,
    bookRef: "si" as const,
    number: ch.number,
    title: ch.title,
    slug: ch.slug,
    summary: ch.summary,
  })),
];

const allConcepts: ContentConcept[] = [
  ...sinConcepts.map((c) => ({
    ref: c.ref,
    chapterRef: c.chapterRef,
    title: c.title,
    description: c.description,
    importance: c.importance as ContentConcept["importance"],
  })),
  ...siConcepts.map((c) => ({
    ref: c.ref,
    chapterRef: c.chapterRef,
    title: c.title,
    description: c.description,
    importance: c.importance as ContentConcept["importance"],
  })),
];

const allArguments: ContentArgument[] = [
  ...sinArguments.map((a) => ({
    conceptRef: a.conceptRef,
    title: a.title,
    description: a.description,
  })),
  ...siArguments.map((a) => ({
    conceptRef: a.conceptRef,
    title: a.title,
    description: a.description,
  })),
];

const allQuotes: ContentQuote[] = [
  ...sinQuotes.map((q) => ({
    chapterRef: q.chapterRef,
    text: q.text,
    context: q.context,
  })),
  ...siQuotes.map((q) => ({
    chapterRef: q.chapterRef,
    text: q.text,
    context: q.context,
  })),
];

const allFlashcards: ContentFlashcard[] = [
  ...sinFlashcards.map((fc, i) => ({
    id: `sin-fc-${i}`,
    bookRef: fc.bookRef,
    chapterRef: fc.chapterRef,
    front: fc.front,
    back: fc.back,
    difficulty: fc.difficulty,
    tags: fc.tags,
  })),
  ...siFlashcards.map((fc, i) => ({
    id: `si-fc-${i}`,
    bookRef: fc.bookRef,
    chapterRef: fc.chapterRef,
    front: fc.front,
    back: fc.back,
    difficulty: fc.difficulty,
    tags: fc.tags,
  })),
];

const allQuizQuestions: ContentQuizQuestion[] = (() => {
  const counters: Record<string, number> = { sin: 0, si: 0, cross: 0 };
  return quizQuestions.map((qq) => {
    const prefix = qq.bookRef;
    const idx = counters[prefix]++;
    const mapped: ContentQuizQuestion = {
      id: `${prefix}-qq-${idx}`,
      bookRef: qq.bookRef,
      chapterRef: qq.chapterRef,
      questionType:
        qq.question_type === "mc" ? "multiple_choice" : "short_answer",
      questionText: qq.question_text,
      correctAnswer: qq.correct_answer,
      explanation: qq.explanation,
      difficulty: qq.difficulty,
    };
    if (qq.option_a !== undefined) mapped.optionA = qq.option_a;
    if (qq.option_b !== undefined) mapped.optionB = qq.option_b;
    if (qq.option_c !== undefined) mapped.optionC = qq.option_c;
    if (qq.option_d !== undefined) mapped.optionD = qq.option_d;
    return mapped;
  });
})();

const allConnections: ContentConnection[] = connections.map((c) => ({
  title: c.title,
  description: c.description,
  sinTheme: c.sin_theme,
  siTheme: c.si_theme,
  relationship: c.relationship,
  detailedAnalysis: c.detailed_analysis,
}));

// ---------------------------------------------------------------------------
// Lookup helpers (internal)
// ---------------------------------------------------------------------------

/** Map bookRef -> ContentBook for fast lookup. */
const bookByRef = new Map<string, ContentBook>(
  allBooks.map((b) => [b.ref, b])
);

/** Map bookSlug -> ContentBook for fast lookup. */
const bookBySlug = new Map<string, ContentBook>(
  allBooks.map((b) => [b.slug, b])
);

/** Map chapterRef -> ContentChapter for fast lookup. */
const chapterByRef = new Map<string, ContentChapter>(
  allChapters.map((ch) => [ch.ref, ch])
);

// ---------------------------------------------------------------------------
// Exported query functions
// ---------------------------------------------------------------------------

export function getBooks(): ContentBook[] {
  return allBooks;
}

export function getBook(slug: string): BookWithChapters | null {
  const book = bookBySlug.get(slug);
  if (!book) return null;
  const chapters = allChapters.filter((ch) => ch.bookRef === book.ref);
  return {
    ...book,
    chapters,
    chapterCount: chapters.length,
  };
}

export function getBookByRef(ref: string): ContentBook | null {
  return bookByRef.get(ref) ?? null;
}

export function getChapter(
  bookSlug: string,
  chapterSlug: string
): ChapterWithContent | null {
  const book = bookBySlug.get(bookSlug);
  if (!book) return null;

  const chapter = allChapters.find(
    (ch) => ch.bookRef === book.ref && ch.slug === chapterSlug
  );
  if (!chapter) return null;

  const concepts = allConcepts
    .filter((c) => c.chapterRef === chapter.ref)
    .map((c): ConceptWithArguments => ({
      ...c,
      arguments: allArguments.filter((a) => a.conceptRef === c.ref),
    }));

  const quotes = allQuotes.filter((q) => q.chapterRef === chapter.ref);

  return {
    ...chapter,
    bookTitle: book.title,
    bookSlug: book.slug,
    concepts,
    quotes,
  };
}

export function getChaptersByBook(bookRef: string): ContentChapter[] {
  return allChapters.filter((ch) => ch.bookRef === bookRef);
}

function enrichFlashcard(fc: ContentFlashcard): FlashcardWithBookInfo {
  const book = bookByRef.get(fc.bookRef);
  const chapter = chapterByRef.get(fc.chapterRef);
  return {
    ...fc,
    bookTitle: book?.title ?? "",
    chapterTitle: chapter?.title ?? "",
  };
}

export function getAllFlashcards(): FlashcardWithBookInfo[] {
  return allFlashcards.map(enrichFlashcard);
}

export function getFlashcardsByBook(
  bookRef: string
): FlashcardWithBookInfo[] {
  return allFlashcards
    .filter((fc) => fc.bookRef === bookRef)
    .map(enrichFlashcard);
}

export function getFlashcardById(id: string): ContentFlashcard | null {
  return allFlashcards.find((fc) => fc.id === id) ?? null;
}

export function getQuizQuestions(
  filters?: {
    bookRef?: string;
    chapterRef?: string;
    difficulty?: string;
    questionType?: string;
    limit?: number;
  }
): ContentQuizQuestion[] {
  let results = allQuizQuestions;

  if (filters) {
    if (filters.bookRef) {
      results = results.filter((q) => q.bookRef === filters.bookRef);
    }
    if (filters.chapterRef) {
      results = results.filter((q) => q.chapterRef === filters.chapterRef);
    }
    if (filters.difficulty) {
      results = results.filter((q) => q.difficulty === filters.difficulty);
    }
    if (filters.questionType) {
      results = results.filter((q) => q.questionType === filters.questionType);
    }
    if (filters.limit !== undefined && filters.limit > 0) {
      // Shuffle using Fisher-Yates and take the first `limit` items
      const shuffled = [...results];
      for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
      }
      results = shuffled.slice(0, filters.limit);
    }
  }

  return results;
}

export function getConnections(): ContentConnection[] {
  return allConnections;
}

interface SearchResult {
  type: string;
  title: string;
  text: string;
  bookRef: string;
  chapterRef?: string;
}

export function searchContent(query: string): SearchResult[] {
  const lowerQuery = query.toLowerCase();
  const results: SearchResult[] = [];

  // Search concepts (title + description)
  for (const concept of allConcepts) {
    if (
      concept.title.toLowerCase().includes(lowerQuery) ||
      concept.description.toLowerCase().includes(lowerQuery)
    ) {
      const chapter = chapterByRef.get(concept.chapterRef);
      const bookRef = chapter?.bookRef ?? "";
      results.push({
        type: "concept",
        title: concept.title,
        text: concept.description,
        bookRef,
        chapterRef: concept.chapterRef,
      });
    }
  }

  // Search quotes (text)
  for (const quote of allQuotes) {
    if (quote.text.toLowerCase().includes(lowerQuery)) {
      const chapter = chapterByRef.get(quote.chapterRef);
      const bookRef = chapter?.bookRef ?? "";
      results.push({
        type: "quote",
        title: quote.context ?? "Quote",
        text: quote.text,
        bookRef,
        chapterRef: quote.chapterRef,
      });
    }
  }

  // Search flashcards (front + back)
  for (const fc of allFlashcards) {
    if (
      fc.front.toLowerCase().includes(lowerQuery) ||
      fc.back.toLowerCase().includes(lowerQuery)
    ) {
      results.push({
        type: "flashcard",
        title: fc.front,
        text: fc.back,
        bookRef: fc.bookRef,
        chapterRef: fc.chapterRef,
      });
    }
  }

  return results;
}

// Re-export types for convenience
export type {
  ContentBook,
  ContentChapter,
  ContentConcept,
  ContentArgument,
  ContentQuote,
  ContentFlashcard,
  ContentQuizQuestion,
  ContentConnection,
  BookWithChapters,
  ChapterWithContent,
  ConceptWithArguments,
  FlashcardWithBookInfo,
} from "./types";
