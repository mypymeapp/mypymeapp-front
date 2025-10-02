'use client'

import React, { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Loader2 } from 'lucide-react'
import type { ChartData } from '../../services/dashboardService'

interface SalesChartProps {
  data: ChartData | null;
  isLoading: boolean;
}

interface ClientsChartProps {
  data: ChartData | null;
  isLoading: boolean;
}

export const SalesChart: React.FC<SalesChartProps> = ({ data, isLoading }) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.labels.map((label, index) => ({
      month: label,
      ventas: data.datasets[0]?.data[index] || 0
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!data || chartData.length === 0) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
        <h3 className="text-lg font-semibold text-foreground mb-4">Ventas Mensuales</h3>
        <p className="text-foreground/60 text-center py-12">No hay datos disponibles</p>
      </div>
    );
  }
  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
      <h3 className="text-lg font-semibold text-foreground mb-4">Ventas Mensuales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#6B7280"
            opacity={0.4}
          />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#6B7280', opacity: 0.5 }}
            tickLine={{ stroke: '#6B7280', opacity: 0.5 }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#6B7280', opacity: 0.5 }}
            tickLine={{ stroke: '#6B7280', opacity: 0.5 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid #3B82F6',
              borderRadius: '8px',
              color: 'orange',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="ventas" 
            stroke="#3B82F6" 
            strokeWidth={3}
            dot={{ fill: '#ffffff', strokeWidth: 2, r: 5 }}
            activeDot={{ r: 7, fill: '#1D4ED8' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export const ClientsChart: React.FC<ClientsChartProps> = ({ data, isLoading }) => {
  const chartData = useMemo(() => {
    if (!data) return [];
    return data.labels.map((label, index) => ({
      month: label,
      clientes: data.datasets[0]?.data[index] || 0
    }));
  }, [data]);

  if (isLoading) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!data || chartData.length === 0) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
        <h3 className="text-lg font-semibold text-foreground mb-4">Nuevos Clientes</h3>
        <p className="text-foreground/60 text-center py-12">No hay datos disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
      <h3 className="text-lg font-semibold text-foreground mb-4">Nuevos Clientes</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke="#6B7280"
            opacity={0.4}
          />
          <XAxis 
            dataKey="month" 
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#6B7280', opacity: 0.5 }}
            tickLine={{ stroke: '#6B7280', opacity: 0.5 }}
          />
          <YAxis 
            tick={{ fontSize: 12, fill: '#9CA3AF' }}
            axisLine={{ stroke: '#6B7280', opacity: 0.5 }}
            tickLine={{ stroke: '#6B7280', opacity: 0.5 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'hsl(var(--background))',
              border: '1px solid #10B981',
              borderRadius: '8px',
              color: 'hsl(var(--foreground))',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}
          />
          <Bar 
            dataKey="clientes" 
            fill="#10B981"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
