'use client'

import React from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'

const salesData = [
  { month: 'Ene', ventas: 4000, clientes: 240 },
  { month: 'Feb', ventas: 3000, clientes: 139 },
  { month: 'Mar', ventas: 2000, clientes: 980 },
  { month: 'Abr', ventas: 2780, clientes: 390 },
  { month: 'May', ventas: 1890, clientes: 480 },
  { month: 'Jun', ventas: 2390, clientes: 380 },
  { month: 'Jul', ventas: 3490, clientes: 430 },
]

export const SalesChart: React.FC = () => {
  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
      <h3 className="text-lg font-semibold text-foreground mb-4">Ventas Mensuales</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={salesData}>
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

export const ClientsChart: React.FC = () => {
  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
      <h3 className="text-lg font-semibold text-foreground mb-4">Nuevos Clientes</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={salesData}>
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
