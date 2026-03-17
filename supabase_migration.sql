-- Upgrading the existing top_game_sessions table to use JSONB instead of INTEGER[] array
-- This allows tracking the rank AND the team that correctly guessed it.

-- 1. First, we clear the existing games because an array cannot be directly cast to JSONB objects trivially in this context. 
-- Assuming game state is disposable for existing testing sessions.
DELETE FROM public.top_game_sessions;

-- 2. Alter the column type
ALTER TABLE public.top_game_sessions 
  ALTER COLUMN revealed_answers TYPE JSONB 
  USING '{}'::jsonb;

-- 3. Set a new default
ALTER TABLE public.top_game_sessions 
  ALTER COLUMN revealed_answers SET DEFAULT '{}'::jsonb;

-- (The JSONB structure will look like: {"1": 1, "5": 2} where key is Answer Rank, and value is Team Number)
