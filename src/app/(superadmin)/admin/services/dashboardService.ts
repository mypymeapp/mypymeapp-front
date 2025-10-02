import apiClient from './apiClient';

// ==================== INTERFACES ====================

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalAdmins: number;
  newUsersThisMonth: number;
  totalClients: number;
  activeClients: number;
  totalCompanies: number;
  activeCompanies: number;
  totalTickets: number;
  openTickets: number;
  closedTickets: number;
  pendingTickets: number;
  userGrowthPercentage: number;
  clientGrowthPercentage: number;
  ticketResolutionRate: number;
}

export interface RecentClient {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  company?: {
    name: string;
  };
  createdAt: string;
}

export interface ActivityItem {
  id: string;
  type: 'user_created' | 'client_created' | 'ticket_created' | 'ticket_closed' | 'admin_action';
  description: string;
  timestamp: string;
  user?: {
    name: string;
    email: string;
  };
}

export interface TopPlan {
  id: string;
  name: string;
  subscriptionCount: number;
  revenue: number;
  growthPercentage: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
  }[];
}

// ==================== SERVICE ====================

class DashboardService {
  private baseUrl = '/admin/dashboard';

  /**
   * Obtiene las estadísticas generales del dashboard
   */
  async getStats(): Promise<DashboardStats> {
    try {
      const response = await apiClient.get<DashboardStats>(`${this.baseUrl}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  /**
   * Obtiene los clientes más recientes
   */
  async getRecentClients(limit: number = 5): Promise<RecentClient[]> {
    try {
      const response = await apiClient.get<RecentClient[]>(`${this.baseUrl}/recent-clients`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching recent clients:', error);
      throw error;
    }
  }

  /**
   * Obtiene el feed de actividad reciente
   */
  async getActivityFeed(limit: number = 10): Promise<ActivityItem[]> {
    try {
      const response = await apiClient.get<ActivityItem[]>(`${this.baseUrl}/activity`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching activity feed:', error);
      throw error;
    }
  }

  /**
   * Obtiene los planes más populares
   */
  async getTopPlans(limit: number = 5): Promise<TopPlan[]> {
    try {
      const response = await apiClient.get<TopPlan[]>(`${this.baseUrl}/top-plans`, {
        params: { limit }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top plans:', error);
      throw error;
    }
  }

  /**
   * Obtiene datos para el gráfico de ventas/ingresos
   */
  async getSalesChartData(period: 'week' | 'month' | 'year' = 'month'): Promise<ChartData> {
    try {
      const response = await apiClient.get<ChartData>(`${this.baseUrl}/sales-chart`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching sales chart data:', error);
      throw error;
    }
  }

  /**
   * Obtiene datos para el gráfico de clientes
   */
  async getClientsChartData(period: 'week' | 'month' | 'year' = 'month'): Promise<ChartData> {
    try {
      const response = await apiClient.get<ChartData>(`${this.baseUrl}/clients-chart`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching clients chart data:', error);
      throw error;
    }
  }
}

export const dashboardService = new DashboardService();
