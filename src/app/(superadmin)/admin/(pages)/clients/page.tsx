'use client';

import React, { useMemo, useEffect, useState } from 'react';
import { DataTable, Column, CrudActions } from '@/app/(superadmin)/admin/_components/dashboard/DataTable';
import { StatsGrid, StatCardData } from '@/app/(superadmin)/admin/_components/dashboard/StatsCard';
import { PageHeader, PageHeaderAction } from '@/app/(superadmin)/admin/_components/dashboard/PageHeader';
import { Card } from './Card';
import { Modal } from './Modal';
import { Button } from './Button';
import { useClientActions } from './useClientActions';
import { Client } from '@/app/(superadmin)/admin/services/clientService';
import CreateClientForm from './CreateClientForm';
import EditClientForm from './EditClientForm';
import { FiUsers, FiUserCheck, FiUser, FiDollarSign, FiDownload, FiTrash2 } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

export default function ClientsPage() {
  const {
    clients,
    deletedClients,
    isLoading,
    selectedClient,
    showViewModal,
    showCreateModal,
    showEditModal,
    showDeletedModal,
    openCreateModal,
    closeCreateModal,
    openEditModal,
    closeEditModal,
    openViewModal,
    closeViewModal,
    openDeletedModal,
    closeDeletedModal,
    handleDeleteClient,
    handleRestoreClient,
    handleCreateClientSuccess,
    handleEditClientSuccess,
    refreshClients,
    refreshDeletedClients
  } = useClientActions();

  // Estado para la exportación
  const [isExporting, setIsExporting] = useState(false);

  // Cargar clientes al montar el componente
  useEffect(() => {
    refreshClients();
  }, [refreshClients]);

  // Calculo de estadisticas con useMemo para optimizar el rendimiento
  const statsData: StatCardData[] = useMemo(() => [
    {
      title: 'Total Clientes',
      value: clients.length.toString(),
      icon: <FiUsers />,
      color: 'blue'
    },
    {
      title: 'Clientes Activos',
      value: clients.filter(client => client.isActive).length.toString(),
      icon: <FiUserCheck />,
      color: 'green'
    },
    {
      title: 'Total Empresas',
      value: clients.reduce((sum, client) => sum + (client._count?.companies || 0), 0).toString(),
      icon: <FiUser />,
      color: 'purple'
    },
    {
      title: 'Total Transacciones',
      value: clients.reduce((sum, client) => sum + (client._count?.transactions || 0), 0).toString(),
      icon: <FiDollarSign />,
      color: 'yellow'
    }
  ], [clients]);

  // Función para manejar la exportación de datos
  const handleExportData = async () => {
    if (isExporting) return; // Prevenir múltiples exportaciones
    
    setIsExporting(true);
    try {
      // Preparar datos para CSV
      const csvData = clients.map(client => {
        const primaryCompany = client.companies?.[0]?.company;
        const primaryRole = client.companies?.[0]?.role;
        
        return {
          'Nombre': client.name,
          'Email': client.email,
          'Empresa Principal': primaryCompany?.name || 'Sin empresa',
          'Rol': primaryRole || 'Sin rol',
          'País': primaryCompany?.Pais || '-',
          'RUT/CUIT': primaryCompany?.rut_Cuit || '-',
          'Plan': primaryCompany?.subscriptionStatus || 'FREE',
          'Estado': client.isActive ? 'Activo' : 'Inactivo',
          'Fecha de Registro': new Date(client.createdAt).toLocaleDateString('es-ES'),
          'Última Actualización': new Date(client.updatedAt).toLocaleDateString('es-ES')
        };
      });

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
      link.setAttribute('download', `clientes_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Exportados ${csvData.length} clientes exitosamente`);
    } catch (error) {
      console.error('Error al exportar datos:', error);
      toast.error('Error al exportar los datos');
    } finally {
      setIsExporting(false);
    }
  };

  // Definir acciones del encabezado
  const headerActions: PageHeaderAction[] = [
    {
      label: `Papelera (${deletedClients.length})`,
      variant: 'outline',
      onClick: () => {
        refreshDeletedClients();
        openDeletedModal();
      },
      icon: <FiTrash2 />
    },
    {
      label: isExporting ? 'Exportando...' : 'Exportar Datos',
      variant: 'outline',
      onClick: handleExportData,
      icon: <FiDownload />
    }
  ];

  // Definir columnas para la tabla de clientes
  const columns: Column<Client>[] = [
    {
      key: 'company',
      header: 'Empresa Principal',
      sortable: true,
      render: (value: unknown, client: Client) => {
        const primaryCompany = client.companies?.[0]?.company;
        return (
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-primary">{primaryCompany?.name?.charAt(0) || 'E'}</span>
            </div>
            <span className="font-medium text-foreground">{primaryCompany?.name || 'Sin empresa'}</span>
          </div>
        );
      },
      width: '200px'
    },
    {
      key: 'name',
      header: 'Cliente',
      sortable: true,
      searchable: true,
      render: (value: string) => (
        <div className="flex flex-col">
          <span className="font-medium text-foreground">{value}</span>
        </div>
      ),
      width: '200px'
    },
    {
      key: 'role',
      header: 'Rol Principal',
      sortable: true,
      render: (value: unknown, client: Client) => {
        const primaryRole = client.companies?.[0]?.role;
        const roleColors = {
          OWNER: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          ADMIN: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          EMPLOYEE: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        };
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            roleColors[primaryRole as keyof typeof roleColors] || roleColors.EMPLOYEE
          }`}>
            {primaryRole || 'Sin rol'}
          </span>
        );
      },
      width: '120px'
    },
    {
      key: 'plan',
      header: 'Plan',
      render: (value: unknown, client: Client) => {
        const primaryCompany = client.companies?.[0]?.company;
        if (!primaryCompany) return <span className="text-muted-foreground">-</span>;
        
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            primaryCompany.subscriptionStatus === 'PREMIUM' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
            'bg-muted text-muted-foreground'
          }`}>
            {primaryCompany.subscriptionStatus === 'PREMIUM' ? 'Premium' : 'Gratuito'}
          </span>
        );
      },
      width: '100px'
    },
    {
      key: 'isActive',
      header: 'Estado',
      sortable: true,
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
          'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      ),
      width: '100px'
    },
    // {
    //   key: 'createdAt',
    //   header: 'Registro',
    //   sortable: true,
    //   render: (value: string) => (
    //     <span className="text-sm text-foreground">
    //       {new Date(value).toLocaleDateString('es-ES')}
    //     </span>
    //   ),
    //   width: '120px'
    // }
  ];

  // Definir acciones CRUD
  const actions: CrudActions<Client> = {
    onCreate: () => {
      openCreateModal();
    },
    onView: (client: Client) => {
      openViewModal(client);
    },
    onEdit: (client: Client) => {
      openEditModal(client);
    },
    onDelete: (client: Client) => {
      toast((t) => (
        <div className="flex flex-col gap-2 text-center">
          <p className="text-lg font-semibold">{`¿Estás seguro de que quieres eliminar el cliente "${client.name}"?`}</p>
          <p className="text-sm text-muted-foreground">Esta acción se puede revertir desde la papelera.</p>
          <div className="flex gap-2 justify-center">
            <button 
              className="px-3 py-1 bg-destructive text-destructive-foreground rounded text-sm hover:bg-destructive/90 transition-colors"
              onClick={async () => {
                await handleDeleteClient(client.id);
                toast.dismiss(t.id);
              }}
            >
              Sí, eliminar
            </button>
            <button 
              className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
              onClick={() => toast.dismiss(t.id)}
            >
              Cancelar
            </button>
          </div>
        </div>
      ), {
        duration: Infinity,
        position: 'top-center',
      });
    }
  };

  return (
    <motion.div 
      className="space-y-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <PageHeader
          title="Gestión de Clientes"
          description="Administra clientes, sus empresas y empleados desde un solo lugar"
          actions={headerActions}
        />
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <StatsGrid stats={statsData} />
      </motion.div>

      {/* Main Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-foreground/60">Cargando clientes...</span>
          </div>
        ) : (
          <DataTable
            data={clients}
            columns={columns}
            actions={actions}
            title="Lista de Clientes"
            searchPlaceholder="Buscar por cliente..."
            itemsPerPage={5}
            showSearch={true}
            showCreateButton={false}
            createButtonText="Nuevo Cliente"
            className="shadow-lg"
          />
        )}
      </motion.div>

      {/* Client Details Modal */}
      <Modal
        isOpen={showViewModal}
        onClose={closeViewModal}
        title={selectedClient ? `Detalles de ${selectedClient.name}` : ''}
        maxWidth="4xl"
        zIndex={60}
      >
        {selectedClient && selectedClient.companies?.[0] && (
          <div className="p-6 space-y-6">
            {(() => {
              const primaryCompany = selectedClient.companies[0].company;
              return (
                <>
                  {/* Client Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="p-4">
                      <h3 className="font-semibold text-foreground mb-4">Información del Cliente</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-foreground/60">Nombre:</span>
                          <p className="font-medium">{selectedClient.name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-foreground/60">Email:</span>
                          <p className="font-medium">{selectedClient.email}</p>
                        </div>
                        <div>
                          <span className="text-sm text-foreground/60">Estado:</span>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            selectedClient.isActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                            'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                          }`}>
                            {selectedClient.isActive ? 'Activo' : 'Inactivo'}
                          </span>
                        </div>
                        <div>
                          <span className="text-sm text-foreground/60">Registro:</span>
                          <p className="font-medium">{new Date(selectedClient.createdAt).toLocaleDateString('es-ES')}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <h3 className="font-semibold text-foreground mb-4">Información de la Empresa</h3>
                      <div className="space-y-3">
                        <div>
                          <span className="text-sm text-foreground/60">Nombre:</span>
                          <p className="font-medium">{primaryCompany.name}</p>
                        </div>
                        <div>
                          <span className="text-sm text-foreground/60">Razón Social:</span>
                          <p className="font-medium">{primaryCompany.razonSocial}</p>
                        </div>
                        <div>
                          <span className="text-sm text-foreground/60">Rubro:</span>
                          <p className="font-medium">{primaryCompany.rubroPrincipal}</p>
                        </div>
                        <div>
                          <span className="text-sm text-foreground/60">País:</span>
                          <p className="font-medium">{primaryCompany.Pais}</p>
                        </div>
                        <div>
                          <span className="text-sm text-foreground/60">RUT/CUIT:</span>
                          <p className="font-medium">{primaryCompany.rut_Cuit}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  <Card className="p-4">
                    <h3 className="font-semibold text-foreground mb-4">Información de Suscripción</h3>
                    <div className="space-y-3">
                      <div>
                        <span className="text-sm text-foreground/60">Email de Contacto:</span>
                        <p className="font-medium">{primaryCompany.mail}</p>
                      </div>
                      <div>
                        <span className="text-sm text-foreground/60">Plan de Suscripción:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          primaryCompany.subscriptionStatus === 'PREMIUM' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {primaryCompany.subscriptionStatus === 'PREMIUM' ? 'Premium' : 'Gratuito'}
                        </span>
                      </div>
                      {primaryCompany.subscriptionEndDate && (
                        <div>
                          <span className="text-sm text-foreground/60">Vence:</span>
                          <p className="font-medium">{new Date(primaryCompany.subscriptionEndDate).toLocaleDateString('es-ES')}</p>
                        </div>
                      )}
                      <div>
                        <span className="text-sm text-foreground/60">Rol del Cliente:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedClient.companies[0].role === 'OWNER' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                          selectedClient.companies[0].role === 'ADMIN' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {selectedClient.companies[0].role === 'OWNER' ? 'Propietario' :
                           selectedClient.companies[0].role === 'ADMIN' ? 'Administrador' : 'Empleado'}
                        </span>
                      </div>
                    </div>
                  </Card>
                </>
              );
            })()}

            {/* Statistics */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Estadísticas</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">{selectedClient._count?.companies || 0}</p>
                  <p className="text-sm text-foreground/60">Empresas</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{selectedClient._count?.transactions || 0}</p>
                  <p className="text-sm text-foreground/60">Transacciones</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{selectedClient._count?.tickets || 0}</p>
                  <p className="text-sm text-foreground/60">Tickets</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-purple-600">{selectedClient.companies[0].company._count?.members || 0}</p>
                  <p className="text-sm text-foreground/60">Miembros</p>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      {/* Create Client Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={closeCreateModal}
        title="Crear Nuevo Cliente"
        maxWidth="4xl"
      >
        <CreateClientForm
          onSuccess={handleCreateClientSuccess}
          onCancel={closeCreateModal}
        />
      </Modal>

      {/* Edit Client Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={closeEditModal}
        title={selectedClient ? `Editar Cliente: ${selectedClient.name}` : 'Editar Cliente'}
        maxWidth="4xl"
      >
        {selectedClient && (
          <EditClientForm
            client={selectedClient}
            onSuccess={handleEditClientSuccess}
            onCancel={closeEditModal}
          />
        )}
      </Modal>

      {/* Deleted Clients Modal (Papelera) */}
      <Modal
        isOpen={showDeletedModal}
        onClose={closeDeletedModal}
        title={`Papelera de Clientes (${deletedClients.length})`}
        maxWidth="4xl"
      >
        <div className="p-6">
          {deletedClients.length === 0 ? (
            <div className="text-center py-12">
              <FiTrash2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-medium text-foreground">La papelera está vacía</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                No hay clientes eliminados para mostrar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  <strong>Nota:</strong> Los clientes eliminados se pueden restaurar. Al restaurar, el cliente volverá a estar activo en el sistema.
                </p>
              </div>

              <div className="space-y-3">
                {deletedClients.map((client) => (
                  <Card key={client.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center opacity-60">
                            <span className="text-gray-600 dark:text-gray-300 font-medium">
                              {client.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-foreground">{client.name}</h4>
                            {client.companies.length > 0 && (
                              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                client.companies[0].company.subscriptionStatus === 'PREMIUM' 
                                  ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                                  : 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
                              }`}>
                                {client.companies[0].company.subscriptionStatus}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{client.email}</p>
                          {client.deletedAt && (
                            <p className="text-xs text-red-600 dark:text-red-400 mt-1">
                              Eliminado el {new Date(client.deletedAt).toLocaleDateString('es-ES', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          onClick={() => {
                            openViewModal(client);
                          }}
                        >
                          Ver Detalles
                        </Button>
                        <Button
                          variant="primary"
                          onClick={() => {
                            toast((t) => (
                              <div className="flex flex-col gap-2 text-center">
                                <p className="text-lg font-semibold">{`¿Restaurar el cliente "${client.name}"?`}</p>
                                <p className="text-sm text-muted-foreground">El cliente volverá a estar activo en el sistema.</p>
                                <div className="flex gap-2 justify-center">
                                  <Button 
                                    variant="primary" 
                                    onClick={async () => {
                                      await handleRestoreClient(client.id);
                                      toast.dismiss(t.id);
                                    }}
                                  >
                                    Sí, restaurar
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    onClick={() => toast.dismiss(t.id)}
                                  >
                                    Cancelar
                                  </Button>
                                </div>
                              </div>
                            ), {
                              duration: Infinity,
                              position: 'top-center'
                            });
                          }}
                        >
                          Restaurar
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </motion.div>
  );
}