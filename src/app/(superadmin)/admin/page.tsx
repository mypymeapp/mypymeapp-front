'use client';

import { PageHeader } from './_components/dashboard/PageHeader';
import { StatsGrid, StatCardData } from './_components/dashboard/StatsCard';
import { SalesChart, ClientsChart } from './_components/dashboard/SalesChart';
import { RecentClients } from './_components/dashboard/RecentClients';
import { TopPlans } from './_components/dashboard/TopPlans';
import { ActivityFeed } from './_components/dashboard/ActivityFeed';
import { Users, DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';
import { useDashboardData } from './useDashboardData';
import { useMemo } from 'react';

export default function SuperAdminPage() {
  const {
    stats,
    recentClients,
    activityFeed,
    topPlans,
    salesChartData,
    clientsChartData,
    isLoadingStats,
    isLoadingClients,
    isLoadingActivity,
    isLoadingPlans,
    isLoadingCharts,
  } = useDashboardData();
  //const { user, isAuthenticated } = useAuth();
  //const router = useRouter();
  // Redirección del lado del cliente por si el middleware falla
  // useEffect(() => {
  //   if (isAuthenticated && user?.role !== 'SUPERADMIN') {
  //     router.replace(PATHROUTES.pymes.dashboard);
  //   }
  // }, [user, isAuthenticated, router]);

    // Muestra un loader mientras se verifica la sesión
  // if (!isAuthenticated) {
  //   return (
  //     <div className="flex items-center justify-center">
  //       <Loader2 className="animate-spin h-8 w-8 text-primary" />
  //     </div>
  //   );
  // }

  // Calcular estadísticas con datos reales
  const statsData: StatCardData[] = useMemo(() => {
    if (!stats) {
      return [
        {
          title: 'Total Usuarios',
          value: '...',
          icon: <Users className="w-6 h-6" />,
          color: 'blue',
          trend: { value: 0, isPositive: true }
        },
        {
          title: 'Total Clientes',
          value: '...',
          icon: <DollarSign className="w-6 h-6" />,
          color: 'green',
          trend: { value: 0, isPositive: true }
        },
        {
          title: 'Crecimiento Usuarios',
          value: '...',
          icon: <TrendingUp className="w-6 h-6" />,
          color: 'purple',
          trend: { value: 0, isPositive: true }
        },
        {
          title: 'Tickets Abiertos',
          value: '...',
          icon: <ShoppingBag className="w-6 h-6" />,
          color: 'indigo',
          trend: { value: 0, isPositive: true }
        }
      ];
    }

    return [
      {
        title: 'Total Usuarios',
        value: stats.totalUsers.toLocaleString(),
        icon: <Users className="w-6 h-6" />,
        color: 'blue',
        trend: { 
          value: stats.userGrowthPercentage, 
          isPositive: stats.userGrowthPercentage >= 0 
        }
      },
      {
        title: 'Total Clientes',
        value: stats.totalClients.toLocaleString(),
        icon: <DollarSign className="w-6 h-6" />,
        color: 'green',
        trend: { 
          value: stats.clientGrowthPercentage, 
          isPositive: stats.clientGrowthPercentage >= 0 
        }
      },
      {
        title: 'Crecimiento Usuarios',
        value: `${stats.userGrowthPercentage.toFixed(1)}%`,
        icon: <TrendingUp className="w-6 h-6" />,
        color: 'purple',
        trend: { 
          value: stats.userGrowthPercentage, 
          isPositive: stats.userGrowthPercentage >= 0 
        }
      },
      {
        title: 'Tickets Abiertos',
        value: stats.openTickets.toLocaleString(),
        icon: <ShoppingBag className="w-6 h-6" />,
        color: 'indigo',
        trend: { 
          value: stats.ticketResolutionRate, 
          isPositive: stats.ticketResolutionRate >= 70 
        }
      }
    ];
  }, [stats]);

  // Mostrar loader mientras cargan las estadísticas principales
  if (isLoadingStats && !stats) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-foreground/60">Cargando dashboard...</p>
        </div>
      </div>
    );
  }

  // Contenido de la página para el SuperAdmin
  return (
    <div className="space-y-6 p-6">
      <PageHeader
        title="Panel de Administración"
        description="Dashboard completo con métricas, análisis y gestión de la plataforma"
      />
      
      {/* Estadísticas principales */}
      <StatsGrid stats={statsData} />
      
      {/* Gráficos principales */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SalesChart data={salesChartData} isLoading={isLoadingCharts} />
        <ClientsChart data={clientsChartData} isLoading={isLoadingCharts} />
      </div>
      
      {/* Sección de planes, análisis y actividad */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <TopPlans plans={topPlans} isLoading={isLoadingPlans} />
          <ActivityFeed activities={activityFeed} isLoading={isLoadingActivity} />
        </div>
        <div className="space-y-6">
          <RecentClients clients={recentClients} isLoading={isLoadingClients} />
          <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
            <h3 className="text-lg font-semibold text-foreground mb-4">Resumen Rápido</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Tickets Pendientes</span>
                <span className="font-semibold text-orange-600">
                  {stats ? stats.pendingTickets : '...'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Usuarios Activos</span>
                <span className="font-semibold text-green-600">
                  {stats ? stats.activeUsers.toLocaleString() : '...'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Clientes Activos</span>
                <span className="font-semibold text-blue-600">
                  {stats ? stats.activeClients.toLocaleString() : '...'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Tasa de Resolución</span>
                <span className="font-semibold text-purple-600">
                  {stats ? `${stats.ticketResolutionRate.toFixed(1)}%` : '...'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}