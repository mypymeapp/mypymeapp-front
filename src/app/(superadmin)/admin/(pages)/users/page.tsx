'use client';

import React, { useMemo, useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { DataTable, Column, CrudActions } from '@/app/(superadmin)/admin/_components/dashboard/DataTable';
import { StatsGrid, StatCardData } from '@/app/(superadmin)/admin/_components/dashboard/StatsCard';
import { PageHeader, PageHeaderAction } from '@/app/(superadmin)/admin/_components/dashboard/PageHeader';
import { Card } from './Card';
import { Modal } from './Modal';
import { Button } from './Button';
import {
  FiUsers,
  FiUserCheck,
  FiShield,
  FiDownload
} from 'react-icons/fi';
import CreateUserForm from './CreateUserForm';
import EditUserForm from './EditUserForm';
import { type User as UserServiceType } from '@/app/(superadmin)/admin/services/userService';
import { useUserActions } from './useUserActions';
import toast from 'react-hot-toast';

// Usar el tipo del servicio
type User = UserServiceType;

export default function UsersPage() {
  // Estado para la exportación
  const [isExporting, setIsExporting] = useState(false);

  // Usar el hook personalizado para todas las acciones de usuarios
  const {
    users,
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showDetailModal,
    setShowDetailModal,
    selectedUser,
    setSelectedUser,
    handleDeleteUser,
    handleCreateUserSuccess,
    handleEditUserSuccess,
    loading,
    stats
  } = useUserActions();

  // Usar estadísticas del hook
  const statsData: StatCardData[] = useMemo(() => [
    {
      title: 'Total Usuarios',
      value: stats.total.toString(),
      icon: <FiUsers />,
      color: 'blue'
    },
    {
      title: 'Usuarios Activos',
      value: stats.active.toString(),
      icon: <FiUserCheck />,
      color: 'green'
    },
    {
      title: 'Administradores',
      value: stats.admins.toString(),
      icon: <FiShield />,
      color: 'purple'
    },
    {
      title: 'Nuevos Usuarios (30 días)',
      value: stats.newUsers.toString(),
      icon: <FiUsers />,
      color: 'indigo'
    }
  ], [stats]);

  // Función para editar usuario (abrir modal)
  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  // Wrapper para manejar la creación exitosa
  const handleCreateSuccess = async (newUser: User) => {
    await handleCreateUserSuccess(newUser);
  };

  // Wrapper para manejar la edición exitosa
  const handleEditSuccess = async (updatedUser: User) => {
    await handleEditUserSuccess(updatedUser);
  };

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
  };

  // Definir acciones del encabezado
  const headerActions: PageHeaderAction[] = [
    {
      label: isExporting ? 'Exportando...' : 'Exportar Datos',
      variant: 'outline',
      onClick: handleExportData,
      icon: <FiDownload />
    }
  ];

  // Definir columnas para la tabla de usuarios
  const columns: Column<User>[] = [
    {
      key: 'name',
      header: 'Usuario',
      sortable: true,
      searchable: true,
      render: (value: string, user: User) => (
        <div className="flex items-center space-x-3">
          <div className="flex-shrink-0">
            {user.avatarUrl ? (
              <Image 
                src={user.avatarUrl} 
                alt={user.name}
                width={32}
                height={32}
                className="w-8 h-8 rounded-full object-cover"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-600 font-medium text-sm">
                  {user.name.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex flex-col">
            <span className="font-medium text-foreground">{value}</span>
            <span className="text-xs text-foreground/60">{user.email}</span>
          </div>
        </div>
      ),
      width: '250px'
    },
    {
      key: 'isAdmin',
      header: 'Rol',
      sortable: true,
      render: (value: boolean, user: User) => (
        <div className="flex flex-col">
          <span className={`px-2 py-1 rounded-full text-xs font-medium inline-block w-fit ${
            user.isAdmin 
              ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' 
              : 'bg-muted text-muted-foreground'
          }`}>
            {user.isAdmin ? 'Administrador' : 'Usuario'}
          </span>
          {user.isAdmin && user.adminRole && (
            <span className="text-xs text-foreground/60 mt-1">
              {user.adminRole === 'SUPER_ADMIN' ? 'Super Admin' :
               user.adminRole === 'SUPPORT' ? 'Soporte' : 'Manager'}
            </span>
          )}
        </div>
      ),
      width: '120px'
    },
    {
      key: 'ticketsCount',
      header: 'Tickets',
      sortable: true,
      render: (value: number) => (
        <span className="font-medium text-foreground">{value}</span>
      ),
      width: '80px'
    },
    {
      key: 'isActive',
      header: 'Estado',
      sortable: true,
      render: (value: boolean) => (
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
          value ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {value ? 'Activo' : 'Inactivo'}
        </span>
      ),
      width: '100px'
    },
    {
      key: 'createdAt',
      header: 'Registro',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-foreground">
          {new Date(value).toLocaleDateString('es-ES')}
        </span>
      ),
      width: '100px'
    }
  ];

  // Definir acciones CRUD
  const actions: CrudActions<User> = {
    onCreate: () => {
      setShowCreateModal(true);
    },
    onView: (user: User) => {
      setSelectedUser(user);
      setShowDetailModal(true);
    },
    onEdit: (user: User) => {
      handleEditUser(user);
    },
    onDelete: async (user: User) => {
      // Verificar si es administrador activo
      if (user.isAdmin) {
        toast.error('No se puede eliminar un usuario administrador activo. Primero remueve sus privilegios de administrador desde la opción "Editar".');
        return;
      }

      toast((t) => (
        <div className="flex flex-col gap-2 text-center">
          <p className="text-lg font-semibold">{`¿Estás seguro de que quieres eliminar el usuario "${user.name}"?`}</p>
          <p className="text-sm text-muted-foreground">Esta acción se puede revertir desde la papelera.</p>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="danger" 
              onClick={async () => {
                await handleDeleteUser(user.id);
                toast.dismiss(t.id);
              }}
            >
              Sí, eliminar
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
        duration: Infinity, // No auto-dismiss
        position: 'top-center'
      });
    }
  };

  return (
    <motion.div 
      className="space-y-6 p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <PageHeader
          title="Gestión de Usuarios"
          description="Administra usuarios del sistema y sus roles de administrador"
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
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-foreground/60">Cargando usuarios...</span>
          </div>
        ) : (
          <DataTable
            data={users}
            columns={columns}
            actions={actions}
            title="Lista de Usuarios"
            searchPlaceholder="Buscar por nombre o email..."
            itemsPerPage={10}
            showSearch={true}
            showCreateButton={true}
            createButtonText="Nuevo Usuario"
            className="shadow-lg"
          />
        )}
      </motion.div>

      {/* User Details Modal */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title={selectedUser ? `Detalles de ${selectedUser.name}` : ''}
        maxWidth="3xl"
      >
        {selectedUser && (
          <div className="p-6 space-y-6">
            {/* User Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-4">Información Personal</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-foreground/60">Nombre:</span>
                    <p className="font-medium">{selectedUser.name}</p>
                  </div>
                  <div>
                    <span className="text-sm text-foreground/60">Email:</span>
                    <p className="font-medium">{selectedUser.email}</p>
                  </div>
                  <div>
                    <span className="text-sm text-foreground/60">Estado:</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      selectedUser.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedUser.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-foreground/60">Fecha de registro:</span>
                    <p className="font-medium">
                      {new Date(selectedUser.createdAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <h3 className="font-semibold text-foreground mb-4">Información de Administrador</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-foreground/60">Es Administrador:</span>
                    <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                      selectedUser.isAdmin ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' : 'bg-muted text-muted-foreground'
                    }`}>
                      {selectedUser.isAdmin ? 'Sí' : 'No'}
                    </span>
                  </div>
                  {selectedUser.isAdmin && (
                    <>
                      <div>
                        <span className="text-sm text-foreground/60">Rol de Admin:</span>
                        <p className="font-medium">
                          {selectedUser.adminRole === 'SUPER_ADMIN' ? 'Super Administrador' :
                           selectedUser.adminRole === 'SUPPORT' ? 'Soporte' : 'Manager'}
                        </p>
                      </div>
                      <div>
                        <span className="text-sm text-foreground/60">Departamento:</span>
                        <p className="font-medium">
                          {selectedUser.adminDepartment === 'TECNICO' ? 'Técnico' :
                           selectedUser.adminDepartment === 'FINANCIERO' ? 'Financiero' :
                           selectedUser.adminDepartment === 'ADMINISTRATIVO' ? 'Administrativo' : 'Ventas'}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </Card>
            </div>

            {/* Activity Stats */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Estadísticas de Actividad</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{selectedUser.ticketsCount}</div>
                  <div className="text-sm text-foreground/60">Tickets Creados</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{selectedUser.companiesCount}</div>
                  <div className="text-sm text-foreground/60">Empresas Asociadas</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.floor((Date.now() - new Date(selectedUser.createdAt).getTime()) / (1000 * 60 * 60 * 24))}
                  </div>
                  <div className="text-sm text-foreground/60">Días en el Sistema</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {new Date(selectedUser.updatedAt).toLocaleDateString('es-ES')}
                  </div>
                  <div className="text-sm text-foreground/60">Última Actividad</div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Modal>

      {/* Create User Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Usuario"
        maxWidth="md"
      >
        <CreateUserForm 
          onSuccess={handleCreateSuccess}
          onCancel={() => setShowCreateModal(false)}
        />
      </Modal>

      {/* Edit User Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title={selectedUser ? `Editar Usuario: ${selectedUser.name}` : 'Editar Usuario'}
        maxWidth="2xl"
      >
        {selectedUser && (
          <EditUserForm 
            user={selectedUser}
            onSuccess={handleEditSuccess}
            onCancel={() => setShowEditModal(false)}
          />
        )}
      </Modal>
    </motion.div>
  );
}