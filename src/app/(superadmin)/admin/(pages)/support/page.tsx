'use client';

import { useEffect, useMemo } from 'react';
import { DataTable, Column, CrudActions } from '@/app/(superadmin)/admin/_components/dashboard/DataTable';
import { StatsGrid, StatCardData } from '@/app/(superadmin)/admin/_components/dashboard/StatsCard';
import { PageHeader, PageHeaderAction } from '@/app/(superadmin)/admin/_components/dashboard/PageHeader';
import { Button } from '@/components/ui/Button';
import { FiDownload, FiAlertCircle, FiCheckCircle, FiClock } from 'react-icons/fi';
import { useSupportActions } from './_components/useSupportActions';
import { Ticket } from '@/app/(superadmin)/admin/services/supportService';
import toast from 'react-hot-toast';
import ViewTicketModal from './_components/ViewTicketModal';
import EditTicketModal from './_components/EditTicketModal';
import { motion } from 'framer-motion';

export default function SupportPage() {
  const actions = useSupportActions();

  // Cargar tickets al montar
  useEffect(() => {
    actions.refreshTickets();
    actions.refreshStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Calcular estadísticas
  const statsData: StatCardData[] = useMemo(() => [
    {
      title: 'Total Tickets',
      value: (actions.stats?.total ?? 0).toString(),
      icon: <FiDownload />,
      color: 'blue'
    },
    {
      title: 'Abiertos',
      value: (actions.stats?.open ?? 0).toString(),
      icon: <FiAlertCircle />,
      color: 'red'
    },
    {
      title: 'En Progreso',
      value: (actions.stats?.inProgress ?? 0).toString(),
      icon: <FiClock />,
      color: 'yellow'
    },
    {
      title: 'Resueltos',
      value: (actions.stats?.resolved ?? 0).toString(),
      icon: <FiCheckCircle />,
      color: 'green'
    }
  ], [actions.stats]);

  // Acciones del header
  const headerActions: PageHeaderAction[] = [
    {
      label: 'Exportar Datos',
      variant: 'outline',
      onClick: actions.handleExportData,
      icon: <FiDownload />
    }
  ];

  // Definir columnas
  const columns: Column<Ticket>[] = [
    {
      key: 'id',
      header: 'ID',
      sortable: true,
      render: (_value, ticket) => (
        <span className="font-mono text-xs text-muted-foreground">
          #{ticket?.id ? ticket.id.slice(0, 8) : 'N/A'}
        </span>
      )
    },
    {
      key: 'user',
      header: 'Usuario',
      render: (_value, ticket) => (
        <div>
          <p className="font-medium text-foreground">{ticket?.user?.name || 'Usuario desconocido'}</p>
          <p className="text-sm text-muted-foreground">{ticket?.user?.email || 'N/A'}</p>
        </div>
      )
    },
    {
      key: 'priority',
      header: 'Prioridad',
      sortable: true,
      render: (_value, ticket) => {
        const priorityColors: Record<string, string> = {
          BAJA: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200',
          MEDIA: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          ALTA: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
          CRITICA: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket?.priority ? priorityColors[ticket.priority] : 'bg-gray-100 text-gray-800'}`}>
            {ticket?.priority || 'N/A'}
          </span>
        );
      }
    },
    {
      key: 'status',
      header: 'Estado',
      sortable: true,
      render: (_value, ticket) => {
        const statusColors: Record<string, string> = {
          ABIERTO: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
          EN_PROCESO: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
          ESPERANDO_USUARIO: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
          RESUELTO: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
          CERRADO: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
        };
        return (
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${ticket?.status ? statusColors[ticket.status] : 'bg-gray-100 text-gray-800'}`}>
            {ticket?.status ? ticket.status.replace('_', ' ') : 'N/A'}
          </span>
        );
      }
    },
    {
      key: 'messages',
      header: 'Mensajes',
      render: (_value, ticket) => (
        <span className="text-sm text-foreground">
          {ticket?._count?.messages || 0}
        </span>
      )
    },
    {
      key: 'createdAt',
      header: 'Creado',
      sortable: true,
      render: (_value, ticket) => (
        <span className="text-sm text-muted-foreground">
          {ticket?.createdAt ? new Date(ticket.createdAt).toLocaleDateString('es-ES') : 'N/A'}
        </span>
      )
    }
  ];

  // Acciones CRUD
  const crudActions: CrudActions<Ticket> = {
    onView: (ticket) => {
      actions.setSelectedTicket(ticket);
      actions.setShowDetailModal(true);
    },
    onEdit: (ticket) => {
      actions.setSelectedTicket(ticket);
      actions.setEditTicket({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        department: ticket.department,
        status: ticket.status
      });
      actions.setShowEditModal(true);
    },
    onDelete: (ticket) => {
      toast((t) => (
        <div className="flex flex-col gap-2 text-center">
          <p className="text-lg font-semibold">{`¿Eliminar ticket "${ticket.title}"?`}</p>
          <p className="text-sm text-muted-foreground">Esta acción se puede revertir desde la papelera.</p>
          <div className="flex gap-2 justify-center">
            <Button 
              variant="danger" 
              onClick={async () => {
                await actions.handleDeleteTicket(ticket.id);
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
        duration: Infinity,
        position: 'top-center'
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
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <PageHeader
          title="Sistema de Soporte"
          description="Gestiona tickets de soporte y consultas de clientes"
          actions={headerActions}
        />
      </motion.div>

      {/* Estadísticas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <StatsGrid stats={statsData} />
      </motion.div>

      {/* Tabla de Tickets */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      >
        <DataTable
          data={actions.tickets}
          columns={columns}
          actions={crudActions}
          title="Tickets de Soporte"
          searchPlaceholder="Buscar por ID, título o usuario..."
          itemsPerPage={10}
          loading={actions.loading}
          emptyMessage="No se encontraron tickets"
          showSearch={true}
          showPagination={true}
          className="shadow-lg"
        />
      </motion.div>

      {/* Modales */}
      <ViewTicketModal
        isOpen={actions.showDetailModal}
        onClose={() => actions.setShowDetailModal(false)}
        ticket={actions.selectedTicket}
      />

      <EditTicketModal
        isOpen={actions.showEditModal}
        onClose={() => actions.setShowEditModal(false)}
        ticket={actions.editTicket}
        ticketId={actions.selectedTicket?.id || null}
        onSuccess={() => {
          actions.refreshTickets();
          toast.success('Ticket actualizado exitosamente');
        }}
      />
    </motion.div>
  );
}