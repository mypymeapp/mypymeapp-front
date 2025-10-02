"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import { 
  FiBell, 
  FiMenu,
  FiChevronDown,
  FiAlertCircle,
  FiClock,
  FiUser,
  FiLogOut
} from "react-icons/fi";
import Image from "next/image";
import { useAdmin } from "../../context/admin-context";
import { supportService, Ticket } from "../../services/supportService";
import { useRouter } from "next/navigation";
import { apiClient } from "../../services/apiClient";
import { signOut } from "next-auth/react";

export default function TopBar() {
  const { user, toggleSidebar } = useAdmin();
  const router = useRouter();
  const [unreadTickets, setUnreadTickets] = useState(0);
  const [recentTickets, setRecentTickets] = useState<Ticket[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);


  // Función para formatear el rol de admin
  const formatAdminRole = (role: string) => {
    const roleMap: { [key: string]: string } = {
      'SUPER_ADMIN': 'SuperAdmin',
      'MANAGER': 'Manager',
      'SUPPORT': 'Soporte'
    };
    return roleMap[role] || role;
  };

  // Función para formatear el departamento
  const formatDepartment = (department: string) => {
    const deptMap: { [key: string]: string } = {
      'TECNICO': 'Técnico',
      'VENTAS': 'Ventas',
      'FINANZAS': 'Finanzas',
      'MARKETING': 'Marketing',
      'ADMINISTRATIVO': 'Administrativo'
    };
    return deptMap[department] || department;
  };

  // Función para obtener tickets recientes
  const fetchRecentTickets = async () => {
    try {
      const response = await supportService.getAllTickets({
        page: 1,
        limit: 5,
        status: 'ABIERTO',
        sortBy: 'createdAt',
        sortOrder: 'desc'
      });
      
      setRecentTickets(response.tickets);
      setUnreadTickets(response.tickets.length);
    } catch (error) {
      console.error('Error fetching recent tickets:', error);
      setRecentTickets([]);
      setUnreadTickets(0);
    }
  };

  // Detectar tema para el logo
  useEffect(() => {
    setMounted(true);
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);

    const observer = new MutationObserver(() => {
      const isDark = document.documentElement.classList.contains('dark');
      setIsDarkMode(isDark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

  // Cargar tickets al montar el componente
  useEffect(() => {
    fetchRecentTickets();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchRecentTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  // Cerrar dropdowns al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Función para manejar click en notificaciones
  const handleNotificationClick = () => {
    setShowDropdown(!showDropdown);
  };

  // Función para navegar a un ticket específico
  const handleTicketClick = (ticketId: string) => {
    setShowDropdown(false);
    router.push(`/admin/support?ticketId=${ticketId}`);
  };

  // Función para ver todos los tickets
  const handleViewAllTickets = () => {
    setShowDropdown(false);
    router.push('/admin/support');
  };

  // Función para obtener color de prioridad
  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      BAJA: 'text-gray-600 dark:text-gray-400',
      MEDIA: 'text-blue-600 dark:text-blue-400',
      ALTA: 'text-orange-600 dark:text-orange-400',
      CRITICA: 'text-red-600 dark:text-red-400'
    };
    return colors[priority] || 'text-gray-600';
  };

  // Función para manejar logout
  const handleLogout = async () => {
    try {
      // Cerrar dropdown
      setShowProfileDropdown(false);
      
      // Limpiar cualquier dato local si existe
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Llamar al endpoint de logout del backend para limpiar cookies
      try {
        await apiClient.post('/auth/logout');
      } catch {
        // Continuar con el logout del frontend incluso si el backend falla
      }
      
      // Usar signOut de NextAuth para limpiar la sesión
      await signOut({ 
        redirect: false, // No redirigir automáticamente
        callbackUrl: '/login' 
      });
      
      // Redirigir manualmente con recarga completa
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      // Aún así redirigir al login con recarga completa
      window.location.href = '/login';
    }
  };

  // Determinar qué logo mostrar
  const logoSrc = mounted && isDarkMode ? '/logo-dark.png' : '/logo-light.png';

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="backdrop-blur-sm text-primary border-b border-primary dark:border-gray-700 px-6 py-4 sticky top-0 z-30"
    >
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center space-x-4">
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-lg transition-colors cursor-pointer"
          >
            <FiMenu size={20} className="text-primary" />
          </button>
          
          <div>
            <p className="text-sm text-foreground hidden md:block">
              Bienvenido de vuelta, {user.name.split(' ')[0]}
            </p>
          </div>
        </div>

        {/* Center Section - Logo for Mobile */}
        <div className="absolute left-1/2 transform -translate-x-1/2 lg:hidden">
          <div className="w-24 h-10 relative">
            <Image
              src={logoSrc}
              alt="My PymeApp Logo"
              fill
              className="object-contain"
              priority
            />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <div className="relative" ref={dropdownRef}>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleNotificationClick}
              className="relative p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
              title={`${unreadTickets} tickets nuevos`}
            >
              <FiBell size={20} className="text-foreground" />
              {unreadTickets > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium"
                >
                  {unreadTickets}
                </motion.span>
              )}
            </motion.button>

            {/* Dropdown de Notificaciones */}
            <AnimatePresence>
              {showDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-96 bg-background border border-border rounded-lg shadow-xl overflow-hidden z-50"
                >
                  {/* Header del Dropdown */}
                  <div className="px-4 py-3 border-b border-border bg-muted/30">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold text-foreground">Tickets Nuevos</h3>
                      <span className="text-xs text-muted-foreground">
                        {unreadTickets} {unreadTickets === 1 ? 'ticket' : 'tickets'}
                      </span>
                    </div>
                  </div>

                  {/* Lista de Tickets */}
                  <div className="max-h-96 overflow-y-auto">
                    {recentTickets.length > 0 ? (
                      recentTickets.map((ticket) => (
                        <motion.div
                          key={ticket.id}
                          whileHover={{ backgroundColor: 'rgba(0, 0, 0, 0.02)' }}
                          onClick={() => handleTicketClick(ticket.id)}
                          className="px-4 py-3 border-b border-border cursor-pointer transition-colors hover:bg-muted/50"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <FiAlertCircle className="text-red-500 flex-shrink-0" size={14} />
                                <p className="font-medium text-sm text-foreground truncate">
                                  {ticket.title}
                                </p>
                              </div>
                              <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                                {ticket.description}
                              </p>
                              <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1">
                                  <FiUser size={12} className="text-muted-foreground" />
                                  <span className="text-muted-foreground">{ticket.user.name}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <FiClock size={12} className="text-muted-foreground" />
                                  <span className="text-muted-foreground">
                                    {new Date(ticket.createdAt).toLocaleDateString('es-ES', {
                                      day: 'numeric',
                                      month: 'short',
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              <span className={`text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                                {ticket.priority}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {ticket.department}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="px-4 py-8 text-center">
                        <FiBell size={32} className="mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">No hay tickets nuevos</p>
                      </div>
                    )}
                  </div>

                  {/* Footer del Dropdown */}
                  {recentTickets.length > 0 && (
                    <div className="px-4 py-3 border-t border-border bg-muted/30">
                      <button
                        onClick={handleViewAllTickets}
                        className="w-full text-sm text-primary hover:text-primary/80 font-medium transition-colors"
                      >
                        Ver todos los tickets →
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative" ref={profileDropdownRef}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className="flex items-center space-x-3 p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
                  {user.avatarUrl ? (
                    <Image
                      src={user.avatarUrl}
                      alt={user.name}
                      width={40}
                      height={40}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center">
                      <span className="text-white font-bold text-sm">{user.avatar}</span>
                    </div>
                  )}
                </div>
                {/* Status indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></div>
              </div>
              
              {/* User Info */}
              <div className="hidden sm:block">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-semibold text-foreground">{user.name}</p>
                  <FiChevronDown size={14} className="text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {formatAdminRole(user.admin.role)} - {formatDepartment(user.admin.department)}
                </p>
              </div>
            </motion.div>

            {/* Dropdown de Perfil */}
            <AnimatePresence>
              {showProfileDropdown && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-56 bg-background border border-border rounded-lg shadow-xl overflow-hidden z-50"
                >
                  {/* Header del Dropdown */}
                  <div className="px-4 py-3 border-b border-border bg-muted/30">
                    <p className="font-semibold text-sm text-foreground truncate">{user.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>

                  {/* Opciones */}
                  <div className="py-2">
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-muted/50 transition-colors text-left"
                    >
                      <FiLogOut size={18} className="text-red-500" />
                      <span className="text-sm font-medium text-foreground">Cerrar Sesión</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
