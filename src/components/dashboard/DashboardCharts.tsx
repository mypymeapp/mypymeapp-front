'use client';

import dynamic from 'next/dynamic';
import { useDashboardData, SalesByMonth, TopProduct, TopCustomer } from '@/hooks/useDashboardData';
import { DashboardSkeletons } from './DashboardSkeletons';
import { Card, Alert } from 'flowbite-react';
import { formatCurrency } from '@/utils/formatters';
import { Package, Users, BarChart } from 'lucide-react';

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false });

const SalesTrendChart = ({ data }: { data: SalesByMonth[] }) => {
  const options = {
    chart: { id: 'sales-trend', toolbar: { show: false } },
    xaxis: { categories: data.map(d => d.month) },
    colors: ['#0055A4'],
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' as const }
  };
  const series = [{ name: 'Facturación', data: data.map(d => d.total) }];

  return <Chart options={options} series={series} type="area" height={350} />;
};

const TopProductsChart = ({ data }: { data: TopProduct[] }) => {
    const options = {
        chart: { id: 'top-products', toolbar: { show: false } },
        plotOptions: { bar: { horizontal: true, } },
        xaxis: { categories: data.map(d => d.name) },
        colors: ['#0055A4'],
        dataLabels: { enabled: true, formatter: (val: number) => `$${val.toFixed(0)}` }
    };
    const series = [{ name: 'Ventas', data: data.map(d => d.total) }];

    return <Chart options={options} series={series} type="bar" height={250} />;
};

const TopCustomersChart = ({ data }: { data: TopCustomer[] }) => {
    const options = {
        chart: { id: 'top-customers', toolbar: { show: false } },
        plotOptions: { bar: { horizontal: true, } },
        xaxis: { categories: data.map(d => d.name) },
        colors: ['#0055A4'],
        dataLabels: { enabled: true, formatter: (val: number) => `$${val.toFixed(0)}` }
    };
    const series = [{ name: 'Compras', data: data.map(d => d.total) }];

    return <Chart options={options} series={series} type="bar" height={250} />;
};

export const DashboardCharts = () => {
  const { data, isLoading, error } = useDashboardData();

  if (isLoading) {
    return <DashboardSkeletons />;
  }

  if (error) {
    return <Alert color="failure">Error al cargar los datos: {error}</Alert>;
  }

  if (!data || data.totalInvoices === 0) {
    return (
        <Card>
            <div className="text-center py-12">
                <BarChart className="mx-auto h-12 w-12 text-foreground/30" />
                <h3 className="mt-2 text-xl font-semibold">Aún no hay datos para mostrar</h3>
                <p className="mt-1 text-sm text-foreground/60">
                    Cuando empieces a registrar facturas, tus reportes aparecerán aquí.
                </p>
            </div>
        </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
            <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Facturación Total</h5>
            <p className="text-3xl font-bold text-primary dark:text-white">{formatCurrency(data.totalRevenue)}</p>
        </Card>
        <Card>
            <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Facturas Emitidas</h5>
            <p className="text-3xl font-bold text-primary dark:text-white">{data.totalInvoices}</p>
        </Card>
         <Card>
            <h5 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ticket Promedio</h5>
            <p className="text-3xl font-bold text-primary dark:text-white">{formatCurrency(data.totalRevenue / data.totalInvoices)}</p>
        </Card>

        <Card className="lg:col-span-3">
             <h5 className="text-xl font-bold">Tendencia de Facturación</h5>
             <SalesTrendChart data={data.salesByMonth} />
        </Card>

        <Card className="lg:col-span-3 lg:grid lg:grid-cols-2 gap-12">
            <div>
                <h5 className="text-xl font-bold mb-4 flex items-center gap-2"><Package className="text-primary"/>Top 5 Productos</h5>
                <TopProductsChart data={data.topProducts} />
            </div>
            <div>
                <h5 className="text-xl font-bold mb-4 flex items-center gap-2"><Users className="text-primary"/>Top 5 Clientes</h5>
                <TopCustomersChart data={data.topCustomers} />
            </div>
        </Card>
    </div>
  );
};