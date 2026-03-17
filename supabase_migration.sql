-- Since it is a testing database, the easiest and safest way to clear the array schema error
-- is to drop the active sessions table and recreate it with the exact JSONB schema we need.
-- This does NOT touch your questions or answers!

-- 1. Drop the table
DROP TABLE IF EXISTS public.top_game_sessions;

-- 2. Recreate with the JSONB column
CREATE TABLE public.top_game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.top_questions(id),
    current_team INTEGER DEFAULT 1, -- 1 or 2
    team_1_score INTEGER DEFAULT 0,
    team_2_score INTEGER DEFAULT 0,
    team_1_strikes INTEGER DEFAULT 0,
    team_2_strikes INTEGER DEFAULT 0,
    revealed_answers JSONB DEFAULT '{}'::jsonb, -- Map of Rank -> Team ID (e.g., {"1": 1})
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Re-enable realtime!
ALTER PUBLICATION supabase_realtime ADD TABLE public.top_game_sessions;
