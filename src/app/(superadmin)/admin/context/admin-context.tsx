"use client";
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useSession } from "next-auth/react";

interface AdminContextType {
  // Estados del sidebar
  sidebarOpen: boolean;
  toggleSidebar: () => void;
  setSidebarOpen: (open: boolean) => void;
  
  // Estados del tema
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  
  // Notificaciones
  notifications: number;
  setNotifications: (count: number) => void;
  
  // Cargando 
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  
  // Información del usuario
  user: {
    name: string;
    role: string;
    avatar: string;
    avatarUrl?: string;
    email: string;
    status: 'online' | 'offline' | 'away';
    admin: {
      role: string;
      department: string;
      isActive: boolean;
    };
  };
  setUser: (user: { name: string; role: string; avatar: string; avatarUrl?: string; email: string; status: 'online' | 'offline' | 'away'; admin: { role: string; department: string; isActive: boolean; } }) => void;
  
  // Estados de los modales
  modals: {
    [key: string]: boolean;
  };
  openModal: (modalName: string) => void;
  closeModal: (modalName: string) => void;
  toggleModal: (modalName: string) => void;
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

interface AdminProviderProps {
  children: ReactNode;
}

export function AdminProvider({ children }: AdminProviderProps) {
  const { data: session } = useSession();
  
  // Sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  // Theme
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  // Notifications
  const [notifications, setNotifications] = useState(3);
  // Loading
  const [isLoading, setIsLoading] = useState(false);
  // Información del usuario - inicializar con datos por defecto
  const [user, setUser] = useState<{
    name: string;
    role: string;
    avatar: string;
    avatarUrl?: string;
    email: string;
    status: 'online' | 'offline' | 'away';
    admin: {
      role: string;
      department: string;
      isActive: boolean;
    };
  }>({
    name: "Usuario",
    role: "Administrador",
    avatar: "U",
    email: "",
    status: "online",
    admin: {
      role: "SUPPORT",
      department: "TECNICO",
      isActive: false,
    },
    avatarUrl: undefined
  });
  // Estados de los modales
  const [modals, setModals] = useState<{ [key: string]: boolean }>({});
  // Funciones del sidebar
  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  // Funciones del tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    // Actualizar el tema
    if (typeof document !== 'undefined') {
      document.documentElement.classList.toggle('dark', newTheme === 'dark');
      localStorage.setItem('theme', newTheme);
    }
  };
  // Funciones de modales
  const openModal = (modalName: string) => {
    setModals(prev => ({ ...prev, [modalName]: true }));
  };
  const closeModal = (modalName: string) => {
    setModals(prev => ({ ...prev, [modalName]: false }));
  };
  const toggleModal = (modalName: string) => {
    setModals(prev => ({ ...prev, [modalName]: !prev[modalName] }));
  };


  // Inicializar tema
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' || 'light';
      setTheme(savedTheme);
      document.documentElement.classList.toggle('dark', savedTheme === 'dark');
    }
  }, []);

  // Actualizar datos del usuario cuando la sesión cambie
  useEffect(() => {
    if (session?.user) {
      const sessionUser = session.user as {
        name?: string;
        email?: string;
        image?: string;
        avatarUrl?: string;
        role?: string;
        adminRole?: string;
        adminDepartment?: string;
        isAdmin?: boolean;
      };
      
      
      setUser({
        name: sessionUser.name || "Usuario",
        role: sessionUser.role || "Administrador", 
        avatar: sessionUser.name ? sessionUser.name.split(' ').map((n: string) => n[0]).join('').toUpperCase() : "U",
        email: sessionUser.email || "",
        status: "online",
        admin: {
          role: sessionUser.adminRole || "SUPPORT",
          department: sessionUser.adminDepartment || "TECNICO", 
          isActive: sessionUser.isAdmin || false,
        },
        avatarUrl: sessionUser.avatarUrl || sessionUser.image || undefined
      });
    }
  }, [session]);
  
  const value: AdminContextType = {
    // Sidebar
    sidebarOpen,
    toggleSidebar,
    setSidebarOpen,
    
    // Theme
    theme,
    toggleTheme,
    setTheme,
    
    // NotificationsAdminContext
    notifications,
    setNotifications,
    
    // Loading
    isLoading,
    setIsLoading,
    
    // User
    user,
    setUser,
    
    // Modals
    modals,
    openModal,
    closeModal,
    toggleModal,
  };
  
  return (
    <AdminContext.Provider value={value}>
      {children}
    </AdminContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
}
