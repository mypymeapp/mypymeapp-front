'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiToggleLeft, FiToggleRight } from 'react-icons/fi';
import { clientService, type Client, type EditClientData } from '@/app/(superadmin)/admin/services/clientService';
import toast from 'react-hot-toast';

interface EditClientFormProps {
  client: Client;
  onSuccess: (client: Client) => void;
  onCancel: () => void;
}

interface FormData {
  name: string;
  email: string;
  avatarUrl: string;
  isActive: boolean;
}

export function EditClientForm({ client, onSuccess, onCancel }: EditClientFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: client.name,
    email: client.email,
    avatarUrl: client.avatarUrl || '',
    isActive: client.isActive
  });

  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    
    try {
      // Preparar datos para el API
      const editData: EditClientData = {
        name: formData.name,
        email: formData.email,
        avatarUrl: formData.avatarUrl || undefined,
        isActive: formData.isActive
      };

      // Llamar al servicio para editar el cliente
      const updatedClient = await clientService.editClient(client.id, editData);
      
      toast.success(`Cliente ${updatedClient.name} actualizado exitosamente`);
      onSuccess(updatedClient);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al actualizar el cliente';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
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
      {/* Información Básica */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          Información Básica
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              errors.name ? 'text-destructive' : 'text-foreground'
            }`}>
              <FiUser className="inline mr-2" />
              Nombre completo *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.name ? 'border-destructive' : 'border-input'
              }`}
              placeholder="Juan Pérez"
            />
            {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              errors.email ? 'text-destructive' : 'text-foreground'
            }`}>
              <FiMail className="inline mr-2" />
              Email *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.email ? 'border-destructive' : 'border-input'
              }`}
              placeholder="juan@empresa.com"
            />
            {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-foreground mb-2">
              URL del Avatar
            </label>
            <input
              type="url"
              name="avatarUrl"
              value={formData.avatarUrl}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="https://ejemplo.com/avatar.jpg"
            />
          </div>
        </div>
      </motion.div>

      {/* Estado del Cliente */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          Estado del Cliente
        </h4>
        
        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, isActive: !prev.isActive }))}
            className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
              formData.isActive 
                ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900 dark:border-green-700 dark:text-green-200' 
                : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900 dark:border-red-700 dark:text-red-200'
            }`}
          >
            {formData.isActive ? (
              <>
                <FiToggleRight className="text-xl" />
                <span>Cliente Activo</span>
              </>
            ) : (
              <>
                <FiToggleLeft className="text-xl" />
                <span>Cliente Inactivo</span>
              </>
            )}
          </button>
          <p className="text-sm text-muted-foreground">
            {formData.isActive 
              ? 'El cliente puede acceder al sistema normalmente' 
              : 'El cliente no podrá acceder al sistema'
            }
          </p>
        </div>
      </motion.div>

      {/* Información de la Empresa (Solo lectura) */}
      {client.companies?.[0] && (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">
            Información de la Empresa (Solo lectura)
          </h4>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Nombre de la empresa
              </label>
              <div className="px-3 py-2 bg-muted rounded-md text-foreground">
                {client.companies[0].company.name}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Email de la empresa
              </label>
              <div className="px-3 py-2 bg-muted rounded-md text-foreground">
                {client.companies[0].company.mail}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Rubro principal
              </label>
              <div className="px-3 py-2 bg-muted rounded-md text-foreground">
                {client.companies[0].company.rubroPrincipal}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                País
              </label>
              <div className="px-3 py-2 bg-muted rounded-md text-foreground">
                {client.companies[0].company.Pais}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Rol del cliente
              </label>
              <div className="px-3 py-2 bg-muted rounded-md">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  client.companies[0].role === 'OWNER' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' :
                  client.companies[0].role === 'ADMIN' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                }`}>
                  {client.companies[0].role === 'OWNER' ? 'Propietario' :
                   client.companies[0].role === 'ADMIN' ? 'Administrador' : 'Empleado'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Plan de suscripción
              </label>
              <div className="px-3 py-2 bg-muted rounded-md">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  client.companies[0].company.subscriptionStatus === 'PREMIUM' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' :
                  'bg-muted text-muted-foreground'
                }`}>
                  {client.companies[0].company.subscriptionStatus === 'PREMIUM' ? 'Premium' : 'Gratuito'}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Información Adicional */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          Información Adicional
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Fecha de registro:</span>
            <p className="font-medium">{new Date(client.createdAt).toLocaleDateString('es-ES')}</p>
          </div>
          <div>
            <span className="text-muted-foreground">Última actualización:</span>
            <p className="font-medium">{new Date(client.updatedAt).toLocaleDateString('es-ES')}</p>
          </div>
          <div>
            <span className="text-muted-foreground">ID del cliente:</span>
            <p className="font-medium font-mono text-xs">{client.id}</p>
          </div>
        </div>
      </motion.div>

      {/* Botones de Acción */}
      <motion.div 
        className="flex justify-end space-x-4 pt-6 border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <button
          type="button"
          onClick={onCancel}
          disabled={isLoading}
          className="px-6 py-2 border border-input rounded-md text-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isLoading ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </motion.div>
    </motion.form>
  );
}

export default EditClientForm;
