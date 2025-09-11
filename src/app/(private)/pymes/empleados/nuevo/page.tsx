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

const puestos = [
  'Administradora',
  'Tecnico',
  'Vendedora',
  'Logistica',
  'Soporte',
  'Ventas',
];

export default function NuevoEmpleadoPage() {
  const formik = useFormik({
    initialValues: {
      nombre: '',
      apellido: '',
      email: '',
      telefono: '',
      puesto: '',
      fechaIngreso: '',
      salario: '',
      activo: true,
    },
    validationSchema: Yup.object({
      nombre: Yup.string().required('El nombre es requerido'),
      apellido: Yup.string().required('El apellido es requerido'),
      email: Yup.string().email('Email no válido').required('El email es requerido'),
      telefono: Yup.string().required('El teléfono es requerido'),
      puesto: Yup.string().required('El puesto es requerido'),
      fechaIngreso: Yup.string().required('La fecha de ingreso es requerida'),
      salario: Yup.number().typeError('El salario debe ser un número').min(0, 'No puede ser negativo').required('El salario es requerido'),
    }),
    onSubmit: (values, { resetForm }) => {
      toast.success('¡Empleado creado con éxito! (simulación)');
      console.log(values);
      resetForm();
    },
  });

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href={PATHROUTES.pymes.empleados}>
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
              <Input id="nombre" label="Nombre" {...formik.getFieldProps('nombre')} />
              {formik.touched.nombre && formik.errors.nombre ? <div className="text-red-500 text-xs mt-1">{formik.errors.nombre}</div> : null}
            </div>
            <div>
              <Input id="apellido" label="Apellido" {...formik.getFieldProps('apellido')} />
              {formik.touched.apellido && formik.errors.apellido ? <div className="text-red-500 text-xs mt-1">{formik.errors.apellido}</div> : null}
            </div>
            <div>
              <Input id="email" label="Email" type="email" {...formik.getFieldProps('email')} />
              {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div> : null}
            </div>
            <div>
              <Input id="telefono" label="Teléfono" {...formik.getFieldProps('telefono')} />
              {formik.touched.telefono && formik.errors.telefono ? <div className="text-red-500 text-xs mt-1">{formik.errors.telefono}</div> : null}
            </div>
            <div>
              <label htmlFor="puesto" className="block text-sm font-medium text-foreground/80 mb-2">Puesto</label>
              <select id="puesto" {...formik.getFieldProps('puesto')} className="w-full px-4 py-3 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="">Selecciona un puesto</option>
                {puestos.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
              {formik.touched.puesto && formik.errors.puesto ? <div className="text-red-500 text-xs mt-1">{formik.errors.puesto}</div> : null}
            </div>
            <div>
              <Input id="fechaIngreso" label="Fecha de Ingreso" type="date" {...formik.getFieldProps('fechaIngreso')} />
              {formik.touched.fechaIngreso && formik.errors.fechaIngreso ? <div className="text-red-500 text-xs mt-1">{formik.errors.fechaIngreso}</div> : null}
            </div>
            <div>
              <Input id="salario" label="Salario" type="number" {...formik.getFieldProps('salario')} />
              {formik.touched.salario && formik.errors.salario ? <div className="text-red-500 text-xs mt-1">{formik.errors.salario}</div> : null}
            </div>
            <div className="flex items-center gap-2 mt-6">
              <input
                id="activo"
                type="checkbox"
                checked={formik.values.activo}
                onChange={e => formik.setFieldValue('activo', e.target.checked)}
                className="h-5 w-5 text-primary border border-border rounded focus:ring-primary"
              />
              <label htmlFor="activo" className="text-sm font-medium text-foreground/80">Empleado activo</label>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <Button type="submit">Guardar Empleado</Button>
          </div>
        </form>
      </Card>
    </div>
  );
}