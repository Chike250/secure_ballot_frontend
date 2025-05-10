import { useState, useCallback, useMemo } from 'react';

interface SearchOptions<T> {
  initialQuery?: string;
  initialFilters?: Partial<Record<keyof T, any>>;
  searchFields?: (keyof T)[];
}

interface SearchState<T> {
  query: string;
  filters: Partial<Record<keyof T, any>>;
  searchFields: (keyof T)[];
}

interface SearchActions<T> {
  setQuery: (query: string) => void;
  setFilter: (field: keyof T, value: any) => void;
  clearFilters: () => void;
  clearSearch: () => void;
  reset: () => void;
}

export const useSearch = <T extends Record<string, any>>({
  initialQuery = '',
  initialFilters = {},
  searchFields = [],
}: SearchOptions<T> = {}): SearchState<T> & SearchActions<T> => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<Partial<Record<keyof T, any>>>(
    initialFilters
  );

  const setFilter = useCallback((field: keyof T, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  const clearSearch = useCallback(() => {
    setQuery('');
  }, []);

  const reset = useCallback(() => {
    setQuery(initialQuery);
    setFilters(initialFilters);
  }, [initialQuery, initialFilters]);

  const searchItems = useCallback(
    (items: T[]): T[] => {
      return items.filter((item) => {
        // Apply search query
        if (query) {
          const matchesQuery = searchFields.some((field) => {
            const value = item[field];
            if (value == null) return false;
            return String(value)
              .toLowerCase()
              .includes(query.toLowerCase());
          });
          if (!matchesQuery) return false;
        }

        // Apply filters
        return Object.entries(filters).every(([field, value]) => {
          if (value == null) return true;
          const itemValue = item[field as keyof T];
          if (itemValue == null) return false;
          return String(itemValue).toLowerCase() === String(value).toLowerCase();
        });
      });
    },
    [query, filters, searchFields]
  );

  return {
    query,
    filters,
    searchFields,
    setQuery,
    setFilter,
    clearFilters,
    clearSearch,
    reset,
    searchItems,
  };
}; 