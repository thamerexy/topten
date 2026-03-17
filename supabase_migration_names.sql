-- Migration to add Custom Team Names to existing active sessions table
-- We use ADD COLUMN IF NOT EXISTS to prevent errors if this is run multiple times

ALTER TABLE public.top_game_sessions 
ADD COLUMN IF NOT EXISTS team_1_name VARCHAR(50) DEFAULT 'الفريق الأول',
ADD COLUMN IF NOT EXISTS team_2_name VARCHAR(50) DEFAULT 'الفريق الثاني';

-- No need to drop or restart realtime for this, as it is just adding new columns.
