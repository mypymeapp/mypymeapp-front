import { apiClient } from './apiClient'

// Tipos que coinciden con el backend
export type Department = 'TECNICO' | 'FINANCIERO' | 'ADMINISTRATIVO' | 'VENTAS'

export interface Ticket {
  id: string
  title: string
  description: string
  priority: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'
  status: 'ABIERTO' | 'EN_PROCESO' | 'ESPERANDO_USUARIO' | 'RESUELTO' | 'CERRADO'
  department: Department
  userId: string
  assignedAdminId?: string
  createdAt: string
  updatedAt: string
  closedAt?: string
  user: {
    id: string
    name: string
    email: string
  }
  assignedAdmin?: {
    id: string
    name: string
    email: string
    department: string
  }
  messages: TicketMessage[]
  _count?: {
    messages: number
  }
}

export interface TicketMessage {
  id: string
  ticketId: string
  message: string
  isFromUser: boolean
  userId?: string
  adminId?: string
  createdAt: string
  readAt?: string
  user?: {
    id: string
    name: string
  }
  admin?: {
    id: string
    name: string
  }
}

// Alias para compatibilidad
export interface Message {
  id: string
  ticketId: string
  content: string
  isFromAdmin: boolean
  userId?: string
  adminId?: string
  createdAt: string
  readAt?: string
  user?: {
    id: string
    name: string
  }
  admin?: {
    id: string
    name: string
  }
}

export interface CreateTicketDto {
  title: string
  description: string
  priority?: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'
  department?: 'TECNICO' | 'FINANCIERO' | 'ADMINISTRATIVO' | 'VENTAS'
  userEmail?: string // Email del usuario autenticado (viene de NextAuth)
}

export interface UpdateTicketDto {
  title?: string
  description?: string
  priority?: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'
  status?: 'ABIERTO' | 'EN_PROCESO' | 'ESPERANDO_USUARIO' | 'RESUELTO' | 'CERRADO'
  department?: 'TECNICO' | 'FINANCIERO' | 'ADMINISTRATIVO' | 'VENTAS'
  assignedAdminId?: string
}

export interface CreateMessageDto {
  message: string
  isFromUser?: boolean
  userEmail?: string // Email del usuario autenticado (viene de NextAuth)
}

export interface TicketQueryDto {
  page?: number
  limit?: number
  status?: 'ABIERTO' | 'EN_PROCESO' | 'ESPERANDO_USUARIO' | 'RESUELTO' | 'CERRADO'
  priority?: 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA'
  department?: 'TECNICO' | 'FINANCIERO' | 'ADMINISTRATIVO' | 'VENTAS'
  assignedAdminId?: string
  search?: string
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'status'
  userEmail?: string // Email del usuario para filtrar sus tickets
  sortOrder?: 'asc' | 'desc'
}

export interface TicketStats {
  totalTickets: number
  openTickets: number
  inProgressTickets: number
  closedTickets: number
  highPriorityTickets: number
  avgResponseTime: number
  ticketsByDepartment: Array<{
    department: string
    _count: { id: number }
  }>
  recentActivity: Array<{
    id: string
    message: string
    createdAt: string
    ticket: {
      id: string
      title: string
    }
    user?: {
      id: string
      name: string
    }
    admin?: {
      id: string
      name: string
    }
  }>
}

export interface PaginatedTickets {
  tickets: Ticket[]
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

class SupportService {
  // Endpoints para administradores
  async getAllTickets(query?: TicketQueryDto): Promise<PaginatedTickets> {
    const params = new URLSearchParams()
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    
    const response = await apiClient.get(`/support/admin/tickets?${params}`)
    return response.data
  }

  async getTicketById(id: string): Promise<Ticket> {
    const response = await apiClient.get(`/support/tickets/${id}`)
    return response.data
  }

  async updateTicket(id: string, data: UpdateTicketDto): Promise<Ticket> {
    const response = await apiClient.patch(`/support/admin/tickets/${id}`, data)
    return response.data
  }

  async assignTicket(ticketId: string, adminId: string): Promise<Ticket> {
    const response = await apiClient.post(`/support/admin/tickets/${ticketId}/assign/${adminId}`)
    return response.data
  }

  async deleteTicket(id: string): Promise<void> {
    await apiClient.delete(`/support/admin/tickets/${id}`)
  }

  async addAdminMessage(ticketId: string, data: CreateMessageDto): Promise<TicketMessage> {
    const response = await apiClient.post(`/support/admin/tickets/${ticketId}/messages`, data)
    return response.data
  }

  async markMessageAsRead(messageId: string): Promise<TicketMessage> {
    const response = await apiClient.patch(`/support/admin/messages/${messageId}/read`)
    return response.data
  }

  async getTicketStats(): Promise<TicketStats> {
    const response = await apiClient.get('/support/admin/stats')
    return response.data
  }

  async getTicketMessages(ticketId: string): Promise<TicketMessage[]> {
    const response = await apiClient.get(`/support/tickets/${ticketId}/messages`)
    return response.data
  }

  // Endpoints para usuarios (si necesitas crear tickets desde admin)
  async createTicket(data: CreateTicketDto): Promise<Ticket> {
    const response = await apiClient.post('/support/tickets', data)
    return response.data
  }

