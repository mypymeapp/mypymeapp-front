'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';
import { useRouter, useSearchParams } from 'next/navigation';
import { PATHROUTES } from '@/constants/pathroutes';
import { KeyRound } from 'lucide-react';
import React from 'react';


export default function ResetPasswordPageWrapper() {
  return (
    <React.Suspense fallback={<div>Cargando...</div>}>
      <ResetPasswordPage />
    </React.Suspense>
  )
}

function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const formik = useFormik({
    initialValues: {
      newPassword: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      newPassword: Yup.string().min(8, 'Debe tener al menos 8 caracteres').required('La nueva contraseña es requerida'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword')], 'Las contraseñas no coinciden')
        .required('Confirma tu nueva contraseña'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      if (!token) {
        toast.error('Token no válido o inexistente. Por favor, solicita un nuevo enlace.');
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            token,
            newPassword: values.newPassword,
          }),
        });

        if (!res.ok) {
          throw new Error('El token es inválido, ha expirado, o la contraseña es débil.');
        }
        
        toast.success('¡Contraseña actualizada con éxito! Ya puedes iniciar sesión.');
        router.push(PATHROUTES.login);

      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Ocurrió un error.');
      } finally {
        setSubmitting(false);
      }
    },
  });
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card isClickable={false} className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
            <KeyRound className="w-12 h-12 text-primary mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-foreground">Crea tu Nueva Contraseña</h1>
            <p className="mt-2 text-foreground/70">Asegúrate de que sea segura y la recuerdes.</p>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Input id="newPassword" label="Nueva Contraseña" type="password" {...formik.getFieldProps('newPassword')} />
            {formik.touched.newPassword && formik.errors.newPassword ? <div className="text-red-500 text-xs mt-1">{formik.errors.newPassword}</div> : null}
          </div>
          <div>
            <Input id="confirmPassword" label="Confirmar Nueva Contraseña" type="password" {...formik.getFieldProps('confirmPassword')} />
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div> : null}
          </div>
          <Button type="submit" disabled={formik.isSubmitting || !token} className="w-full">
            {formik.isSubmitting ? 'Actualizando...' : 'Actualizar Contraseña'}
          </Button>
        </form>
      </Card>
    </div>
  );
}