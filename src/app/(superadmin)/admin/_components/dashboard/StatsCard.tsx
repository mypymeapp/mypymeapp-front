'use client'

import React from 'react'

export interface StatCardData {
  title: string
  value: string | number
  icon: React.ReactNode
  color: 'blue' | 'red' | 'yellow' | 'green' | 'purple' | 'indigo'
  trend?: {
    value: number
    isPositive: boolean
  }
}

interface StatsCardProps {
  data: StatCardData
  className?: string
}

const colorClasses = {
  blue: {
    bg: 'bg-blue-100',
    text: 'text-blue-600',
    value: 'text-blue-600'
  },
  red: {
    bg: 'bg-red-100',
    text: 'text-red-600',
    value: 'text-red-600'
  },
  yellow: {
    bg: 'bg-yellow-100',
    text: 'text-yellow-600',
    value: 'text-yellow-600'
  },
  green: {
    bg: 'bg-green-100',
    text: 'text-green-600',
    value: 'text-green-600'
  },
  purple: {
    bg: 'bg-purple-100',
    text: 'text-purple-600',
    value: 'text-purple-600'
  },
  indigo: {
    bg: 'bg-indigo-100',
    text: 'text-indigo-600',
    value: 'text-indigo-600'
  }
}

export const StatsCard: React.FC<StatsCardProps> = ({ data, className = '' }) => {
  const colors = colorClasses[data.color]

  return (
    <div className={`bg-background p-6 rounded-lg shadow-sm border border-primary ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-foreground">{data.title}</p>
          <p className={`text-2xl font-bold text-primary`}>{data.value}</p>
          {data.trend && (
            <div className="flex items-center mt-1">
              <span className={`text-xs ${data.trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                {data.trend.isPositive ? '↗' : '↘'} {Math.abs(data.trend.value)}%
              </span>
            </div>
          )}
        </div>
        <div className={`p-3 ${colors.bg} rounded-full`}>
          <div className={`w-6 h-6 ${colors.text}`}>
            {data.icon}
          </div>
        </div>
      </div>
    </div>
  )
}

interface StatsGridProps {
  stats: StatCardData[]
  className?: string
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats, className = '' }) => {
  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ${className}`}>
      {stats.map((stat, index) => (
        <StatsCard key={index} data={stat} />
      ))}
    </div>
  )
}
