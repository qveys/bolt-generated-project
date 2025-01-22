import React from 'react';
import { useTournaments } from '../../hooks/useTournaments';
import { Loading } from '../common/Loading';
import { ErrorMessage } from '../common/ErrorMessage';
import { Pagination } from '../common/Pagination';
import type { TournamentFilters } from '../../types/tournament';

export const TournamentList: React.FC = () => {
  const {
    data: tournaments,
    totalCount,
    isLoading,
    error,
    filters,
    pagination,
    updateFilters,
    updatePagination
  } = useTournaments();

  if (isLoading) {
    return <Loading size="lg" />;
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error loading tournaments"
        message={error.message}
        action={
          <button
            onClick={() => window.location.reload()}
            className="text-sm text-blue-600 hover:text-blue-500"
          >
            Try again
          </button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex gap-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
        <select
          value={filters.status}
          onChange={(e) => updateFilters({ status: e.target.value as TournamentFilters['status'] })}
          className="rounded-md border-gray-300 dark:border-gray-600"
        >
          <option value="">All Statuses</option>
          <option value="scheduled">Scheduled</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        {/* Add more filters as needed */}
      </div>

      {/* Tournament List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {tournaments.map((tournament) => (
            <div
              key={tournament.id}
              className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {tournament.name}
              </h3>
              <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                {new Date(tournament.start_date).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={pagination.page}
        totalPages={Math.ceil(totalCount / pagination.pageSize)}
        onPageChange={(page) => updatePagination({ page })}
      />
    </div>
  );
};
