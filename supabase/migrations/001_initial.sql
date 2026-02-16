-- ============================================================================
-- SI-SIN Study App: Initial Migration
-- Creates all 8 core tables, RLS policies, indexes, and trigger function
-- ============================================================================

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================================
-- 1. USERS TABLE
-- ============================================================================
create table public.users (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.users enable row level security;

create policy "Users can view own data"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can insert own data"
  on public.users for insert
  with check (auth.uid() = id);

create policy "Users can update own data"
  on public.users for update
  using (auth.uid() = id);

create policy "Users can delete own data"
  on public.users for delete
  using (auth.uid() = id);

-- ============================================================================
-- 2. STUDY_PROGRESS TABLE
-- ============================================================================
create table public.study_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  book text not null,
  chapter int not null,
  section text,
  status text check (status in ('not_started', 'in_progress', 'completed')) default 'not_started' not null,
  completion_percentage int default 0 not null,
  last_studied_at timestamptz,
  created_at timestamptz default now() not null,
  unique (user_id, book, chapter)
);

alter table public.study_progress enable row level security;

create policy "Users can view own study_progress"
  on public.study_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own study_progress"
  on public.study_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own study_progress"
  on public.study_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own study_progress"
  on public.study_progress for delete
  using (auth.uid() = user_id);

create index idx_study_progress_user_id on public.study_progress(user_id);
create index idx_study_progress_book on public.study_progress(book);

-- ============================================================================
-- 3. NOTES TABLE
-- ============================================================================
create table public.notes (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  book text not null,
  chapter int not null,
  section text,
  content text not null,
  tags text[] default '{}',
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.notes enable row level security;

create policy "Users can view own notes"
  on public.notes for select
  using (auth.uid() = user_id);

create policy "Users can insert own notes"
  on public.notes for insert
  with check (auth.uid() = user_id);

create policy "Users can update own notes"
  on public.notes for update
  using (auth.uid() = user_id);

create policy "Users can delete own notes"
  on public.notes for delete
  using (auth.uid() = user_id);

create index idx_notes_user_id on public.notes(user_id);
create index idx_notes_book on public.notes(book);

-- ============================================================================
-- 4. QUIZ_RESULTS TABLE
-- ============================================================================
create table public.quiz_results (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  book text not null,
  chapter int,
  score int not null,
  total_questions int not null,
  answers jsonb not null,
  completed_at timestamptz default now() not null
);

alter table public.quiz_results enable row level security;

create policy "Users can view own quiz_results"
  on public.quiz_results for select
  using (auth.uid() = user_id);

create policy "Users can insert own quiz_results"
  on public.quiz_results for insert
  with check (auth.uid() = user_id);

create policy "Users can update own quiz_results"
  on public.quiz_results for update
  using (auth.uid() = user_id);

create policy "Users can delete own quiz_results"
  on public.quiz_results for delete
  using (auth.uid() = user_id);

create index idx_quiz_results_user_id on public.quiz_results(user_id);
create index idx_quiz_results_book on public.quiz_results(book);

-- ============================================================================
-- 5. HIGHLIGHTS TABLE
-- ============================================================================
create table public.highlights (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  book text not null,
  chapter int not null,
  highlighted_text text not null,
  note text,
  color text default 'yellow' not null,
  created_at timestamptz default now() not null
);

alter table public.highlights enable row level security;

create policy "Users can view own highlights"
  on public.highlights for select
  using (auth.uid() = user_id);

create policy "Users can insert own highlights"
  on public.highlights for insert
  with check (auth.uid() = user_id);

create policy "Users can update own highlights"
  on public.highlights for update
  using (auth.uid() = user_id);

create policy "Users can delete own highlights"
  on public.highlights for delete
  using (auth.uid() = user_id);

create index idx_highlights_user_id on public.highlights(user_id);
create index idx_highlights_book on public.highlights(book);

-- ============================================================================
-- 6. CROSS_REFERENCES TABLE
-- ============================================================================
create table public.cross_references (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  source_book text not null,
  source_chapter int not null,
  target_book text not null,
  target_chapter int not null,
  connection_note text not null,
  created_at timestamptz default now() not null
);

alter table public.cross_references enable row level security;

create policy "Users can view own cross_references"
  on public.cross_references for select
  using (auth.uid() = user_id);

create policy "Users can insert own cross_references"
  on public.cross_references for insert
  with check (auth.uid() = user_id);

create policy "Users can update own cross_references"
  on public.cross_references for update
  using (auth.uid() = user_id);

create policy "Users can delete own cross_references"
  on public.cross_references for delete
  using (auth.uid() = user_id);

create index idx_cross_references_user_id on public.cross_references(user_id);
create index idx_cross_references_source_book on public.cross_references(source_book);
create index idx_cross_references_target_book on public.cross_references(target_book);

-- ============================================================================
-- 7. FLASHCARD_PROGRESS TABLE
-- ============================================================================
create table public.flashcard_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  flashcard_id text not null,
  easiness_factor real default 2.5 not null,
  interval_days int default 0 not null,
  repetitions int default 0 not null,
  next_review timestamptz default now() not null,
  last_quality int,
  updated_at timestamptz default now() not null,
  unique (user_id, flashcard_id)
);

alter table public.flashcard_progress enable row level security;

create policy "Users can view own flashcard_progress"
  on public.flashcard_progress for select
  using (auth.uid() = user_id);

create policy "Users can insert own flashcard_progress"
  on public.flashcard_progress for insert
  with check (auth.uid() = user_id);

create policy "Users can update own flashcard_progress"
  on public.flashcard_progress for update
  using (auth.uid() = user_id);

create policy "Users can delete own flashcard_progress"
  on public.flashcard_progress for delete
  using (auth.uid() = user_id);

create index idx_flashcard_progress_user_id on public.flashcard_progress(user_id);
create index idx_flashcard_progress_flashcard_id on public.flashcard_progress(flashcard_id);

-- ============================================================================
-- 8. TUTOR_CONVERSATIONS TABLE
-- ============================================================================
create table public.tutor_conversations (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.users(id) on delete cascade not null,
  difficulty text default 'intermediate' not null,
  topic text,
  messages jsonb default '[]'::jsonb not null,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.tutor_conversations enable row level security;

create policy "Users can view own tutor_conversations"
  on public.tutor_conversations for select
  using (auth.uid() = user_id);

create policy "Users can insert own tutor_conversations"
  on public.tutor_conversations for insert
  with check (auth.uid() = user_id);

create policy "Users can update own tutor_conversations"
  on public.tutor_conversations for update
  using (auth.uid() = user_id);

create policy "Users can delete own tutor_conversations"
  on public.tutor_conversations for delete
  using (auth.uid() = user_id);

create index idx_tutor_conversations_user_id on public.tutor_conversations(user_id);

-- ============================================================================
-- TRIGGER: Auto-create user profile on auth signup
-- ============================================================================
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.users (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data->>'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
