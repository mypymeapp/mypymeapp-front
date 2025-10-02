'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FiPlus, 
  FiMessageSquare, 
  FiClock, 
  FiCheckCircle,
  FiAlertCircle,
  FiSearch,
  FiFilter,
  FiX,
  FiSend,
  FiUser,
  FiRefreshCw
} from 'react-icons/fi';
import { supportService, Ticket, Message } from '@/app/(superadmin)/admin/services/supportService';
import toast from 'react-hot-toast';

export default function SoportePage() {
  const { data: session } = useSession();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  
  // Modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  
  // Mensajería
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  
  // Formulario de creación
  const [newTicket, setNewTicket] = useState({
    title: '',
    description: '',
    priority: 'MEDIA' as 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
    department: 'TECNICO' as 'TECNICO' | 'VENTAS' | 'FINANCIERO' | 'ADMINISTRATIVO'
  });

  // Cargar tickets del usuario
  const loadTickets = async () => {
    try {
      setIsLoading(true);
      const response = await supportService.getMyTickets({ 
        page: 1, 
        limit: 100,
        userEmail: session?.user?.email || undefined // Enviar email del usuario autenticado
      });
      setTickets(response.tickets);
      setFilteredTickets(response.tickets);
    } catch (error) {
      console.error('Error loading tickets:', error);
      toast.error('Error al cargar los tickets');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar mensajes de un ticket
  const loadMessages = async (ticketId: string) => {
    try {
      setLoadingMessages(true);
      const response = await supportService.getTicketMessages(ticketId);
      // Convertir TicketMessage[] a Message[]
      const convertedMessages = supportService.convertMessagesToMessageFormat(response);
      setMessages(convertedMessages);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast.error('Error al cargar los mensajes');
    } finally {
      setLoadingMessages(false);
    }
  };

  // Crear nuevo ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newTicket.title.trim() || !newTicket.description.trim()) {
      toast.error('Por favor completa todos los campos');
      return;
    }

    try {
      await supportService.createTicket({
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority,
        department: newTicket.department,
        userEmail: session?.user?.email || undefined // Enviar email del usuario autenticado
      });
      
      toast.success('Ticket creado exitosamente');
      setShowCreateModal(false);
      setNewTicket({
        title: '',
        description: '',
        priority: 'MEDIA',
        department: 'TECNICO'
      });
      loadTickets();
    } catch (error) {
      console.error('Error creating ticket:', error);
      toast.error('Error al crear el ticket');
    }
  };

  // Enviar mensaje
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      setIsSendingMessage(true);
      await supportService.addMessage(selectedTicket.id, { 
        message: newMessage,
        userEmail: session?.user?.email || undefined // Enviar email del usuario autenticado
      });
      setNewMessage('');
      await loadMessages(selectedTicket.id);
      toast.success('Mensaje enviado');
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Error al enviar el mensaje');
    } finally {
      setIsSendingMessage(false);
    }
  };

  // Abrir detalles del ticket
  const handleOpenTicket = async (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setShowDetailModal(true);
    await loadMessages(ticket.id);
  };

  // Filtrar tickets
  useEffect(() => {
    let filtered = tickets;

    // Filtrar por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(ticket =>
        ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        ticket.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtrar por estado
    if (statusFilter !== 'all') {
      filtered = filtered.filter(ticket => ticket.status === statusFilter);
    }

    setFilteredTickets(filtered);
  }, [searchTerm, statusFilter, tickets]);

  // Cargar tickets al montar
  useEffect(() => {
    loadTickets();
  }, []);

  // Obtener color de prioridad
  const getPriorityColor = (priority: string) => {
    const colors = {
      BAJA: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
      MEDIA: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      ALTA: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      CRITICA: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
    };
    return colors[priority as keyof typeof colors] || colors.MEDIA;
  };

  // Obtener color de estado
  const getStatusColor = (status: string) => {
    const colors = {
      ABIERTO: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
      EN_PROCESO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      ESPERANDO_USUARIO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      RESUELTO: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      CERRADO: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[status as keyof typeof colors] || colors.ABIERTO;
  };

  // Obtener icono de estado
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ABIERTO':
        return <FiAlertCircle className="w-4 h-4" />;
      case 'EN_PROCESO':
        return <FiClock className="w-4 h-4" />;
      case 'RESUELTO':
        return <FiCheckCircle className="w-4 h-4" />;
      default:
        return <FiMessageSquare className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Centro de Soporte</h1>
            <p className="text-muted-foreground mt-1">
              Gestiona tus tickets y obtén ayuda de nuestro equipo
            </p>
          </div>
          
          <button
            onClick={() => setShowCreateModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium"
          >
            <FiPlus className="w-5 h-5" />
            Nuevo Ticket
          </button>
        </div>
      </motion.div>

      {/* Filtros y Búsqueda */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6 flex flex-col md:flex-row gap-4"
      >
        {/* Búsqueda */}
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Filtro de Estado */}
        <div className="relative">
          <FiFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-10 pr-8 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="all">Todos los estados</option>
            <option value="ABIERTO">Abiertos</option>
            <option value="EN_PROCESO">En Proceso</option>
            <option value="ESPERANDO_USUARIO">Esperando Respuesta</option>
            <option value="RESUELTO">Resueltos</option>
            <option value="CERRADO">Cerrados</option>
          </select>
        </div>
      </motion.div>

      {/* Lista de Tickets */}
      {isLoading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : filteredTickets.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <FiMessageSquare className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchTerm || statusFilter !== 'all' ? 'No se encontraron tickets' : 'No tienes tickets'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {searchTerm || statusFilter !== 'all' 
              ? 'Intenta con otros filtros' 
              : 'Crea tu primer ticket para obtener soporte'}
          </p>
          {!searchTerm && statusFilter === 'all' && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              Crear Ticket
            </button>
          )}
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTickets.map((ticket, index) => (
            <motion.div
              key={ticket.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => handleOpenTicket(ticket)}
              className="bg-card border border-border rounded-lg p-6 cursor-pointer hover:shadow-lg transition-all hover:scale-[1.02]"
            >
              {/* Header del Ticket */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground text-lg mb-2 line-clamp-2">
                    {ticket.title}
                  </h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {ticket.description}
                  </p>
                </div>
              </div>

              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(ticket.status)}`}>
                  {getStatusIcon(ticket.status)}
                  {ticket.status.replace('_', ' ')}
                </span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                  {ticket.priority}
                </span>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-4 border-t border-border">
                <div className="flex items-center gap-1">
                  <FiMessageSquare className="w-4 h-4" />
                  <span>{ticket._count?.messages || 0} mensajes</span>
                </div>
                <span>{new Date(ticket.createdAt).toLocaleDateString('es-ES')}</span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal de Creación de Ticket */}
      <AnimatePresence>
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-background z-10">
                <h2 className="text-2xl font-bold text-foreground">Crear Nuevo Ticket</h2>
                <button
                  onClick={() => setShowCreateModal(false)}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Formulario */}
              <form onSubmit={handleCreateTicket} className="p-6 space-y-6">
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Título del Ticket *
                  </label>
                  <input
                    type="text"
                    value={newTicket.title}
                    onChange={(e) => setNewTicket({ ...newTicket, title: e.target.value })}
                    placeholder="Describe brevemente tu problema"
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Descripción *
                  </label>
                  <textarea
                    value={newTicket.description}
                    onChange={(e) => setNewTicket({ ...newTicket, description: e.target.value })}
                    placeholder="Proporciona detalles sobre tu problema..."
                    rows={5}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </div>

                {/* Prioridad y Departamento */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Prioridad
                    </label>
                    <select
                      value={newTicket.priority}
                      onChange={(e) => setNewTicket({ ...newTicket, priority: e.target.value as 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA' })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                      <option value="CRITICA">Crítica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Departamento
                    </label>
                    <select
                      value={newTicket.department}
                      onChange={(e) => setNewTicket({ ...newTicket, department: e.target.value as 'TECNICO' | 'VENTAS' | 'FINANCIERO' | 'ADMINISTRATIVO' })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="TECNICO">Técnico</option>
                      <option value="VENTAS">Ventas</option>
                      <option value="FINANCIERO">Financiero</option>
                      <option value="ADMINISTRATIVO">Administrativo</option>
                    </select>
                  </div>
                </div>

                {/* Botones */}
                <div className="flex gap-3 justify-end pt-4">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium"
                  >
                    Crear Ticket
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Detalles y Chat */}
      <AnimatePresence>
        {showDetailModal && selectedTicket && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-background rounded-lg shadow-xl max-w-4xl w-full h-[90vh] flex flex-col"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-foreground mb-2">{selectedTicket.title}</h2>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(selectedTicket.status)}`}>
                      {getStatusIcon(selectedTicket.status)}
                      {selectedTicket.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(selectedTicket.priority)}`}>
                      {selectedTicket.priority}
                    </span>
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                      {selectedTicket.department}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedTicket(null);
                    setMessages([]);
                  }}
                  className="p-2 hover:bg-muted rounded-lg transition-colors"
                >
                  <FiX className="w-5 h-5" />
                </button>
              </div>

              {/* Descripción del Ticket */}
              <div className="p-6 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground mb-2">Descripción</h3>
                <p className="text-sm text-muted-foreground">{selectedTicket.description}</p>
              </div>

              {/* Header de Chat con Botón Refresh */}
              <div className="px-6 py-4 border-b border-border flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FiMessageSquare className="w-5 h-5 text-primary" />
                  <h3 className="text-lg font-semibold text-foreground">Conversación</h3>
                  <span className="text-sm text-muted-foreground">({messages.length} mensajes)</span>
                </div>
                <button
                  onClick={() => selectedTicket && loadMessages(selectedTicket.id)}
                  disabled={loadingMessages}
                  className="p-2 hover:bg-muted rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Actualizar mensajes"
                >
                  <FiRefreshCw className={`w-4 h-4 text-muted-foreground ${loadingMessages ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Chat de Mensajes */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {loadingMessages ? (
                  <div className="flex justify-center items-center py-10">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-10">
                    <FiMessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                    <p className="text-muted-foreground">No hay mensajes aún</p>
                    <p className="text-sm text-muted-foreground mt-1">Sé el primero en escribir</p>
                  </div>
                ) : (
                  messages.map((message, index) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex gap-3 ${message.isFromAdmin ? 'flex-row' : 'flex-row-reverse'}`}
                    >
                      {/* Avatar */}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                        message.isFromAdmin 
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200' 
                          : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'
                      }`}>
                        <FiUser className="w-5 h-5" />
                      </div>

                      {/* Mensaje */}
                      <div className={`flex-1 max-w-[70%] ${
                        message.isFromAdmin ? 'text-left' : 'text-right'
                      }`}>
                        <div className={`inline-block px-4 py-2 rounded-lg ${
                          message.isFromAdmin
                            ? 'bg-muted text-foreground'
                            : 'bg-primary text-black'
                        }`}>
                          <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {new Date(message.createdAt).toLocaleString('es-ES', {
                            day: '2-digit',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Input de Mensaje */}
              <form onSubmit={handleSendMessage} className="p-6 border-t border-border">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Escribe tu mensaje..."
                    className="flex-1 px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    disabled={isSendingMessage}
                  />
                  <button
                    type="submit"
                    disabled={isSendingMessage || !newMessage.trim()}
                    className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    {isSendingMessage ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                    ) : (
                      <FiSend className="w-4 h-4" />
                    )}
                    Enviar
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
