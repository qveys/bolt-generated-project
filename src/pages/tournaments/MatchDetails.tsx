import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { MatchTimer } from '../../components/MatchTimer';
import { MatchScoreboard } from '../../components/MatchScoreboard';
import { MatchManager } from '../../lib/matchManager';
import { Match, MatchConfiguration } from '../../types/match';
import { supabase } from '../../lib/supabaseClient';

const defaultMatchConfig: MatchConfiguration = {
  sport: 'water-polo',
  scoringType: 'goals',
  periodCount: 4,
  periodDuration: 480, // 8 minutes
  overtimeDuration: 300, // 5 minutes
  maxSubstitutions: 6,
  maxTimeouts: 2
};

const MatchDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [match, setMatch] = useState<Match | null>(null);
  const [matchManager, setMatchManager] = useState<MatchManager | null>(null);

  useEffect(() => {
    const fetchMatch = async () => {
      if (!id) return;

      try {
        const { data, error } = await supabase
          .from('matches')
          .select('*')
          .eq('id', id)
          .single();

        if (error) throw error;
        
        const newMatch = data as Match;
        setMatch(newMatch);
        setMatchManager(new MatchManager(newMatch));
      } catch (error) {
        console.error('Error fetching match:', error);
      }
    };

    fetchMatch();
  }, [id]);

  const handleTimerUpdate = async (timerData: Match['timer']) => {
    if (!matchManager) return;

    try {
      await matchManager.updateTimer(timerData);
    } catch (error) {
      console.error('Timer update failed:', error);
    }
  };

  const handleScoreUpdate = async (teamId: string, points: number) => {
    if (!matchManager) return;

    try {
      await matchManager.recordScore(teamId, points);
    } catch (error) {
      console.error('Score update failed:', error);
    }
  };

  const handleMatchFinalization = async () => {
    if (!matchManager) return;

    try {
      await matchManager.finalizeMatch();
    } catch (error) {
      console.error('Match finalization failed:', error);
    }
  };

  if (!match) return <div>Loading match details...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-4">{match.name}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MatchTimer 
            initialTimer={match.timer} 
            onTimerUpdate={handleTimerUpdate} 
          />
          
          <MatchScoreboard 
            match={match} 
            onScoreUpdate={handleScoreUpdate} 
          />
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button 
            variant="secondary"
            onClick={() => matchManager?.updateStatus('paused')}
          >
            Pause Match
          </Button>
          <Button 
            variant="primary"
            onClick={handleMatchFinalization}
          >
            Finalize Match
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
