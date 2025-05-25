'use client';

import { useState, useEffect, useCallback } from 'react';
import { useUIStore } from '@/store/useStore';
import { electionAPI, resultsAPI } from '@/services/api'; // Import resultsAPI

// Define interfaces for your data structures
interface Candidate {
  id: number | string;
  name: string;
  party: string;
  votes: number;
  percentage: number;
  image?: string;
  color?: string;
  bio?: string;
  manifesto?: string;
}

interface Election {
  id: string;
  electionName: string;
  electionType: string; // e.g., "Presidential", "Gubernatorial"
  startDate: string;
  endDate: string;
  description?: string;
  // Add other relevant fields
}

// Refined ElectionResults interface - assuming results contains candidate breakdown
interface ElectionResultCandidate {
  id: number | string;
  name: string;
  party: string;
  votes: number;
  percentage: number;
  image?: string; // Optional fields for display
  color?: string;
}

interface ElectionResults {
  totalVotes: number;
  turnout?: number; // Turnout might be part of election details or stats endpoint
  candidates: ElectionResultCandidate[];
  lastUpdated?: string; // Optional timestamp
  // Add other relevant result fields if needed
}

// Election types mapping
const ELECTION_TYPES_MAP: Record<string, string> = {
  presidential: "Presidential Election",
  gubernatorial: "Gubernatorial Election",
  "house-of-reps": "House of Representatives Election",
  senatorial: "Senatorial Election",
};

export function useElectionData(initialElectionTypeKey: string = "presidential") {
  const { setLoading, setError } = useUIStore();
  const [currentElectionTypeKey, setCurrentElectionTypeKey] = useState(initialElectionTypeKey);
  const [elections, setElections] = useState<Election[]>([]); // List of all elections
  const [currentElectionDetails, setCurrentElectionDetails] = useState<Election | null>(null);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [electionResults, setElectionResults] = useState<ElectionResults | null>(null);

  const fetchElectionsList = useCallback(async (status: string = "all") => {
    setLoading(true);
    setError(null);
    try {
      const data = await electionAPI.getElections(status); // API: /api/v1/elections
      setElections(data.elections || []); // Assuming API returns { elections: [...] }
    } catch (err: any) {
      setError(err.message || "Failed to fetch elections list");
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  const fetchElectionDetailsAndCandidates = useCallback(async (electionTypeKey: string) => {
    setCurrentElectionTypeKey(electionTypeKey);
    setLoading(true);
    setError(null);
    try {
      // Get election details
      const electionDetailData = await electionAPI.getElectionDetails(electionTypeKey);
      setCurrentElectionDetails(electionDetailData);

      // Fetch candidates for this election
      const candidatesData = await electionAPI.getCandidates(electionTypeKey);
      setCandidates(candidatesData.candidates || []);
    } catch (err: any) {
      setError(err.message || `Failed to fetch data for ${electionTypeKey}`);
      // Don't set fallback dummy data, just empty array
      setCandidates([]);
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Implement fetchResults using resultsAPI
  const fetchResults = useCallback(async (electionId: string) => {
    setLoading(true);
    setError(null); // Clear previous errors
    try {
      // Call the actual API endpoint
      const data = await resultsAPI.getDetailedResults(electionId);
      setElectionResults(data);
    } catch (err: any) {
      setError(err.message || "Failed to fetch results");
      setElectionResults(null); // Clear results on error
    } finally {
      setLoading(false);
    }
  }, [setLoading, setError]);

  // Initial fetch for the given election type
  useEffect(() => {
    fetchElectionDetailsAndCandidates(initialElectionTypeKey);
  }, [initialElectionTypeKey, fetchElectionDetailsAndCandidates]);
  
  // Fetch list of elections on mount (optional, if needed for a selector)
  // useEffect(() => {
  //   fetchElectionsList();
  // }, [fetchElectionsList]);

  return {
    elections, // Full list
    currentElectionDetails, // Details of the currently selected/viewed election
    currentElectionTypeKey,
    candidates,
    electionResults,
    fetchElectionsList, // To manually refresh or get all elections
    fetchElectionDetailsAndCandidates, // To switch to a different election type
    fetchResults, // To fetch/refresh results for the current election
    ELECTION_TYPES_MAP, // Exporting map for display names
    isLoading: useUIStore.getState().isLoading, // Direct access to loading state from UI store
    error: useUIStore.getState().error,
  };
}

// NOTE: This hook assumes electionAPI methods are implemented in src/services/api.ts
// - electionAPI.getElections({ status })
// - electionAPI.getElectionById(electionId)
// - electionAPI.getCandidates(electionId)
// - electionAPI.getResults(electionId) -> Now uses resultsAPI.getDetailedResults
// - resultsAPI.getDetailedResults(electionId) 