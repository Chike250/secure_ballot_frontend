import { useCallback } from 'react';
import { voterAPI } from '@/services/api';
import { useUIStore } from '@/store/useStore';

// Define interfaces for polling unit data
interface PollingUnit {
  id: string;
  code: string;
  name: string;
  ward: string;
  lga: string;
  state: string;
  location?: {
    latitude: number;
    longitude: number;
  };
  status: 'active' | 'inactive';
  registeredVoters: number;
  address?: string;
  openingHours?: string;
  contactDetails?: string;
  distance?: number; // Only when fetching nearby units
}

export const usePollingUnit = () => {
  const { setLoading, setError } = useUIStore();

  const getNearbyPollingUnits = useCallback(
    async (data: {
      latitude: number;
      longitude: number;
      radius?: number;
      limit?: number;
    }) => {
      try {
        setLoading(true);
        setError(null);
        const response = await voterAPI.getNearbyPollingUnits(data.latitude, data.longitude, data.radius);
        return response.data;
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch nearby polling units');
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [setLoading, setError]
  );

  const getUserLocation = useCallback(async (): Promise<{ latitude: number; longitude: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        setError('Geolocation is not supported by your browser');
        reject(new Error('Geolocation not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          let errorMessage = 'Failed to get your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access was denied';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          setError(errorMessage);
          reject(new Error(errorMessage));
        }
      );
    });
  }, [setError]);

  const findNearestPollingUnit = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get user's current location
      const location = await getUserLocation();
      
      // Fetch nearby polling units
      const response = await voterAPI.getNearbyPollingUnits(
        location.latitude,
        location.longitude,
        5 // 5km radius
      );
      
      // Return the nearest polling unit (first in the list)
      if (response.data && response.data.pollingUnits && response.data.pollingUnits.length > 0) {
        return response.data.pollingUnits[0];
      } else {
        throw new Error('No polling units found nearby');
      }
    } catch (error: any) {
      setError(error.message || 'Failed to find nearest polling unit');
      throw error;
    } finally {
      setLoading(false);
    }
  }, [getUserLocation, setLoading, setError]);

  const calculateDistance = useCallback((
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number => {
    // Haversine formula to calculate distance between two points
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;

    function deg2rad(deg: number) {
      return deg * (Math.PI/180);
    }
  }, []);

  return {
    getNearbyPollingUnits,
    getUserLocation,
    findNearestPollingUnit,
    calculateDistance
  };
}; 