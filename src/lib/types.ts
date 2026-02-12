// Database entity types — all IDs are UUIDs (strings)

export interface User {
  id: string;
  email: string;
  display_name: string;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  slug: string;
  description: string | null;
  cover_url: string | null;
  year: number | null;
  created_at: string;
}

export interface Chapter {
  id: string;
  book_id: string;
  number: number;
  title: string;
  slug: string;
  subtitle: string | null;
  summary: string | null;
  created_at: string;
}

export interface Concept {
  id: string;
  chapter_id: string;
  title: string;
  description: string;
  importance: "core" | "supporting" | "supplementary";
  created_at: string;
}

export interface Argument {
  id: string;
  concept_id: string;
  title: string;
  description: string;
  created_at: string;
}

export interface Quote {
  id: string;
  chapter_id: string;
  concept_id: string | null;
  text: string;
  page_ref: string | null;
  context: string | null;
  created_at: string;
}

export interface Flashcard {
  id: string;
  book_id: string;
  chapter_id: string | null;
  concept_id: string | null;
  front: string;
  back: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  tags: string | null;
  created_at: string;
}

export interface FlashcardReview {
  id: string;
  user_id: string;
  flashcard_id: string;
  quality: number;
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
  reviewed_at: string;
}

export interface UserFlashcardState {
  user_id: string;
  flashcard_id: string;
  easiness_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: string;
  last_quality: number | null;
  updated_at: string;
}

export interface QuizQuestion {
  id: string;
  book_id: string | null;
  chapter_id: string | null;
  concept_id: string | null;
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

export interface QuizResult {
  id: string;
  user_id: string;
  book: string;
  chapter: number | null;
  score: number;
  total_questions: number;
  answers: QuizResultAnswer[];
  completed_at: string;
}

export interface QuizResultAnswer {
  question_id: string;
  question_text: string;
  user_answer: string;
  correct_answer: string;
  is_correct: boolean;
  explanation: string | null;
}

export interface StudyProgress {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  section: string | null;
  status: "not_started" | "in_progress" | "completed";
  completion_percentage: number;
  last_studied_at: string | null;
  created_at: string;
}

export interface Note {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  section: string | null;
  content: string;
  tags: string[];
  created_at: string;
  updated_at: string;
}

export interface Highlight {
  id: string;
  user_id: string;
  book: string;
  chapter: number;
  highlighted_text: string;
  note: string | null;
  color: string;
  created_at: string;
}

export interface CrossReference {
  id: string;
  user_id: string;
  source_book: string;
  source_chapter: number;
  target_book: string;
  target_chapter: number;
  connection_note: string;
  created_at: string;
}

export interface StudySession {
  id: string;
  user_id: string;
  session_type: "daily" | "flashcard" | "quiz" | "tutor" | "browse";
  flashcards_reviewed: number;
  quiz_score: number | null;
  duration_minutes: number | null;
  started_at: string;
  completed_at: string | null;
}

export interface Connection {
  id: string;
  title: string;
  description: string;
  sin_concept_id: string | null;
  si_concept_id: string | null;
  sin_theme: string;
  si_theme: string;
  relationship: "parallel" | "contrast" | "complement" | "tension";
  detailed_analysis: string | null;
  created_at: string;
}

export interface TutorConversation {
  id: string;
  user_id: string;
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
  chapter_title?: string;
  state: UserFlashcardState | null;
}

export interface QuizQuestionWithAnswer extends QuizQuestion {
  user_answer?: string;
  is_correct?: boolean;
}

export interface UserStats {
  user_id: string;
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
  total_notes: number;
}

export interface TutorMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface LeaderboardEntry {
  user_id: string;
  user_name: string;
  flashcards_reviewed: number;
  flashcard_accuracy: number;
  quizzes_taken: number;
  avg_quiz_score: number;
  study_sessions: number;
}
