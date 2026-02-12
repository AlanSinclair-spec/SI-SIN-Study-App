import type Database from "better-sqlite3";

export function initializeSchema(db: Database.Database) {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      name        TEXT NOT NULL UNIQUE,
      avatar_url  TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS books (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      title       TEXT NOT NULL,
      author      TEXT NOT NULL,
      slug        TEXT NOT NULL UNIQUE,
      description TEXT,
      cover_url   TEXT,
      year        INTEGER,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS chapters (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id     INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      number      INTEGER NOT NULL,
      title       TEXT NOT NULL,
      slug        TEXT NOT NULL,
      subtitle    TEXT,
      summary     TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      UNIQUE(book_id, number)
    );

    CREATE TABLE IF NOT EXISTS concepts (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter_id  INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      importance  TEXT CHECK(importance IN ('core', 'supporting', 'supplementary')) DEFAULT 'core',
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS arguments (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      concept_id  INTEGER NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
      title       TEXT NOT NULL,
      description TEXT NOT NULL,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quotes (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      chapter_id  INTEGER NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
      concept_id  INTEGER REFERENCES concepts(id) ON DELETE SET NULL,
      text        TEXT NOT NULL,
      page_ref    TEXT,
      context     TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS flashcards (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id     INTEGER NOT NULL REFERENCES books(id) ON DELETE CASCADE,
      chapter_id  INTEGER REFERENCES chapters(id) ON DELETE SET NULL,
      concept_id  INTEGER REFERENCES concepts(id) ON DELETE SET NULL,
      front       TEXT NOT NULL,
      back        TEXT NOT NULL,
      difficulty  TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
      tags        TEXT,
      created_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS flashcard_reviews (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      flashcard_id    INTEGER NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
      quality         INTEGER NOT NULL CHECK(quality >= 0 AND quality <= 5),
      easiness_factor REAL NOT NULL DEFAULT 2.5,
      interval_days   INTEGER NOT NULL DEFAULT 0,
      repetitions     INTEGER NOT NULL DEFAULT 0,
      next_review     TEXT NOT NULL,
      reviewed_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE INDEX IF NOT EXISTS idx_reviews_user_next
      ON flashcard_reviews(user_id, next_review);
    CREATE INDEX IF NOT EXISTS idx_reviews_user_card
      ON flashcard_reviews(user_id, flashcard_id, reviewed_at DESC);

    CREATE TABLE IF NOT EXISTS user_flashcard_state (
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      flashcard_id    INTEGER NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
      easiness_factor REAL NOT NULL DEFAULT 2.5,
      interval_days   INTEGER NOT NULL DEFAULT 0,
      repetitions     INTEGER NOT NULL DEFAULT 0,
      next_review     TEXT NOT NULL,
      last_quality    INTEGER,
      updated_at      TEXT NOT NULL DEFAULT (datetime('now')),
      PRIMARY KEY (user_id, flashcard_id)
    );

    CREATE TABLE IF NOT EXISTS quiz_questions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      book_id         INTEGER REFERENCES books(id),
      chapter_id      INTEGER REFERENCES chapters(id),
      concept_id      INTEGER REFERENCES concepts(id),
      question_type   TEXT CHECK(question_type IN ('multiple_choice', 'short_answer')) NOT NULL,
      question_text   TEXT NOT NULL,
      correct_answer  TEXT NOT NULL,
      option_a        TEXT,
      option_b        TEXT,
      option_c        TEXT,
      option_d        TEXT,
      explanation     TEXT,
      difficulty      TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
      created_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      book_id         INTEGER REFERENCES books(id),
      chapter_id      INTEGER REFERENCES chapters(id),
      quiz_type       TEXT CHECK(quiz_type IN ('multiple_choice', 'short_answer', 'mixed', 'cross_book')) NOT NULL,
      score           REAL,
      total_questions INTEGER NOT NULL,
      correct_count   INTEGER DEFAULT 0,
      started_at      TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at    TEXT
    );

    CREATE TABLE IF NOT EXISTS quiz_answers (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      quiz_id         INTEGER NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
      question_id     INTEGER NOT NULL REFERENCES quiz_questions(id),
      user_answer     TEXT NOT NULL,
      is_correct      INTEGER NOT NULL CHECK(is_correct IN (0, 1)),
      answered_at     TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS study_sessions (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id         INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      session_type    TEXT CHECK(session_type IN ('daily', 'flashcard', 'quiz', 'tutor', 'browse')) NOT NULL,
      flashcards_reviewed INTEGER DEFAULT 0,
      quiz_score      REAL,
      duration_minutes INTEGER,
      started_at      TEXT NOT NULL DEFAULT (datetime('now')),
      completed_at    TEXT
    );

    CREATE TABLE IF NOT EXISTS connections (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      title           TEXT NOT NULL,
      description     TEXT NOT NULL,
      sin_concept_id  INTEGER REFERENCES concepts(id),
      si_concept_id   INTEGER REFERENCES concepts(id),
      sin_theme       TEXT NOT NULL,
      si_theme        TEXT NOT NULL,
      relationship    TEXT CHECK(relationship IN ('parallel', 'contrast', 'complement', 'tension')) NOT NULL,
      detailed_analysis TEXT,
      created_at      TEXT NOT NULL DEFAULT (datetime('now'))
    );

    CREATE TABLE IF NOT EXISTS tutor_conversations (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      difficulty  TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
      topic       TEXT,
      messages    TEXT NOT NULL DEFAULT '[]',
      created_at  TEXT NOT NULL DEFAULT (datetime('now')),
      updated_at  TEXT NOT NULL DEFAULT (datetime('now'))
    );
  `);
}
