import { useState, useEffect, useCallback } from 'react'
import { supportService, Ticket, CreateTicketDto, UpdateTicketDto } from '@/app/(superadmin)/admin/services/supportService'
import toast from 'react-hot-toast'

export interface SupportActions {
  tickets: Ticket[]
  setTickets: (tickets: Ticket[] | ((prev: Ticket[]) => Ticket[])) => void
  showCreateModal: boolean
  setShowCreateModal: (show: boolean) => void
  showEditModal: boolean
  setShowEditModal: (show: boolean) => void
  showDetailModal: boolean
  setShowDetailModal: (show: boolean) => void
  selectedTicket: Ticket | null
  setSelectedTicket: (ticket: Ticket | null) => void
  newTicket: Partial<CreateTicketDto & { clientName?: string; clientEmail?: string; clientCompany?: string }>
  setNewTicket: (ticket: Partial<CreateTicketDto & { clientName?: string; clientEmail?: string; clientCompany?: string }>) => void
  editTicket: Partial<UpdateTicketDto>
  setEditTicket: (ticket: Partial<UpdateTicketDto>) => void
  handleSendMessage: (message: string) => Promise<void>
  handleCreateTicket: (e: React.FormEvent) => Promise<void>
  handleEditTicket: (e: React.FormEvent) => Promise<void>
  handleExportData: () => void
  handleDeleteTicket: (ticketId: string) => Promise<void>
  handleAssignTicket: (ticketId: string, adminId: string) => Promise<void>
  refreshTickets: () => Promise<void>
  refreshStats: () => Promise<void>
  loading: boolean
  stats: {
    total: number
    open: number
    inProgress: number
    resolved: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  setPagination: (pagination: { page: number; limit: number; total: number; totalPages: number }) => void
}

export function useSupportActions(): SupportActions {
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [loading, setLoading] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null)
  const [newTicket, setNewTicket] = useState<Partial<CreateTicketDto & { clientName?: string; clientEmail?: string; clientCompany?: string }>>({
    title: '',
    description: '',
    priority: 'MEDIA',
    department: 'TECNICO',
    clientName: '',
    clientEmail: '',
    clientCompany: ''
  })
  const [editTicket, setEditTicket] = useState<Partial<UpdateTicketDto>>({})
  const [stats, setStats] = useState({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Función para cargar tickets
  const refreshTickets = useCallback(async () => {
    try {
      setLoading(true)
      const response = await supportService.getAllTickets({
        page: pagination.page,
        limit: pagination.limit,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      })
      
      // Mapear datos para compatibilidad con la UI existente
      const mappedTickets = response.tickets.map(ticket => ({
        ...ticket,
        client: {
          name: ticket.user?.name || 'Usuario desconocido',
          email: ticket.user?.email || 'N/A',
          company: ticket.user?.name || 'N/A' // Temporal, ya que no tenemos company en el backend
        },
        responses: ticket._count?.messages || 0,
        chatMessages: ticket.messages?.map(msg => ({
          id: msg.id,
          message: msg.message,
          author: msg.isFromUser ? msg.user?.name || 'Usuario' : msg.admin?.name || 'Admin',
          authorType: msg.isFromUser ? 'client' as const : 'admin' as const,
          timestamp: msg.createdAt
        })) || []
      }));
      
      setTickets(mappedTickets)
      setPagination(prev => ({
        ...prev,
        total: response.pagination.total,
        totalPages: response.pagination.totalPages
      }))
    } catch (error: unknown) {
      console.error('Error loading tickets:', error)
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 401) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.')
      } else if (axiosError.response?.status === 403) {
        toast.error('No tienes permisos para acceder a esta sección.')
      } else {
        toast.error('Error al cargar los tickets')
      }
    } finally {
      setLoading(false)
    }
  }, [pagination.page, pagination.limit])

