/* eslint-disable @typescript-eslint/no-explicit-any */
import { apiClient } from './apiClient';

export interface User {
  id: string;
  name: string;
  email: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string; // Para soft delete
  avatarUrl?: string;
  isAdmin: boolean;
  adminRole?: 'SUPER_ADMIN' | 'SUPPORT' | 'MANAGER';
  adminDepartment?: 'TECNICO' | 'FINANCIERO' | 'ADMINISTRATIVO' | 'VENTAS';
  ticketsCount: number;
  companiesCount: number;
}

export interface EditUserData {
  name?: string;
  email?: string;
  isActive?: boolean;
  isAdmin?: boolean;
  adminRole?: 'SUPER_ADMIN' | 'SUPPORT' | 'MANAGER';
  adminDepartment?: 'TECNICO' | 'FINANCIERO' | 'ADMINISTRATIVO' | 'VENTAS';
}

export interface CreateUserData {
  name: string;
  email: string;
  password: string;
  isAdmin?: boolean;
  adminRole?: 'SUPER_ADMIN' | 'SUPPORT' | 'MANAGER';
  adminDepartment?: 'TECNICO' | 'FINANCIERO' | 'ADMINISTRATIVO' | 'VENTAS';
}

export interface ResetPasswordData {
  temporaryPassword?: string;
}

export interface ResetPasswordResponse {
  message: string;
  temporaryPassword: string;
  userId: string;
  userName: string;
}

export interface SoftDeleteResponse {
  message: string;
  userId: string;
  userName: string;
  deletedAt: string;
}

export interface RestoreUserResponse {
  message: string;
  userId: string;
  userName: string;
  restoredAt: string;
}

export const userService = {
  // Obtener todos los usuarios para el panel de administración
  async getUsersForAdmin(): Promise<User[]> {
    try {
      const response = await apiClient.get('/users/admin/list');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios:', error);
      throw new Error('Error al cargar los usuarios');
    }
  },

  // Crear nuevo usuario
  async createUser(data: CreateUserData): Promise<User> {
    try {
      const response = await apiClient.post('/users', data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al crear usuario:', error);
      
      // Verificar si es un error de Axios
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Error response:', axiosError.response?.data);
        console.error('Error status:', axiosError.response?.status);
        
        // Extraer mensaje específico del servidor
        const serverMessage = axiosError.response?.data?.message || axiosError.message;
        throw new Error(serverMessage);
      }
      
      // Error genérico
      throw new Error('Error al crear el usuario');
    }
  },

  // Obtener un usuario específico por ID
  async getUserById(id: string): Promise<User> {
    try {
      const response = await apiClient.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      throw new Error('Error al cargar el usuario');
    }
  },

  // Editar usuario existente
  async editUser(id: string, data: EditUserData): Promise<User> {
    try {
      const response = await apiClient.patch(`/users/${id}/edit`, data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al editar usuario:', error);
      
      // Verificar si es un error de Axios
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Error response:', axiosError.response?.data);
        console.error('Error status:', axiosError.response?.status);
        
        // Extraer mensaje específico del servidor
        const serverMessage = axiosError.response?.data?.message || axiosError.message;
        throw new Error(serverMessage);
      }
      
      // Error genérico
      throw new Error('Error al editar el usuario');
    }
  },

  // Reset de contraseña
  async resetPassword(id: string, data: ResetPasswordData = {}): Promise<ResetPasswordResponse> {
    try {
      const response = await apiClient.post(`/users/${id}/reset-password`, data);
      return response.data;
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      throw new Error('Error al resetear la contraseña');
    }
  },

  // Eliminar usuario (soft delete)
  async deleteUser(id: string): Promise<SoftDeleteResponse> {
    try {
      const response = await apiClient.delete(`/users/${id}`);
      return response.data;
    } catch (error: unknown) {
      console.error('Error al eliminar usuario:', error);
      
      // Verificar si es un error de Axios
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as any;
        console.error('Error response:', axiosError.response?.data);
        console.error('Error status:', axiosError.response?.status);
        
        // Extraer mensaje específico del servidor
        const serverMessage = axiosError.response?.data?.message || axiosError.message;
        throw new Error(serverMessage);
      }
      
      // Error genérico
      throw new Error('Error al eliminar el usuario');
    }
  },

  // Restaurar usuario eliminado
  async restoreUser(id: string): Promise<RestoreUserResponse> {
    try {
      const response = await apiClient.post(`/users/${id}/restore`);
      return response.data;
    } catch (error) {
      console.error('Error al restaurar usuario:', error);
      throw new Error('Error al restaurar el usuario');
    }
  },

  // Obtener usuarios eliminados
  async getDeletedUsers(): Promise<User[]> {
    try {
      const response = await apiClient.get('/users/deleted');
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios eliminados:', error);
      throw new Error('Error al cargar los usuarios eliminados');
    }
  },

  // Obtener usuarios activos
  async getActiveUsers(companyId?: string): Promise<User[]> {
    try {
      const params = companyId ? { companyId } : {};
      const response = await apiClient.get('/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener usuarios activos:', error);
      throw new Error('Error al cargar los usuarios activos');
    }
  },

  // Obtener todos los usuarios (activos e inactivos)
  async getAllUsers(companyId?: string): Promise<User[]> {
    try {
      const params = companyId ? { companyId } : {};
      const response = await apiClient.get('/users/all', { params });
      return response.data;
    } catch (error) {
      console.error('Error al obtener todos los usuarios:', error);
      throw new Error('Error al cargar todos los usuarios');
    }
  }
};

export default userService;
