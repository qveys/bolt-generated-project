import { useState, useEffect } from 'react';

interface UseGoogleMapsOptions {
  libraries?: string[];
}

declare global {
  interface Window {
    initGoogleMapsCallback?: () => void;
  }
}

export const useGoogleMaps = (options: UseGoogleMapsOptions = {}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadError, setLoadError] = useState<Error | null>(null);

  useEffect(() => {
    // If the API is already loaded, don't load it again
    if (window.google?.maps?.places) {
      setIsLoaded(true);
      return;
    }

    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      setLoadError(new Error('Google Maps API key is missing'));
      return;
    }

    // Create a global callback function
    window.initGoogleMapsCallback = () => {
      setIsLoaded(true);
    };

    // Load the script
    const script = document.createElement('script');
    const libraries = ['places']; // Always include places
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=${libraries.join(',')}&callback=initGoogleMapsCallback`;
    script.async = true;
    script.defer = true;

    // Handle errors
    script.onerror = () => {
      setLoadError(new Error('Failed to load Google Maps API'));
      if (window.initGoogleMapsCallback) {
        delete window.initGoogleMapsCallback;
      }
    };

    // Add the script to the document
    document.head.appendChild(script);

    // Cleanup
    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
      if (window.initGoogleMapsCallback) {
        delete window.initGoogleMapsCallback;
      }
    };
  }, []);

  return { isLoaded, loadError };
};
