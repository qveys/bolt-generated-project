import React from 'react';
import { MapPin } from 'lucide-react';
import { useAddressAutocomplete } from './context';

interface SuggestionsProps {
  onSelect: (placeId: string, description: string) => void;
  inputId?: string;
}

export const Suggestions: React.FC<SuggestionsProps> = ({ onSelect, inputId }) => {
  const { suggestions, showSuggestions, activeSuggestionIndex } = useAddressAutocomplete();

  if (!showSuggestions || !suggestions.length) return null;

  return (
    <ul
      id={`${inputId}-suggestions`}
      className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto"
      role="listbox"
    >
      {suggestions.map((suggestion, index) => (
        <li
          key={suggestion.place_id}
          id={`${inputId}-suggestion-${index}`}
          onClick={() => onSelect(suggestion.place_id, suggestion.description)}
          className={`
            px-4 py-2 cursor-pointer text-sm
            ${
              index === activeSuggestionIndex
                ? 'bg-blue-50 dark:bg-blue-900/50'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'
            }
          `}
          role="option"
          aria-selected={index === activeSuggestionIndex}
        >
          <div className="flex items-start">
            <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500 mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <div className="font-medium text-gray-900 dark:text-white">
                {suggestion.structured_formatting.main_text}
              </div>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {suggestion.structured_formatting.secondary_text}
              </div>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
};
