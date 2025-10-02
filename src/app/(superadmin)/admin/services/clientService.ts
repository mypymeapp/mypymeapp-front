import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';

// Interfaces
export interface UserCompany {
  id: string;
  role: 'OWNER' | 'ADMIN' | 'EMPLOYEE';
  createdAt: string;
  company: Company;
}

export interface Company {
  id: string;
  name: string;
  mail: string;
  Pais: string;
  razonSocial: string;
  rubroPrincipal: string;
  rut_Cuit: string;
  subscriptionStatus: 'FREE' | 'PREMIUM';
  subscriptionEndDate: string | null;
  createdAt: string;
  logoFileId: string | null;
  _count: {
    members: number;
    products: number;
    customers: number;
    transactions: number;
  };
}

export interface Client {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  companies: UserCompany[];
  _count: {
    companies: number;
    transactions: number;
    tickets: number;
  };
}

export interface CreateClientData {
  name: string;
  email: string;
  password: string;
  role: 'OWNER' | 'ADMIN' | 'EMPLOYEE';
  company: {
    name: string;
    mail: string;
    pais: string;
    razonSocial: string;
    rubroPrincipal: string;
    rut_Cuit: string;
    passwordHash: string;
  };
}

export interface EditClientData {
  name?: string;
  email?: string;
  avatarUrl?: string;
  isActive?: boolean;
}

class ClientService {
  private getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` })
    };
  }

  // Obtener todos los clientes
  async getClients(): Promise<Client[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/clients`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        const serverMessage = axiosError.response?.data?.message || axiosError.message || 'Error desconocido';
        throw new Error(serverMessage);
      }
      throw new Error('Error al obtener los clientes');
    }
  }

  // Crear nuevo cliente
  async createClient(clientData: CreateClientData): Promise<Client> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/clients`, clientData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        const serverMessage = axiosError.response?.data?.message || axiosError.message || 'Error desconocido';
        throw new Error(serverMessage);
      }
      throw new Error('Error al crear el cliente');
    }
  }

  // Editar cliente
  async editClient(id: string, clientData: EditClientData): Promise<Client> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/users/${id}`, clientData, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        const serverMessage = axiosError.response?.data?.message || axiosError.message || 'Error desconocido';
        throw new Error(serverMessage);
      }
      throw new Error('Error al editar el cliente');
    }
  }

  // Eliminar cliente (soft delete)
  async deleteClient(id: string): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/users/${id}`, {
        headers: this.getAuthHeaders()
      });
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        const serverMessage = axiosError.response?.data?.message || axiosError.message || 'Error desconocido';
        throw new Error(serverMessage);
      }
      throw new Error('Error al eliminar el cliente');
    }
  }

  // Obtener clientes eliminados
  async getDeletedClients(): Promise<Client[]> {
    try {
      const response = await axios.get(`${API_BASE_URL}/users/clients/deleted`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        const serverMessage = axiosError.response?.data?.message || axiosError.message || 'Error desconocido';
        throw new Error(serverMessage);
      }
      throw new Error('Error al obtener los clientes eliminados');
    }
  }

  // Restaurar cliente eliminado
  async restoreClient(id: string): Promise<Client> {
    try {
      const response = await axios.post(`${API_BASE_URL}/users/${id}/restore`, {}, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        const serverMessage = axiosError.response?.data?.message || axiosError.message || 'Error desconocido';
        throw new Error(serverMessage);
      }
      throw new Error('Error al restaurar el cliente');
    }
  }

  // Cambiar estado de cliente
  async changeClientStatus(id: string, status: 'active' | 'inactive' | 'suspended'): Promise<Client> {
    try {
      const response = await axios.patch(`${API_BASE_URL}/clients/${id}/status`, { status }, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        const serverMessage = axiosError.response?.data?.message || axiosError.message || 'Error desconocido';
        throw new Error(serverMessage);
      }
      throw new Error('Error al cambiar el estado del cliente');
    }
  }

  // Obtener estadísticas de clientes
  async getClientStats(): Promise<{
    totalClients: number;
    activeClients: number;
    totalEmployees: number;
    totalRevenue: number;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/clients/stats`, {
        headers: this.getAuthHeaders()
      });
      return response.data;
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } }; message?: string };
        const serverMessage = axiosError.response?.data?.message || axiosError.message || 'Error desconocido';
        throw new Error(serverMessage);
      }
      throw new Error('Error al obtener las estadísticas de clientes');
    }
  }
}

export const clientService = new ClientService();
