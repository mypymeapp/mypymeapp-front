import { useState, useEffect, useCallback } from 'react'
import { userService, User, EditUserData, CreateUserData, ResetPasswordData } from '@/app/(superadmin)/admin/services/userService'
import toast from 'react-hot-toast'

export interface UserActions {
  users: User[]
  setUsers: (users: User[] | ((prev: User[]) => User[])) => void
  deletedUsers: User[]
  setDeletedUsers: (users: User[] | ((prev: User[]) => User[])) => void
  showCreateModal: boolean
  setShowCreateModal: (show: boolean) => void
  showEditModal: boolean
  setShowEditModal: (show: boolean) => void
  showDetailModal: boolean
  setShowDetailModal: (show: boolean) => void
  showDeletedModal: boolean
  setShowDeletedModal: (show: boolean) => void
  selectedUser: User | null
  setSelectedUser: (user: User | null) => void
  newUser: Partial<CreateUserData>
  setNewUser: (user: Partial<CreateUserData>) => void
  editUser: Partial<EditUserData>
  setEditUser: (user: Partial<EditUserData>) => void
  handleCreateUser: (e: React.FormEvent) => Promise<void>
  handleCreateUserSuccess: (newUser: User) => Promise<void>
  handleEditUser: (e: React.FormEvent) => Promise<void>
  handleEditUserSuccess: (updatedUser: User) => Promise<void>
  handleDeleteUser: (userId: string) => Promise<void>
  handleRestoreUser: (userId: string) => Promise<void>
  handleResetPassword: (userId: string, data?: ResetPasswordData) => Promise<void>
  handlePromoteToAdmin: (userId: string, role: string, department: string) => Promise<void>
  handleDemoteFromAdmin: (userId: string) => Promise<void>
  handleExportData: () => Promise<void>
  isExporting: boolean
  refreshUsers: () => Promise<void>
  refreshDeletedUsers: () => Promise<void>
  refreshStats: () => Promise<void>
  loading: boolean
  stats: {
    total: number
    active: number
    inactive: number
    admins: number
    newUsers: number
  }
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
  setPagination: (pagination: { page: number; limit: number; total: number; totalPages: number }) => void
}

