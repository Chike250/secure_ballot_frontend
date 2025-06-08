'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore, useUIStore } from '@/store/useStore';
import { voterAPI } from '@/services/api';

interface PollingUnit {
  id: string;
  name: string;
  code: string;
  address: string | null;
}

interface DetailedPollingUnit {
  id: string;
  pollingUnitCode: string;
  pollingUnitName: string;
  state: string;
  lga: string;
  ward: string;
  geolocation: any | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  registeredVoters: number;
  assignedOfficer: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

interface VoterCard {
  vin: string;
  pollingUnitCode: string;
  pollingUnit: PollingUnit | null;
}

interface UserProfile {
  id: string;
  nin: string;
  vin: string;
  phoneNumber: string;
  dateOfBirth: string;
  fullName: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
  mfaEnabled: boolean;
  publicKey: string | null;
  verification: any | null;
  voterCard: VoterCard;
  // Additional fields for profile editing
  email?: string;
  address?: string;
  gender?: string;
  state?: string;
  lga?: string;
  ward?: string;
  bio?: string;
  isVerified?: boolean;
}

interface ApiResponse {
  success: boolean;
  data: UserProfile;
}

export function useUser() {
  const { user: authUser, token, updateUser, isAuthenticated } = useAuthStore();
  const { setLoading, setError } = useUIStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [lastFetch, setLastFetch] = useState<number>(0);
  const CACHE_DURATION = 30000; // 30 seconds cache

  const fetchProfile = useCallback(async (force = false) => {
    if (!token) {
      console.log('No token available for profile fetch');
      return;
    }
    
    // Check cache unless forced
    const now = Date.now();
    if (!force && profile && (now - lastFetch < CACHE_DURATION)) {
      console.log('Using cached profile data');
      return;
    }
    
    console.log('Fetching profile from API...');
    setLoading(true);
    setError(null);
    try {
      const response: ApiResponse = await voterAPI.getProfile();
      console.log('Profile API response:', response);
      
      if (response.success && response.data) {
        setProfile(response.data);
        setLastFetch(now);
        
        // Update auth store with latest profile data
        updateUser({
          fullName: response.data.fullName,
          phoneNumber: response.data.phoneNumber,
          nin: response.data.nin,
          vin: response.data.vin,
          dateOfBirth: response.data.dateOfBirth,
          isVerified: response.data.verification !== null,
          pollingUnitCode: response.data.voterCard?.pollingUnitCode,
        });
        
        console.log('Profile loaded successfully');
      } else {
        console.warn('Profile API returned unsuccessful response:', response);
        setError('Failed to load profile data');
      }
    } catch (error: any) {
      console.error('Fetch profile error:', error);
      setError(error.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError]); // Removed problematic dependencies

  const updateProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    if (!token) return false;
    setLoading(true);
    setError(null);
    try {
      const response = await voterAPI.updateProfile(profileData);
      
      if (response.success && response.data) {
        setProfile(prev => prev ? { ...prev, ...response.data } : response.data);
        
        // Update auth store with updated data
        updateUser({
          fullName: response.data.fullName,
          phoneNumber: response.data.phoneNumber,
        });
        
        // Update cache timestamp
        setLastFetch(Date.now());
        return true;
      }
      return false;
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
      console.error('Update profile error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError]); // Stable dependencies only

  // REMOVED automatic fetching - now controlled manually
  // Components should call fetchProfile() explicitly when needed

  return {
    profile,
    fetchProfile,
    updateProfile,
  };
}

// NOTE: Requires implementation of userAPI.getProfile and userAPI.updateProfile
// in src/services/api.ts using the /api/v1/voter/profile endpoint.
// Also consider enhancing useAuthStore to allow partial user updates.
// Update Note:
// NOTE: Uses voterAPI.getProfile and voterAPI.updateProfile from src/services/api.ts 