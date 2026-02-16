// Static content types for the SI-SIN Study App.
// These replace the SQLite schema for all reference/content data.

export interface ContentBook {
  ref: string;
  title: string;
  author: string;
  slug: string;
  description: string;
  year: number;
}

export interface ContentChapter {
  ref: string;
  bookRef: string;
  number: number;
  title: string;
  slug: string;
  summary: string;
}

export interface ContentConcept {
  ref: string;
  chapterRef: string;
  title: string;
  description: string;
  importance: "core" | "supporting" | "supplementary";
}

export interface ContentArgument {
  conceptRef: string;
  title: string;
  description: string;
}

export interface ContentQuote {
  chapterRef: string;
  text: string;
  context?: string;
}

export interface ContentFlashcard {
  id: string;
  bookRef: string;
  chapterRef: string;
  front: string;
  back: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string[];
}

export interface ContentQuizQuestion {
  id: string;
  bookRef: "sin" | "si" | "cross";
  chapterRef: string | null;
  questionType: "multiple_choice" | "short_answer";
  questionText: string;
  correctAnswer: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  explanation: string;
  difficulty: "beginner" | "intermediate" | "advanced";
}

export interface ContentConnection {
  title: string;
  description: string;
  sinTheme: string;
  siTheme: string;
  relationship: "parallel" | "contrast" | "complement" | "tension";
  detailedAnalysis: string;
}

// Extended types for UI

export interface BookWithChapters extends ContentBook {
  chapters: ContentChapter[];
  chapterCount: number;
}

export interface ChapterWithContent extends ContentChapter {
  bookTitle: string;
  bookSlug: string;
  concepts: ConceptWithArguments[];
  quotes: ContentQuote[];
}

export interface ConceptWithArguments extends ContentConcept {
  arguments: ContentArgument[];
}

export interface FlashcardWithBookInfo extends ContentFlashcard {
  bookTitle: string;
  chapterTitle: string;
}
