-- Migration: flashcards + mock_exams tables for the Learn feature expansion.
-- Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS flashcard_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  chapter_id TEXT,
  title TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  chapter_id TEXT,
  front TEXT NOT NULL,
  back TEXT NOT NULL,
  ease INTEGER NOT NULL DEFAULT 250,
  interval_days INTEGER NOT NULL DEFAULT 0,
  repetitions INTEGER NOT NULL DEFAULT 0,
  due_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT flashcards_user_front_uq UNIQUE (user_id, front)
);

CREATE INDEX IF NOT EXISTS flashcards_user_due_idx
  ON flashcards (user_id, due_at);

CREATE TABLE IF NOT EXISTS mock_exams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  track_id TEXT NOT NULL,
  duration INTEGER NOT NULL,
  total_questions INTEGER NOT NULL,
  score INTEGER,
  status TEXT NOT NULL DEFAULT 'in_progress',
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS mock_exam_responses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  exam_id UUID NOT NULL REFERENCES mock_exams(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  response INTEGER NOT NULL,
  correct INTEGER NOT NULL,
  reviewed INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT mock_exam_responses_uq UNIQUE (exam_id, question_id)
);