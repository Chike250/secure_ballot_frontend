'use client';

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore, useUIStore } from '@/store/useStore';
import { electionAPI, voterAPI } from '@/services/api'; // Assuming voterAPI exists

// Re-use or import interfaces if defined elsewhere
interface Candidate {
  id: number | string;
  name: string;
  party: string;
  // Add potentially missing fields used in the UI
  image?: string;
  color?: string;
  bio?: string;
  manifesto?: string;
  votes?: number;
  percentage?: number;
  // ... other fields
}
interface Election {
  id: string;
  electionName: string;
  // ... other fields
}

interface VotingStatus {
  hasVoted: boolean;
  candidateId?: number | string | null;
}

interface EligibilityStatus {
  isEligible: boolean;
  reason?: string;
}

// Helper function to get party colors
const getPartyColor = (partyCode: string | undefined): string => {
  const partyColors: Record<string, string> = {
    'APC': '#1E40AF', // Blue
    'PDP': '#DC2626', // Red
    'LP': '#059669',  // Green
    'NNPP': '#7C3AED', // Purple
    'APGA': '#EA580C', // Orange
    'SDP': '#0891B2', // Cyan
    'YPP': '#BE185D', // Pink
    'AAC': '#7C2D12', // Brown
    'ADC': '#4338CA', // Indigo
    'NRM': '#065F46', // Emerald
  };
  
  if (!partyCode) return '#6B7280'; // Default gray
  
  return partyColors[partyCode.toUpperCase()] || '#6B7280';
};

