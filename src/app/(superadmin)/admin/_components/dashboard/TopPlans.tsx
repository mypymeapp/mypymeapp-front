/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'

import React, { useMemo } from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { Crown, Star, Shield, Loader2 } from 'lucide-react'
import type { TopPlan } from '../../services/dashboardService'

interface TopPlansProps {
  plans: TopPlan[];
  isLoading: boolean;
}

interface PlanData {
  name: string
  value: number
  color: string
  icon: React.ReactNode
  revenue: number
  [key: string]: string | number | React.ReactNode
}

const getPlanIcon = (name: string) => {
  if (name.includes('Premium')) return <Crown className="w-4 h-4" />;
  if (name.includes('Gratuito')) return <Shield className="w-4 h-4" />;
  return <Star className="w-4 h-4" />;
};

const getPlanColor = (name: string) => {
  if (name.includes('Premium')) return '#8B5CF6';
  if (name.includes('Gratuito')) return '#6B7280';
  return '#3B82F6';
};

const RADIAN = Math.PI / 180

const renderCustomizedLabel = (props: any) => {
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text 
      x={x} 
      y={y} 
      fill="white" 
      textAnchor={x > cx ? 'start' : 'end'} 
      dominantBaseline="central"
      className="text-sm font-medium"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}

export const TopPlans: React.FC<TopPlansProps> = ({ plans, isLoading }) => {
  const plansData: PlanData[] = useMemo(() => {
    return plans.map(plan => ({
      name: plan.name,
      value: plan.subscriptionCount,
      color: getPlanColor(plan.name),
      icon: getPlanIcon(plan.name),
      revenue: plan.revenue
    }));
  }, [plans]);

  const totalRevenue = plansData.reduce((sum: number, plan: PlanData) => sum + plan.revenue, 0);

  if (isLoading) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!plans || plans.length === 0) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
        <h3 className="text-lg font-semibold text-foreground mb-4">Planes Más Vendidos</h3>
        <p className="text-foreground/60 text-center py-8">No hay datos de planes disponibles</p>
      </div>
    );
  }

  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
      <h3 className="text-lg font-semibold text-foreground mb-4">Planes Más Vendidos</h3>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de torta */}
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={plansData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={renderCustomizedLabel}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {plansData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  border: '1px solid hsl(var(--primary))',
                  borderRadius: '8px',
                  color: 'hsl(var(--foreground))'
                }}
                formatter={(value: number) => [`${value}%`, 'Porcentaje']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Lista de planes */}
        <div className="space-y-4">
          {plansData.map((plan, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-primary/5">
              <div className="flex items-center space-x-3">
                <div 
                  className="p-2 rounded-full text-white"
                  style={{ backgroundColor: plan.color }}
                >
                  {plan.icon}
                </div>
                <div>
                  <p className="font-medium text-foreground">{plan.name}</p>
                  <p className="text-sm text-foreground/60">{plan.value}% del total</p>
                </div>
              </div>
              
              <div className="text-right">
                <p className="font-semibold text-foreground">
                  ${plan.revenue.toLocaleString('es-AR')}
                </p>
                <p className="text-xs text-foreground/60">ingresos</p>
              </div>
            </div>
          ))}
          
          <div className="pt-4 border-t border-primary/20">
            <div className="flex justify-between items-center">
              <span className="font-medium text-foreground">Total de Ingresos:</span>
              <span className="font-bold text-lg text-primary">
                ${totalRevenue.toLocaleString('es-AR')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
