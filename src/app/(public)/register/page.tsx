'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import { FcGoogle } from 'react-icons/fc';

const paises = [
  { value: 'AR', label: 'Argentina' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'CL', label: 'Chile' },
  { value: 'ES', label: 'España' },
  { value: 'MX', label: 'México' },
];

export default function RegisterPage() {
  const formik = useFormik({
    initialValues: {
      nombreEmpresa: '',
      email: '',
      password: '',
      pais: 'AR',
      razonSocial: '',
      identificacionFiscal: '',
      rubro: '',
    },
    validationSchema: Yup.object({
      nombreEmpresa: Yup.string().required('El nombre de la empresa es requerido'),
      email: Yup.string().email('Email no válido').required('El email es requerido'),
      password: Yup.string().min(8, 'Debe tener al menos 8 caracteres').required('La contraseña es requerida'),
      pais: Yup.string().required('El país es requerido'),
      razonSocial: Yup.string().when('pais', {
        is: (pais: string) => ['AR', 'UY', 'CL', 'ES', 'MX'].includes(pais),
        then: schema => schema.required('La Razón Social es requerida'),
      }),
      identificacionFiscal: Yup.string().when('pais', {
        is: (pais: string) => ['AR', 'UY', 'CL', 'ES', 'MX'].includes(pais),
        then: schema => schema.required('La identificación fiscal es requerida'),
      }),
      rubro: Yup.string().when('pais', {
        is: 'AR',
        then: schema => schema.required('El rubro es requerido en Argentina'),
      }),
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
      // Chicos aca la lógica para enviar los datos a la API de registro
    },
  });

  const getIdentificacionLabel = (pais: string) => {
    switch (pais) {
      case 'AR': return 'CUIT (Sin guiones)';
      case 'UY':
      case 'CL': return 'RUT (Sin puntos ni guiones)';
      case 'ES': return 'NIF';
      case 'MX': return 'RFC';
      default: return 'Identificación Fiscal';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <div className="w-full max-w-lg p-8 space-y-6 bg-card border border-border rounded-2xl">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-primary">Crea tu Cuenta</h1>
          <p className="mt-2 text-foreground/70">Empieza a transformar la gestión de tu PYME.</p>
        </div>
        
        <Button variant="outline" className="w-full" onClick={() => signIn('google', { callbackUrl: PATHROUTES.pymes.dashboard })}>
          <FcGoogle className="mr-2 h-5 w-5" />
          Registrarse con Google
        </Button>

        <div className="flex items-center">
          <hr className="flex-grow border-border" />
          <span className="mx-4 text-foreground/50 text-sm">O</span>
          <hr className="flex-grow border-border" />
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Input id="nombreEmpresa" label="Nombre de tu PYME" type="text" {...formik.getFieldProps('nombreEmpresa')} />
            {formik.touched.nombreEmpresa && formik.errors.nombreEmpresa ? <div className="text-red-500 text-xs mt-1">{formik.errors.nombreEmpresa}</div> : null}
          </div>
          <div>
            <Input id="email" label="Correo Electrónico de Contacto" type="email" {...formik.getFieldProps('email')} />
            {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div> : null}
          </div>
          <div>
            <Input id="password" label="Crea una Contraseña" type="password" {...formik.getFieldProps('password')} />
            {formik.touched.password && formik.errors.password ? <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div> : null}
          </div>

          <div className="border-t border-border pt-4 space-y-4">
            <h2 className="text-lg font-semibold text-foreground">Información Fiscal</h2>
            <div>
                <label htmlFor="pais" className="block mb-2 text-sm font-medium text-foreground/80">País de la empresa</label>
                <select id="pais" {...formik.getFieldProps('pais')} className="w-full px-4 py-3 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                {paises.map(pais => <option key={pais.value} value={pais.value}>{pais.label}</option>)}
                </select>
                {formik.touched.pais && formik.errors.pais ? <div className="text-red-500 text-xs mt-1">{formik.errors.pais}</div> : null}
            </div>

            <div>
                <Input id="razonSocial" label="Razón Social" type="text" {...formik.getFieldProps('razonSocial')} />
                {formik.touched.razonSocial && formik.errors.razonSocial ? <div className="text-red-500 text-xs mt-1">{formik.errors.razonSocial}</div> : null}
            </div>
             <div>
                <Input id="identificacionFiscal" label={getIdentificacionLabel(formik.values.pais)} type="text" {...formik.getFieldProps('identificacionFiscal')} />
                {formik.touched.identificacionFiscal && formik.errors.identificacionFiscal ? <div className="text-red-500 text-xs mt-1">{formik.errors.identificacionFiscal}</div> : null}
            </div>

            {formik.values.pais === 'AR' && (
              <div>
                <Input id="rubro" label="Rubro principal" type="text" {...formik.getFieldProps('rubro')} />
                {formik.touched.rubro && formik.errors.rubro ? <div className="text-red-500 text-xs mt-1">{formik.errors.rubro}</div> : null}
              </div>
            )}
          </div>

          <Button type="submit" className="w-full">
            Registrar mi PYME
          </Button>
        </form>
        <p className="text-center text-sm text-foreground/60">
          ¿Ya tienes una cuenta?{' '}
          <Link href={PATHROUTES.login} className="font-medium text-primary hover:underline">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}