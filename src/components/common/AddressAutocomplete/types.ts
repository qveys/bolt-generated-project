import type { Dispatch, SetStateAction } from 'react';

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface AddressDetails {
  formatted: string;
  street: string;
  city: string;
  postalCode: string;
  country: string;
  coordinates: Coordinates;
}

export interface AddressAutocompleteProps {
  /** Current input value */
  value: string;
  /** Callback when input value changes */
  onChange: (value: string) => void;
  /** Callback when an address is selected from suggestions */
  onAddressSelect: (address: AddressDetails) => void;
  /** Input label */
  label?: string;
  /** Whether the field is required */
  required?: boolean;
  /** Error message to display */
  error?: string;
  /** Additional CSS classes */
  className?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Whether to disable the input */
  disabled?: boolean;
  /** ID for the input element */
  id?: string;
  /** Name for the input element */
  name?: string;
}

export interface AddressContext {
  suggestions: google.maps.places.AutocompletePrediction[];
  setSuggestions: Dispatch<SetStateAction<google.maps.places.AutocompletePrediction[]>>;
  activeSuggestionIndex: number;
  setActiveSuggestionIndex: Dispatch<SetStateAction<number>>;
  isLoading: boolean;
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  showSuggestions: boolean;
  setShowSuggestions: Dispatch<SetStateAction<boolean>>;
  error: string | null;
  setError: Dispatch<SetStateAction<string | null>>;
}
