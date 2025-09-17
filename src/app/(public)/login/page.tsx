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
import { FcGoogle } from 'react-icons/fc';
import { ArrowLeft } from 'lucide-react';

export default function LoginPage() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const isDark = document.documentElement.classList.contains('dark');
    setIsDarkMode(isDark);
    const observer = new MutationObserver(() => { setIsDarkMode(document.documentElement.classList.contains('dark')); });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    validationSchema: Yup.object({
      email: Yup.string().email('Email no válido').required('El email es requerido'),
      password: Yup.string().required('La contraseña es requerida'),
    }),
    onSubmit: values => {
      alert(JSON.stringify(values, null, 2));
      // Chicos acá va la lógica de login con la API
    },
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-background p-4">
    
      <Link 
        href={PATHROUTES.home} 
        className="absolute top-6 left-6 flex items-center text-foreground/70 hover:text-foreground transition-colors"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Volver al Inicio
      </Link>

      <div className="w-full max-w-md p-8 space-y-6 bg-card border border-border rounded-2xl">
        <div className="text-center flex flex-col items-center">
          <Image
            src={isDarkMode ? '/logo-dark.png' : '/logo-light.png'}
            alt="My PYME App Logo"
            width={200}
            height={50}
            className="object-contain mb-4"
            priority
          />
          <p className="text-foreground/70">Gestiona tu negocio del futuro, hoy.</p>
        </div>
        
        <Button variant="outline" className="w-full" onClick={() => signIn('google', { callbackUrl: PATHROUTES.pymes.dashboard })}>
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
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
            ) : null}
          </div>
          <div>
            <Input id="password" label="Contraseña" type="password" {...formik.getFieldProps('password')} />
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.password}</div>
            ) : null}
          </div>
          <Button type="submit" className="w-full">
            Acceder con Email
          </Button>
        </form>

        <p className="text-center text-sm text-foreground/60">
          ¿No tienes cuenta?{' '}
          <Link href={PATHROUTES.register} className="font-medium text-primary hover:underline">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}