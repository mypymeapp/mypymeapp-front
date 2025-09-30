'use client'

import React from 'react'
import { Button } from '@/components/ui/Button'

export interface PageHeaderAction {
  label: string
  variant?: 'primary' | 'outline' | 'danger'
  onClick: () => void
  icon?: React.ReactNode
}

export interface PageHeaderProps {
  title: string
  description: string
  actions?: PageHeaderAction[]
  className?: string
}

export const PageHeader: React.FC<PageHeaderProps> = ({ 
  title, 
  description, 
  actions = [], 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 ${className}`}>
      <div>
        <h1 className="text-3xl font-bold text-foreground">{title}</h1>
        <p className="text-foreground/60 mt-1">
          {description}
        </p>
      </div>
      
      {actions.length > 0 && (
        <div className="flex gap-3">
          {actions.map((action, index) => (
            <Button 
              key={index}
              variant={action.variant || 'outline'}
              onClick={action.onClick}
              className="flex items-center gap-2"
            >
              {action.icon && action.icon}
              {action.label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
