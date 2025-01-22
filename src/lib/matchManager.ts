import { Match, MatchStatus, MatchEvent, MatchScore } from '../types/match';
import { supabase } from './supabaseClient';

export class MatchManager {
  private match: Match;

  constructor(match: Match) {
    this.match = match;
  }

  // Create a new match
  static async createMatch(matchData: Partial<Match>): Promise<Match> {
    const { data, error } = await supabase
      .from('matches')
      .insert([matchData])
      .select()
      .single();

    if (error) throw new Error(`Match creation failed: ${error.message}`);
    return data;
  }

  // Update match status
  async updateStatus(status: MatchStatus): Promise<void> {
    const { error } = await supabase
      .from('matches')
      .update({ status })
      .eq('id', this.match.id);

    if (error) throw new Error(`Status update failed: ${error.message}`);
    this.match.status = status;
  }

  // Record a scoring event
  async recordScore(teamId: string, points: number): Promise<void> {
    const currentScores = this.match.scores;
    const teamScoreIndex = currentScores.findIndex(score => score.teamId === teamId);

    if (teamScoreIndex === -1) {
      currentScores.push({ teamId, points });
    } else {
      currentScores[teamScoreIndex].points += points;
      currentScores[teamScoreIndex].periodScores?.push(points);
    }

    const { error } = await supabase
      .from('matches')
      .update({ scores: currentScores })
      .eq('id', this.match.id);

    if (error) throw new Error(`Score update failed: ${error.message}`);
  }

  // Record a match event
  async recordEvent(event: MatchEvent): Promise<void> {
    const { error } = await supabase
      .from('match_events')
      .insert([{ ...event, match_id: this.match.id }]);

    if (error) throw new Error(`Event recording failed: ${error.message}`);
    this.match.events.push(event);
  }

  // Manage match timer
  async updateTimer(timerData: Partial<Match['timer']>): Promise<void> {
    const updatedTimer = { ...this.match.timer, ...timerData };

    const { error } = await supabase
      .from('matches')
      .update({ timer: updatedTimer })
      .eq('id', this.match.id);

    if (error) throw new Error(`Timer update failed: ${error.message}`);
    this.match.timer = updatedTimer;
  }

  // Validate and finalize match result
  async finalizeMatch(): Promise<void> {
    // Determine winner based on scoring rules
    const winner = this.determineWinner();

    const { error } = await supabase
      .from('matches')
      .update({
        status: 'completed',
        end_time: new Date().toISOString(),
        winner_id: winner?.id
      })
      .eq('id', this.match.id);

    if (error) throw new Error(`Match finalization failed: ${error.message}`);
  }

  private determineWinner(): Team | null {
    const { scores } = this.match;
    const sortedScores = [...scores].sort((a, b) => b.points - a.points);
    
    if (sortedScores[0].points > sortedScores[1].points) {
      return this.match.teams.find(team => team.id === sortedScores[0].teamId) || null;
    }

    return null; // Draw scenario
  }
}
