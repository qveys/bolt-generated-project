import React from 'react';
import { Calendar, Users, Trophy } from 'lucide-react';
import { FloatingLabelInput } from '../ui/FloatingLabelInput';
import { FloatingLabelSelect } from '../ui/FloatingLabelSelect';
import type { Tournament, TournamentFormat, TournamentStatus } from '../../types/tournament';

interface TournamentFormProps {
  tournament?: Partial<Tournament>;
  onSubmit: (data: Partial<Tournament>) => void;
  isLoading?: boolean;
}

export const TournamentForm: React.FC<TournamentFormProps> = ({
  tournament,
  onSubmit,
  isLoading
}) => {
  const [formData, setFormData] = React.useState<Partial<Tournament>>(
    tournament || {
      name: '',
      format: 'elimination',
      status: 'scheduled',
      start_date: new Date().toISOString().split('T')[0],
      max_participants: undefined,
      description: ''
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Tournament Details
        </h2>

        <div className="space-y-6">
          <FloatingLabelInput
            id="name"
            name="name"
            label="Tournament Name"
            value={formData.name || ''}
            onChange={handleChange}
            icon={<Trophy className="h-5 w-5" />}
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FloatingLabelSelect
              id="format"
              name="format"
              label="Tournament Format"
              value={formData.format || 'elimination'}
              onChange={handleChange}
              icon={<Trophy className="h-5 w-5" />}
              options={[
                { value: 'elimination', label: 'Single Elimination' },
                { value: 'round_robin', label: 'Round Robin' },
                { value: 'groups', label: 'Group Stage' }
              ]}
              required
            />

            <FloatingLabelSelect
              id="status"
              name="status"
              label="Tournament Status"
              value={formData.status || 'scheduled'}
              onChange={handleChange}
              icon={<Trophy className="h-5 w-5" />}
              options={[
                { value: 'scheduled', label: 'Scheduled' },
                { value: 'in_progress', label: 'In Progress' },
                { value: 'completed', label: 'Completed' },
                { value: 'cancelled', label: 'Cancelled' }
              ]}
              required
            />

            <FloatingLabelInput
              id="start_date"
              name="start_date"
              type="date"
              label="Start Date"
              value={formData.start_date?.split('T')[0] || ''}
              onChange={handleChange}
              icon={<Calendar className="h-5 w-5" />}
              required
            />

            <FloatingLabelInput
              id="max_participants"
              name="max_participants"
              type="number"
              label="Maximum Participants"
              value={formData.max_participants?.toString() || ''}
              onChange={handleChange}
              icon={<Users className="h-5 w-5" />}
              min="2"
            />
          </div>

          <div>
            <label 
              htmlFor="description" 
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              value={formData.description || ''}
              onChange={handleChange}
              className="w-full rounded-lg border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 
                text-gray-900 dark:text-white shadow-sm focus:border-blue-500 focus:ring-blue-500
                placeholder-gray-400 dark:placeholder-gray-500"
              placeholder="Enter tournament description..."
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            type="button"
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
              hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
              transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : tournament ? 'Update Tournament' : 'Create Tournament'}
          </button>
        </div>
      </div>
    </form>
  );
};
