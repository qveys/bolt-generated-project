import { createContext, useContext } from 'react';
import type { AddressContext } from './types';

export const AddressAutocompleteContext = createContext<AddressContext | null>(null);

export const useAddressAutocomplete = () => {
  const context = useContext(AddressAutocompleteContext);
  if (!context) {
    throw new Error('useAddressAutocomplete must be used within an AddressAutocompleteProvider');
  }
  return context;
};