export function useUserActions(): UserActions {
  const [users, setUsers] = useState<User[]>([])
  const [deletedUsers, setDeletedUsers] = useState<User[]>([])
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showDeletedModal, setShowDeletedModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState<Partial<CreateUserData>>({
    name: '',
    email: '',
    password: '',
    isAdmin: false,
    adminRole: 'SUPPORT',
    adminDepartment: 'TECNICO'
  })
  const [editUser, setEditUser] = useState<Partial<EditUserData>>({})
  const [loading, setLoading] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    newUsers: 0
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  })

  // Función para cargar usuarios activos
  const refreshUsers = useCallback(async () => {
    try {
      setLoading(true)
      const usersData = await userService.getUsersForAdmin()
      setUsers(usersData)
      
      // Actualizar paginación basada en los datos
      setPagination(prev => ({
        ...prev,
        total: usersData.length,
        totalPages: Math.ceil(usersData.length / prev.limit)
      }))
    } catch (error: unknown) {
      console.error('Error loading users:', error)
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 401) {
        toast.error('Sesión expirada. Por favor, inicia sesión nuevamente.')
      } else if (axiosError.response?.status === 403) {
        toast.error('No tienes permisos para acceder a esta sección.')
      } else {
        toast.error('Error al cargar los usuarios')
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Función para cargar usuarios eliminados
  const refreshDeletedUsers = useCallback(async () => {
    try {
      const deletedUsersData = await userService.getDeletedUsers()
      setDeletedUsers(deletedUsersData)
    } catch (error: unknown) {
      console.error('Error loading deleted users:', error)
      const axiosError = error as { response?: { status?: number } }
      if (axiosError.response?.status === 401) {
        toast.error('Sesión expirada al cargar usuarios eliminados.')
      } else if (axiosError.response?.status === 403) {
        toast.error('Sin permisos para ver usuarios eliminados.')
      } else {
        toast.error('Error al cargar usuarios eliminados')
      }
    }
  }, [])

  // Función para cargar estadísticas
  const refreshStats = useCallback(async () => {
    try {
      // Calcular estadísticas basadas en los usuarios cargados
      const totalUsers = users.length
      const activeUsers = users.filter(user => user.isActive).length
      const inactiveUsers = users.filter(user => !user.isActive).length
      const adminUsers = users.filter(user => user.isAdmin).length
      
      // Usuarios nuevos (últimos 30 días)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const newUsers = users.filter(user => 
        new Date(user.createdAt) >= thirtyDaysAgo
      ).length

      setStats({
        total: totalUsers,
        active: activeUsers,
        inactive: inactiveUsers,
        admins: adminUsers,
        newUsers: newUsers
      })
    } catch (error: unknown) {
      console.error('Error calculating stats:', error)
    }
  }, [users])

  // Función para crear nuevo usuario
  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!newUser.name || !newUser.email || !newUser.password) {
      toast.error('Por favor completa todos los campos requeridos')
      return
    }

    try {
      const userData: CreateUserData = {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        isAdmin: newUser.isAdmin || false,
        adminRole: newUser.adminRole || 'SUPPORT',
        adminDepartment: newUser.adminDepartment || 'TECNICO'
      }

      await userService.createUser(userData)
      await refreshUsers()
      
      setShowCreateModal(false)
      setNewUser({
        name: '',
        email: '',
        password: '',
        isAdmin: false,
        adminRole: 'SUPPORT',
        adminDepartment: 'TECNICO'
      })
      
      toast.success('Usuario creado correctamente')
    } catch (error) {
      console.error('Error creating user:', error)
      toast.error('Error al crear el usuario')
    }
  }

  // Función para manejar creación exitosa desde componentes externos
  const handleCreateUserSuccess = async (_newUser: User) => {
    try {
      await refreshUsers()
      
      setShowCreateModal(false)
      setNewUser({
        name: '',
        email: '',
        password: '',
        isAdmin: false,
        adminRole: 'SUPPORT',
        adminDepartment: 'TECNICO'
      })
      
      toast.success('Usuario creado correctamente')
    } catch (error) {
      console.error('Error refreshing after create:', error)
    }
  }

  // Función para editar usuario (maneja eventos de formulario)
  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    try {
      await userService.editUser(selectedUser.id, editUser)
      await refreshUsers()
      
      setShowEditModal(false)
      setSelectedUser(null)
      setEditUser({})
      
      toast.success('Usuario actualizado correctamente')
    } catch (error) {
      console.error('Error updating user:', error)
      toast.error('Error al actualizar el usuario')
    }
  }

  // Función para manejar edición exitosa desde componentes externos
  const handleEditUserSuccess = async (_updatedUser: User) => {
    try {
      await refreshUsers()
      
      setShowEditModal(false)
      setSelectedUser(null)
      
      toast.success('Usuario actualizado correctamente')
    } catch (error) {
      console.error('Error refreshing after edit:', error)
    }
  }

  // Función para eliminar usuario (soft delete)
  const handleDeleteUser = async (userId: string) => {
    try {
      const response = await userService.deleteUser(userId)
      
      await refreshUsers()
      await refreshDeletedUsers()
      
      toast.success(`${response.message}. El usuario puede ser restaurado desde la papelera.`)
    } catch (error) {
      console.error('Error deleting user:', error)
      
      // Manejo específico de errores
      if (error instanceof Error) {
        // Mostrar el mensaje exacto del servidor
        toast.error(error.message)
      } else {
        toast.error('Error al eliminar el usuario. Inténtalo de nuevo.')
      }
    }
  }

  // Función para restaurar usuario
  const handleRestoreUser = async (userId: string) => {
    try {
      const response = await userService.restoreUser(userId)
      await refreshUsers()
      await refreshDeletedUsers()
      toast.success(response.message)
    } catch (error) {
      console.error('Error restoring user:', error)
      const errorMessage = error instanceof Error ? error.message : 'Error al restaurar el usuario'
      toast.error(errorMessage)
    }
  }

  // Función para resetear contraseña
  const handleResetPassword = async (userId: string, data?: ResetPasswordData) => {
    try {
      const response = await userService.resetPassword(userId, data || { temporaryPassword: 'temp123456' })
      toast.success(`Contraseña reseteada. Nueva contraseña temporal: ${response.temporaryPassword}`)
    } catch (error) {
      console.error('Error resetting password:', error)
      toast.error('Error al resetear la contraseña')
    }
  }

  // Función para promover a administrador
  const handlePromoteToAdmin = async (userId: string, role: string, department: string) => {
    try {
      await userService.editUser(userId, {
        isAdmin: true,
        adminRole: role as 'SUPER_ADMIN' | 'SUPPORT' | 'MANAGER',
        adminDepartment: department as 'TECNICO' | 'FINANCIERO' | 'ADMINISTRATIVO' | 'VENTAS'
      })
      await refreshUsers()
      toast.success('Usuario promovido a administrador correctamente')
    } catch (error) {
      console.error('Error promoting user:', error)
      toast.error('Error al promover el usuario')
    }
  }

  // Función para degradar de administrador
  const handleDemoteFromAdmin = async (userId: string) => {
    try {
      await userService.editUser(userId, {
        isAdmin: false
      })
      await refreshUsers()
      toast.success('Usuario degradado de administrador correctamente')
    } catch (error) {
      console.error('Error demoting user:', error)
      toast.error('Error al degradar el usuario')
    }
  }

  // Función para manejar la exportación de datos
  const handleExportData = async () => {
    if (isExporting) return; // Prevenir múltiples exportaciones
    
    setIsExporting(true);
    try {
      // Preparar datos para CSV
      const csvData = users.map(user => ({
        'ID': user.id,
        'Nombre': user.name,
        'Email': user.email,
        'Estado': user.isActive ? 'Activo' : 'Inactivo',
        'Administrador': user.isAdmin ? 'Sí' : 'No',
        'Rol': user.isAdmin ? user.adminRole : '-',
        'Departamento': user.isAdmin ? user.adminDepartment : '-',
        'Tickets': user.ticketsCount || 0,
        'Empresas': user.companiesCount || 0,
        'Fecha de Registro': new Date(user.createdAt).toLocaleDateString('es-ES'),
        'Última Actualización': new Date(user.updatedAt).toLocaleDateString('es-ES')
      }));

      // Convertir a CSV
      if (csvData.length === 0) {
        toast.error('No hay datos para exportar');
        return;
      }

      // Pequeño delay para mostrar el estado de carga
      await new Promise(resolve => setTimeout(resolve, 500));

      const headers = Object.keys(csvData[0]);
      const csvContent = [
        headers.join(','),
        ...csvData.map(row => 
          headers.map(header => {
            const value = row[header as keyof typeof row];
            // Escapar comillas y envolver en comillas si contiene comas
            return typeof value === 'string' && (value.includes(',') || value.includes('"')) 
              ? `"${value.replace(/"/g, '""')}"` 
              : value;
          }).join(',')
        )
      ].join('\n');

      // Crear y descargar archivo
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      
      link.setAttribute('href', url);
      link.setAttribute('download', `usuarios_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exportados ${csvData.length} usuarios exitosamente`);
    } catch (error) {
      console.error('Error al exportar datos:', error);
      toast.error('Error al exportar los datos');
    } finally {
      setIsExporting(false);
    }
  }

  // Cargar datos iniciales
  useEffect(() => {
    refreshUsers()
    refreshDeletedUsers()
  }, [refreshUsers, refreshDeletedUsers])

  // Actualizar estadísticas cuando cambien los usuarios
  useEffect(() => {
    refreshStats()
  }, [users, refreshStats])

  return {
    users,
    setUsers,
    deletedUsers,
    setDeletedUsers,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showDetailModal,
    setShowDetailModal,
    showDeletedModal,
    setShowDeletedModal,
    selectedUser,
    setSelectedUser,
    newUser,
    setNewUser,
    editUser,
    setEditUser,
    handleCreateUser,
    handleCreateUserSuccess,
    handleEditUser,
    handleEditUserSuccess,
    handleDeleteUser,
    handleRestoreUser,
    handleResetPassword,
    handlePromoteToAdmin,
    handleDemoteFromAdmin,
    handleExportData,
    isExporting,
    refreshUsers,
    refreshDeletedUsers,
    refreshStats,
    loading,
    stats,
    pagination,
    setPagination
  }
}