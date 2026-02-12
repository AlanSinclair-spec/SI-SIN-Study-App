// Database entity types

export interface User {
  id: number;
  name: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Book {
  id: number;
  title: string;
  author: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  year: number | null;
  created_at: string;
}

export interface Chapter {
  id: number;
  book_id: number;
  number: number;
  title: string;
  slug: string;
  subtitle: string | null;
  summary: string | null;
  created_at: string;
}

export interface Concept {
  id: number;
  chapter_id: number;
  title: string;
  description: string;
  importance: "core" | "supporting" | "supplementary";
  created_at: string;
}

export interface Argument {
  id: number;
  concept_id: number;
  title: string;
  description: string;
  created_at: string;
}

export interface Quote {
  id: number;
  chapter_id: number;
  concept_id: number | null;
  text: string;
  page_ref: string | null;
  context: string | null;
  created_at: string;
}

export interface Flashcard {
  id: number;
  book_id: number;
  chapter_id: number | null;
  concept_id: number | null;
  front: string;
  back: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string | null;
  created_at: string;
}

export interface FlashcardReview {
  id: number;
  user_id: number;
  flashcard_id: number;
  quality: number;
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
  reviewed_at: string;
}

export interface UserFlashcardState {
  user_id: number;
  flashcard_id: number;
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
  last_quality: number | null;
  updated_at: string;
}

export interface QuizQuestion {
  id: number;
  book_id: number | null;
  chapter_id: number | null;
  concept_id: number | null;
  question_type: "multiple_choice" | "short_answer";
  question_text: string;
  correct_answer: string;
  option_a: string | null;
  option_b: string | null;
  option_c: string | null;
  option_d: string | null;
  explanation: string | null;
  difficulty: "beginner" | "intermediate" | "advanced";
  created_at: string;
}

export interface Quiz {
  id: number;
  user_id: number;
  book_id: number | null;
  chapter_id: number | null;
  quiz_type: "multiple_choice" | "short_answer" | "mixed" | "cross_book";
  score: number | null;
  total_questions: number;
  correct_count: number;
  started_at: string;
  completed_at: string | null;
}

export interface QuizAnswer {
  id: number;
  quiz_id: number;
  question_id: number;
  user_answer: string;
  is_correct: number;
  answered_at: string;
}

export interface StudySession {
  id: number;
  user_id: number;
  session_type: "daily" | "flashcard" | "quiz" | "tutor" | "browse";
  flashcards_reviewed: number;
  quiz_score: number | null;
  duration_minutes: number | null;
  started_at: string;
  completed_at: string | null;
}

export interface Connection {
  id: number;
  title: string;
  description: string;
  sin_concept_id: number | null;
  si_concept_id: number | null;
  sin_theme: string;
  si_theme: string;
  relationship: "parallel" | "contrast" | "complement" | "tension";
  detailed_analysis: string | null;
  created_at: string;
}

export interface TutorConversation {
  id: number;
  user_id: number;
  difficulty: "beginner" | "intermediate" | "advanced";
  topic: string | null;
  messages: string;
  created_at: string;
  updated_at: string;
}

// Extended types for UI

export interface BookWithChapters extends Book {
  chapters: Chapter[];
  chapter_count: number;
}

export interface ChapterWithContent extends Chapter {
  book_title: string;
  book_slug: string;
  concepts: ConceptWithArguments[];
  quotes: Quote[];
}

export interface ConceptWithArguments extends Concept {
  arguments: Argument[];
}

export interface FlashcardWithState extends Flashcard {
  book_title: string;
  state: UserFlashcardState | null;
}

export interface QuizQuestionWithAnswer extends QuizQuestion {
  user_answer?: string;
  is_correct?: boolean;
}

export interface UserStats {
  user_id: number;
  user_name: string;
  total_flashcards_reviewed: number;
  flashcard_accuracy: number;
  total_quizzes_taken: number;
  avg_quiz_score: number;
  study_streak: number;
  chapters_studied: number;
  total_study_sessions: number;
}

export interface TutorMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}