  async getUserTickets(query?: TicketQueryDto): Promise<PaginatedTickets> {
    const params = new URLSearchParams()
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString())
        }
      })
    }
    
    const response = await apiClient.get(`/support/my-tickets?${params}`)
    return response.data
  }

  async addUserMessage(ticketId: string, data: CreateMessageDto): Promise<TicketMessage> {
    const response = await apiClient.post(`/support/tickets/${ticketId}/messages`, data)
    return response.data
  }

  // Alias para compatibilidad con vista de clientes
  async getMyTickets(query?: TicketQueryDto): Promise<PaginatedTickets> {
    return this.getUserTickets(query)
  }

  async addMessage(ticketId: string, data: { content?: string; message?: string; userEmail?: string }): Promise<Message> {
    const response = await apiClient.post(`/support/tickets/${ticketId}/messages`, {
      message: data.message || data.content,
      isFromUser: true,
      userEmail: data.userEmail
    })
    
    // Convertir TicketMessage a Message
    const ticketMessage = response.data as TicketMessage
    return {
      id: ticketMessage.id,
      ticketId: ticketMessage.ticketId,
      content: ticketMessage.message,
      isFromAdmin: !ticketMessage.isFromUser,
      userId: ticketMessage.userId,
      adminId: ticketMessage.adminId,
      createdAt: ticketMessage.createdAt,
      readAt: ticketMessage.readAt,
      user: ticketMessage.user,
      admin: ticketMessage.admin
    }
  }

  // Convertir mensajes de TicketMessage a Message
  convertMessagesToMessageFormat(messages: TicketMessage[]): Message[] {
    return messages.map(msg => ({
      id: msg.id,
      ticketId: msg.ticketId,
      content: msg.message,
      isFromAdmin: !msg.isFromUser,
      userId: msg.userId,
      adminId: msg.adminId,
      createdAt: msg.createdAt,
      readAt: msg.readAt,
      user: msg.user,
      admin: msg.admin
    }))
  }

  // Utilidades para mapear datos
  mapPriorityToDisplay(priority: string): string {
    const priorityMap: Record<string, string> = {
      'BAJA': 'Baja',
      'MEDIA': 'Media', 
      'ALTA': 'Alta',
      'CRITICA': 'Crítica'
    }
    return priorityMap[priority] || priority
  }

  mapStatusToDisplay(status: string): string {
    const statusMap: Record<string, string> = {
      'ABIERTO': 'Abierto',
      'EN_PROCESO': 'En Progreso',
      'ESPERANDO_USUARIO': 'Esperando Usuario',
      'RESUELTO': 'Resuelto',
      'CERRADO': 'Cerrado'
    }
    return statusMap[status] || status
  }

  mapDepartmentToDisplay(department: string): string {
    const departmentMap: Record<string, string> = {
      'TECNICO': 'Técnico',
      'FINANCIERO': 'Financiero',
      'ADMINISTRATIVO': 'Administrativo',
      'VENTAS': 'Ventas'
    }
    return departmentMap[department] || department
  }

  getPriorityColor(priority: string): string {
    const colorMap: Record<string, string> = {
      'BAJA': 'bg-green-100 text-green-800',
      'MEDIA': 'bg-yellow-100 text-yellow-800',
      'ALTA': 'bg-orange-100 text-orange-800',
      'CRITICA': 'bg-red-100 text-red-800'
    }
    return colorMap[priority] || 'bg-gray-100 text-gray-800'
  }

  getStatusColor(status: string): string {
    const colorMap: Record<string, string> = {
      'ABIERTO': 'bg-red-100 text-red-800',
      'EN_PROCESO': 'bg-blue-100 text-blue-800',
      'ESPERANDO_USUARIO': 'bg-yellow-100 text-yellow-800',
      'RESUELTO': 'bg-green-100 text-green-800',
      'CERRADO': 'bg-gray-100 text-gray-800'
    }
    return colorMap[status] || 'bg-gray-100 text-gray-800'
  }

  getDepartmentColor(department: string): string {
    const colorMap: Record<string, string> = {
      'TECNICO': 'bg-blue-100 text-blue-800',
      'FINANCIERO': 'bg-green-100 text-green-800',
      'ADMINISTRATIVO': 'bg-purple-100 text-purple-800',
      'VENTAS': 'bg-yellow-100 text-yellow-800'
    }
    return colorMap[department] || 'bg-gray-100 text-gray-800'
  }
}

export const getDepartmentString = (department: string): string => {
  switch (department) {
    case 'TECNICO':
      return 'Técnico'
    case 'FINANCIERO':
      return 'Financiero'
    case 'ADMINISTRATIVO':
      return 'Administrativo'
    case 'VENTAS':
      return 'Ventas'
    default:
      return department
  }
}

// ChatMessage interface for compatibility with ChatHistory component
export interface ChatMessage {
  id: string
  message: string
  author: string
  authorType: 'admin' | 'client'
  timestamp: string
}

// Utility to convert TicketMessage to ChatMessage format
export const convertToChatMessage = (message: TicketMessage): ChatMessage => {
  return {
    id: message.id,
    message: message.message,
    author: message.isFromUser ? message.user?.name || 'Usuario' : message.admin?.name || 'Admin',
    authorType: message.isFromUser ? 'client' : 'admin',
    timestamp: message.createdAt
  }
}

export const supportService = new SupportService()
