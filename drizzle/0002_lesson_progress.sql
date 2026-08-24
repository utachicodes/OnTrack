-- Migration: lesson_progress + user_xp tables for the Learn feature.
-- Run against DATABASE_URL. Idempotent: safe to re-run.

CREATE TABLE IF NOT EXISTS lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  lesson_id TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  xp_awarded INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT lesson_progress_user_lesson_uq UNIQUE (user_id, lesson_id),
  CONSTRAINT lesson_progress_score_range CHECK (score BETWEEN 0 AND 100),
  CONSTRAINT lesson_progress_xp_nonneg CHECK (xp_awarded >= 0)
);

CREATE INDEX IF NOT EXISTS lesson_progress_user_completed_idx
  ON lesson_progress (user_id, completed_at DESC);

CREATE TABLE IF NOT EXISTS user_xp (
  user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  xp INTEGER NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT user_xp_nonneg CHECK (xp >= 0)
);