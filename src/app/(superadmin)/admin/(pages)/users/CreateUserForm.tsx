'use client';

import React, { useState } from 'react';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { userService, type User, type CreateUserData as CreateUserServiceData } from '@/app/(superadmin)/admin/services/userService';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

interface CreateUserFormProps {
  onSuccess: (user: User) => void;
  onCancel: () => void;
}

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  isAdmin: boolean;
  adminRole?: 'SUPER_ADMIN' | 'SUPPORT' | 'MANAGER';
  adminDepartment?: 'TECNICO' | 'FINANCIERO' | 'ADMINISTRATIVO' | 'VENTAS';
}

export default function CreateUserForm({ onSuccess, onCancel }: CreateUserFormProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    isAdmin: false,
    adminRole: 'SUPPORT',
    adminDepartment: 'TECNICO'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<CreateUserData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Validar formulario
  const validateForm = (): boolean => {
    const newErrors: Partial<CreateUserData> = {};

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

    // Validar contraseña
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 6) {
      newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    // Validar confirmación de contraseña
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirma tu contraseña';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
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
    if (errors[name as keyof CreateUserData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
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
      // Preparar datos para el API
      const createData: CreateUserServiceData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        isAdmin: formData.isAdmin,
        adminRole: formData.isAdmin ? formData.adminRole : undefined,
        adminDepartment: formData.isAdmin ? formData.adminDepartment : undefined
      };
      
      // Llamar al servicio real para crear el usuario
      const newUser = await userService.createUser(createData);

      onSuccess(newUser);
    } catch (error) {
      console.error('Error al crear usuario:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el usuario. Inténtalo de nuevo.';
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
        <h3 className="text-lg font-semibold text-foreground">Información Básica</h3>
        
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

        {/* Contraseña */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground/70 mb-2">
            <FiLock className="inline mr-2" />
            Contraseña
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full p-3 pr-10 border rounded-md bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.password ? 'border-red-500' : 'border-border'
              }`}
              placeholder="Mínimo 6 caracteres"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* Confirmar contraseña */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground/70 mb-2">
            <FiLock className="inline mr-2" />
            Confirmar contraseña
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              className={`w-full p-3 pr-10 border rounded-md bg-background text-foreground placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.confirmPassword ? 'border-red-500' : 'border-border'
              }`}
              placeholder="Repite la contraseña"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-foreground/50 hover:text-foreground"
            >
              {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
          )}
        </div>
      </motion.div>

      {/* Configuración de administrador */}
      <motion.div 
        className="space-y-4 border-t border-border pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
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
            Crear como administrador
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
      </motion.div>

      {/* Botones de acción */}
      <motion.div 
        className="flex justify-end space-x-3 pt-4 border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
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
              <span>Creando...</span>
            </>
          ) : (
            <>
              <FiUser />
              <span>Crear Usuario</span>
            </>
          )}
        </button>
      </motion.div>
    </motion.form>
  );
}
