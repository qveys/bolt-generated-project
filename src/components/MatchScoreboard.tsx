import React, { useState } from 'react';
import { Match, MatchScore, Team } from '../types/match';
import { Button } from '../components/common/Button';

interface MatchScoreboardProps {
  match: Match;
  onScoreUpdate: (teamId: string, points: number) => void;
}

export const MatchScoreboard: React.FC<MatchScoreboardProps> = ({ 
  match, 
  onScoreUpdate 
}) => {
  const [localScores, setLocalScores] = useState<MatchScore[]>(match.scores);

  const handleScoreChange = (teamId: string, points: number) => {
    const updatedScores = localScores.map(score => 
      score.teamId === teamId 
        ? { ...score, points: score.points + points }
        : score
    );
    
    setLocalScores(updatedScores);
    onScoreUpdate(teamId, points);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <div className="grid grid-cols-2 gap-4">
        {match.teams.map((team: Team) => {
          const teamScore = localScores.find(score => score.teamId === team.id);
          
          return (
            <div key={team.id} className="text-center">
              <h3 className="text-lg font-semibold mb-4">{team.name}</h3>
              <div className="text-3xl font-bold mb-4">
                {teamScore?.points || 0}
              </div>
              <div className="flex justify-center space-x-2">
                <Button 
                  onClick={() => handleScoreChange(team.id, 1)}
                  variant="secondary"
                >
                  +1
                </Button>
                <Button 
                  onClick={() => handleScoreChange(team.id, -1)}
                  variant="secondary"
                >
                  -1
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
