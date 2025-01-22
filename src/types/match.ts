import { User } from './index';

export type MatchStatus = 'scheduled' | 'in-progress' | 'paused' | 'completed' | 'cancelled';
export type ScoringType = 'points' | 'goals' | 'sets' | 'rounds';

export interface Team {
  id: string;
  name: string;
  players: User[];
}

export interface MatchEvent {
  id: string;
  type: 'goal' | 'penalty' | 'substitution' | 'timeout';
  timestamp: string;
  player?: string;
  team: string;
  details?: Record<string, any>;
}

export interface MatchTimer {
  startTime?: string;
  pausedTime?: string;
  duration: number; // in seconds
  overtime?: number;
  status: 'running' | 'paused' | 'stopped';
}

export interface MatchScore {
  teamId: string;
  points: number;
  periodScores?: number[];
}

export interface Match {
  id: string;
  tournamentId?: string;
  eventId?: string;
  name: string;
  sport: string;
  format: string;
  status: MatchStatus;
  teams: Team[];
  scores: MatchScore[];
  timer: MatchTimer;
  events: MatchEvent[];
  startTime: string;
  endTime?: string;
  venue?: string;
  referee?: User;
  rules?: Record<string, any>;
}

export interface MatchConfiguration {
  sport: string;
  scoringType: ScoringType;
  periodCount: number;
  periodDuration: number;
  overtimeDuration?: number;
  maxSubstitutions?: number;
  maxTimeouts?: number;
}
