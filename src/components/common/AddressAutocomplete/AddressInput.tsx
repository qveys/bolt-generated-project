import React, { useRef, useCallback } from 'react';
import { MapPin } from 'lucide-react';
import { useAddressAutocomplete } from './context';
import type { AddressAutocompleteProps } from './types';

export const AddressInput: React.FC<
  Omit<AddressAutocompleteProps, 'onAddressSelect'>
> = ({
  value,
  onChange,
  label,
  required,
  error,
  className = '',
  placeholder = 'Enter an address...',
  disabled,
  id,
  name,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const {
    suggestions,
    showSuggestions,
    setShowSuggestions,
    isLoading,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
  } = useAddressAutocomplete();

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (!showSuggestions || !suggestions.length) return;

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault();
          setActiveSuggestionIndex((prev) =>
            prev < suggestions.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          e.preventDefault();
          setActiveSuggestionIndex((prev) => (prev > 0 ? prev - 1 : 0));
          break;
        case 'Escape':
          setShowSuggestions(false);
          break;
      }
    },
    [showSuggestions, suggestions.length, setActiveSuggestionIndex, setShowSuggestions]
  );

  return (
    <div className="relative">
      <div className="relative">
        {label && (
          <label
            htmlFor={id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400 dark:text-gray-500" />
          </div>
          <input
            ref={inputRef}
            type="text"
            id={id}
            name={name}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => value.length >= 3 && setShowSuggestions(true)}
            onBlur={() => {
              // Delay hiding suggestions to allow clicking them
              setTimeout(() => setShowSuggestions(false), 200);
            }}
            disabled={disabled}
            required={required}
            aria-label={label}
            aria-required={required}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            aria-expanded={showSuggestions}
            aria-autocomplete="list"
            aria-controls={showSuggestions ? `${id}-suggestions` : undefined}
            aria-activedescendant={
              showSuggestions && activeSuggestionIndex >= 0
                ? `${id}-suggestion-${activeSuggestionIndex}`
                : undefined
            }
            role="combobox"
            className={`
              block w-full pl-10 pr-4 py-2 border rounded-lg
              ${error
                ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
                : 'border-gray-300 dark:border-gray-600 focus:border-blue-500 focus:ring-blue-500'
              }
              bg-white dark:bg-gray-700 
              text-gray-900 dark:text-white
              placeholder-gray-500 dark:placeholder-gray-400
              disabled:bg-gray-50 dark:disabled:bg-gray-800
              disabled:text-gray-500 dark:disabled:text-gray-400
              ${className}
            `}
            placeholder={placeholder}
          />
          {isLoading && (
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-blue-600"></div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <p
          id={`${id}-error`}
          className="mt-1 text-sm text-red-600 dark:text-red-400"
          role="alert"
        >
          {error}
        </p>
      )}
    </div>
  );
};
