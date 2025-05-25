import { useState, useEffect } from 'react';
import { useVoterStore, useUIStore, useAuthStore } from '@/store/useStore';
import { voterAPI } from '@/services/api';

export const useVoterData = () => {
  const { 
    profile, 
    pollingUnit, 
    verificationStatus, 
    voteHistory,
    setProfile, 
    setPollingUnit, 
    setVerificationStatus, 
    setVoteHistory,
    clearVoterData 
  } = useVoterStore();
  
  const { user, updateUser } = useAuthStore();
  const { setLoading, setError, addNotification } = useUIStore();
  
  const [isLoading, setIsLoading] = useState(false);

  // Fetch voter profile
  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.getProfile();
      if (response.success) {
        setProfile(response.data);
        updateUser(response.data);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch profile';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update voter profile
  const updateProfile = async (data: { 
    phoneNumber?: string; 
    state?: string; 
    lga?: string; 
    ward?: string; 
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.updateProfile(data);
      if (response.success) {
        setProfile(response.data);
        updateUser(response.data);
        addNotification({
          type: 'success',
          message: 'Profile updated successfully!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.changePassword(currentPassword, newPassword);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Password changed successfully!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch polling unit
  const fetchPollingUnit = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.getPollingUnit();
      if (response.success) {
        setPollingUnit(response.data);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch polling unit';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Get nearby polling units
  const getNearbyPollingUnits = async (latitude: number, longitude: number, radius = 5) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.getNearbyPollingUnits(latitude, longitude, radius);
      if (response.success) {
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch nearby polling units';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch verification status
  const fetchVerificationStatus = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.getVerificationStatus();
      if (response.success) {
        setVerificationStatus(response.data);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch verification status';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Submit verification request
  const submitVerification = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.submitVerification(data);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Verification request submitted successfully!',
        });
        // Refresh verification status
        await fetchVerificationStatus();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to submit verification';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Check eligibility for an election
  const checkEligibility = async (electionId: string) => {
    try {
      const response = await voterAPI.getEligibility(electionId);
      if (response.success) {
        return response.data;
      }
    } catch (error: any) {
      console.error('Failed to check eligibility:', error);
      return { eligible: false, reason: 'Unable to verify eligibility' };
    }
  };

  // Fetch vote history
  const fetchVoteHistory = async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.getVoteHistory(page, limit);
      if (response.success) {
        setVoteHistory(response.data);
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch vote history';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch voting history
  const fetchVotingHistory = async (page = 1, limit = 10) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.getVotingHistory(page, limit);
      if (response.success) {
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to fetch voting history';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Verify vote with receipt code
  const verifyVote = async (receiptCode: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.verifyVote(receiptCode);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Vote verified successfully!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to verify vote';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Report vote issue
  const reportVoteIssue = async (data: {
    voteId: string;
    issueType: 'technical' | 'fraud' | 'coercion' | 'other';
    description: string;
  }) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.reportVoteIssue(data);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Issue reported successfully!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to report issue';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify identity
  const verifyIdentity = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.verifyIdentity(data);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Identity verification submitted!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to verify identity';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Verify address
  const verifyAddress = async (data: any) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.verifyAddress(data);
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Address verification submitted!',
        });
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to verify address';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Deactivate account
  const deactivateAccount = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await voterAPI.deactivateAccount();
      if (response.success) {
        addNotification({
          type: 'success',
          message: 'Account deactivated successfully!',
        });
        clearVoterData();
        return response.data;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || 'Failed to deactivate account';
      setError(errorMessage);
      addNotification({
        type: 'error',
        message: errorMessage,
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-fetch profile and polling unit on mount if user is authenticated
  useEffect(() => {
    if (user?.id) {
      fetchProfile();
      fetchPollingUnit();
      fetchVerificationStatus();
    }
  }, [user?.id]);

  return {
    // State
    profile,
    pollingUnit,
    verificationStatus,
    voteHistory,
    isLoading,

    // Actions
    fetchProfile,
    updateProfile,
    changePassword,
    fetchPollingUnit,
    getNearbyPollingUnits,
    fetchVerificationStatus,
    submitVerification,
    checkEligibility,
    fetchVoteHistory,
    fetchVotingHistory,
    verifyVote,
    reportVoteIssue,
    verifyIdentity,
    verifyAddress,
    deactivateAccount,
    clearVoterData,

    // Computed values
    isVerified: profile?.isVerified || false,
    isActive: profile?.isActive || false,
    hasPollingUnit: !!pollingUnit,
    verificationPending: verificationStatus?.status === 'pending',
    verificationApproved: verificationStatus?.status === 'approved',
    verificationRejected: verificationStatus?.status === 'rejected',
  };
}; 