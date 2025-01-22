import React, { useState, useRef, useCallback } from 'react';
import { useGoogleMaps } from '../../../hooks/useGoogleMaps';
import { useDebounce } from '../../../hooks/useDebounce';
import { AddressAutocompleteContext } from './context';
import { AddressInput } from './AddressInput';
import { Suggestions } from './Suggestions';
import type { AddressAutocompleteProps, AddressDetails } from './types';

/**
 * AddressAutocomplete Component
 * 
 * A fully-featured address autocomplete component that uses the Google Places API
 * to provide address suggestions and validation.
 * 
 * Features:
 * - Address autocompletion with Google Places API
 * - Keyboard navigation support
 * - Accessibility compliance
 * - Error handling and loading states
 * - Debounced API calls
 * - Restricted to Belgium and France addresses
 * 
 * @example
 * ```tsx
 * <AddressAutocomplete
 *   value={address}
 *   onChange={setAddress}
 *   onAddressSelect={(addressData) => {
 *     console.log('Selected address:', addressData);
 *   }}
 *   required
 *   label="Address"
 * />
 * ```
 */
export const AddressAutocomplete: React.FC<AddressAutocompleteProps> = ({
  value,
  onChange,
  onAddressSelect,
  label,
  required,
  error: externalError,
  className,
  placeholder,
  disabled,
  id = 'address-autocomplete',
  name,
}) => {
  // State management
  const [suggestions, setSuggestions] = useState<google.maps.places.AutocompletePrediction[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [internalError, setInternalError] = useState<string | null>(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  // Refs for Google Services
  const autocompleteService = useRef<google.maps.places.AutocompleteService | null>(null);
  const placesService = useRef<google.maps.places.PlacesService | null>(null);
  const sessionToken = useRef<google.maps.places.AutocompleteSessionToken | null>(null);

  // Custom hooks
  const { isLoaded, loadError } = useGoogleMaps();
  const debouncedSearchValue = useDebounce(value, 300);

  // Initialize Google Places services
  React.useEffect(() => {
    if (!isLoaded || !window.google?.maps?.places) return;

    try {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      const dummyDiv = document.createElement('div');
      placesService.current = new window.google.maps.places.PlacesService(dummyDiv);
      sessionToken.current = new window.google.maps.places.AutocompleteSessionToken();
      setInternalError(null);
    } catch (error) {
      console.error('Error initializing Places services:', error);
      setInternalError('Error initializing address search');
    }
  }, [isLoaded]);

  // Fetch suggestions when input changes
  React.useEffect(() => {
    const fetchSuggestions = async () => {
      if (!autocompleteService.current || !debouncedSearchValue || debouncedSearchValue.length < 3) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const request = {
          input: debouncedSearchValue,
          componentRestrictions: { country: ['BE', 'FR'] },
          types: ['address'],
          sessionToken: sessionToken.current
        };

        autocompleteService.current.getPlacePredictions(
          request,
          (predictions, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && predictions) {
              setSuggestions(predictions);
              setShowSuggestions(true);
              setInternalError(null);
            } else {
              setSuggestions([]);
              setInternalError('No suggestions found');
            }
            setIsLoading(false);
          }
        );
      } catch (error) {
        console.error('Error fetching suggestions:', error);
        setSuggestions([]);
        setInternalError('Error fetching suggestions');
        setIsLoading(false);
      }
    };

    if (isLoaded) {
      fetchSuggestions();
    }
  }, [debouncedSearchValue, isLoaded]);

  // Handle address selection
  const handleAddressSelect = useCallback(async (placeId: string, description: string) => {
    if (!placesService.current) return;

    try {
      onChange(description);
      setShowSuggestions(false);
      setIsLoading(true);

      const place = await new Promise<google.maps.places.PlaceResult>((resolve, reject) => {
        placesService.current?.getDetails(
          {
            placeId,
            fields: ['formatted_address', 'address_components', 'geometry']
          },
          (result, status) => {
            if (status === google.maps.places.PlacesServiceStatus.OK && result) {
              resolve(result);
            } else {
              reject(status);
            }
          }
        );
      });

      const getAddressComponent = (type: string): string => {
        return place.address_components?.find(component => 
          component.types.includes(type)
        )?.long_name || '';
      };

      const streetNumber = getAddressComponent('street_number');
      const route = getAddressComponent('route');
      const street = streetNumber && route ? `${streetNumber} ${route}` : route;

      const addressData: AddressDetails = {
        formatted: place.formatted_address || description,
        street,
        city: getAddressComponent('locality'),
        postalCode: getAddressComponent('postal_code'),
        country: getAddressComponent('country'),
        coordinates: {
          lat: place.geometry?.location?.lat() || 0,
          lng: place.geometry?.location?.lng() || 0
        }
      };

      onAddressSelect(addressData);
      setInternalError(null);
      sessionToken.current = new google.maps.places.AutocompleteSessionToken();
    } catch (error) {
      console.error('Error fetching place details:', error);
      setInternalError('Error retrieving address details');
    } finally {
      setIsLoading(false);
    }
  }, [onChange, onAddressSelect]);

  // Combine external and internal errors
  const error = externalError || internalError || (loadError && 'Failed to load Google Maps API');

  // Provide context values
  const contextValue = {
    suggestions,
    setSuggestions,
    activeSuggestionIndex,
    setActiveSuggestionIndex,
    isLoading,
    setIsLoading,
    showSuggestions,
    setShowSuggestions,
    error: error || null,
    setError: setInternalError,
  };

  return (
    <AddressAutocompleteContext.Provider value={contextValue}>
      <div className="relative">
        <AddressInput
          value={value}
          onChange={onChange}
          label={label}
          required={required}
          error={error}
          className={className}
          placeholder={placeholder}
          disabled={disabled || !isLoaded}
          id={id}
          name={name}
        />
        <Suggestions onSelect={handleAddressSelect} inputId={id} />
      </div>
    </AddressAutocompleteContext.Provider>
  );
};
