'use client'

import React from 'react'
import { User, Calendar, MapPin } from 'lucide-react'

interface Client {
  id: string
  name: string
  email: string
  plan: string
  joinDate: string
  location: string
  avatar?: string
}

const recentClients: Client[] = [
  {
    id: '1',
    name: 'María González',
    email: 'maria@empresa.com',
    plan: 'Premium',
    joinDate: '2024-01-15',
    location: 'Buenos Aires, AR'
  },
  {
    id: '2',
    name: 'Carlos Rodríguez',
    email: 'carlos@negocio.com',
    plan: 'Básico',
    joinDate: '2024-01-14',
    location: 'Córdoba, AR'
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana@startup.com',
    plan: 'Premium',
    joinDate: '2024-01-13',
    location: 'Rosario, AR'
  },
  {
    id: '4',
    name: 'Luis Fernández',
    email: 'luis@comercio.com',
    plan: 'Estándar',
    joinDate: '2024-01-12',
    location: 'Mendoza, AR'
  },
  {
    id: '5',
    name: 'Sofia López',
    email: 'sofia@tienda.com',
    plan: 'Premium',
    joinDate: '2024-01-11',
    location: 'La Plata, AR'
  }
]

const getPlanColor = (plan: string) => {
  switch (plan) {
    case 'Premium':
      return 'bg-purple-100 text-purple-800'
    case 'Estándar':
      return 'bg-blue-100 text-blue-800'
    case 'Básico':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

export const RecentClients: React.FC = () => {
  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Nuevos Clientes</h3>
        <span className="text-sm text-foreground/60">Últimos 5 días</span>
      </div>
      
      <div className="space-y-4">
        {recentClients.map((client) => (
          <div key={client.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-primary/5 transition-colors">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground truncate">
                  {client.name}
                </p>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPlanColor(client.plan)}`}>
                  {client.plan}
                </span>
              </div>
              
              <p className="text-sm text-foreground/60 truncate">
                {client.email}
              </p>
              
              <div className="flex items-center space-x-4 mt-1">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-3 h-3 text-foreground/40" />
                  <span className="text-xs text-foreground/60">
                    {new Date(client.joinDate).toLocaleDateString('es-AR')}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <MapPin className="w-3 h-3 text-foreground/40" />
                  <span className="text-xs text-foreground/60">
                    {client.location}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 pt-4 border-t border-primary/20">
        <button className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors">
          Ver todos los clientes →
        </button>
      </div>
    </div>
  )
}
