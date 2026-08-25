ALTER TABLE ai_conversations ADD COLUMN IF NOT EXISTS messages text NOT NULL DEFAULT '[]';
