'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { useRouter } from 'next/navigation';
import { FcGoogle } from 'react-icons/fc';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Tu nombre es requerido'),
      email: Yup.string().email('Email no válido').required('El email es requerido'),
      password: Yup.string().min(8, 'Debe tener al menos 8 caracteres').required('La contraseña es requerida'),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref('password')], 'Las contraseñas deben coincidir')
        .required('Debes confirmar la contraseña'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: values.name,
            email: values.email,
            password: values.password,
          })
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'Error al registrar el usuario.');
        }

        toast.success('¡Registro exitoso! Por favor, inicia sesión para continuar.');
        router.push(PATHROUTES.login);
        
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Ocurrió un error desconocido.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-background">
      <Navbar />
      <main className="flex items-center justify-center min-h-screen py-24">
        <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-2xl">
           <div className="text-center">
            <h1 className="text-4xl font-extrabold text-primary">Crea tu Cuenta</h1>
            <p className="mt-2 text-foreground/70">Paso 1: Tus datos de acceso.</p>
          </div>
          
          <Button variant="outline" className="w-full" onClick={() => signIn('google', { callbackUrl: PATHROUTES.pymes.dashboard })}>
            <FcGoogle className="mr-2 h-5 w-5" />
            Continuar con Google
          </Button>

          <div className="flex items-center"><hr className="flex-grow border-border" /><span className="mx-4 text-foreground/50 text-sm">O</span><hr className="flex-grow border-border" /></div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Input id="name" label="Nombre Completo" type="text" {...formik.getFieldProps('name')} />
              {formik.touched.name && formik.errors.name ? <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div> : null}
            </div>
            <div>
              <Input id="email" label="Correo Electrónico" type="email" {...formik.getFieldProps('email')} />
              {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div> : null}
            </div>
            <div className="relative">
              <Input
                id="password"
                label="Crea una Contraseña"
                type={showPassword ? 'text' : 'password'}
                {...formik.getFieldProps('password')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {formik.touched.password && formik.errors.password ? <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div> : null}
            </div>
            <div className="relative">
              <Input
                id="confirmPassword"
                label="Confirma tu Contraseña"
                type={showConfirm ? 'text' : 'password'}
                {...formik.getFieldProps('confirmPassword')}
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/50"
                onClick={() => setShowConfirm((prev) => !prev)}
                tabIndex={-1}
              >
                {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
              {formik.touched.confirmPassword && formik.errors.confirmPassword ? <div className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</div> : null}
            </div>

              <Button type="submit" disabled={formik.isSubmitting} className="w-full">
                {formik.isSubmitting 
                  ? 'Registrando... Por favor, espera.' 
                  : 'Crear Cuenta'
                }
              </Button>
          </form>
          <p className="text-center text-sm text-foreground/60">
            ¿Ya tienes una cuenta?{' '}
            <Link href={PATHROUTES.login} className="font-medium text-primary hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}