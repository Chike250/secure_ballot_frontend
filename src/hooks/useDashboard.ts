import { useState, useCallback } from 'react';
import { useUIStore } from '@/store/useStore';
import { electionAPI } from '@/services/api';

interface DashboardOverview {
  election: {
    id: string;
    electionName: string;
    electionType: string;
    startDate: string;
    endDate: string;
    description: string;
    status: string;
    displayStatus: string;
  };
  statistics: {
    totalVotesCast: number;
    validVotes: number;
    invalidVotes: number;
    voterTurnout: number;
    totalRegisteredVoters: number;
    pollingUnitsReported: string;
    reportingPercentage: number;
  };
  voteDistribution: Array<{
    candidateId: string;
    candidateName: string;
    partyName: string;
    partyCode: string;
    votes: number;
    percentage: number;
  }>;
  lastUpdated: string;
}

interface DashboardCandidate {
  id: string;
  fullName: string;
  partyName: string;
  partyCode: string;
  bio: string | null;
  photoUrl: string | null;
  position: string | null;
  manifesto: string | null;
  status: string;
  votes: number;
  percentage: number;
}

interface DashboardCandidates {
  totalCandidates: number;
  candidatesList: DashboardCandidate[];
  comparison: Array<{
    candidateId: string;
    candidateName: string;
    partyName: string;
    partyCode: string;
    votes: number;
    percentage: number;
  }>;
}

interface RegionData {
  region_name: string;
  vote_count: number;
  percentage: number;
  states: string[];
  zone_info: {
    name: string;
    states: string[];
  };
  states_reported: number;
  total_states_in_zone: number;
}

interface TurnoutByRegion {
  regionName: string;
  turnoutPercentage: number;
  statesReported: number;
  totalStatesInZone: number;
}

interface RecentActivity {
  id: string;
  timestamp: string;
  source: string;
  pollingUnit: string;
  state: string;
  lga: string;
  candidate: string;
  party: string;
}

interface DashboardStatistics {
  overview: {
    registeredVoters: number;
    totalVotesCast: number;
    validVotes: number;
    invalidVotes: number;
    voterTurnout: number;
    pollingUnitsReported: number;
    totalPollingUnits: number;
    reportingPercentage: number;
  };
  byRegion: RegionData[];
  byAge: any[];
  byGender: any[];
  turnoutByRegion: TurnoutByRegion[];
  recentActivity: RecentActivity[];
}

interface LiveUpdate {
  id: number;
  type: 'announcement' | 'results' | 'security' | 'update' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  icon: string;
}

interface DashboardData {
  overview: DashboardOverview;
  candidates: DashboardCandidates;
  statistics: DashboardStatistics;
  liveUpdates?: LiveUpdate[]; // Optional since it might not always be present
}

export const useDashboard = () => {
  const { setLoading, setError } = useUIStore();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const fetchDashboardData = useCallback(async (electionId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await electionAPI.getElectionDashboard(electionId);
      
      if (response.code === 'ELECTION_DASHBOARD_RETRIEVED') {
        setDashboardData(response.data);
        return response.data;
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data');
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'Failed to fetch dashboard data';
      setError(errorMessage);
      console.error('Dashboard fetch error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [setError]);

  const refreshDashboard = useCallback(async (electionId: string) => {
    return fetchDashboardData(electionId);
  }, [fetchDashboardData]);

  // Helper functions to extract specific data
  const getOverviewStats = useCallback(() => {
    if (!dashboardData?.overview) return null;
    return dashboardData.overview.statistics;
  }, [dashboardData]);

  const getCandidates = useCallback(() => {
    if (!dashboardData?.candidates) return [];
    return dashboardData.candidates.candidatesList;
  }, [dashboardData]);

  const getVoteDistribution = useCallback(() => {
    if (!dashboardData?.overview) return [];
    return dashboardData.overview.voteDistribution;
  }, [dashboardData]);

  const getRegionalBreakdown = useCallback(() => {
    if (!dashboardData?.statistics) return [];
    return dashboardData.statistics.byRegion;
  }, [dashboardData]);

  const getTurnoutByRegion = useCallback(() => {
    if (!dashboardData?.statistics) return [];
    return dashboardData.statistics.turnoutByRegion;
  }, [dashboardData]);

  const getLiveUpdates = useCallback(() => {
    if (!dashboardData?.liveUpdates) return [];
    return dashboardData.liveUpdates;
  }, [dashboardData]);

  const getRecentActivity = useCallback(() => {
    if (!dashboardData?.statistics) return [];
    return dashboardData.statistics.recentActivity;
  }, [dashboardData]);

  const getElectionInfo = useCallback(() => {
    if (!dashboardData?.overview) return null;
    return dashboardData.overview.election;
  }, [dashboardData]);

  // Additional helper to get detailed statistics overview
  const getDetailedStats = useCallback(() => {
    if (!dashboardData?.statistics) return null;
    return dashboardData.statistics.overview;
  }, [dashboardData]);

  return {
    // Data
    dashboardData,
    
    // Loading states
    isLoading,
    
    // Actions
    fetchDashboardData,
    refreshDashboard,
    
    // Helper getters
    getOverviewStats,
    getCandidates,
    getVoteDistribution,
    getRegionalBreakdown,
    getTurnoutByRegion,
    getLiveUpdates,
    getRecentActivity,
    getElectionInfo,
    getDetailedStats,
  };
}; 