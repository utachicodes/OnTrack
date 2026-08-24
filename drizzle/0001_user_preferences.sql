-- Migration: create user_preferences table for theme + accent color
-- Run this against your DATABASE_URL.
-- Idempotent: safe to re-run.

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'theme_preference') THEN
    CREATE TYPE theme_preference AS ENUM ('light', 'dark', 'system');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'accent_color') THEN
    CREATE TYPE accent_color AS ENUM ('coral', 'indigo', 'emerald', 'amber', 'violet', 'rose');
  END IF;
END$$;

CREATE TABLE IF NOT EXISTS user_preferences (
  user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  theme_preference theme_preference NOT NULL DEFAULT 'system',
  accent_color accent_color NOT NULL DEFAULT 'coral',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
