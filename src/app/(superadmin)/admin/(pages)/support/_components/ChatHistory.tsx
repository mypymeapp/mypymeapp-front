'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FiSend, FiUser, FiUserCheck, FiRefreshCw } from 'react-icons/fi'

export interface ChatMessage {
  id: string
  message: string
  author: string
  authorType: 'admin' | 'client'
  timestamp: string
  avatar?: string
}

export interface ChatHistoryProps {
  messages: ChatMessage[]
  onSendMessage: (message: string) => void
  onRefresh?: () => void
  loading?: boolean
  className?: string
}

export const ChatHistory: React.FC<ChatHistoryProps> = ({
  messages,
  onSendMessage,
  onRefresh,
  loading = false,
  className = ''
}) => {
  const [newMessage, setNewMessage] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (newMessage.trim() && !loading) {
      onSendMessage(newMessage.trim())
      setNewMessage('')
    }
  }

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  return (
    <div className={`flex flex-col h-96 border border-border rounded-lg bg-background ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <FiUserCheck className="w-4 h-4" />
              Historial de Respuestas
            </h3>
            <p className="text-sm text-foreground/60 mt-1">
              {messages.length} {messages.length === 1 ? 'mensaje' : 'mensajes'}
            </p>
          </div>
          {onRefresh && (
            <button
              onClick={onRefresh}
              disabled={loading}
              className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Actualizar mensajes"
            >
              <FiRefreshCw className={`w-4 h-4 text-muted-foreground ${loading ? 'animate-spin' : ''}`} />
            </button>
          )}
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-foreground/60 py-8">
            <FiUserCheck className="w-8 h-8 mx-auto mb-2 opacity-50" />
            <p>No hay respuestas aún</p>
            <p className="text-sm">Sé el primero en responder a este ticket</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 ${
                message.authorType === 'admin' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              {/* Avatar */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.authorType === 'admin' 
                  ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200' 
                  : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
              }`}>
                {message.authorType === 'admin' ? (
                  <FiUserCheck className="w-4 h-4" />
                ) : (
                  <FiUser className="w-4 h-4" />
                )}
              </div>

              {/* Message Bubble */}
              <div className={`flex-1 max-w-[80%] ${
                message.authorType === 'admin' ? 'text-right' : 'text-left'
              }`}>
                <div className={`inline-block p-3 rounded-lg ${
                  message.authorType === 'admin'
                    ? 'bg-primary text-black'
                    : 'bg-muted border border-border text-foreground'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.message}</p>
                </div>
                
                {/* Message Info */}
                <div className={`mt-1 text-xs text-foreground/60 ${
                  message.authorType === 'admin' ? 'text-right' : 'text-left'
                }`}>
                  <span className="font-medium">{message.author}</span>
                  <span className="mx-1">•</span>
                  <span>{formatTimestamp(message.timestamp)}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Message Input */}
      <div className="p-4 border-t border-border bg-muted/10">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <div className="flex-1">
            <Input
              id="new-message"
              label="Escribe tu respuesta..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              disabled={loading}
              className="mb-0"
            />
          </div>
          <Button
            type="submit"
            disabled={!newMessage.trim() || loading}
            className="px-4 py-2 flex items-center gap-2"
          >
            <FiSend className="w-4 h-4" />
            {loading ? 'Enviando...' : 'Enviar'}
          </Button>
        </form>
      </div>
    </div>
  )
}
