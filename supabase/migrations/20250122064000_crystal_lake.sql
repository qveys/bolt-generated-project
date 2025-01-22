-- Migration 5: Create matches table with proper foreign key relationship
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
CREATE INDEX idx_matches_tournament_id ON matches(tournament_id);
