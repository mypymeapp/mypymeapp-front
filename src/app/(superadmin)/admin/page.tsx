//import { useAuth } from '@/context/AuthContext';
//import { Loader2, ShieldOff } from 'lucide-react';
//import { useRouter } from 'next/navigation';
//import { useEffect } from 'react';
//import { PATHROUTES } from '@/constants/pathroutes';
import { PageHeader } from './_components/dashboard/PageHeader';
import { StatsGrid, StatCardData } from './_components/dashboard/StatsCard';
import { SalesChart, ClientsChart } from './_components/dashboard/SalesChart';
import { RecentClients } from './_components/dashboard/RecentClients';
import { TopPlans } from './_components/dashboard/TopPlans';
import { ActivityFeed } from './_components/dashboard/ActivityFeed';
import { Users, DollarSign, TrendingUp, ShoppingBag } from 'lucide-react';

export default function SuperAdminPage() {
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

  // Datos de estadísticas principales
  const statsData: StatCardData[] = [
    {
      title: 'Total Usuarios',
      value: '2,847',
      icon: <Users className="w-6 h-6" />,
      color: 'blue',
      trend: { value: 12.5, isPositive: true }
    },
    {
      title: 'Ingresos Mensuales',
      value: '$166,000',
      icon: <DollarSign className="w-6 h-6" />,
      color: 'green',
      trend: { value: 8.2, isPositive: true }
    },
    {
      title: 'Crecimiento',
      value: '23.1%',
      icon: <TrendingUp className="w-6 h-6" />,
      color: 'purple',
      trend: { value: 4.3, isPositive: true }
    },
    {
      title: 'Ventas del Mes',
      value: '1,234',
      icon: <ShoppingBag className="w-6 h-6" />,
      color: 'indigo',
      trend: { value: 2.1, isPositive: false }
    }
  ];

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
        <SalesChart />
        <ClientsChart />
      </div>
      
      {/* Sección de planes, análisis y actividad */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          <TopPlans />
          <ActivityFeed />
        </div>
        <div className="space-y-6">
          <RecentClients />
          <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
            <h3 className="text-lg font-semibold text-foreground mb-4">Resumen Rápido</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Tickets Pendientes</span>
                <span className="font-semibold text-orange-600">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Usuarios Activos Hoy</span>
                <span className="font-semibold text-green-600">1,847</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Conversión del Mes</span>
                <span className="font-semibold text-blue-600">3.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-foreground/70">Satisfacción Cliente</span>
                <span className="font-semibold text-purple-600">4.8/5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}