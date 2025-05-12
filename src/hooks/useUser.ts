'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore, useUIStore } from '@/store/useStore';
import { voterAPI } from '@/services/api'; // Change import from userAPI to voterAPI

interface UserProfile {
  fullName?: string;
  email?: string;
  phoneNumber?: string;
  address?: string;
  nin?: string;
  vin?: string;
  dob?: string; // Assuming API returns date as string
  gender?: string;
  state?: string;
  lga?: string;
  ward?: string;
  pollingUnit?: string;
  bio?: string;
  isVerified?: boolean;
  // Add any other fields returned by the API
}

export function useUser() {
  const { user: authUser, token, setAuth, isAuthenticated } = useAuthStore();
  const { setLoading, setError } = useUIStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  const fetchProfile = useCallback(async () => {
    if (!token) return; // Need token to fetch profile
    setLoading(true);
    setError(null); // Clear error before fetching
    try {
      const data = await voterAPI.getProfile(); // Use voterAPI instead of userAPI
      setProfile(data); // Assuming data matches UserProfile structure
       // Optionally update auth store if profile contains relevant info like isVerified
      if (authUser && data.isVerified !== undefined && authUser.isVerified !== data.isVerified) {
         const updatedUser = { ...authUser, isVerified: data.isVerified };
         // Need a way to update only the user part without resetting token
         // This might require an update to useAuthStore's setAuth or a new action
         // For now, we'll just update local state
      }
    } catch (error: any) {
      setError(error.message || 'Failed to fetch profile');
      console.error('Fetch profile error:', error);
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError, authUser]);

  const updateProfile = useCallback(async (profileData: Partial<UserProfile>) => {
    if (!token) return false; // Need token to update
    setLoading(true);
    setError(null); // Clear error before updating
    try {
      const updatedData = await voterAPI.updateProfile(profileData); // Use voterAPI instead of userAPI
      setProfile(prev => ({ ...(prev || {}), ...updatedData }));
      // Update auth store if necessary (e.g., if name/email changed)
      if (authUser && (updatedData.fullName || updatedData.email || updatedData.phoneNumber)) {
        const updatedAuthUser = { 
          ...authUser, 
          fullName: updatedData.fullName ?? authUser.fullName,
          email: updatedData.email ?? authUser.email,
          phoneNumber: updatedData.phoneNumber ?? authUser.phoneNumber,
        };
        // This might require an update to useAuthStore's setAuth or a new action
        // For now, we only update local state which might not reflect everywhere
      }
      return true; // Indicate success
    } catch (error: any) {
      setError(error.message || 'Failed to update profile');
      console.error('Update profile error:', error);
      return false; // Indicate failure
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError, authUser]);

  // Fetch profile on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      fetchProfile();
    }
  }, [isAuthenticated, token, fetchProfile]);

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