import { useState, useCallback } from 'react';
import { clientService, type Client } from '@/app/(superadmin)/admin/services/clientService';
import toast from 'react-hot-toast';

export interface ClientActions {
  // Estado
  clients: Client[];
  isLoading: boolean;
  selectedClient: Client | null;
  
  // Modales
  showCreateModal: boolean;
  showEditModal: boolean;
  showViewModal: boolean;
  showDeletedModal: boolean;
  
  // Acciones básicas
  refreshClients: () => Promise<void>;
  setSelectedClient: (client: Client | null) => void;
  
  // Acciones de modales
  openCreateModal: () => void;
  closeCreateModal: () => void;
  openEditModal: (client: Client) => void;
  closeEditModal: () => void;
  openViewModal: (client: Client) => void;
  closeViewModal: () => void;
  openDeletedModal: () => void;
  closeDeletedModal: () => void;
  
  // Acciones CRUD
  handleCreateClient: (clientData: any) => Promise<void>;
  handleEditClient: (clientData: any) => Promise<void>;
  handleDeleteClient: (clientId: string) => Promise<void>;
  handleRestoreClient: (clientId: string) => Promise<void>;
  handleChangeClientStatus: (clientId: string, status: 'active' | 'inactive' | 'suspended') => Promise<void>;
  
  // Funciones de éxito para componentes externos
  handleCreateClientSuccess: (newClient: Client) => Promise<void>;
  handleEditClientSuccess: (updatedClient: Client) => Promise<void>;
}

export function useClientActions(): ClientActions {
  // Estado
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  
  // Estado de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);

  // Función para refrescar clientes
  const refreshClients = useCallback(async () => {
    setIsLoading(true);
    try {
      const clientsData = await clientService.getClients();
      setClients(clientsData);
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al obtener los clientes';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Acciones de modales
  const openCreateModal = useCallback(() => {
    setShowCreateModal(true);
  }, []);

  const closeCreateModal = useCallback(() => {
    setShowCreateModal(false);
  }, []);

  const openEditModal = useCallback((client: Client) => {
    setSelectedClient(client);
    setShowEditModal(true);
  }, []);

  const closeEditModal = useCallback(() => {
    setShowEditModal(false);
    setSelectedClient(null);
  }, []);

  const openViewModal = useCallback((client: Client) => {
    setSelectedClient(client);
    setShowViewModal(true);
  }, []);

  const closeViewModal = useCallback(() => {
    setShowViewModal(false);
    setSelectedClient(null);
  }, []);

  const openDeletedModal = useCallback(() => {
    setShowDeletedModal(true);
  }, []);

  const closeDeletedModal = useCallback(() => {
    setShowDeletedModal(false);
  }, []);

  // Acciones CRUD
  const handleCreateClient = useCallback(async (clientData: any) => {
    try {
      setIsLoading(true);
      const newClient = await clientService.createClient(clientData);
      await refreshClients();
      closeCreateModal();
      toast.success(`Cliente ${newClient.name} creado exitosamente`);
    } catch (error) {
      console.error('Error al crear cliente:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el cliente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [refreshClients, closeCreateModal]);

  const handleEditClient = useCallback(async (clientData: any) => {
    if (!selectedClient) return;
    
    try {
      setIsLoading(true);
      const updatedClient = await clientService.editClient(selectedClient.id, clientData);
      await refreshClients();
      closeEditModal();
      toast.success(`Cliente ${updatedClient.name} actualizado exitosamente`);
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el cliente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedClient, refreshClients, closeEditModal]);

  const handleDeleteClient = useCallback(async (clientId: string) => {
    try {
      setIsLoading(true);
      await clientService.deleteClient(clientId);
      await refreshClients();
      toast.success('Cliente eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al eliminar el cliente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [refreshClients]);

  const handleRestoreClient = useCallback(async (clientId: string) => {
    try {
      setIsLoading(true);
      const restoredClient = await clientService.restoreClient(clientId);
      await refreshClients();
      toast.success(`Cliente ${restoredClient.name} restaurado exitosamente`);
    } catch (error) {
      console.error('Error al restaurar cliente:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al restaurar el cliente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [refreshClients]);

  const handleChangeClientStatus = useCallback(async (clientId: string, status: 'active' | 'inactive' | 'suspended') => {
    try {
      setIsLoading(true);
      const updatedClient = await clientService.changeClientStatus(clientId, status);
      await refreshClients();
      toast.success(`Estado del cliente ${updatedClient.name} actualizado exitosamente`);
    } catch (error) {
      console.error('Error al cambiar estado del cliente:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al cambiar el estado del cliente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [refreshClients]);

  // Funciones de éxito para componentes externos
  const handleCreateClientSuccess = useCallback(async (_newClient: Client) => {
    await refreshClients();
    closeCreateModal();
    // El toast ya se maneja en el componente del formulario
  }, [refreshClients, closeCreateModal]);

  const handleEditClientSuccess = useCallback(async (_updatedClient: Client) => {
    await refreshClients();
    closeEditModal();
    // El toast ya se maneja en el componente del formulario
  }, [refreshClients, closeEditModal]);

  return {
    // Estado
    clients,
    isLoading,
    selectedClient,
    
    // Modales
    showCreateModal,
    showEditModal,
    showViewModal,
    showDeletedModal,
    
    // Acciones básicas
    refreshClients,
    setSelectedClient,
    
    // Acciones de modales
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openViewModal,
    closeViewModal,
    openDeletedModal,
    closeDeletedModal,
    
    // Acciones CRUD
    handleCreateClient,
    handleEditClient,
    handleDeleteClient,
    handleRestoreClient,
    handleChangeClientStatus,
    
    // Funciones de éxito
    handleCreateClientSuccess,
    handleEditClientSuccess
  };
}
