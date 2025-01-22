import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, Search, Filter, ArrowUpDown } from 'lucide-react';
import { useTournaments } from '../../hooks/useTournaments';
import { Loading } from '../../components/common/Loading';
import { ErrorMessage } from '../../components/common/ErrorMessage';
import type { TournamentStatus, TournamentFormat } from '../../types/tournament';

const TournamentsList: React.FC = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<TournamentStatus | 'all'>('all');
  const [formatFilter, setFormatFilter] = useState<TournamentFormat | 'all'>('all');
  const [sortBy, setSortBy] = useState<'name' | 'start_date'>('start_date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const {
    data: tournaments,
    isLoading,
    error,
    updateFilters,
    refresh
  } = useTournaments({
    status: statusFilter !== 'all' ? statusFilter : undefined,
    format: formatFilter !== 'all' ? formatFilter : undefined,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage
        title="Error loading tournaments"
        message={error.message}
        action={
          <button
            onClick={refresh}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        }
      />
    );
  }

  const filteredTournaments = tournaments
    .filter(tournament => {
      const matchesSearch = tournament.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return sortOrder === 'asc' 
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else {
        return sortOrder === 'asc'
          ? new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
          : new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
      }
    });

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tournaments</h1>
          <p className="text-gray-600 dark:text-gray-400">Manage and monitor all tournaments</p>
        </div>
        <button
          onClick={() => navigate('/tournaments/create')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Tournament
        </button>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tournaments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
          <div className="flex gap-4">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <select
                value={statusFilter}
                onChange={(e) => {
                  const value = e.target.value as TournamentStatus | 'all';
                  setStatusFilter(value);
                  updateFilters({ status: value !== 'all' ? value : undefined });
                }}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="scheduled">Scheduled</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div className="relative">
              <Trophy className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
              <select
                value={formatFilter}
                onChange={(e) => {
                  const value = e.target.value as TournamentFormat | 'all';
                  setFormatFilter(value);
                  updateFilters({ format: value !== 'all' ? value : undefined });
                }}
                className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Types</option>
                <option value="elimination">Elimination</option>
                <option value="round_robin">Round Robin</option>
                <option value="groups">Groups</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Tournaments List */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
        <div className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          {/* Table Header */}
          <div className="bg-gray-50 dark:bg-gray-700/50">
            <div className="grid grid-cols-4 gap-4 px-6 py-3">
              <button
                onClick={() => {
                  setSortBy('name');
                  setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
                }}
                className="flex items-center gap-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Tournament Name
                <ArrowUpDown className={`h-4 w-4 ${sortBy === 'name' ? 'text-blue-500' : ''}`} />
              </button>
              <button
                onClick={() => {
                  setSortBy('start_date');
                  setSortOrder(current => current === 'asc' ? 'desc' : 'asc');
                }}
                className="flex items-center gap-2 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
              >
                Date
                <ArrowUpDown className={`h-4 w-4 ${sortBy === 'start_date' ? 'text-blue-500' : ''}`} />
              </button>
              <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Status
              </div>
              <div className="text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Actions
              </div>
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {filteredTournaments.length === 0 ? (
              <div className="px-6 py-8 text-center text-gray-500 dark:text-gray-400">
                No tournaments found
              </div>
            ) : (
              filteredTournaments.map((tournament) => (
                <div key={tournament.id} className="grid grid-cols-4 gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/50 rounded-lg flex items-center justify-center">
                      <Trophy className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{tournament.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{tournament.format}</div>
                    </div>
                  </div>
                  <div className="flex items-center text-sm text-gray-900 dark:text-white">
                    {new Date(tournament.start_date).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                      ${tournament.status === 'in_progress' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                        tournament.status === 'scheduled' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                        tournament.status === 'completed' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200' :
                        'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'}`}>
                      {tournament.status.replace('_', ' ').charAt(0).toUpperCase() + tournament.status.slice(1)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate(`/tournaments/${tournament.id}`)}
                      className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TournamentsList;
