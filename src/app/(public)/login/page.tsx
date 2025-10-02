'use client';

import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { signIn } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { FcGoogle } from 'react-icons/fc';
import { LoginRedirect } from './LoginRedirect';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    const observer = new MutationObserver(() => { setIsDarkMode(document.documentElement.classList.contains('dark')); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const formik = useFormik({
    initialValues: { email: '', password: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Email no válido').required('El email es requerido'),
      password: Yup.string().required('La contraseña es requerida'),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const loginRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
          method: 'POST',
          body: JSON.stringify({
              email: values.email,
              password: values.password
          }),
          headers: { "Content-Type": "application/json" }
        });

        const backendData = await loginRes.json();
        
        if (!loginRes.ok) {
            throw new Error(backendData.message || "Las credenciales son incorrectas.");
        }
        
        const result = await signIn('credentials', {
            redirect: false,
            backendResponse: JSON.stringify(backendData),
        });
        
        if (!result?.ok || result.error) {
            throw new Error("Hubo un problema al iniciar la sesión local.");
        }
        
        toast.success('¡Bienvenido de vuelta!');

        // Redirigir según el tipo de usuario
        if (backendData.user.isAdmin) {
            router.push('/admin');
        } else if (backendData.user.company?.name) {
            router.push(PATHROUTES.pymes.dashboard);
        } else {
            router.push(PATHROUTES.onboarding.create_company);
        }

      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Error desconocido');
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="bg-background">
      <LoginRedirect />
      <Navbar />
      <main className="flex items-center justify-center min-h-screen pt-16">
        <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-2xl">
          <div className="text-center flex flex-col items-center">
            <Image
              src={isDarkMode ? '/logo-dark.png' : '/logo-light.png'}
              alt="My PYME App Logo" width={200} height={50}
              className="object-contain mb-4" priority
            />
            <p className="text-foreground/70">Gestiona tu negocio del futuro, hoy.</p>
          </div>
          
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={async () => {
              // Iniciar sesión con Google
              // La redirección se manejará en el callback de NextAuth
              await signIn('google');
            }}
          >
            <FcGoogle className="mr-2 h-5 w-5" />
            Continuar con Google
          </Button>

          <div className="flex items-center">
            <hr className="flex-grow border-border" />
            <span className="mx-4 text-foreground/50 text-sm">O</span>
            <hr className="flex-grow border-border" />
          </div>

          <form onSubmit={formik.handleSubmit} className="space-y-4">
            <div>
              <Input id="email" label="Correo Electrónico" type="email" {...formik.getFieldProps('email')} />
              {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div> : null}
            </div>
            <div className="relative">
              <Input
                id="password"
                label="Contraseña"
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
              {formik.touched.password && formik.errors.password ? (
                <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
              ) : null}
            </div>
            <div className="text-right mt-2">
              <Link href={PATHROUTES.forgot_password} className="text-xs font-medium text-primary hover:underline">
              ¿Olvidaste tu contraseña?
              </Link>
            </div>
              <Button type="submit" disabled={formik.isSubmitting} className="w-full">
                {formik.isSubmitting 
                  ? 'Iniciando sesión... El servidor puede tardar un momento.' 
                  : 'Acceder con Email'
                }
              </Button>
          </form>

          <p className="text-center text-sm text-foreground/60">
            ¿No tienes una cuenta?{' '}
            <Link href={PATHROUTES.register} className="font-medium text-primary hover:underline">
              Regístrate aquí
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}