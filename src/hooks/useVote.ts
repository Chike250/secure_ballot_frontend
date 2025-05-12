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
    if (!token) return;
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
      setCandidates(candidatesData.candidates || []);
      setVotingStatus(status); 
      setEligibility(elig);

      // Update the votedElections state based on fetched status
      if (status?.hasVoted && status.candidateId) {
        setVotedElections(prev => ({ ...prev, [electionId]: Number(status.candidateId) }));
      }

    } catch (err: any) {
      setError(err.message || `Failed to load election data for ${electionId}`);
      // Maybe set fallback data here?
      setCandidates([]); 
    } finally {
      setLoading(false);
    }
  }, [token, setLoading, setError]);

  const castVote = useCallback(async (electionId: string, candidateId: number | string): Promise<boolean> => {
    if (!token || !eligibility?.isEligible || votingStatus?.hasVoted) {
      setError(eligibility?.reason || (votingStatus?.hasVoted ? 'Already voted' : 'Cannot cast vote'));
      return false;
    }
    setLoading(true);
    setError(null);
    try {
      await electionAPI.castVote(electionId, candidateId.toString()); // Ensure candidateId is string if API expects it
      
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

      return true; // Success
    } catch (err: any) {
      setError(err.message || 'Failed to cast vote');
      return false; // Failure
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