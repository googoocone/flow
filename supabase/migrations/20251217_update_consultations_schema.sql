-- Ensure consultations table has all necessary columns
ALTER TABLE consultations 
ADD COLUMN IF NOT EXISTS record_file_path TEXT,
ADD COLUMN IF NOT EXISTS transcript TEXT,
ADD COLUMN IF NOT EXISTS analysis_result JSONB,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'completed',
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id),
ADD COLUMN IF NOT EXISTS counselor_name TEXT,
ADD COLUMN IF NOT EXISTS client_name TEXT,
ADD COLUMN IF NOT EXISTS client_phone TEXT,
ADD COLUMN IF NOT EXISTS case_type TEXT;

-- Enable RLS if not already enabled
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can see their own consultations
DROP POLICY IF EXISTS "Users can view own consultations" ON consultations;
CREATE POLICY "Users can view own consultations" ON consultations
  FOR SELECT USING (auth.uid() = user_id);

-- Policy: Users can insert their own consultations
DROP POLICY IF EXISTS "Users can insert own consultations" ON consultations;
CREATE POLICY "Users can insert own consultations" ON consultations
  FOR INSERT WITH CHECK (auth.uid() = user_id);
