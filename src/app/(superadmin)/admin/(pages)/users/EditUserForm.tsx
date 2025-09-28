'use client';

import React, { useState } from 'react';
import { FiUser, FiMail, FiShield, FiKey, FiRefreshCw, FiSave } from 'react-icons/fi';
import { userService, type User as UserServiceType, type EditUserData as EditUserServiceData, type ResetPasswordResponse } from '@/app/(superadmin)/admin/services/userService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

// Usar el tipo del servicio
type User = UserServiceType;

interface EditUserFormProps {
  user: User;
  onSuccess: (user: User) => void;
  onCancel: () => void;
}

interface EditUserData {
  name: string;
  email: string;
  isActive: boolean;
  isAdmin: boolean;
  adminRole?: 'SUPER_ADMIN' | 'SUPPORT' | 'MANAGER';
  adminDepartment?: 'TECNICO' | 'FINANCIERO' | 'ADMINISTRATIVO' | 'VENTAS';
}

export default function EditUserForm({ user, onSuccess, onCancel }: EditUserFormProps) {
  const [formData, setFormData] = useState<EditUserData>({
    name: user.name,
    email: user.email,
    isActive: user.isActive,
    isAdmin: user.isAdmin,
    adminRole: user.adminRole || 'SUPPORT',
    adminDepartment: user.adminDepartment || 'TECNICO'
  });

  const [errors, setErrors] = useState<Partial<EditUserData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResettingPassword, setIsResettingPassword] = useState(false);
  const [showPasswordResetConfirm, setShowPasswordResetConfirm] = useState(false);

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Partial<EditUserData> = {};

    // Validar nombre
    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.email.trim()) {
      newErrors.email = 'El email es requerido';
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = 'El email no tiene un formato válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manejar cambios en el formulario
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof EditUserData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Manejar reset de contraseña
  const handlePasswordReset = async () => {
    if (!showPasswordResetConfirm) {
      setShowPasswordResetConfirm(true);
      return;
    }

    setIsResettingPassword(true);
    
    try {
      const response: ResetPasswordResponse = await userService.resetPassword(user.id);
      
      toast.success(`${response.message}. Nueva contraseña temporal: ${response.temporaryPassword}`);
      setShowPasswordResetConfirm(false);
    } catch (error) {
      console.error('Error al resetear contraseña:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al resetear la contraseña. Inténtalo de nuevo.';
      toast.error(errorMessage);
    } finally {
      setIsResettingPassword(false);
    }
  };

  // Manejar envío del formulario
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Preparar datos para enviar
      const updateData: EditUserServiceData = {};
      
      // Información básica del usuario
      if (formData.name !== user.name) updateData.name = formData.name;
      if (formData.email !== user.email) updateData.email = formData.email;
      if (formData.isActive !== user.isActive) updateData.isActive = formData.isActive;
      
      // Estado de administrador
      if (formData.isAdmin !== user.isAdmin) updateData.isAdmin = formData.isAdmin;
      
      // Rol y departamento de admin - enviar siempre que el usuario será admin
      if (formData.isAdmin) {
        if (formData.adminRole && formData.adminRole !== user.adminRole) {
          updateData.adminRole = formData.adminRole;
        }
        if (formData.adminDepartment && formData.adminDepartment !== user.adminDepartment) {
          updateData.adminDepartment = formData.adminDepartment;
        }
      }

      
      const updatedUser = await userService.editUser(user.id, updateData);
      onSuccess(updatedUser);
    } catch (error) {
      console.error('Error al actualizar usuario:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el usuario. Inténtalo de nuevo.';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form 
      onSubmit={handleSubmit} 
      className="p-6 space-y-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      {/* Información básica */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Información Básica</h3>
          <span className="text-sm text-foreground/60">ID: {user.id}</span>
        </div>
        
        {/* Nombre */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground/70 mb-2">
            <FiUser className="inline mr-2" />
            Nombre completo
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-md bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.name ? 'border-red-500' : 'border-border'
            }`}
            placeholder="Ingresa el nombre completo"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground/70 mb-2">
            <FiMail className="inline mr-2" />
            Correo electrónico
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full p-3 border rounded-md bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? 'border-red-500' : 'border-border'
            }`}
            placeholder="usuario@ejemplo.com"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Estado activo */}
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isActive"
            name="isActive"
            checked={formData.isActive}
            onChange={handleInputChange}
            className="w-4 h-4 text-green-600 bg-background border-border rounded focus:ring-green-500"
          />
          <label htmlFor="isActive" className="text-sm font-medium text-foreground">
            Usuario activo
          </label>
        </div>
      </motion.div>

      {/* Gestión de contraseña */}
      <motion.div 
        className="space-y-4 border-t border-border pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h3 className="text-lg font-semibold text-foreground">Gestión de Contraseña</h3>
        
        <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-md">
          <div className="flex items-start space-x-3">
            <FiKey className="text-yellow-600 mt-1" />
            <div className="flex-1">
              <h4 className="font-medium text-foreground mb-2">Reset de Contraseña</h4>
              <p className="text-sm text-foreground/70 mb-3">
                La contraseña actual no se puede visualizar por seguridad. Puedes resetearla a una contraseña temporal.
              </p>
              
              {!showPasswordResetConfirm ? (
                <button
                  type="button"
                  onClick={handlePasswordReset}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors flex items-center space-x-2"
                >
                  <FiRefreshCw />
                  <span>Resetear Contraseña</span>
                </button>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    ¿Estás seguro de que quieres resetear la contraseña de {user.name}?
                  </p>
                  <p className="text-xs text-foreground/60">
                    Se generará una contraseña temporal: <strong>temp123456</strong>
                  </p>
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={handlePasswordReset}
                      disabled={isResettingPassword}
                      className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center space-x-1"
                    >
                      {isResettingPassword ? (
                        <>
                          <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Reseteando...</span>
                        </>
                      ) : (
                        <>
                          <FiKey />
                          <span>Confirmar Reset</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowPasswordResetConfirm(false)}
                      className="px-3 py-1 bg-secondary text-secondary-foreground rounded text-sm hover:bg-secondary/80 transition-colors"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Configuración de administrador */}
      <motion.div 
        className="space-y-4 border-t border-border pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="isAdmin"
            name="isAdmin"
            checked={formData.isAdmin}
            onChange={handleInputChange}
            className="w-4 h-4 text-purple-600 bg-background border-border rounded focus:ring-purple-500"
          />
          <label htmlFor="isAdmin" className="text-sm font-medium text-foreground">
            <FiShield className="inline mr-2" />
            Es administrador
          </label>
        </div>

        {formData.isAdmin && (
          <div className="ml-7 space-y-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-md">
            <h4 className="font-medium text-foreground">Configuración de Administrador</h4>
            
            {/* Rol de administrador */}
            <div>
              <label htmlFor="adminRole" className="block text-sm font-medium text-foreground/70 mb-2">
                Rol de Administrador
              </label>
              <select
                id="adminRole"
                name="adminRole"
                value={formData.adminRole}
                onChange={handleInputChange}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="SUPPORT">Soporte</option>
                <option value="MANAGER">Manager</option>
                <option value="SUPER_ADMIN">Super Administrador</option>
              </select>
            </div>

            {/* Departamento */}
            <div>
              <label htmlFor="adminDepartment" className="block text-sm font-medium text-foreground/70 mb-2">
                Departamento
              </label>
              <select
                id="adminDepartment"
                name="adminDepartment"
                value={formData.adminDepartment}
                onChange={handleInputChange}
                className="w-full p-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="TECNICO">Técnico</option>
                <option value="FINANCIERO">Financiero</option>
                <option value="ADMINISTRATIVO">Administrativo</option>
                <option value="VENTAS">Ventas</option>
              </select>
            </div>
          </div>
        )}

        {/* Mostrar cambios de estado de admin */}
        {formData.isAdmin !== user.isAdmin && (
          <div className={`p-3 rounded-md ${
            formData.isAdmin 
              ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
          }`}>
            <p className={`text-sm font-medium ${
              formData.isAdmin ? 'text-green-800 dark:text-green-200' : 'text-red-800 dark:text-red-200'
            }`}>
              {formData.isAdmin 
                ? `✓ ${user.name} será promovido a administrador` 
                : `⚠ ${user.name} será degradado de administrador`
              }
            </p>
          </div>
        )}
      </motion.div>

      {/* Información adicional */}
      <motion.div 
        className="bg-muted/50 p-4 rounded-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h4 className="font-medium text-foreground mb-2">Información del Usuario</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-foreground/60">Tickets creados:</span>
            <span className="ml-2 font-medium">{user.ticketsCount}</span>
          </div>
          <div>
            <span className="text-foreground/60">Empresas asociadas:</span>
            <span className="ml-2 font-medium">{user.companiesCount}</span>
          </div>
          <div>
            <span className="text-foreground/60">Fecha de registro:</span>
            <span className="ml-2 font-medium">
              {new Date(user.createdAt).toLocaleDateString('es-ES')}
            </span>
          </div>
          <div>
            <span className="text-foreground/60">Última actualización:</span>
            <span className="ml-2 font-medium">
              {new Date(user.updatedAt).toLocaleDateString('es-ES')}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Botones de acción */}
      <motion.div 
        className="flex justify-end space-x-3 pt-4 border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-foreground/60 hover:text-foreground transition-colors"
          disabled={isSubmitting}
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Guardando...</span>
            </>
          ) : (
            <>
              <FiSave />
              <span>Guardar Cambios</span>
            </>
          )}
        </button>
      </motion.div>
    </motion.form>
  );
}
