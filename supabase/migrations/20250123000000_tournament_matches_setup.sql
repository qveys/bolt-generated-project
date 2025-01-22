-- Tournament and Matches Setup Migration

-- First, create the tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add index for id to improve query performance
CREATE INDEX IF NOT EXISTS idx_tournaments_id ON tournaments(id);

-- Enable RLS for tournaments
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policy for tournaments
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable read access for all users" ON tournaments;
  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON tournaments;
  DROP POLICY IF EXISTS "Enable update for authenticated users only" ON tournaments;
  
  CREATE POLICY "Enable read access for all users" ON tournaments FOR SELECT
    USING (true);

  CREATE POLICY "Enable insert for authenticated users only" ON tournaments FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

  CREATE POLICY "Enable update for authenticated users only" ON tournaments FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
END $$;

-- Now, recreate the matches table with proper foreign key relationship
DROP TABLE IF EXISTS matches;

CREATE TABLE matches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id uuid REFERENCES tournaments(id) ON DELETE CASCADE,
  round integer NOT NULL,
  participant1_id uuid REFERENCES users(id),
  participant2_id uuid REFERENCES users(id),
  score1 integer,
  score2 integer,
  status text NOT NULL DEFAULT 'scheduled',
  start_time timestamptz NOT NULL,
  referee_id uuid REFERENCES users(id),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Add index for tournament_id to improve query performance
CREATE INDEX IF NOT EXISTS idx_matches_tournament_id ON matches(tournament_id);

-- Enable RLS for matches
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

-- Create updated_at trigger if it doesn't exist
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for matches
DROP TRIGGER IF EXISTS update_matches_updated_at ON matches;
CREATE TRIGGER update_matches_updated_at
  BEFORE UPDATE ON matches
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Add basic RLS policy for matches
DO $$ 
BEGIN
  DROP POLICY IF EXISTS "Enable read access for all users" ON matches;
  DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON matches;
  DROP POLICY IF EXISTS "Enable update for authenticated users only" ON matches;
  
  CREATE POLICY "Enable read access for all users" ON matches FOR SELECT
    USING (true);

  CREATE POLICY "Enable insert for authenticated users only" ON matches FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

  CREATE POLICY "Enable update for authenticated users only" ON matches FOR UPDATE
    USING (auth.role() = 'authenticated')
    WITH CHECK (auth.role() = 'authenticated');
END $$;

-- Add a comment to the migration
COMMENT ON TABLE tournaments IS 'Stores tournament information';
COMMENT ON TABLE matches IS 'Stores match information with tournament relationships';