  // Función para cargar estadísticas
  const refreshStats = useCallback(async () => {
    try {
      const statsData = await supportService.getTicketStats()
      setStats({
        total: statsData.totalTickets,
        open: statsData.openTickets,
        inProgress: statsData.inProgressTickets,
        resolved: statsData.closedTickets
      })
    } catch (error: unknown) {
      console.error('Error loading stats:', error)
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 401) {
        toast.error('Sesión expirada al cargar estadísticas.')
      } else if (axiosError.response?.status === 403) {
        toast.error('Sin permisos para ver estadísticas.')
      }
    }
  }, [])

  // Función para manejar mensajes del chat
  const handleSendMessage = async (message: string) => {
    if (!selectedTicket) return

    try {
      await supportService.addAdminMessage(selectedTicket.id, {
        message,
        isFromUser: false
      })

      // Actualizar el ticket seleccionado
      const updatedTicket = await supportService.getTicketById(selectedTicket.id)
      setSelectedTicket(updatedTicket)

      // Actualizar la lista de tickets
      setTickets(prev => prev.map(ticket => 
        ticket.id === selectedTicket.id 
          ? {
              ...updatedTicket,
              client: {
                name: updatedTicket.user.name,
                email: updatedTicket.user.email,
                company: updatedTicket.user.name
              },
              responses: updatedTicket._count?.messages || 0,
              chatMessages: updatedTicket.messages?.map(msg => ({
                id: msg.id,
                message: msg.message,
                author: msg.isFromUser ? msg.user?.name || 'Usuario' : msg.admin?.name || 'Admin',
                authorType: msg.isFromUser ? 'client' as const : 'admin' as const,
                timestamp: msg.createdAt
              })) || []
            }
          : ticket
      ))

      toast.success('Mensaje enviado correctamente')
    } catch (error) {
      console.error('Error sending message:', error)
      toast.error('Error al enviar el mensaje')
    }
  }

  // Función para crear nuevo ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newTicket.title || !newTicket.description) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    try {
      const ticketData: CreateTicketDto = {
        title: newTicket.title,
        description: newTicket.description,
        priority: newTicket.priority || 'MEDIA',
        department: newTicket.department || 'TECNICO'
      }

      await supportService.createTicket(ticketData)
      await refreshTickets()
      await refreshStats()
      
      setShowCreateModal(false)
      setNewTicket({
        title: '',
        description: '',
        priority: 'MEDIA',
        department: 'TECNICO',
        clientName: '',
        clientEmail: '',
        clientCompany: ''
      })
      
      toast.success('Ticket creado correctamente')
    } catch (error) {
      console.error('Error creating ticket:', error)
      toast.error('Error al crear el ticket')
    }
  }

  // Función para editar ticket
  const handleEditTicket = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedTicket) return

    try {
      await supportService.updateTicket(selectedTicket.id, editTicket)
      await refreshTickets()
      await refreshStats()
      
      setShowEditModal(false)
      setSelectedTicket(null)
      setEditTicket({})
      
      toast.success('Ticket actualizado correctamente')
    } catch (error) {
      console.error('Error updating ticket:', error)
      toast.error('Error al actualizar el ticket')
    }
  }

  // Función para eliminar ticket
  const handleDeleteTicket = async (ticketId: string) => {
    try {
      await supportService.deleteTicket(ticketId)
      await refreshTickets()
      await refreshStats()
      toast.success('Ticket eliminado correctamente')
    } catch (error) {
      console.error('Error deleting ticket:', error)
      toast.error('Error al eliminar el ticket')
    }
  }

  // Función para asignar ticket
  const handleAssignTicket = async (ticketId: string, adminId: string) => {
    try {
      await supportService.assignTicket(ticketId, adminId)
      await refreshTickets()
      await refreshStats()
      toast.success('Ticket asignado correctamente')
    } catch (error) {
      console.error('Error assigning ticket:', error)
      toast.error('Error al asignar el ticket')
    }
  }

  // Función para manejar la exportación de datos
  const handleExportData = () => {
    try {
      if (tickets.length === 0) {
        toast.error('No hay tickets para exportar')
        return
      }

      // Implementar lógica de exportación
      const csvContent = tickets.map(ticket => ({
        ID: ticket.id || 'N/A',
        Título: ticket.title || 'Sin título',
        Estado: ticket.status ? ticket.status.replace('_', ' ') : 'N/A',
        Prioridad: ticket.priority || 'N/A',
        Cliente: ticket.user?.name || 'N/A',
        Email: ticket.user?.email || 'N/A',
        Departamento: ticket.department || 'N/A',
        'Admin Asignado': ticket.assignedAdmin?.name || 'Sin asignar',
        'Fecha Creación': ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('es-ES') : 'N/A',
        Mensajes: ticket._count?.messages || 0
      }))

      const csv = [
        Object.keys(csvContent[0]).join(','),
        ...csvContent.map(row => Object.values(row).map(val => `"${val}"`).join(','))
      ].join('\n')

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `tickets-${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      window.URL.revokeObjectURL(url)
      
      toast.success('Datos exportados correctamente')
    } catch (error) {
      console.error('Error exporting data:', error)
      toast.error('Error al exportar los datos')
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    refreshTickets()
    refreshStats()
  }, [refreshTickets, refreshStats])

  return {
    tickets,
    setTickets,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showDetailModal,
    setShowDetailModal,
    selectedTicket,
    setSelectedTicket,
    newTicket,
    setNewTicket,
    editTicket,
    setEditTicket,
    handleSendMessage,
    handleCreateTicket,
    handleEditTicket,
    handleExportData,
    handleDeleteTicket,
    handleAssignTicket,
    refreshTickets,
    refreshStats,
    loading,
    stats,
    pagination,
    setPagination
  }
}
