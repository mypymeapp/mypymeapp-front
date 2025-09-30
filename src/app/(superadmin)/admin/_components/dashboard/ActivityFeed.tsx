'use client'

import React from 'react'
import { Clock, UserPlus, CreditCard, AlertCircle, CheckCircle, TrendingUp } from 'lucide-react'

interface Activity {
  id: string
  type: 'new_user' | 'payment' | 'support' | 'milestone' | 'upgrade'
  title: string
  description: string
  timestamp: string
  icon: React.ReactNode
  color: string
}

const activities: Activity[] = [
  {
    id: '1',
    type: 'new_user',
    title: 'Nuevo cliente registrado',
    description: 'María González se registró con plan Premium',
    timestamp: '2024-01-15T10:30:00Z',
    icon: <UserPlus className="w-4 h-4" />,
    color: 'text-green-600'
  },
  {
    id: '2',
    type: 'payment',
    title: 'Pago procesado',
    description: 'Carlos Rodríguez renovó su suscripción mensual',
    timestamp: '2024-01-15T09:15:00Z',
    icon: <CreditCard className="w-4 h-4" />,
    color: 'text-blue-600'
  },
  {
    id: '3',
    type: 'support',
    title: 'Ticket de soporte',
    description: 'Ana Martínez reportó un problema con la facturación',
    timestamp: '2024-01-15T08:45:00Z',
    icon: <AlertCircle className="w-4 h-4" />,
    color: 'text-orange-600'
  },
  {
    id: '4',
    type: 'milestone',
    title: 'Meta alcanzada',
    description: 'Se alcanzaron 1000 usuarios activos este mes',
    timestamp: '2024-01-15T07:20:00Z',
    icon: <CheckCircle className="w-4 h-4" />,
    color: 'text-purple-600'
  },
  {
    id: '5',
    type: 'upgrade',
    title: 'Actualización de plan',
    description: 'Luis Fernández actualizó de Básico a Premium',
    timestamp: '2024-01-14T16:30:00Z',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'text-indigo-600'
  }
]

const getTimeAgo = (timestamp: string) => {
  const now = new Date()
  const time = new Date(timestamp)
  const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60))
  
  if (diffInHours < 1) return 'Hace menos de 1 hora'
  if (diffInHours < 24) return `Hace ${diffInHours} horas`
  
  const diffInDays = Math.floor(diffInHours / 24)
  return `Hace ${diffInDays} días`
}

export const ActivityFeed: React.FC = () => {
  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Actividad Reciente</h3>
        <Clock className="w-5 h-5 text-foreground/40" />
      </div>
      
      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <div className={`flex-shrink-0 p-2 rounded-full bg-primary/10 ${activity.color}`}>
              {activity.icon}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">
                  {activity.title}
                </p>
                <span className="text-xs text-foreground/60">
                  {getTimeAgo(activity.timestamp)}
                </span>
              </div>
              
              <p className="text-sm text-foreground/70 mt-1">
                {activity.description}
              </p>
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
