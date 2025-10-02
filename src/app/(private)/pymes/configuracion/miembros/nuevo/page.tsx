"use client";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMembers } from '@/context/MembersContext';

const roles = [
  { value: 'ADMIN', label: 'Administrador' },
  { value: 'EMPLOYEE', label: 'Empleado' },
];

export default function NuevoEmpleadoPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { createMember } = useMembers();

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      role: 'EMPLOYEE',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('El nombre es requerido'),
      email: Yup.string().email('Email no válido').required('El email es requerido'),
      password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es requerida'),
      role: Yup.string().required('El rol es requerido'),
    }),
    onSubmit: async (values, { resetForm }) => {
      setLoading(true);
      try {
        await createMember(values);
        toast.success('¡Empleado creado con éxito!');
        resetForm();
        router.push(PATHROUTES.pymes.miembros);
      } catch (error) {
        console.error('Error al crear empleado:', error);
        toast.error(error instanceof Error ? error.message : 'Error al crear el empleado');
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href={PATHROUTES.pymes.miembros}>
          <Button variant="outline" className="px-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Crear Nuevo Empleado</h1>
      </div>

      <Card isClickable={false}>
        <form onSubmit={formik.handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <Input 
                id="name" 
                label="Nombre Completo" 
                {...formik.getFieldProps('name')} 
                disabled={loading}
              />
              {formik.touched.name && formik.errors.name ? 
                <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div> : null
              }
            </div>

            <div>
              <Input 
                id="email" 
                label="Email" 
                type="email" 
                {...formik.getFieldProps('email')} 
                disabled={loading}
              />
              {formik.touched.email && formik.errors.email ? 
                <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div> : null
              }
            </div>

            <div>
              <div className="relative w-full group">
                <div
                  className="absolute -inset-0.5 bg-gradient-to-r from-primary to-foreground rounded-lg blur opacity-0 group-focus-within:opacity-100 transition duration-300"
                  aria-hidden="true"
                />
                <div className="relative h-[49px]">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="block w-full h-full px-4 pr-12 text-foreground bg-card border border-border rounded-lg placeholder-foreground/50 focus:outline-none focus:ring-0 peer"
                    placeholder=" "
                    {...formik.getFieldProps('password')}
                    disabled={loading}
                  />
                  <label
                    htmlFor="password"
                    className="absolute text-sm text-foreground/70 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-card px-2 peer-focus:px-2 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 start-1"
                  >
                    Contraseña
                  </label>
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-foreground/60 hover:text-foreground transition-colors"
                    aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    disabled={loading}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
              {formik.touched.password && formik.errors.password ? 
                <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div> : null
              }
            </div>
        
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-foreground/80 mb-2">
                Rol
              </label>
              <select 
                id="role" 
                {...formik.getFieldProps('role')} 
                disabled={loading}
                className="w-full px-4 py-3 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
              >
                <option value="">Selecciona un rol</option>
                {roles.map(role => (
                  <option key={role.value} value={role.value}>
                    {role.label}
                  </option>
                ))}
              </select>
              {formik.touched.role && formik.errors.role ? 
                <div className="text-red-500 text-xs mt-1">{formik.errors.role}</div> : null
              }
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={loading}>
              {loading ? 'Creando...' : 'Guardar Empleado'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}