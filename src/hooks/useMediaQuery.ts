import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Create a MediaQueryList object
    const mediaQuery = window.matchMedia(query);

    // Set the initial value
    setMatches(mediaQuery.matches);

    // Define a callback function to handle changes
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Add the callback as a listener for changes to the media query
    mediaQuery.addEventListener('change', handleChange);

    // Clean up
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query]);

  return matches;
}

// Common media query breakpoints
export const breakpoints = {
  xs: '(max-width: 639px)',
  sm: '(min-width: 640px) and (max-width: 767px)',
  md: '(min-width: 768px) and (max-width: 1023px)',
  lg: '(min-width: 1024px) and (max-width: 1279px)',
  xl: '(min-width: 1280px)',
  'sm-up': '(min-width: 640px)',
  'md-up': '(min-width: 768px)',
  'lg-up': '(min-width: 1024px)',
  'xl-up': '(min-width: 1280px)',
  'sm-down': '(max-width: 767px)',
  'md-down': '(max-width: 1023px)',
  'lg-down': '(max-width: 1279px)',
  'xl-down': '(max-width: 1279px)',
} as const;

// Predefined hooks for common breakpoints
export const useIsMobile = () => useMediaQuery(breakpoints['sm-down']);
export const useIsTablet = () => useMediaQuery(breakpoints.md);
export const useIsDesktop = () => useMediaQuery(breakpoints['lg-up']);
export const useIsLargeDesktop = () => useMediaQuery(breakpoints.xl); 