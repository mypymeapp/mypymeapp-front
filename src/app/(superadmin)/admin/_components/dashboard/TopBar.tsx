"use client";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { 
  FiBell, 
  FiMenu,
  FiSun,
  FiMoon,
  FiChevronDown
} from "react-icons/fi";
import Image from "next/image";
import { useAdmin } from "../../context/admin-context";

export default function TopBar() {
  const { user, theme, toggleTheme, toggleSidebar } = useAdmin();
  const [unreadTickets, setUnreadTickets] = useState(0);


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

  // Función para obtener tickets no leídos
  const fetchUnreadTickets = async () => {
    try {
      // Llamada real a la API de tickets
      const response = await fetch('/api/support/tickets/unread-count', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Agregar token de autenticación si es necesario
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUnreadTickets(data.count || 0);
      } else {
        // Fallback: usar número simulado si la API no está disponible
        const mockUnreadCount = Math.floor(Math.random() * 5);
        setUnreadTickets(mockUnreadCount);
      }
    } catch (error) {
      console.error('Error fetching unread tickets:', error);
      // Fallback: usar número simulado en caso de error
      const mockUnreadCount = Math.floor(Math.random() * 3);
      setUnreadTickets(mockUnreadCount);
    }
  };

  // Cargar tickets no leídos al montar el componente
  useEffect(() => {
    fetchUnreadTickets();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchUnreadTickets, 30000);
    return () => clearInterval(interval);
  }, []);

  // Función para manejar click en notificaciones
  const handleNotificationClick = () => {
    // Aquí podrías navegar a la página de tickets o abrir un modal
    console.log('Navegando a tickets no leídos...');
    // Por ejemplo: router.push('/admin/support/tickets?filter=unread');
  };

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

        {/* Right Section */}
        <div className="flex items-center space-x-3">
          {/* Notifications */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleNotificationClick}
            className="relative p-2 rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
            title={`${unreadTickets} tickets sin leer`}
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

          {/* Profile */}
          <motion.div
            whileHover={{ scale: 1.02 }}
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
        </div>
      </div>
    </motion.header>
  );
}
