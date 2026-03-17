-- Create Questions/Topics table
CREATE TABLE public.top_questions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    topic_ar TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create ranked Answers table (1 to 10 for each question)
CREATE TABLE public.top_answers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.top_questions(id) ON DELETE CASCADE,
    answer_ar TEXT NOT NULL,
    rank INTEGER NOT NULL CHECK (rank >= 1 AND rank <= 10),
    points INTEGER NOT NULL, -- Lower rank = lower points
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active Game Sessions table (for realtime sync)
CREATE TABLE public.top_game_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID REFERENCES public.top_questions(id),
    current_team INTEGER DEFAULT 1, -- 1 or 2
    team_1_score INTEGER DEFAULT 0,
    team_2_score INTEGER DEFAULT 0,
    team_1_strikes INTEGER DEFAULT 0,
    team_2_strikes INTEGER DEFAULT 0,
    revealed_answers INTEGER[] DEFAULT '{}', -- Array of ranks (1-10) revealed
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- IMPORTANT: Enable Realtime for the active game session table
-- Go to Database -> Publications -> supabase_realtime and add this table, or run:
ALTER PUBLICATION supabase_realtime ADD TABLE public.top_game_sessions;
