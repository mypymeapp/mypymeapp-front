'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { Mail } from 'lucide-react';
import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [requestSent, setRequestSent] = useState(false);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Email no válido').required('El email es requerido'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: values.email }),
        });

        if (!res.ok) {
          const errorBody = await res.json().catch(() => ({}));
          console.error("ERROR RECIBIDO DEL BACKEND (forgot-password):", errorBody);
          throw new Error('No se pudo procesar la solicitud. Revisa la consola para más detalles.');
        }
        
        setRequestSent(true);
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Ocurrió un error.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  if (requestSent) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background p-4">
        <Card isClickable={false} className="w-full max-w-md p-8 text-center">
            <Mail className="w-16 h-16 text-primary mx-auto mb-6" />
            <h1 className="text-2xl font-bold text-foreground">Revisa tu Correo</h1>
            <p className="mt-4 text-foreground/70">
                Si existe una cuenta con el email <span className="font-bold text-foreground">{formik.values.email}</span>, hemos enviado un enlace para resetear tu contraseña.
            </p>
            <Link href={PATHROUTES.login} className="mt-8 inline-block">
                <Button>Volver a Inicio de Sesión</Button>
            </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
      <Card isClickable={false} className="w-full max-w-md p-8 space-y-6">
        <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground">Recuperar Contraseña</h1>
            <p className="mt-2 text-foreground/70">Ingresa tu email y te enviaremos un enlace para recuperarla.</p>
        </div>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div>
            <Input id="email" label="Correo Electrónico" type="email" {...formik.getFieldProps('email')} />
            {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div> : null}
          </div>
          <Button type="submit" disabled={formik.isSubmitting} className="w-full">
            {formik.isSubmitting 
              ? 'Enviando... El servidor puede tardar en responder.' 
              : 'Enviar Enlace de Recuperación'
            }
          </Button>
        </form>
        <div className="text-center">
            <Link href={PATHROUTES.login} className="text-sm font-medium text-primary hover:underline">
                Volver a Inicio de Sesión
            </Link>
        </div>
      </Card>
    </div>
  );
}