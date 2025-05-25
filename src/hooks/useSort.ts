import { useState, useCallback } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
  key: keyof T;
  direction: SortDirection;
}

interface SortOptions<T> {
  initialSort?: SortConfig<T>;
}

interface SortState<T> {
  sortConfig: SortConfig<T> | null;
}

interface SortActions<T> {
  sort: (key: keyof T) => void;
  clearSort: () => void;
  sortItems: (items: T[]) => T[];
}

export const useSort = <T extends Record<string, any>>({
  initialSort,
}: SortOptions<T> = {}): SortState<T> & SortActions<T> => {
  const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(
    initialSort || null
  );

  const sort = useCallback(
    (key: keyof T) => {
      setSortConfig((currentSort) => {
        if (!currentSort || currentSort.key !== key) {
          return { key, direction: 'asc' };
        }

        if (currentSort.direction === 'asc') {
          return { key, direction: 'desc' };
        }

        return null;
      });
    },
    []
  );

  const clearSort = useCallback(() => {
    setSortConfig(null);
  }, []);

  const sortItems = useCallback(
    (items: T[]): T[] => {
      if (!sortConfig) return items;

      return [...items].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc'
            ? aValue - bValue
            : bValue - aValue;
        }

        if ((aValue as any) instanceof Date && (bValue as any) instanceof Date) {
          return sortConfig.direction === 'asc'
            ? (aValue as Date).getTime() - (bValue as Date).getTime()
            : (bValue as Date).getTime() - (aValue as Date).getTime();
        }

        return 0;
      });
    },
    [sortConfig]
  );

  return {
    sortConfig,
    sort,
    clearSort,
    sortItems,
  };
}; 