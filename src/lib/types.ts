// Types used by UI pages for API responses.
// Content types (Book, Chapter, Concept, etc.) are defined in @/data/content/types.

export interface TutorMessage {
  role: "user" | "assistant";
  content: string;
  timestamp?: string;
}

// Stats API response
export interface UserStats {
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

// Flashcard as returned by /api/flashcards/due
export interface DueFlashcard {
  id: string;
  front: string;
  back: string;
  difficulty: string;
  bookTitle: string;
  chapterTitle: string;
  tags: string[];
  easiness_factor: number | null;
  interval_days: number | null;
  repetitions: number | null;
  next_review: string | null;
  last_quality: number | null;
}

// Quiz question as returned by /api/quiz/generate
export interface QuizQuestion {
  id: string;
  questionType: "multiple_choice" | "short_answer";
  questionText: string;
  correctAnswer: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  explanation: string;
  difficulty: string;
}

// Quiz generation response
export interface QuizGenerateResponse {
  quizId: string;
  questions: QuizQuestion[];
}

// Quiz submission result
export interface QuizSubmitResult {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  explanation: string | null;
}

export interface QuizSubmitResponse {
  quizId: string;
  score: number;
  correctCount: number;
  totalQuestions: number;
  results: QuizSubmitResult[];
}

// Search result from /api/search
export interface SearchResult {
  type: string;
  title: string;
  text: string;
  bookRef: string;
  chapterRef?: string;
  description?: string;
  book_title?: string;
  chapter_title?: string;
}

// Connection as returned by /api/connections
export interface ConnectionData {
  title: string;
  description: string;
  sinTheme: string;
  siTheme: string;
  relationship: "parallel" | "contrast" | "complement" | "tension";
  detailedAnalysis: string;
}
