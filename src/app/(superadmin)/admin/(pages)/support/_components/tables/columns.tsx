import { Ticket } from "@/app/(superadmin)/admin/(pages)/support/_components/datamock"
import { Column } from "@/app/(superadmin)/admin/_components/dashboard/DataTable"
import { FiMessageSquare } from "react-icons/fi"
import { supportService } from "@/app/(superadmin)/admin/services/supportService"

export const Columns: Column<Ticket>[] = [
  {
    key: 'id',
    header: 'ID',
    sortable: true,
    searchable: true,
    width: '100px'
  },
  {
    key: 'title',
    header: 'Título',
    sortable: true,
    searchable: true,
    width: '250px'
  },
  {
    key: 'user',
    header: 'Usuario',
    sortable: true,
    render: (user: Ticket['user']) => (
      <div>
        <div className="font-medium">{user.name}</div>
        <div className="text-sm text-gray-500">{user.email}</div>
      </div>
    ),
    width: '200px'
  },
  {
    key: 'status',
    header: 'Estado',
    sortable: true,
    render: (status: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${supportService.getStatusColor(status)}`}>
        {supportService.mapStatusToDisplay(status)}
      </span>
    ),
    width: '120px'
  },
  {
    key: 'priority',
    header: 'Prioridad',
    sortable: true,
    render: (priority: string) => (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${supportService.getPriorityColor(priority)}`}>
        {supportService.mapPriorityToDisplay(priority)}
      </span>
    ),
    width: '100px'
  },
  {
    key: 'department',
    header: 'Departamento',
    sortable: true,
    render: (department: string) => supportService.mapDepartmentToDisplay(department),
    width: '120px'
  },
  {
    key: 'createdAt',
    header: 'Fecha',
    sortable: true,
    render: (date: string) => new Date(date).toLocaleDateString('es-ES'),
    width: '120px'
  },
  {
    key: '_count',
    header: 'Mensajes',
    sortable: false,
    render: (count: Ticket['_count']) => (
      <div className="flex items-center gap-1">
        <FiMessageSquare className="w-4 h-4" />
        <span>{count?.messages || 0}</span>
      </div>
    ),
    width: '100px'
  }
]