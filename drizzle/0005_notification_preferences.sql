-- Migration: create notification_preferences table.
-- Run against DATABASE_URL. Idempotent.

CREATE TABLE IF NOT EXISTS notification_preferences (
  user_id TEXT PRIMARY KEY REFERENCES "user"(id) ON DELETE CASCADE,
  reminders BOOLEAN NOT NULL DEFAULT TRUE,
  exam_alerts BOOLEAN NOT NULL DEFAULT TRUE,
  quiet_start TEXT NOT NULL DEFAULT '22:00',
  quiet_end TEXT NOT NULL DEFAULT '07:00',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