// Hook to manage voting for a specific election
export function useVote() {
  const { token } = useAuthStore();
  const { setLoading, setError } = useUIStore();
  
  // State specific to this hook instance (could be moved to store if needed globally)
  const [electionDetails, setElectionDetails] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [votingStatus, setVotingStatus] = useState<VotingStatus | null>(null);
  const [eligibility, setEligibility] = useState<EligibilityStatus | null>(null);
  // Store voted status across different elections (could be fetched once globally)
  const [votedElections, setVotedElections] = useState<Record<string, number>>({});

  const loadElectionData = useCallback(async (electionId: string) => {
    
    if (!token) {
      return;
    }
    
    setLoading(true);
    setError(null);
    setVotingStatus(null);
    setEligibility(null);
    
    try {
      // Fetch election details, candidates, status, eligibility in parallel
      const [details, candidatesData, status, elig] = await Promise.all([
        electionAPI.getElectionDetails(electionId),
        electionAPI.getCandidates(electionId),   // API: /api/v1/elections/{electionId}/candidates
        electionAPI.getVotingStatus(electionId),    // Use electionAPI for getVotingStatus
        voterAPI.getEligibility(electionId)         // Use voterAPI for getEligibility
      ]);
      
      setElectionDetails(details);
      
      // Handle different possible response structures
      let rawCandidatesList = [];
      if (candidatesData.candidates) {
        rawCandidatesList = candidatesData.candidates;
      } else if (candidatesData.data && candidatesData.data.candidates) {
        rawCandidatesList = candidatesData.data.candidates;
      } else if (candidatesData.data && Array.isArray(candidatesData.data)) {
        rawCandidatesList = candidatesData.data;
      } else if (Array.isArray(candidatesData)) {
        rawCandidatesList = candidatesData;
      }
      
      // Transform API response to match frontend interface
      const candidatesList = rawCandidatesList.map((candidate: any) => ({
        id: candidate.id,
        name: candidate.fullName || candidate.name || 'Unknown Candidate',
        party: candidate.partyName || candidate.party || candidate.partyCode || 'Unknown Party',
        image: candidate.photoUrl || candidate.image,
        color: getPartyColor(candidate.partyCode || candidate.partyName || candidate.party),
        bio: candidate.bio,
        manifesto: candidate.manifesto,
        votes: candidate.votes || 0,
        percentage: candidate.percentage || 0,
        // Preserve original fields for reference
        partyCode: candidate.partyCode,
        partyName: candidate.partyName,
        fullName: candidate.fullName,
        photoUrl: candidate.photoUrl,
      }));
      
      setCandidates(candidatesList);
      
      // Process voting status - handle different response structures
      let votingStatusData = null;
      if (status?.data) {
        votingStatusData = {
          hasVoted: status.data.hasVoted || false,
          candidateId: status.data.candidateId || null
        };
      } else {
        votingStatusData = {
          hasVoted: status?.hasVoted || false,
          candidateId: status?.candidateId || null
        };
      }
      
      // Process eligibility - prioritize separate eligibility API call, fallback to voting status
      let eligibilityData = null;
      
      // First check separate eligibility API response
      if (elig?.data?.isEligible !== undefined) {
        eligibilityData = {
          isEligible: elig.data.isEligible,
          reason: elig.data.reason || elig.data.eligibilityReason || (elig.data.isEligible ? 'Eligible to vote' : 'Not eligible to vote')
        };
        console.log("Using eligibility from separate API call");
      } 
      // Fallback to eligibility data in voting status response
      else if (status?.data?.isEligible !== undefined) {
        eligibilityData = {
          isEligible: status.data.isEligible,
          reason: status.data.eligibilityReason || status.data.reason || (status.data.isEligible ? 'Eligible to vote' : 'Not eligible to vote')
        };
        console.log("Using eligibility from voting status response");
      } 
      // Fallback to direct eligibility object
      else if (elig) {
        eligibilityData = {
          isEligible: elig.isEligible !== undefined ? elig.isEligible : false,
          reason: elig.reason || elig.eligibilityReason || (elig.isEligible ? 'Eligible to vote' : 'Not eligible to vote')
        };
        console.log("Using direct eligibility object");
      }
      // Default to not eligible if no data found
      else {
        eligibilityData = {
          isEligible: false,
          reason: 'Eligibility could not be determined'
        };
        console.log("No eligibility data found, defaulting to not eligible");
      }
      
      console.log("Processed voting status:", votingStatusData);
      console.log("Processed eligibility:", eligibilityData);
      
      setVotingStatus(votingStatusData); 
      setEligibility(eligibilityData);

      // Update the votedElections state based on fetched status
      if (votingStatusData?.hasVoted && votingStatusData.candidateId) {
        setVotedElections(prev => ({ ...prev, [electionId]: Number(votingStatusData.candidateId) }));
      }

    } catch (err: any) {
      setError(err.message || `Failed to load election data for ${electionId}`);
      // Maybe set fallback data here?
      setCandidates([]); 
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError]);

  const castVote = useCallback(async (electionId: string, candidateId: number | string): Promise<{ success: boolean, receiptCode?: string }> => {
    if (!token || !eligibility?.isEligible || votingStatus?.hasVoted) {
      setError(eligibility?.reason || (votingStatus?.hasVoted ? 'Already voted' : 'Cannot cast vote'));
      return { success: false };
    }
    setLoading(true);
    setError(null);
    try {
      const response = await electionAPI.castVote(electionId, candidateId.toString()); // Ensure candidateId is string if API expects it
      
      // Update local state immediately for responsiveness
      setVotingStatus({ hasVoted: true, candidateId });
      setVotedElections(prev => ({ ...prev, [electionId]: Number(candidateId) }));

      // Update localStorage for profile page consistency (can be removed if profile fetches directly)
      const lsVotingStatus = JSON.parse(localStorage.getItem("votingStatus") || "{}")
      const votedCandidateDetails = candidates.find(c => c.id === candidateId)
      lsVotingStatus[electionId] = {
        candidateId: candidateId,
        candidateName: votedCandidateDetails?.name,
        candidateParty: votedCandidateDetails?.party,
        timestamp: new Date().toISOString(),
      }
      localStorage.setItem("votingStatus", JSON.stringify(lsVotingStatus))
      localStorage.setItem("votedElections", JSON.stringify({ ...votedElections, [electionId]: Number(candidateId) })); // Keep this for dashboard fallback?

      // Return success and receipt code if available in the response
      return { 
        success: true,
        receiptCode: response?.receiptCode || undefined
      };
    } catch (err: any) {
      setError(err.message || 'Failed to cast vote');
      return { success: false };
    } finally {
      setLoading(false);
    }
  }, [token, eligibility, votingStatus, candidates, votedElections, setLoading, setError]);
  
    // Function specifically for dashboard quick check (uses local state)
  const checkVotingStatus = useCallback(async (electionId: string) => {
      // This is a placeholder. Ideally, dashboard would fetch status once 
      // or this hook needs refactoring to handle multiple elections.
      // For now, it relies on data potentially fetched by loadElectionData
      // or the temporary localStorage fallback.
       const savedVotes = localStorage.getItem("votedElections");
       if(savedVotes) {
         try { setVotedElections(JSON.parse(savedVotes)); } catch(e) {}
       }
  }, []);


  return {
    electionDetails,
    candidates,
    votingStatus,
    eligibility,
    votedElections, // Expose the map of voted elections
    loadElectionData,
    castVote,
    checkVotingStatus, // For dashboard temporary use
  };
}

// NOTE: Requires implementation of electionAPI and voterAPI methods in src/services/api.ts
// - electionAPI.getElectionDetails(electionId)
// - electionAPI.getCandidates(electionId)
// - electionAPI.getVotingStatus(electionId)
// - voterAPI.getEligibility(electionId)
// - electionAPI.castVote(electionId, candidateId) 