import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TournamentCard } from './TournamentCard';
import type { Tournament } from '../../types/tournament';

interface TournamentGridProps {
  tournaments: Tournament[];
}

export const TournamentGrid: React.FC<TournamentGridProps> = ({ tournaments }) => {
  const navigate = useNavigate();

  if (tournaments.length === 0) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white">
          No tournaments found
        </h3>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Get started by creating your first tournament.
        </p>
        <button
          onClick={() => navigate('/tournaments/create')}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Tournament
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {tournaments.map((tournament) => (
        <TournamentCard
          key={tournament.id}
          tournament={tournament}
          onClick={() => navigate(`/tournaments/${tournament.id}`)}
        />
      ))}
    </div>
  );
};
