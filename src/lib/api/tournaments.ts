import { supabase } from '../supabaseClient';
import type { 
  Tournament, 
  TournamentFilters, 
  PaginationParams, 
  TournamentError 
} from '../../types/tournament';

export class TournamentAPI {
  static async fetchTournaments(
    filters: TournamentFilters = {},
    pagination: PaginationParams = { page: 1, pageSize: 10 }
  ) {
    try {
      // Calculate offset
      const offset = (pagination.page - 1) * pagination.pageSize;

      // Start building the query
      let query = supabase
        .from('tournaments')
        .select('*', { count: 'exact' });

      // Apply filters
      if (filters.status) {
        query = query.eq('status', filters.status);
      }
      if (filters.format) {
        query = query.eq('format', filters.format);
      }
      if (filters.venueId) {
        query = query.eq('venue_id', filters.venueId);
      }
      if (filters.startDate) {
        query = query.gte('start_date', filters.startDate);
      }
      if (filters.endDate) {
        query = query.lte('end_date', filters.endDate);
      }

      // Apply pagination
      query = query
        .range(offset, offset + pagination.pageSize - 1)
        .order('start_date', { ascending: true });

      // Execute query
      const { data, error, count } = await query;

      if (error) {
        throw new Error(error.message);
      }

      return {
        data: data as Tournament[],
        count: count || 0,
        error: null
      };

    } catch (error) {
      const tournamentError: TournamentError = error instanceof Error ? error : new Error('Unknown error occurred');
      console.error('Error fetching tournaments:', tournamentError);
      return {
        data: [],
        count: 0,
        error: tournamentError
      };
    }
  }

  static async fetchTournamentById(id: string) {
    try {
      const { data, error } = await supabase
        .from('tournaments')
        .select(`
          *,
          matches (
            id,
            round,
            participant1_id,
            participant2_id,
            score1,
            score2,
            status,
            start_time
          ),
          venue:venue_id (
            id,
            name,
            address,
            city
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      return {
        data: data as Tournament,
        error: null
      };

    } catch (error) {
      const tournamentError: TournamentError = error instanceof Error ? error : new Error('Unknown error occurred');
      console.error('Error fetching tournament:', tournamentError);
      return {
        data: null,
        error: tournamentError
      };
    }
  }
}
