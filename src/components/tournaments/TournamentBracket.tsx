import React from 'react';
import type { Match, Tournament } from '../../types';

interface BracketProps {
  tournament: Tournament;
}

const TournamentBracket: React.FC<BracketProps> = ({ tournament }) => {
  const rounds = Math.max(...tournament.matches.map(match => match.round));
  
  const matchesByRound = Array.from({ length: rounds }, (_, i) => {
    return tournament.matches.filter(match => match.round === i + 1);
  });

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px] p-6">
        <div className="flex justify-between items-start gap-8">
          {matchesByRound.map((roundMatches, roundIndex) => (
            <div
              key={roundIndex}
              className="flex-1"
            >
              <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300 mb-4">
                {getRoundName(roundIndex + 1, rounds)}
              </h3>
              <div className="space-y-4">
                {roundMatches.map((match) => (
                  <MatchCard key={match.id} match={match} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const MatchCard: React.FC<{ match: Match }> = ({ match }) => {
  const statusStyles = {
    scheduled: 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800',
    inProgress: 'border-blue-200 dark:border-blue-500/30 bg-blue-50/50 dark:bg-blue-900/20',
    completed: 'border-green-200 dark:border-green-500/30 bg-green-50/50 dark:bg-green-900/20'
  };

  const getScoreStyle = (score1?: number, score2?: number) => {
    if (!score1 || !score2) return '';
    if (score1 > score2) return 'text-green-600 dark:text-green-400 font-bold';
    if (score1 < score2) return 'text-gray-500 dark:text-gray-400';
    return 'text-gray-700 dark:text-gray-300'; // Tie
  };

  return (
    <div className={`border-2 ${statusStyles[match.status]} rounded-lg shadow-sm transition-colors duration-200`}>
      <div className="p-4 space-y-3">
        {/* Participant 1 */}
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${
            match.score1 && match.score2 && match.score1 > match.score2
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {match.participant1}
          </span>
          <span className={`text-sm ${getScoreStyle(match.score1, match.score2)}`}>
            {match.score1 ?? '-'}
          </span>
        </div>

        {/* Participant 2 */}
        <div className="flex justify-between items-center">
          <span className={`text-sm font-medium ${
            match.score1 && match.score2 && match.score2 > match.score1
              ? 'text-gray-900 dark:text-white'
              : 'text-gray-700 dark:text-gray-300'
          }`}>
            {match.participant2}
          </span>
          <span className={`text-sm ${getScoreStyle(match.score2, match.score1)}`}>
            {match.score2 ?? '-'}
          </span>
        </div>

        {/* Match Info */}
        <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {new Date(match.startTime).toLocaleDateString()}
            </span>
            <span className={`
              text-xs px-2 py-1 rounded-full
              ${match.status === 'completed' 
                ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300'
                : match.status === 'inProgress'
                ? 'bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }
            `}>
              {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

const getRoundName = (round: number, totalRounds: number): string => {
  if (round === totalRounds) return 'Final';
  if (round === totalRounds - 1) return 'Semi-Finals';
  if (round === totalRounds - 2) return 'Quarter-Finals';
  return `Round ${round}`;
};

export default TournamentBracket;
