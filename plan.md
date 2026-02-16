# SI-SIN Study App — Implementation Plan

## Architecture Decisions
- **Content data** (books, chapters, concepts, flashcards, quiz questions, quotes, connections): Static TypeScript modules in `/src/data/content/`
- **User data**: 8 Supabase tables (6 requested + flashcard_progress + tutor_conversations)
- **Auth**: Supabase Auth with email/password
- **SQLite**: Fully removed — `better-sqlite3` dependency deleted

---

## PHASE 1: AUDIT & FIX

### Steps
1. `npm install` — fix dependency issues
2. `npm run build` — fix all build errors/warnings
3. `npm run lint` — fix linting issues
4. Manually review every page route, component, and API route
5. Test dashboard specifically
6. Fix all TypeScript errors, broken navigation, non-functional features
7. Report all findings

---

## PHASE 2: SUPABASE BACKEND

### 2A: Static Content Layer

**Create `/src/data/content/` directory** with typed data modules extracted from existing seed data:

| File | Content |
|------|---------|
| `books.ts` | Book metadata (title, author, slug, description, year) |
| `singularity-chapters.ts` | All chapters for "The Singularity Is Nearer" with concepts, arguments, quotes |
| `sovereign-chapters.ts` | All chapters for "The Sovereign Individual" with concepts, arguments, quotes |
| `flashcards.ts` | All flashcard data (front/back/difficulty/tags/book/chapter) |
| `quiz-questions.ts` | All quiz questions (question/options/answer/explanation) |
| `connections.ts` | Cross-book connections (themes, relationships, analysis) |
| `index.ts` | Helper functions: `getBook()`, `getBooks()`, `getChapter()`, `getFlashcardsByBook()`, `getQuizQuestions()`, `getConnections()` |

**Create `/src/data/content/types.ts`** — content-specific types (Book, Chapter, Concept, etc.) using string IDs instead of integer IDs.

### 2B: Supabase Database Schema

**8 tables total** — SQL migration file at `/supabase/migrations/001_initial.sql`:

```sql
-- 1. users (references auth.users)
-- 2. study_progress
-- 3. notes
-- 4. quiz_results
-- 5. highlights
-- 6. cross_references
-- 7. flashcard_progress (added for SM-2)
-- 8. tutor_conversations (added for AI tutor)
```

**flashcard_progress table:**
- id (uuid, primary key)
- user_id (uuid, references users)
- flashcard_id (text — references static flashcard data)
- easiness_factor (real, default 2.5)
- interval_days (integer, default 0)
- repetitions (integer, default 0)
- next_review (timestamptz)
- last_quality (integer, nullable)
- updated_at (timestamptz)

**tutor_conversations table:**
- id (uuid, primary key)
- user_id (uuid, references users)
- difficulty (text)
- topic (text, nullable)
- messages (jsonb — array of {role, content, timestamp})
- created_at (timestamptz)
- updated_at (timestamptz)

**RLS policies** on ALL 8 tables: users can only CRUD their own rows.
**Indexes** on user_id and book columns for all relevant tables.

### 2C: Supabase Client Setup

| File | Purpose |
|------|---------|
| `/src/lib/supabase.ts` | Browser client (createBrowserClient from @supabase/ssr) |
| `/src/lib/supabase-server.ts` | Server client (createServerClient from @supabase/ssr using cookies) |
| `/src/lib/supabase-types.ts` | Generated TypeScript types for all Supabase tables |
| `/src/middleware.ts` | Auth middleware — protect /dashboard, /flashcards, /quiz, /tutor, /daily, /notes, /connections |

**Install**: `@supabase/supabase-js` and `@supabase/ssr`
**Remove**: `better-sqlite3` and `@types/better-sqlite3`

**Env vars**: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### 2D: Auth Flow

| File | Purpose |
|------|---------|
| `/src/app/(auth)/login/page.tsx` | Sign in form |
| `/src/app/(auth)/signup/page.tsx` | Sign up form |
| `/src/app/(auth)/layout.tsx` | Auth layout (centered card) |
| `/src/app/auth/callback/route.ts` | OAuth callback handler |
| `/src/contexts/user-context.tsx` | Rewrite — replace localStorage user switching with Supabase session |

### 2E: API Route Rewrites

