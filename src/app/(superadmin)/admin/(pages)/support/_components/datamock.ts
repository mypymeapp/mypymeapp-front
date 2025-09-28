import { ChatMessage } from "@/app/(superadmin)/admin/(pages)/support/_components/ChatHistory";

// Tipos actualizados para coincidir con el backend
export interface Ticket {
  id: string;
  title: string;
  description: string;
  status: "ABIERTO" | "EN_PROCESO" | "ESPERANDO_USUARIO" | "RESUELTO" | "CERRADO";
  priority: "BAJA" | "MEDIA" | "ALTA" | "CRITICA";
  department: "TECNICO" | "FINANCIERO" | "ADMINISTRATIVO" | "VENTAS";
  userId: string;
  assignedAdminId?: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  assignedAdmin?: {
    id: string;
    name: string;
    email: string;
    department: string;
  };
  messages: TicketMessage[];
  _count?: {
    messages: number;
  };
  // Campos de compatibilidad para la UI existente
  client?: {
    name: string;
    email: string;
    company: string;
  };
  responses?: number;
  chatMessages?: ChatMessage[];
}

export interface TicketMessage {
  id: string;
  ticketId: string;
  message: string;
  isFromUser: boolean;
  userId?: string;
  adminId?: string;
  createdAt: string;
  readAt?: string;
  user?: {
    id: string;
    name: string;
  };
  admin?: {
    id: string;
    name: string;
  };
}

// Datos de ejemplo iniciales (actualizados con tipos correctos)
export const initialTickets: Ticket[] = [
  {
    id: "TK-001",
    title: "Error en el sistema de nómina",
    description: "El cálculo de horas extras no está funcionando correctamente",
    status: "ABIERTO",
    priority: "ALTA",
    department: "TECNICO",
    userId: "user-1",
    user: {
      id: "user-1",
      name: "Juan Pérez",
      email: "juan@empresa.com",
    },
    messages: [],
    createdAt: "2024-01-15T10:30:00",
    updatedAt: "2024-01-15T10:30:00",
    // Campos de compatibilidad
    client: {
      name: "Juan Pérez",
      email: "juan@empresa.com",
      company: "Empresa ABC",
    },
    responses: 0,
    chatMessages: [],
  },
  {
    id: "TK-002",
    title: "Solicitud de nueva funcionalidad",
    description: "Necesitamos agregar reportes personalizados",
    status: "EN_PROCESO",
    priority: "MEDIA",
    department: "TECNICO",
    userId: "user-2",
    assignedAdminId: "admin-1",
    user: {
      id: "user-2",
      name: "María González",
      email: "maria@tech.com",
    },
    assignedAdmin: {
      id: "admin-1",
      name: "Ana Rodríguez",
      email: "ana@admin.com",
      department: "TECNICO",
    },
    messages: [],
    createdAt: "2024-01-14T14:20:00",
    updatedAt: "2024-01-15T09:15:00",
    // Campos de compatibilidad
    client: {
      name: "María González",
      email: "maria@tech.com",
      company: "Tech Solutions",
    },
    responses: 3,
    chatMessages: [
      {
        id: "msg-1",
        message: "Hemos recibido su solicitud y la estamos revisando.",
        author: "Ana Rodríguez",
        authorType: "admin",
        timestamp: "2024-01-14T15:00:00",
      },
      {
        id: "msg-2",
        message: "Gracias por la respuesta. ¿Cuándo estará disponible?",
        author: "María González",
        authorType: "client",
        timestamp: "2024-01-14T16:30:00",
      },
      {
        id: "msg-3",
        message: "Estimamos que estará listo en 2 semanas.",
        author: "Ana Rodríguez",
        authorType: "admin",
        timestamp: "2024-01-15T09:15:00",
      },
    ],
  },
  {
    id: "TK-003",
    title: "Problema con el login",
    description:
      "Los usuarios no pueden acceder al sistema desde dispositivos móviles",
    status: "RESUELTO",
    priority: "CRITICA",
    department: "TECNICO",
    userId: "user-3",
    assignedAdminId: "admin-2",
    user: {
      id: "user-3",
      name: "Carlos Mendoza",
      email: "carlos@innovatech.com",
    },
    assignedAdmin: {
      id: "admin-2",
      name: "Luis García",
      email: "luis@admin.com",
      department: "TECNICO",
    },
    messages: [],
    createdAt: "2024-01-13T08:45:00",
    updatedAt: "2024-01-14T16:30:00",
    // Campos de compatibilidad
    client: {
      name: "Carlos Mendoza",
      email: "carlos@innovatech.com",
      company: "InnovaTech",
    },
    responses: 7,
    chatMessages: [
      {
        id: "msg-4",
        message:
          "Hemos identificado el problema y estamos trabajando en la solución.",
        author: "Luis García",
        authorType: "admin",
        timestamp: "2024-01-13T10:00:00",
      },
      {
        id: "msg-5",
        message:
          "Perfecto, el problema ya está resuelto. Gracias por la rápida respuesta.",
        author: "Carlos Mendoza",
        authorType: "client",
        timestamp: "2024-01-14T16:30:00",
      },
    ],
  },
  {
    id: "TK-004",
    title: "Consulta sobre facturación",
    description: "Necesito información sobre el cambio de plan de suscripción",
    status: "RESUELTO",
    priority: "BAJA",
    department: "FINANCIERO",
    userId: "user-4",
    assignedAdminId: "admin-3",
    user: {
      id: "user-4",
      name: "Ana Martínez",
      email: "ana@startup.co",
    },
    assignedAdmin: {
      id: "admin-3",
      name: "Sofia Ruiz",
      email: "sofia@admin.com",
      department: "FINANCIERO",
    },
    messages: [],
    createdAt: "2024-01-12T15:20:00",
    updatedAt: "2024-01-13T10:15:00",
    // Campos de compatibilidad
    client: {
      name: "Ana Martínez",
      email: "ana@startup.co",
      company: "StartupCo",
    },
    responses: 2,
    chatMessages: [
      {
        id: "msg-6",
        message: "He enviado la información sobre los planes disponibles.",
        author: "Sofia Ruiz",
        authorType: "admin",
        timestamp: "2024-01-12T16:00:00",
      },
      {
        id: "msg-7",
        message: "Muchas gracias, ya realicé el cambio.",
        author: "Ana Martínez",
        authorType: "client",
        timestamp: "2024-01-13T10:15:00",
      },
    ],
  },
  {
    id: "TK-005",
    title: "Integración con API externa",
    description: "Problemas para conectar con el sistema de contabilidad",
    status: "ABIERTO",
    priority: "MEDIA",
    department: "TECNICO",
    userId: "user-5",
    user: {
      id: "user-5",
      name: "Roberto Silva",
      email: "roberto@contable.net",
    },
    messages: [],
    createdAt: "2024-01-11T11:10:00",
    updatedAt: "2024-01-11T11:10:00",
    // Campos de compatibilidad
    client: {
      name: "Roberto Silva",
      email: "roberto@contable.net",
      company: "Contable Net",
    },
    responses: 0,
    chatMessages: [],
  },
];
