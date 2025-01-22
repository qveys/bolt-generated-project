export type TournamentStatus = 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
export type TournamentFormat = 'elimination' | 'round_robin' | 'groups';

export interface Tournament {
  id: string;
  name: string;
  description?: string;
  format: TournamentFormat;
  start_date: string;
  end_date?: string;
  status: TournamentStatus;
  venue_id?: string;
  max_participants?: number;
  current_participants?: number;
  created_at: string;
  updated_at: string;
}

export interface TournamentFilters {
  status?: TournamentStatus;
  format?: TournamentFormat;
  startDate?: string;
  endDate?: string;
  venueId?: string;
}

export interface TournamentError extends Error {
  code?: string;
  details?: string;
  hint?: string;
}
