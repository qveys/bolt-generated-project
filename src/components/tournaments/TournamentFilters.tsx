import React from 'react';
import { Search, Filter, Calendar } from 'lucide-react';
import type { TournamentFilters } from '../../types/tournament';

interface TournamentFilterProps {
  filters: TournamentFilters;
  onFilterChange: (filters: Partial<TournamentFilters>) => void;
  onSearchChange: (search: string) => void;
  searchTerm: string;
}

export const TournamentFilters: React.FC<TournamentFilterProps> = ({
  filters,
  onFilterChange,
  onSearchChange,
  searchTerm
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
          <input
            type="text"
            placeholder="Search tournaments..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
              bg-white dark:bg-gray-700 text-gray-900 dark:text-white 
              placeholder-gray-500 dark:placeholder-gray-400"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <select
              value={filters.status || ''}
              onChange={(e) => onFilterChange({ status: e.target.value || undefined })}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                appearance-none cursor-pointer"
            >
              <option value="">All Status</option>
              <option value="scheduled">Scheduled</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 h-5 w-5" />
            <input
              type="date"
              value={filters.startDate || ''}
              onChange={(e) => onFilterChange({ startDate: e.target.value || undefined })}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
                bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