Every existing API route must be rewritten. The data source changes from SQLite to either static content or Supabase:

| Route | Old Source | New Source |
|-------|-----------|------------|
| `/api/users` | SQLite users table | Supabase users table |
| `/api/books` | SQLite books table | Static content `getBooks()` |
| `/api/books/[bookId]` | SQLite books + chapters | Static content `getBook(slug)` |
| `/api/books/[bookId]/chapters/[chapterId]` | SQLite chapters + concepts | Static content `getChapter(bookSlug, chapterSlug)` |
| `/api/flashcards` | SQLite flashcards | Static content `getAllFlashcards()` |
| `/api/flashcards/due` | SQLite flashcards + user_flashcard_state | Static flashcards + Supabase flashcard_progress |
| `/api/flashcards/review` | SQLite flashcard_reviews + user_flashcard_state | Supabase flashcard_progress (upsert) |
| `/api/quiz/generate` | SQLite quiz_questions | Static content `getQuizQuestions()` |
| `/api/quiz/submit` | SQLite quizzes + quiz_answers | Supabase quiz_results (single insert with JSONB answers) |
| `/api/stats` | SQLite (5 complex queries) | Supabase (quiz_results + flashcard_progress + study_progress) |
| `/api/stats/leaderboard` | SQLite cross-user query | Supabase (aggregate across users — needs special RLS or service role) |
| `/api/daily` | SQLite study_sessions | Supabase study_progress (update status) |
| `/api/tutor/chat` | SQLite tutor_conversations + Kimi API | Supabase tutor_conversations + Kimi API |
| `/api/connections` | SQLite connections table | Static content `getConnections()` |
| `/api/search` | SQLite full-text search | Static content search (in-memory) |

### 2F: Page Updates

All pages that use `useUser()` need updates for Supabase auth session. Key changes:
- `currentUser.id` changes from `number` to `string` (UUID)
- API calls pass user context via Supabase session (no more `?userId=` params)
- Add loading states and error handling to all data fetches
- Add proper sign-out functionality

### 2G: Cleanup

**Delete:**
- `/src/lib/db.ts` (SQLite connection)
- `/src/lib/schema.ts` (SQLite schema)
- `/scripts/seed-db.ts` (SQLite seeding)
- `/scripts/reset-db.ts` (SQLite reset)
- `study-app.db` file (if exists)

**Update `package.json`:**
- Remove `better-sqlite3`, `@types/better-sqlite3`, `tsx`
- Remove `"seed"` and `"reset-db"` scripts
- Add `@supabase/supabase-js`, `@supabase/ssr`

---

## PHASE 3: ENHANCEMENTS

### 3A: Dashboard Stats (real data from Supabase)
- Chapters completed per book (from study_progress)
- Quiz scores over time (from quiz_results with chart)
- Total notes count (from notes)
- Study streak (from study_progress + quiz_results timestamps)
- Replace leaderboard with personal stats (single-user auth model)

### 3B: Notes Feature
- New `/notes` page — list, create, edit, delete notes
- Notes tied to book/chapter/section
- Tag system
- Auto-save with debounce

### 3C: Highlights Feature
- New `/highlights` page — list all highlights
- Highlight management (view, edit color, add note, delete)
- Filter by book/chapter/color

### 3D: Cross-Book Connections (user-created)
- Update `/connections` page to show both static connections AND user-created ones
- Add form to create new cross_references
- Link concepts from one book to the other

### 3E: Search
- Full-text search across notes and highlights (Supabase text search)
- Also search static content (books, concepts, quotes)
- Search results page with filtering

### 3F: Dark/Light Mode
- Add `next-themes` or manual theme provider
- Toggle in header
- Respect system preference
- Persist preference in localStorage

### 3G: Mobile Responsive
- Audit all pages for mobile layout issues
- Fix any overflow, spacing, or touch target issues
- Test sidebar/mobile-nav behavior

### 3H: Export Notes
- Button on notes page: "Export as Markdown"
- Generate markdown grouped by book → chapter
- Download as .md file

---

## Final Verification
- `npm run build` — zero errors
- `npm run lint` — zero warnings
- All pages render without crashing
- All forms save to Supabase
- Auth flow works end-to-end
- Dark/light mode works
- Mobile layouts work
