"use client";

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMembers } from '@/context/MembersContext';

const roles = [
  { value: 'ADMIN', label: 'Administración' },
  { value: 'EMPLOYEE', label: 'Empleado' },
  { value: 'OWNER', label: 'Propietario' },
];

export default function NuevoEmpleadoPage() {
  const [loading, setLoading] = useState(false);
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
              <Input 
                id="password" 
                label="Contraseña" 
                type="password" 
                {...formik.getFieldProps('password')} 
                disabled={loading}
              />
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
