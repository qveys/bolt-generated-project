import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Trophy, Calendar, Users, MapPin, Clock } from 'lucide-react';
import TournamentBracket from '../../components/tournaments/TournamentBracket';
import type { Tournament } from '../../types';
import { supabase } from '../../lib/supabaseClient';
import { Loading } from '../../components/common/Loading';

const TournamentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [matches, setMatches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTournamentData = async () => {
      try {
        if (!id) throw new Error('Tournament ID is required');

        // Fetch tournament details
        const { data: tournamentData, error: tournamentError } = await supabase
          .from('tournaments')
          .select('*')
          .eq('id', id)
          .single();

        if (tournamentError) throw tournamentError;
        if (!tournamentData) throw new Error('Tournament not found');

        // Fetch matches for the tournament
        const { data: matchesData, error: matchesError } = await supabase
          .from('matches')
          .select('*')
          .eq('tournament_id', id)
          .order('round', { ascending: true });

        if (matchesError) throw matchesError;

        // Combine the data
        const fullTournament: Tournament = {
          ...tournamentData,
          matches: matchesData || []
        };

        setTournament(fullTournament);
        setMatches(matchesData || []);
      } catch (err) {
        console.error('Error fetching tournament:', err);
        setError(err instanceof Error ? err.message : 'Failed to load tournament');
      } finally {
        setLoading(false);
      }
    };

    fetchTournamentData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" />
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {error || 'Tournament not found'}
        </h2>
        <button
          onClick={() => navigate('/tournaments')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Back to Tournaments
        </button>
      </div>
    );
  }

  // Rest of the component remains the same...
  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Tournament Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        {/* ... existing header content ... */}
      </div>

      {/* Tournament Bracket */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Tournament Bracket
          </h2>
        </div>
        <TournamentBracket tournament={{ ...tournament, matches }} />
      </div>

      {/* Participants List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        {/* ... existing participants content ... */}
      </div>
    </div>
  );
};

export default TournamentDetails;
