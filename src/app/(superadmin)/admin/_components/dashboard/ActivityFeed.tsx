'use client'

import React from 'react'
import { Clock, UserPlus, AlertCircle, CheckCircle, Loader2 } from 'lucide-react'
import type { ActivityItem } from '../../services/dashboardService'

interface ActivityFeedProps {
  activities: ActivityItem[];
  isLoading: boolean;
}

const getActivityIcon = (type: string) => {
  switch (type) {
    case 'user_created':
      return <UserPlus className="w-4 h-4" />;
    case 'client_created':
      return <UserPlus className="w-4 h-4" />;
    case 'ticket_created':
      return <AlertCircle className="w-4 h-4" />;
    case 'ticket_closed':
      return <CheckCircle className="w-4 h-4" />;
    case 'admin_action':
      return <CheckCircle className="w-4 h-4" />;
    default:
      return <Clock className="w-4 h-4" />;
  }
};

const getActivityColor = (type: string) => {
  switch (type) {
    case 'user_created':
      return 'text-green-600';
    case 'client_created':
      return 'text-blue-600';
    case 'ticket_created':
      return 'text-orange-600';
    case 'ticket_closed':
      return 'text-purple-600';
    case 'admin_action':
      return 'text-indigo-600';
    default:
      return 'text-gray-600';
  }
};

const getTimeAgo = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Hace menos de 1 hora'
  if (diffInHours < 24) return `Hace ${diffInHours} horas`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `Hace ${diffInDays} días`
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ activities, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!activities || activities.length === 0) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
        <h3 className="text-lg font-semibold text-foreground mb-4">Actividad Reciente</h3>
        <p className="text-foreground/60 text-center py-8">No hay actividad reciente</p>
      </div>
    );
  }
  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Actividad Reciente</h3>
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 ${getActivityColor(activity.type)}`}>
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {activity.description}
              </p>
              {activity.user && (
                <p className="text-xs text-foreground/50 truncate">
                  {activity.user.name}
                </p>
              )}
              <div className="flex items-center space-x-1 mt-1">
                <Clock className="w-3 h-3 text-foreground/40" />
                <span className="text-xs text-foreground/60">
                  {getTimeAgo(activity.timestamp)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-primary/20">
        <button className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          Ver toda la actividad →
        </button>
      </div>
    </div>
  )
}
