'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUser, FiMail, FiLock, FiEye, FiEyeOff, FiGlobe, FiMapPin, FiGrid } from 'react-icons/fi';
import { clientService, type CreateClientData, type Client } from '@/app/(superadmin)/admin/services/clientService';
import toast from 'react-hot-toast';

interface CreateClientFormProps {
  onSuccess: (client: Client) => void;
  onCancel: () => void;
}

interface FormData {
  // Datos del usuario
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  
  // Datos de la empresa
  companyName: string;
  companyEmail: string;
  razonSocial: string;
  rubroPrincipal: string;
  pais: string;
  rutCuit: string;
  companyPassword: string;
  
  // Rol en la empresa
  role: 'OWNER' | 'ADMIN' | 'EMPLOYEE';
}

const COUNTRIES = [
  'Argentina',
  'Uruguay', 
  'Chile',
  'Brasil',
  'Colombia',
  'México',
  'España',
  'Estados Unidos'
];

const INDUSTRIES = [
  'Tecnología',
  'Comercio',
  'Servicios',
  'Manufactura',
  'Salud',
  'Educación',
  'Construcción',
  'Agricultura',
  'Turismo',
  'Transporte',
  'Finanzas',
  'Inmobiliario'
];

export function CreateClientForm({ onSuccess, onCancel }: CreateClientFormProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    companyEmail: '',
    razonSocial: '',
    rubroPrincipal: '',
    pais: '',
    rutCuit: '',
    companyPassword: '',
    role: 'OWNER'
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    // Validaciones del usuario
    if (!formData.name.trim()) newErrors.name = 'El nombre es requerido';
    if (!formData.email.trim()) newErrors.email = 'El email es requerido';
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.password) newErrors.password = 'La contraseña es requerida';
    if (formData.password.length < 6) newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }

    // Validaciones de la empresa
    if (!formData.companyName.trim()) newErrors.companyName = 'El nombre de la empresa es requerido';
    if (!formData.companyEmail.trim()) newErrors.companyEmail = 'El email de la empresa es requerido';
    if (!/\S+@\S+\.\S+/.test(formData.companyEmail)) newErrors.companyEmail = 'Email de empresa inválido';
    if (!formData.razonSocial.trim()) newErrors.razonSocial = 'La razón social es requerida';
    if (!formData.rubroPrincipal) newErrors.rubroPrincipal = 'El rubro es requerido';
    if (!formData.pais) newErrors.pais = 'El país es requerido';
    if (!formData.rutCuit.trim()) newErrors.rutCuit = 'El RUT/CUIT es requerido';
    if (!formData.companyPassword) newErrors.companyPassword = 'La contraseña de la empresa es requerida';

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
      const createData: CreateClientData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        company: {
          name: formData.companyName,
          mail: formData.companyEmail,
          pais: formData.pais,
          razonSocial: formData.razonSocial,
          rubroPrincipal: formData.rubroPrincipal,
          rut_Cuit: formData.rutCuit,
          passwordHash: formData.companyPassword
        }
      };

      // Llamar al servicio para crear el cliente
      const newClient = await clientService.createClient(createData);
      
      toast.success(`Cliente ${newClient.name} creado exitosamente`);
      onSuccess(newClient);
    } catch (error) {
      console.error('Error al crear cliente:', error);
      const errorMessage = error instanceof Error ? error.message : 'Error al crear el cliente';
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
      {/* Información del Usuario */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          Información del Usuario
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

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              errors.password ? 'text-destructive' : 'text-foreground'
            }`}>
              <FiLock className="inline mr-2" />
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.password ? 'border-destructive' : 'border-input'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && <p className="text-destructive text-sm mt-1">{errors.password}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              errors.confirmPassword ? 'text-destructive' : 'text-foreground'
            }`}>
              <FiLock className="inline mr-2" />
              Confirmar contraseña *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 pr-10 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                  errors.confirmPassword ? 'border-destructive' : 'border-input'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-foreground"
              >
                {showConfirmPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-destructive text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>
      </motion.div>

      {/* Información de la Empresa */}
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <h4 className="text-lg font-semibold text-foreground border-b border-border pb-2">
          Información de la Empresa
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              errors.companyName ? 'text-destructive' : 'text-foreground'
            }`}>
              <FiGrid className="inline mr-2" />
              Nombre de la empresa *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.companyName ? 'border-destructive' : 'border-input'
              }`}
              placeholder="Mi Empresa S.A."
            />
            {errors.companyName && <p className="text-destructive text-sm mt-1">{errors.companyName}</p>}
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              errors.companyEmail ? 'text-destructive' : 'text-foreground'
            }`}>
              <FiMail className="inline mr-2" />
              Email de la empresa *
            </label>
            <input
              type="email"
              name="companyEmail"
              value={formData.companyEmail}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.companyEmail ? 'border-destructive' : 'border-input'
              }`}
              placeholder="contacto@miempresa.com"
            />
            {errors.companyEmail && <p className="text-destructive text-sm mt-1">{errors.companyEmail}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Razón social *
            </label>
            <input
              type="text"
              name="razonSocial"
              value={formData.razonSocial}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.razonSocial ? 'border-destructive' : 'border-input'
              }`}
              placeholder="Mi Empresa Sociedad Anónima"
            />
            {errors.razonSocial && <p className="text-destructive text-sm mt-1">{errors.razonSocial}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              RUT/CUIT *
            </label>
            <input
              type="text"
              name="rutCuit"
              value={formData.rutCuit}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.rutCuit ? 'border-destructive' : 'border-input'
              }`}
              placeholder="20-12345678-9"
            />
            {errors.rutCuit && <p className="text-destructive text-sm mt-1">{errors.rutCuit}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiGlobe className="inline mr-2" />
              Rubro principal *
            </label>
            <select
              name="rubroPrincipal"
              value={formData.rubroPrincipal}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.rubroPrincipal ? 'border-destructive' : 'border-input'
              }`}
            >
              <option value="">Seleccionar rubro</option>
              {INDUSTRIES.map(industry => (
                <option key={industry} value={industry}>{industry}</option>
              ))}
            </select>
            {errors.rubroPrincipal && <p className="text-destructive text-sm mt-1">{errors.rubroPrincipal}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiMapPin className="inline mr-2" />
              País *
            </label>
            <select
              name="pais"
              value={formData.pais}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.pais ? 'border-destructive' : 'border-input'
              }`}
            >
              <option value="">Seleccionar país</option>
              {COUNTRIES.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
            {errors.pais && <p className="text-destructive text-sm mt-1">{errors.pais}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              <FiLock className="inline mr-2" />
              Contraseña de la empresa *
            </label>
            <input
              type="password"
              name="companyPassword"
              value={formData.companyPassword}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
                errors.companyPassword ? 'border-destructive' : 'border-input'
              }`}
              placeholder="••••••••"
            />
            {errors.companyPassword && <p className="text-destructive text-sm mt-1">{errors.companyPassword}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Rol en la empresa *
            </label>
            <select
              name="role"
              value={formData.role}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="OWNER">Propietario</option>
              <option value="ADMIN">Administrador</option>
              <option value="EMPLOYEE">Empleado</option>
            </select>
          </div>
        </div>
      </motion.div>

      {/* Botones de Acción */}
      <motion.div 
        className="flex justify-end space-x-4 pt-6 border-t border-border"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
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
          {isLoading ? 'Creando...' : 'Crear Cliente'}
        </button>
      </motion.div>
    </motion.form>
  );
}

export default CreateClientForm;
