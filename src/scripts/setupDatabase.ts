import { supabase } from '../lib/supabaseClient';

async function setupDatabase() {
  try {
    // Drop existing matches table if it exists
    const { error: dropError } = await supabase.rpc('drop_matches_table', {});
    if (dropError) console.log('Drop table error (might not exist):', dropError.message);

    // Create matches table
    const { error: createError } = await supabase.query(`
      CREATE TABLE IF NOT EXISTS matches (
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

      -- Add index for tournament_id
      CREATE INDEX IF NOT EXISTS idx_matches_tournament_id ON matches(tournament_id);

      -- Enable RLS
      ALTER TABLE matches ENABLE ROW LEVEL SECURITY;

      -- Create RLS policies
      CREATE POLICY "Enable read access for all users" ON matches FOR SELECT
        USING (true);

      CREATE POLICY "Enable insert for authenticated users only" ON matches FOR INSERT
        WITH CHECK (auth.role() = 'authenticated');

      CREATE POLICY "Enable update for authenticated users only" ON matches FOR UPDATE
        USING (auth.role() = 'authenticated')
        WITH CHECK (auth.role() = 'authenticated');
    `);

    if (createError) {
      console.error('Error creating matches table:', createError);
      return;
    }

    console.log('Database setup completed successfully!');
  } catch (error) {
    console.error('Error setting up database:', error);
  }
}

setupDatabase();
