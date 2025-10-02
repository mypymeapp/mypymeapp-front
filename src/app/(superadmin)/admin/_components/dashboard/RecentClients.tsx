'use client'

import React from 'react'
import { User, Calendar, Loader2 } from 'lucide-react'
import type { RecentClient } from '../../services/dashboardService'

interface RecentClientsProps {
  clients: RecentClient[];
  isLoading: boolean;
}

export const RecentClients: React.FC<RecentClientsProps> = ({ clients, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!clients || clients.length === 0) {
    return (
      <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
        <h3 className="text-lg font-semibold text-foreground mb-4">Nuevos Clientes</h3>
        <p className="text-foreground/60 text-center py-8">No hay clientes recientes</p>
      </div>
    );
  }
  return (
    <div className="bg-background p-6 rounded-lg shadow-sm border border-primary">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Nuevos Clientes</h3>
        <span className="text-sm text-foreground/60">Últimos 5 días</span>
      </div>
      
      <div className="space-y-4">
        {clients.map((client) => (
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
                {client.company && (
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                    {client.company.name}
                  </span>
                )}
              </div>
              
              <p className="text-sm text-foreground/60 truncate">
                {client.email}
              </p>
              
              <div className="flex items-center space-x-1 mt-1">
                <Calendar className="w-3 h-3 text-foreground/40" />
                <span className="text-xs text-foreground/60">
                  {new Date(client.createdAt).toLocaleDateString('es-AR')}
                </span>
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
