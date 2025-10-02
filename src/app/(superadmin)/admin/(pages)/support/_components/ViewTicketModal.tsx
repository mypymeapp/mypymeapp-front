'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Calendar, MessageSquare, AlertCircle, Send, RefreshCw } from 'lucide-react';
import { Ticket, TicketMessage, supportService } from '@/app/(superadmin)/admin/services/supportService';
import toast from 'react-hot-toast';

interface ViewTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Ticket | null;
}

export default function ViewTicketModal({ isOpen, onClose, ticket }: ViewTicketModalProps) {
  const [messages, setMessages] = useState<TicketMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    if (!ticket?.id) return;
    
    try {
      setIsLoadingMessages(true);
      const response = await supportService.getTicketMessages(ticket.id);
      setMessages(response);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Error al cargar los mensajes');
    } finally {
      setIsLoadingMessages(false);
    }
  }, [ticket?.id]);

  // Cargar mensajes cuando se abre el modal
  useEffect(() => {
    if (isOpen && ticket?.id) {
      loadMessages();
    }
  }, [isOpen, ticket?.id, loadMessages]);

  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !ticket?.id) return;

    try {
      setIsSending(true);
      await supportService.addAdminMessage(ticket.id, { message: newMessage });
      setNewMessage('');
      await loadMessages(); // Recargar mensajes
      toast.success('Mensaje enviado');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar el mensaje');
    } finally {
      setIsSending(false);
    }
  };

  if (!ticket) return null;

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      BAJA: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      MEDIA: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      ALTA: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      CRITICA: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      ABIERTO: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      EN_PROCESO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      ESPERANDO_USUARIO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      RESUELTO: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      CERRADO: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-lg shadow-xl"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-background"
            >
              <h2 className="text-2xl font-bold text-foreground">Detalles del Ticket</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 space-y-6"
            >
              {/* ID y Estado */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">ID del Ticket</p>
                  <p className="font-mono text-sm text-foreground">#{ticket.id?.slice(0, 8)}</p>
                </div>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                    {ticket.priority}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ticket.status)}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              {/* Título */}
              <div>
                <h3 className="text-xl font-semibold text-foreground mb-2">{ticket.title}</h3>
                <p className="text-muted-foreground">{ticket.description}</p>
              </div>

              {/* Información del Usuario */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Usuario</p>
                  </div>
                  <p className="text-sm text-foreground">{ticket.user?.name || 'N/A'}</p>
                  <p className="text-xs text-muted-foreground">{ticket.user?.email || 'N/A'}</p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Fecha de Creación</p>
                  </div>
                  <p className="text-sm text-foreground">
                    {ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    }) : 'N/A'}
                  </p>
                </div>
              </div>

              {/* Departamento y Admin Asignado */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Departamento</p>
                  </div>
                  <p className="text-sm text-foreground">{ticket.department || 'N/A'}</p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="w-4 h-4 text-primary" />
                    <p className="text-sm font-medium text-foreground">Admin Asignado</p>
                  </div>
                  {ticket.assignedAdmin ? (
                    <>
                      <p className="text-sm text-foreground">{ticket.assignedAdmin.name}</p>
                      <p className="text-xs text-muted-foreground">{ticket.assignedAdmin.department}</p>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Sin asignar</p>
                  )}
                </div>
              </div>

              {/* Fechas adicionales */}
              {ticket.closedAt && (
                <div className="p-4 bg-muted/50 rounded-lg">
                  <p className="text-sm font-medium text-foreground mb-1">Fecha de Cierre</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(ticket.closedAt).toLocaleDateString('es-ES', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              )}

              {/* Sección de Mensajería */}
              <div className="border-t border-border pt-6 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    <h3 className="text-lg font-semibold text-foreground">Conversación</h3>
                    <span className="text-sm text-muted-foreground">({messages.length} mensajes)</span>
                  </div>
                  <button
                    onClick={loadMessages}
                    disabled={isLoadingMessages}
                    className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    title="Actualizar mensajes"
                  >
                    <RefreshCw className={`w-4 h-4 text-muted-foreground ${isLoadingMessages ? 'animate-spin' : ''}`} />
                  </button>
                </div>

                {/* Lista de Mensajes */}
                <div className="bg-muted/30 rounded-lg p-4 mb-4 max-h-96 overflow-y-auto space-y-3">
                  {isLoadingMessages ? (
                    <div className="flex justify-center items-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>No hay mensajes aún</p>
                      <p className="text-sm">Sé el primero en responder</p>
                    </div>
                  ) : (
                    messages.map((msg, index) => (
                      <div
                        key={index}
                        className={`flex ${msg.isFromUser ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[70%] rounded-lg p-3 ${
                            msg.isFromUser
                              ? 'bg-muted border border-border text-foreground'
                              : 'bg-primary text-black'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <User className="w-3 h-3" />
                            <span className="text-xs font-medium">
                              {msg.isFromUser ? 'Cliente' : (msg.admin?.name || 'Soporte')}
                            </span>
                            {msg.isFromUser && ticket.user?.email && (
                              <span className="text-xs opacity-70">({ticket.user.email})</span>
                            )}
                          </div>
                          <p className="text-sm">{msg.message}</p>
                          <p className={`text-xs mt-1 ${msg.isFromUser ? 'text-muted-foreground' : 'text-black/70'}`}>
                            {new Date(msg.createdAt).toLocaleString('es-ES', {
                              day: '2-digit',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Formulario de Envío */}
                <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSending}
                  />
                  <button
                    type="submit"
                    disabled={isSending || !newMessage.trim()}
                    className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Send className="w-4 h-4" />
                    {isSending ? 'Enviando...' : 'Enviar'}
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Footer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-border bg-background"
            >
              <button
                onClick={onClose}
                className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
              >
                Cerrar
              </button>
            </motion.div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
