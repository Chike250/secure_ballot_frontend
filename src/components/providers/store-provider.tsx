'use client';

import { ReactNode } from 'react';
import { useAuthStore } from '@/store/useStore';
import { useElectionStore } from '@/store/useStore';
import { useUIStore } from '@/store/useStore';

interface StoreProviderProps {
  children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
  // Initialize stores
  useAuthStore();
  useElectionStore();
  useUIStore();

  return <>{children}</>;
} 