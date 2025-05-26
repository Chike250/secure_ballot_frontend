"use client";

import { useState, useEffect, useCallback } from "react";
import { useElectionStore, useVotingStore, useUIStore } from "@/store/useStore";
import { electionAPI, resultsAPI } from "@/services/api";

// Define interfaces for your data structures
interface Candidate {
  id: string;
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
  id: string;
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

export const useElectionData = () => {
  console.log("useElectionData");
  const {
    currentElection,
    elections,
    candidates,
    results,
    setCurrentElection,
    setElections,
    setCandidates,
    setResults,
    clearElectionData,
  } = useElectionStore();

  const {
    hasVoted,
    votingStatus,
    eligibility,
    voteReceipts,
    setHasVoted,
    setVotingStatus,
    setEligibility,
    setVoteReceipt,
  } = useVotingStore();

  const { setLoading, setError, addNotification } = useUIStore();

  const [isLoading, setIsLoading] = useState(false);

  // Fetch all elections
  const fetchElections = useCallback(
    async (status = "active", type?: string) => {
      try {
        setIsLoading(true);
        setError(null);
        console.log("fetchElections: Making API call with params:", {
          status,
          type,
        });
        const response = await electionAPI.getElections(status, type);
        console.log("fetchElections: Full API response:", response);

        if (response.success) {
          setElections(response.data.elections);
        }
      } catch (error: any) {
        console.error("fetchElections: API call failed:", error);
        const errorMessage =
          error.response?.data?.message || "Failed to fetch elections";
        setError(errorMessage);
        addNotification({
          type: "error",
          message: errorMessage,
        });
        setElections([]);
      } finally {
        setIsLoading(false);
      }
    },
    [setElections, setError, addNotification]
  );

  // Fetch election details
  const fetchElectionDetails = useCallback(
    async (electionId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await electionAPI.getElectionDetails(electionId);
        if (response.success) {
          setCurrentElection(response.data);
          return response.data;
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch election details";
        setError(errorMessage);
        addNotification({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setCurrentElection, setError, addNotification]
  );

  // Fetch candidates for an election
  const fetchCandidates = useCallback(
    async (electionId: string, search?: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await electionAPI.getCandidates(electionId, search);
        if (response.success) {
          setCandidates(response.data);
          return response.data;
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch candidates";
        setError(errorMessage);
        addNotification({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setCandidates, setError, addNotification]
  );

  // Cast a vote
  const castVote = useCallback(
    async (electionId: string, candidateId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await electionAPI.castVote(electionId, candidateId);
        if (response.success) {
          setHasVoted(electionId, candidateId);
          if (response.data.receiptCode) {
            setVoteReceipt(electionId, response.data.receiptCode);
          }
          addNotification({
            type: "success",
            message: "Vote cast successfully!",
          });
          return response.data;
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to cast vote";
        setError(errorMessage);
        addNotification({
          type: "error",
          message: errorMessage,
        });
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [setHasVoted, setVoteReceipt, setError, addNotification]
  );

  // Check voting status
  const checkVotingStatus = useCallback(
    async (electionId: string) => {
      try {
        const response = await electionAPI.getVotingStatus(electionId);
        if (response.success) {
          setVotingStatus(electionId, response.data);
          setHasVoted(
            electionId,
            response.data.hasVoted ? response.data.candidateId : null
          );
          return response.data;
        }
      } catch (error: any) {
        console.error("Failed to check voting status:", error);
      }
    },
    [setVotingStatus, setHasVoted]
  );

  // Fetch election results
  const fetchResults = useCallback(
    async (electionId: string) => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await resultsAPI.getDetailedResults(electionId);
        if (response.success) {
          setResults(response.data);
          return response.data;
        }
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.message || "Failed to fetch results";
        setError(errorMessage);
        addNotification({
          type: "error",
          message: errorMessage,
        });
      } finally {
        setIsLoading(false);
      }
    },
    [setResults, setError, addNotification]
  );

  // Fetch live results
  const fetchLiveResults = useCallback(
    async (electionId: string) => {
      try {
        const response = await resultsAPI.getLiveResults(electionId);
        if (response.success) {
          setResults(response.data);
          return response.data;
        }
      } catch (error: any) {
        console.error("Failed to fetch live results:", error);
      }
    },
    [setResults]
  );

  // Fetch election statistics
  const fetchStatistics = useCallback(async (electionId: string) => {
    try {
      const response = await resultsAPI.getStatistics(electionId);
      if (response.success) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch statistics:", error);
    }
  }, []);

  // Get real-time results
  const getRealTimeResults = useCallback(async (electionId: string) => {
    try {
      const response = await resultsAPI.getRealTimeResults(electionId);
      if (response.success) {
        return response.data;
      }
    } catch (error: any) {
      console.error("Failed to fetch real-time results:", error);
    }
  }, []);

  // Get regional results
  const getRegionalResults = useCallback(
    async (electionId: string, region?: string) => {
      try {
        const response = await resultsAPI.getRegionalResults(
          electionId,
          region
        );
        if (response.success) {
          return response.data;
        }
      } catch (error: any) {
        console.error("Failed to fetch regional results:", error);
      }
    },
    []
  );

  // Auto-fetch elections on mount
  useEffect(() => {
    console.log(
      "useElectionData: Auto-fetch effect running, calling fetchElections..."
    );
    fetchElections()
      .then(() => {
        console.log("useElectionData: Auto-fetch completed successfully");
      })
      .catch((error: any) => {
        console.error("useElectionData: Auto-fetch failed:", error);
      });
  }, []); // Empty dependency array - only run on mount

  // Auto-fetch candidates when current election changes
  useEffect(() => {
    if (currentElection?.id) {
      fetchCandidates(currentElection.id);
      checkVotingStatus(currentElection.id);
    }
  }, [currentElection?.id, fetchCandidates, checkVotingStatus]);

  return {
    // State
    currentElection,
    elections,
    candidates,
    results,
    hasVoted,
    votingStatus,
    eligibility,
    voteReceipts,
    isLoading,

    // Actions
    fetchElections,
    fetchElectionDetails,
    fetchCandidates,
    castVote,
    checkVotingStatus,
    fetchResults,
    fetchLiveResults,
    fetchStatistics,
    getRealTimeResults,
    getRegionalResults,
    setCurrentElection,
    clearElectionData,

    // Computed values
    isElectionActive: currentElection?.status === "active",
    isElectionCompleted: currentElection?.status === "completed",
    canVote:
      currentElection?.status === "active" && !hasVoted[currentElection.id],
    totalCandidates: candidates.length,
    totalVotes: results?.totalVotes || 0,
  };
};

// NOTE: This hook assumes electionAPI methods are implemented in src/services/api.ts
// - electionAPI.getElections({ status })
// - electionAPI.getElectionById(electionId)
// - electionAPI.getCandidates(electionId)
// - electionAPI.getResults(electionId) -> Now uses resultsAPI.getDetailedResults
// - resultsAPI.getDetailedResults(electionId)
