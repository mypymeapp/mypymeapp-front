'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  dashboardService, 
  type DashboardStats, 
  type RecentClient, 
  type ActivityItem, 
  type TopPlan, 
  type ChartData 
} from './services/dashboardService';

export interface UseDashboardDataReturn {
  // Estados
  stats: DashboardStats | null;
  recentClients: RecentClient[];
  activityFeed: ActivityItem[];
  topPlans: TopPlan[];
  salesChartData: ChartData | null;
  clientsChartData: ChartData | null;
  
  // Loading states
  isLoadingStats: boolean;
  isLoadingClients: boolean;
  isLoadingActivity: boolean;
  isLoadingPlans: boolean;
  isLoadingCharts: boolean;
  
  // Funciones de refresh
  refreshStats: () => Promise<void>;
  refreshRecentClients: () => Promise<void>;
  refreshActivityFeed: () => Promise<void>;
  refreshTopPlans: () => Promise<void>;
  refreshCharts: (period?: 'week' | 'month' | 'year') => Promise<void>;
  refreshAll: () => Promise<void>;
}

export function useDashboardData(): UseDashboardDataReturn {
  // Estados de datos
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentClients, setRecentClients] = useState<RecentClient[]>([]);
  const [activityFeed, setActivityFeed] = useState<ActivityItem[]>([]);
  const [topPlans, setTopPlans] = useState<TopPlan[]>([]);
  const [salesChartData, setSalesChartData] = useState<ChartData | null>(null);
  const [clientsChartData, setClientsChartData] = useState<ChartData | null>(null);
  
  // Estados de loading
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingClients, setIsLoadingClients] = useState(true);
  const [isLoadingActivity, setIsLoadingActivity] = useState(true);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isLoadingCharts, setIsLoadingCharts] = useState(true);

  // Función para obtener estadísticas
  const refreshStats = useCallback(async () => {
    setIsLoadingStats(true);
    try {
      const data = await dashboardService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Función para obtener clientes recientes
  const refreshRecentClients = useCallback(async () => {
    setIsLoadingClients(true);
    try {
      const data = await dashboardService.getRecentClients(5);
      setRecentClients(data);
    } catch (error) {
      console.error('Error loading recent clients:', error);
    } finally {
      setIsLoadingClients(false);
    }
  }, []);

  // Función para obtener feed de actividad
  const refreshActivityFeed = useCallback(async () => {
    setIsLoadingActivity(true);
    try {
      const data = await dashboardService.getActivityFeed(10);
      setActivityFeed(data);
    } catch (error) {
      console.error('Error loading activity feed:', error);
    } finally {
      setIsLoadingActivity(false);
    }
  }, []);

  // Función para obtener planes top
  const refreshTopPlans = useCallback(async () => {
    setIsLoadingPlans(true);
    try {
      const data = await dashboardService.getTopPlans(5);
      setTopPlans(data);
    } catch (error) {
      console.error('Error loading top plans:', error);
    } finally {
      setIsLoadingPlans(false);
    }
  }, []);

  // Función para obtener datos de gráficos
  const refreshCharts = useCallback(async (period: 'week' | 'month' | 'year' = 'month') => {
    setIsLoadingCharts(true);
    try {
      const [salesData, clientsData] = await Promise.all([
        dashboardService.getSalesChartData(period),
        dashboardService.getClientsChartData(period)
      ]);
      setSalesChartData(salesData);
      setClientsChartData(clientsData);
    } catch (error) {
      console.error('Error loading charts:', error);
    } finally {
      setIsLoadingCharts(false);
    }
  }, []);

  // Función para refrescar todo
  const refreshAll = useCallback(async () => {
    await Promise.all([
      refreshStats(),
      refreshRecentClients(),
      refreshActivityFeed(),
      refreshTopPlans(),
      refreshCharts()
    ]);
  }, [refreshStats, refreshRecentClients, refreshActivityFeed, refreshTopPlans, refreshCharts]);

  // Cargar datos iniciales
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    // Estados
    stats,
    recentClients,
    activityFeed,
    topPlans,
    salesChartData,
    clientsChartData,
    
    // Loading states
    isLoadingStats,
    isLoadingClients,
    isLoadingActivity,
    isLoadingPlans,
    isLoadingCharts,
    
    // Funciones
    refreshStats,
    refreshRecentClients,
    refreshActivityFeed,
    refreshTopPlans,
    refreshCharts,
    refreshAll
  };
}
