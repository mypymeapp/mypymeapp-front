'use client'

import { FiDownload, FiAlertCircle, FiCheckCircle } from 'react-icons/fi'
import { DataTable, CrudActions } from '@/app/(superadmin)/admin/_components/dashboard/DataTable'
import { StatsGrid, StatCardData } from '@/app/(superadmin)/admin/_components/dashboard/StatsCard'
import { PageHeader, PageHeaderAction } from '@/app/(superadmin)/admin/_components/dashboard/PageHeader'
import { Columns } from './tables/columns'
import { Ticket } from './datamock'
import { useSupportActions } from './useSupportActions'
import { SupportModals } from './tables/modals'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/Button'

export default function SupportClient() {
  const actions = useSupportActions()

  // Definir acciones del encabezado
  const headerActions: PageHeaderAction[] = [
    {
      label: 'Exportar Datos',
      variant: 'outline',
      onClick: actions.handleExportData,
      icon: <FiDownload />
    }
  ]

  // Definir las acciones CRUD
  const actionsTable: CrudActions<Ticket> = {
    onCreate: () => actions.setShowCreateModal(true),
    onView: (ticket: Ticket) => {
      actions.setSelectedTicket(ticket)
      actions.setShowDetailModal(true)
    },
    onEdit: (ticket: Ticket) => {
      actions.setSelectedTicket(ticket)
      actions.setEditTicket({
        title: ticket.title,
        description: ticket.description,
        priority: ticket.priority,
        department: ticket.department,
        status: ticket.status
      })
      actions.setShowEditModal(true)
    },
    onDelete: (ticket: Ticket) => {
        if (!ticket.id) {
            toast.error('Error: Ticket sin ID válido');
            return;
        }
        
        toast((t) => (
            <div className="flex flex-col gap-2 text-center">
                <p className="text-lg font-semibold">{`¿Estás seguro de que quieres eliminar el ticket "${ticket.title}"?`}</p>
                <div className="flex gap-2">
                    <Button variant="danger" onClick={async () => {
                        await actions.handleDeleteTicket(ticket.id!)
                        toast.dismiss(t.id)
                    }}>Sí, eliminar</Button>
                    <Button variant="outline" onClick={() => {
                        toast.dismiss(t.id)
                    }}>No, cancelar</Button>
                </div>
            </div>
        ))
    }
  }

  // Configurar datos para StatsGrid
  const statsData: StatCardData[] = [
    {
      title: 'Total',
      value: actions.stats.total,
      icon: <FiDownload className="w-6 h-6" />,
      color: 'blue'
    },
    {
      title: 'Abiertos',
      value: actions.stats.open,
      icon: <FiAlertCircle className="w-6 h-6" />,
      color: 'red'
    },
    {
      title: 'En Progreso',
      value: actions.stats.inProgress,
      icon: <FiCheckCircle className="w-6 h-6" />,
      color: 'yellow'
    },
    {
      title: 'Resueltos',
      value: actions.stats.resolved,
      icon: <FiCheckCircle className="w-6 h-6" />,
      color: 'green'
    }
  ]

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <PageHeader
        title="Sistema de Soporte"
        description="Gestiona tickets de soporte y consultas de clientes"
        actions={headerActions}
      />

      {/* Estadísticas */}
      <StatsGrid stats={statsData} />

      {/* Tabla de tickets usando DataTable */}
      <DataTable
        data={actions.tickets}
        columns={Columns}
        actions={actionsTable}
        title="Tickets de Soporte"
        searchPlaceholder="Buscar ID..."
        itemsPerPage={3}
        loading={actions.loading}
        emptyMessage="No se encontraron tickets"
        showSearch={true}
        showPagination={true}
        showCreateButton={true}
        createButtonText="Nuevo Ticket"
        className="shadow-lg"
      />

      {/* Modales */}
      <SupportModals actions={actions} />
    </div>
  )
}
