import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import type { 
  Tournament, 
  TournamentFilters, 
  TournamentError 
} from '../types/tournament';

export function useTournaments(initialFilters: TournamentFilters = {}) {
  const [data, setData] = useState<Tournament[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [filters, setFilters] = useState(initialFilters);

  const fetchTournaments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      let query = supabase
        .from('tournaments')
        .select('*')
        .order('start_date', { ascending: false });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.format) {
        query = query.eq('format', filters.format);
      }
      if (filters.startDate) {
        query = query.gte('start_date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('end_date', filters.endDate);
      }

      const { data, error: supabaseError } = await query;

      if (supabaseError) throw supabaseError;

      setData(data as Tournament[]);
    } catch (err) {
      const tournamentError = err as TournamentError;
      console.error('Error fetching tournaments:', tournamentError);
      setError(new Error(tournamentError.message || 'Failed to load tournaments'));
    } finally {
      setIsLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchTournaments();
  }, [fetchTournaments]);

  const updateFilters = useCallback((newFilters: Partial<TournamentFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  return {
    data,
    isLoading,
    error,
    filters,
    updateFilters,
    refresh: fetchTournaments
  };
}
