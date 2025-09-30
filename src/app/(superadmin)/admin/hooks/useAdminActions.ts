"use client";
import { useAdmin } from "../context/admin-context";

export function useAdminActions() {
  const context = useAdmin();
  
  // Sidebar actions
  const sidebarActions = {
    open: () => context.setSidebarOpen(true),
    close: () => context.setSidebarOpen(false),
    toggle: context.toggleSidebar,
    isOpen: context.sidebarOpen,
  };
  
  // Theme actions
  const themeActions = {
    toggle: context.toggleTheme,
    setLight: () => context.setTheme('light'),
    setDark: () => context.setTheme('dark'),
    current: context.theme,
    isDark: context.theme === 'dark',
    isLight: context.theme === 'light',
  };
  
  // Notification actions
  const notificationActions = {
    count: context.notifications,
    increment: () => context.setNotifications(context.notifications + 1),
    decrement: () => context.setNotifications(Math.max(0, context.notifications - 1)),
    clear: () => context.setNotifications(0),
    set: context.setNotifications,
  };
  
  // Loading actions
  const loadingActions = {
    start: () => context.setIsLoading(true),
    stop: () => context.setIsLoading(false),
    toggle: () => context.setIsLoading(!context.isLoading),
    isLoading: context.isLoading,
  };
  
  // Modal actions
  const modalActions = {
    open: context.openModal,
    close: context.closeModal,
    toggle: context.toggleModal,
    isOpen: (modalName: string) => !!context.modals[modalName],
    states: context.modals,
  };
  
  // User actions
  const userActions = {
    current: context.user,
    update: context.setUser,
    updateName: (name: string) => context.setUser({ ...context.user, name }),
    updateRole: (role: string) => context.setUser({ ...context.user, role }),
    updateAvatar: (avatar: string) => context.setUser({ ...context.user, avatar }),
  };
  
  return {
    sidebar: sidebarActions,
    theme: themeActions,
    notifications: notificationActions,
    loading: loadingActions,
    modals: modalActions,
    user: userActions,
    // acceso directo a especificos context values (evitando duplicados)
    sidebarOpen: context.sidebarOpen,
    isLoading: context.isLoading,
    modalStates: context.modals,
  };
}
