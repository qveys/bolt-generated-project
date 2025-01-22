-- Migration: Update tournaments table structure

-- Create or replace the updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add new columns if they don't exist
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tournaments' AND column_name = 'description') THEN
    EXECUTE 'ALTER TABLE tournaments ADD COLUMN description text;';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tournaments' AND column_name = 'format') THEN
    EXECUTE 'ALTER TABLE tournaments ADD COLUMN format text;';  -- Add without default
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tournaments' AND column_name = 'start_date') THEN
    EXECUTE 'ALTER TABLE tournaments ADD COLUMN start_date timestamptz NOT NULL DEFAULT now();';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tournaments' AND column_name = 'end_date') THEN
    EXECUTE 'ALTER TABLE tournaments ADD COLUMN end_date timestamptz;';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tournaments' AND column_name = 'status') THEN
    EXECUTE 'ALTER TABLE tournaments ADD COLUMN status text;';  -- Add without default
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tournaments' AND column_name = 'venue_id') THEN
    EXECUTE 'ALTER TABLE tournaments ADD COLUMN venue_id uuid REFERENCES venues(id);';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tournaments' AND column_name = 'max_participants') THEN
    EXECUTE 'ALTER TABLE tournaments ADD COLUMN max_participants integer;';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'tournaments' AND column_name = 'current_participants') THEN
    EXECUTE 'ALTER TABLE tournaments ADD COLUMN current_participants integer DEFAULT 0;';
  END IF;

  -- Create ENUM types if they don't exist
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tournament_format') THEN
    EXECUTE 'CREATE TYPE tournament_format AS ENUM (''elimination'', ''round_robin'', ''groups'');';
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'tournament_status') THEN
    EXECUTE 'CREATE TYPE tournament_status AS ENUM (''scheduled'', ''in_progress'', ''completed'', ''cancelled'');';
  END IF;

  -- Update existing rows to set default value for format
  EXECUTE 'UPDATE tournaments SET format = ''elimination'' WHERE format IS NULL;';

  -- Update existing rows to set default value for status
  EXECUTE 'UPDATE tournaments SET status = ''scheduled'' WHERE status IS NULL;';

  -- Update column types to use ENUMs
  EXECUTE 'ALTER TABLE tournaments 
    ALTER COLUMN format TYPE tournament_format 
    USING format::tournament_format;';

  EXECUTE 'ALTER TABLE tournaments 
    ALTER COLUMN status TYPE tournament_status 
    USING status::tournament_status;';

  -- Set default value for new rows
  EXECUTE 'ALTER TABLE tournaments ALTER COLUMN format SET DEFAULT ''elimination'';';
  EXECUTE 'ALTER TABLE tournaments ALTER COLUMN status SET DEFAULT ''scheduled'';';

  -- Add constraints if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE table_name = 'tournaments' AND constraint_name = 'check_participants_count'
  ) THEN
    EXECUTE 'ALTER TABLE tournaments
    ADD CONSTRAINT check_participants_count 
    CHECK (current_participants <= max_participants);';
  END IF;

  -- Create indexes if they don't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'tournaments' AND indexname = 'idx_tournaments_status'
  ) THEN
    EXECUTE 'CREATE INDEX idx_tournaments_status ON tournaments(status);';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'tournaments' AND indexname = 'idx_tournaments_format'
  ) THEN
    EXECUTE 'CREATE INDEX idx_tournaments_format ON tournaments(format);';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes 
    WHERE tablename = 'tournaments' AND indexname = 'idx_tournaments_start_date'
  ) THEN
    EXECUTE 'CREATE INDEX idx_tournaments_start_date ON tournaments(start_date);';
  END IF;

  -- Create trigger if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 FROM pg_trigger 
    WHERE tgname = 'update_tournaments_updated_at'
  ) THEN
    EXECUTE 'CREATE TRIGGER update_tournaments_updated_at
      BEFORE UPDATE ON tournaments
      FOR EACH ROW
      EXECUTE FUNCTION update_updated_at_column();';
  END IF;

END $$;

-- Add comments
COMMENT ON TABLE tournaments IS 'Stores tournament information with extended fields for better organization';
COMMENT ON COLUMN tournaments.format IS 'Tournament format: elimination, round_robin, or groups';
COMMENT ON COLUMN tournaments.status IS 'Tournament status: scheduled, in_progress, completed, or cancelled';

-- Add RLS Policies
DROP POLICY IF EXISTS "Enable read access for all users" ON tournaments;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON tournaments;
DROP POLICY IF EXISTS "Enable update for authenticated users only" ON tournaments;

CREATE POLICY "Enable read access for all users" ON tournaments
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON tournaments
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable update for authenticated users only" ON tournaments
  FOR UPDATE USING (auth.role() = 'authenticated')
  WITH CHECK (auth.role() = 'authenticated');
	