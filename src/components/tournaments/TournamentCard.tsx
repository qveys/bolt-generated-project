import React from 'react';
import { Trophy, Calendar, Users, ArrowRight } from 'lucide-react';
import type { Tournament } from '../../types/tournament';

interface TournamentCardProps {
  tournament: Tournament;
  onClick: () => void;
}

export const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, onClick }) => {
  const statusColors = {
    scheduled: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
    in_progress: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200',
    completed: 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200',
    cancelled: 'bg-red-100 dark:bg-red-900/50 text-red-800 dark:text-red-200'
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              {tournament.name}
            </h3>
            <span className={`inline-block px-2 py-1 text-sm rounded-full mt-2 ${statusColors[tournament.status]}`}>
              {tournament.status.replace('_', ' ').charAt(0).toUpperCase() + tournament.status.slice(1)}
            </span>
          </div>
          <div className="p-2 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
            <Trophy className="h-6 w-6 text-blue-600 dark:text-blue-400" />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span>Format: {tournament.format.replace('_', ' ')}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Users className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span>
              {tournament.current_participants || 0}
              {tournament.max_participants ? ` / ${tournament.max_participants}` : ''} Participants
            </span>
          </div>
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <Calendar className="h-4 w-4 mr-2 text-gray-400 dark:text-gray-500" />
            <span>{new Date(tournament.start_date).toLocaleDateString()}</span>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
          <button 
            onClick={onClick}
            className="w-full flex items-center justify-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors"
          >
            View Tournament Details
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
