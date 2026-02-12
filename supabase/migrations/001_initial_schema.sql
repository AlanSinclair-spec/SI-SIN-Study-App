-- ============================================================================
-- SI-SIN Study App — Complete Supabase Schema
-- ============================================================================

-- ─── CONTENT TABLES (read-only reference data) ───────────────────────────

CREATE TABLE books (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title       TEXT NOT NULL,
  author      TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  cover_url   TEXT,
  year        INTEGER,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE chapters (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id     UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  number      INTEGER NOT NULL,
  title       TEXT NOT NULL,
  slug        TEXT NOT NULL,
  subtitle    TEXT,
  summary     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now(),
  UNIQUE(book_id, number)
);
CREATE INDEX idx_chapters_book_id ON chapters(book_id);

CREATE TABLE concepts (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id  UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  importance  TEXT CHECK(importance IN ('core', 'supporting', 'supplementary')) DEFAULT 'core',
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_concepts_chapter_id ON concepts(chapter_id);

CREATE TABLE arguments (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  concept_id  UUID NOT NULL REFERENCES concepts(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_arguments_concept_id ON arguments(concept_id);

CREATE TABLE quotes (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  chapter_id  UUID NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  concept_id  UUID REFERENCES concepts(id) ON DELETE SET NULL,
  text        TEXT NOT NULL,
  page_ref    TEXT,
  context     TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_quotes_chapter_id ON quotes(chapter_id);

CREATE TABLE flashcards (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id     UUID NOT NULL REFERENCES books(id) ON DELETE CASCADE,
  chapter_id  UUID REFERENCES chapters(id) ON DELETE SET NULL,
  concept_id  UUID REFERENCES concepts(id) ON DELETE SET NULL,
  front       TEXT NOT NULL,
  back        TEXT NOT NULL,
  difficulty  TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
  tags        TEXT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_flashcards_book_id ON flashcards(book_id);
CREATE INDEX idx_flashcards_chapter_id ON flashcards(chapter_id);

CREATE TABLE quiz_questions (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  book_id         UUID REFERENCES books(id),
  chapter_id      UUID REFERENCES chapters(id),
  concept_id      UUID REFERENCES concepts(id),
  question_type   TEXT CHECK(question_type IN ('multiple_choice', 'short_answer')) NOT NULL,
  question_text   TEXT NOT NULL,
  correct_answer  TEXT NOT NULL,
  option_a        TEXT,
  option_b        TEXT,
  option_c        TEXT,
  option_d        TEXT,
  explanation     TEXT,
  difficulty      TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
  created_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_quiz_questions_book_id ON quiz_questions(book_id);

CREATE TABLE connections (
  id                UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title             TEXT NOT NULL,
  description       TEXT NOT NULL,
  sin_concept_id    UUID REFERENCES concepts(id),
  si_concept_id     UUID REFERENCES concepts(id),
  sin_theme         TEXT NOT NULL,
  si_theme          TEXT NOT NULL,
  relationship      TEXT CHECK(relationship IN ('parallel', 'contrast', 'complement', 'tension')) NOT NULL,
  detailed_analysis TEXT,
  created_at        TIMESTAMPTZ DEFAULT now()
);

-- ─── USER TABLES ─────────────────────────────────────────────────────────

CREATE TABLE users (
  id           UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email        TEXT NOT NULL,
  display_name TEXT NOT NULL,
  avatar_url   TEXT,
  created_at   TIMESTAMPTZ DEFAULT now(),
  updated_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_users_email ON users(email);

CREATE TABLE study_progress (
  id                    UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id               UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book                  TEXT NOT NULL,
  chapter               INTEGER NOT NULL,
  section               TEXT,
  status                TEXT CHECK(status IN ('not_started', 'in_progress', 'completed')) DEFAULT 'not_started',
  completion_percentage INTEGER DEFAULT 0,
  last_studied_at       TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_study_progress_user_id ON study_progress(user_id);
CREATE INDEX idx_study_progress_book ON study_progress(book);

CREATE TABLE notes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book       TEXT NOT NULL,
  chapter    INTEGER NOT NULL,
  section    TEXT,
  content    TEXT NOT NULL,
  tags       TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_notes_user_id ON notes(user_id);
CREATE INDEX idx_notes_book ON notes(book);

CREATE TABLE quiz_results (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book            TEXT NOT NULL,
  chapter         INTEGER,
  score           INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  answers         JSONB NOT NULL DEFAULT '[]',
  completed_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_quiz_results_user_id ON quiz_results(user_id);
CREATE INDEX idx_quiz_results_book ON quiz_results(book);

CREATE TABLE highlights (
  id               UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id          UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  book             TEXT NOT NULL,
  chapter          INTEGER NOT NULL,
  highlighted_text TEXT NOT NULL,
  note             TEXT,
  color            TEXT DEFAULT 'yellow',
  created_at       TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_highlights_user_id ON highlights(user_id);
CREATE INDEX idx_highlights_book ON highlights(book);

CREATE TABLE cross_references (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  source_book     TEXT NOT NULL,
  source_chapter  INTEGER NOT NULL,
  target_book     TEXT NOT NULL,
  target_chapter  INTEGER NOT NULL,
  connection_note TEXT NOT NULL,
  created_at      TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_cross_references_user_id ON cross_references(user_id);

CREATE TABLE user_flashcard_state (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flashcard_id    UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  easiness_factor REAL NOT NULL DEFAULT 2.5,
  interval_days   INTEGER NOT NULL DEFAULT 0,
  repetitions     INTEGER NOT NULL DEFAULT 0,
  next_review     DATE NOT NULL DEFAULT CURRENT_DATE,
  last_quality    INTEGER,
  updated_at      TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, flashcard_id)
);
CREATE INDEX idx_ufs_user_id ON user_flashcard_state(user_id);
CREATE INDEX idx_ufs_next_review ON user_flashcard_state(user_id, next_review);

CREATE TABLE flashcard_reviews (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  flashcard_id    UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  quality         INTEGER NOT NULL CHECK(quality >= 0 AND quality <= 5),
  easiness_factor REAL NOT NULL DEFAULT 2.5,
  interval_days   INTEGER NOT NULL DEFAULT 0,
  repetitions     INTEGER NOT NULL DEFAULT 0,
  next_review     DATE NOT NULL,
  reviewed_at     TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_fr_user_next ON flashcard_reviews(user_id, next_review);
CREATE INDEX idx_fr_user_card ON flashcard_reviews(user_id, flashcard_id, reviewed_at DESC);

CREATE TABLE tutor_conversations (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  difficulty TEXT CHECK(difficulty IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'intermediate',
  topic      TEXT,
  messages   JSONB NOT NULL DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_tutor_user_id ON tutor_conversations(user_id);

CREATE TABLE study_sessions (
  id                  UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id             UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  session_type        TEXT CHECK(session_type IN ('daily', 'flashcard', 'quiz', 'tutor', 'browse')) NOT NULL,
  flashcards_reviewed INTEGER DEFAULT 0,
  quiz_score          REAL,
  duration_minutes    INTEGER,
  started_at          TIMESTAMPTZ DEFAULT now(),
  completed_at        TIMESTAMPTZ
);
CREATE INDEX idx_ss_user_id ON study_sessions(user_id);

-- ─── ROW LEVEL SECURITY ─────────────────────────────────────────────────

-- Content tables: authenticated users can read
ALTER TABLE books ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read books" ON books FOR SELECT TO authenticated USING (true);

ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read chapters" ON chapters FOR SELECT TO authenticated USING (true);

ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read concepts" ON concepts FOR SELECT TO authenticated USING (true);

ALTER TABLE arguments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read arguments" ON arguments FOR SELECT TO authenticated USING (true);

ALTER TABLE quotes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read quotes" ON quotes FOR SELECT TO authenticated USING (true);

ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read flashcards" ON flashcards FOR SELECT TO authenticated USING (true);

ALTER TABLE quiz_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read quiz_questions" ON quiz_questions FOR SELECT TO authenticated USING (true);

ALTER TABLE connections ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Authenticated can read connections" ON connections FOR SELECT TO authenticated USING (true);

-- User table: users can read/update own profile
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON users FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON users FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON users FOR INSERT WITH CHECK (auth.uid() = id);

-- User data tables: full CRUD on own rows
ALTER TABLE study_progress ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own study_progress" ON study_progress FOR ALL USING (auth.uid() = user_id);

ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own notes" ON notes FOR ALL USING (auth.uid() = user_id);

ALTER TABLE quiz_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own quiz_results" ON quiz_results FOR ALL USING (auth.uid() = user_id);

ALTER TABLE highlights ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own highlights" ON highlights FOR ALL USING (auth.uid() = user_id);

ALTER TABLE cross_references ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own cross_references" ON cross_references FOR ALL USING (auth.uid() = user_id);

ALTER TABLE user_flashcard_state ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own flashcard_state" ON user_flashcard_state FOR ALL USING (auth.uid() = user_id);

ALTER TABLE flashcard_reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own flashcard_reviews" ON flashcard_reviews FOR ALL USING (auth.uid() = user_id);

ALTER TABLE tutor_conversations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own tutor_conversations" ON tutor_conversations FOR ALL USING (auth.uid() = user_id);

ALTER TABLE study_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users own study_sessions" ON study_sessions FOR ALL USING (auth.uid() = user_id);

-- ─── TRIGGER: Auto-create user profile on auth signup ────────────────────

CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email, display_name)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── RPC FUNCTIONS ───────────────────────────────────────────────────────

-- Get due flashcards for SM-2 review
CREATE OR REPLACE FUNCTION get_due_flashcards(p_user_id UUID, p_limit INTEGER DEFAULT 20)
RETURNS TABLE(
  id UUID, book_id UUID, chapter_id UUID, concept_id UUID,
  front TEXT, back TEXT, difficulty TEXT, tags TEXT,
  book_title TEXT, chapter_title TEXT,
  easiness_factor REAL, interval_days INTEGER, repetitions INTEGER,
  next_review DATE, last_quality INTEGER
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    f.id, f.book_id, f.chapter_id, f.concept_id,
    f.front, f.back, f.difficulty, f.tags,
    b.title AS book_title, ch.title AS chapter_title,
    s.easiness_factor, s.interval_days, s.repetitions,
    s.next_review, s.last_quality
  FROM flashcards f
  JOIN books b ON f.book_id = b.id
  LEFT JOIN chapters ch ON f.chapter_id = ch.id
  LEFT JOIN user_flashcard_state s ON f.id = s.flashcard_id AND s.user_id = p_user_id
  WHERE s.next_review IS NULL OR s.next_review <= CURRENT_DATE
  ORDER BY
    CASE WHEN s.next_review IS NULL THEN 1 ELSE 0 END,
    s.next_review ASC,
    random()
  LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user stats for dashboard
CREATE OR REPLACE FUNCTION get_user_stats(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
  v_total_reviews BIGINT;
  v_accuracy REAL;
  v_unique_cards BIGINT;
  v_total_quizzes BIGINT;
  v_avg_score REAL;
  v_best_score INTEGER;
  v_streak INTEGER;
  v_chapters_studied BIGINT;
  v_session_count BIGINT;
  v_total_notes BIGINT;
  v_study_dates DATE[];
  v_today DATE;
  v_expected DATE;
  v_i INTEGER;
BEGIN
  -- Flashcard stats
  SELECT COUNT(*), COALESCE(ROUND(AVG(CASE WHEN quality >= 3 THEN 1.0 ELSE 0.0 END) * 100, 1), 0), COUNT(DISTINCT flashcard_id)
  INTO v_total_reviews, v_accuracy, v_unique_cards
  FROM flashcard_reviews WHERE user_id = p_user_id;

  -- Quiz stats
  SELECT COUNT(*), COALESCE(ROUND(AVG(score)::numeric, 1), 0), COALESCE(MAX(score), 0)
  INTO v_total_quizzes, v_avg_score, v_best_score
  FROM quiz_results WHERE user_id = p_user_id;

  -- Study streak
  SELECT ARRAY_AGG(DISTINCT d ORDER BY d DESC) INTO v_study_dates FROM (
    SELECT DATE(started_at) AS d FROM study_sessions WHERE user_id = p_user_id
    UNION
    SELECT DATE(reviewed_at) AS d FROM flashcard_reviews WHERE user_id = p_user_id
    UNION
    SELECT DATE(completed_at) AS d FROM quiz_results WHERE user_id = p_user_id
  ) dates;

  v_today := CURRENT_DATE;
  v_streak := 0;
  IF v_study_dates IS NOT NULL THEN
    FOR v_i IN 1..array_length(v_study_dates, 1) LOOP
      v_expected := v_today - (v_i - 1);
      IF v_study_dates[v_i] = v_expected THEN
        v_streak := v_streak + 1;
      ELSIF v_i = 1 AND v_study_dates[1] = v_today - 1 THEN
        v_streak := 1;
      ELSE
        EXIT;
      END IF;
    END LOOP;
  END IF;

  -- Chapters studied
  SELECT COUNT(DISTINCT sub.chapter_id) INTO v_chapters_studied FROM (
    SELECT f.chapter_id FROM flashcard_reviews fr
    JOIN flashcards f ON fr.flashcard_id = f.id
    WHERE fr.user_id = p_user_id AND f.chapter_id IS NOT NULL
  ) sub;

  -- Session count
  SELECT COUNT(*) INTO v_session_count FROM study_sessions WHERE user_id = p_user_id;

  -- Notes count
  SELECT COUNT(*) INTO v_total_notes FROM notes WHERE user_id = p_user_id;

  result := json_build_object(
    'total_flashcards_reviewed', v_total_reviews,
    'unique_cards_reviewed', v_unique_cards,
    'flashcard_accuracy', v_accuracy,
    'total_quizzes_taken', v_total_quizzes,
    'avg_quiz_score', v_avg_score,
    'best_quiz_score', v_best_score,
    'study_streak', v_streak,
    'chapters_studied', v_chapters_studied,
    'total_study_sessions', v_session_count,
    'total_notes', v_total_notes
  );

  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get leaderboard (cross-user aggregation)
CREATE OR REPLACE FUNCTION get_leaderboard()
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(row_to_json(t)) INTO result FROM (
    SELECT
      u.id AS user_id,
      u.display_name AS user_name,
      COALESCE((SELECT COUNT(*) FROM flashcard_reviews WHERE user_id = u.id), 0) AS flashcards_reviewed,
      COALESCE((SELECT ROUND(AVG(CASE WHEN quality >= 3 THEN 1.0 ELSE 0.0 END) * 100, 1) FROM flashcard_reviews WHERE user_id = u.id), 0) AS flashcard_accuracy,
      COALESCE((SELECT COUNT(*) FROM quiz_results WHERE user_id = u.id), 0) AS quizzes_taken,
      COALESCE((SELECT ROUND(AVG(score)::numeric, 1) FROM quiz_results WHERE user_id = u.id), 0) AS avg_quiz_score,
      COALESCE((SELECT COUNT(*) FROM study_sessions WHERE user_id = u.id), 0) AS study_sessions
    FROM users u
    ORDER BY (
      COALESCE((SELECT COUNT(*) FROM flashcard_reviews WHERE user_id = u.id), 0) * 1 +
      COALESCE((SELECT COUNT(*) FROM quiz_results WHERE user_id = u.id), 0) * 5 +
      COALESCE((SELECT COUNT(*) FROM study_sessions WHERE user_id = u.id), 0) * 3
    ) DESC
  ) t;

  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get weak concepts from quiz misses
CREATE OR REPLACE FUNCTION get_weak_concepts(p_user_id UUID)
RETURNS JSON AS $$
DECLARE
  result JSON;
BEGIN
  SELECT json_agg(row_to_json(t)) INTO result FROM (
    SELECT
      c.title,
      c.id,
      COUNT(*) AS miss_count,
      ch.title AS chapter_title,
      b.title AS book_title
    FROM quiz_results qr,
    jsonb_array_elements(qr.answers) AS ans
    JOIN quiz_questions qq ON qq.id = (ans->>'question_id')::uuid
    JOIN concepts c ON qq.concept_id = c.id
    JOIN chapters ch ON c.chapter_id = ch.id
    JOIN books b ON ch.book_id = b.id
    WHERE qr.user_id = p_user_id
      AND (ans->>'is_correct')::boolean = false
    GROUP BY c.id, c.title, ch.title, b.title
    ORDER BY miss_count DESC
    LIMIT 5
  ) t;

  RETURN COALESCE(result, '[]'::json);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
