'use client';

import { SessionProvider } from 'next-auth/react';
import { AuthProvider } from '@/context/AuthContext';
import { MembersProvider } from '@/context/MembersContext';
import { ReactNode, useState, useEffect } from 'react';
import { Toaster, useToasterStore } from 'react-hot-toast';
import { Backdrop } from './ui/Backdrop';

interface ProvidersProps {
  children: ReactNode;
}

const ToasterWithBackdrop = () => {
    const { toasts } = useToasterStore();
    const [backdropVisible, setBackdropVisible] = useState(false);

    useEffect(() => {
        const hasVisibleToast = toasts.some(t => t.visible);
        setBackdropVisible(hasVisibleToast);
    }, [toasts]);
    
    return (
        <>
            <Backdrop isVisible={backdropVisible} />
            <Toaster
                position="top-center"
                toastOptions={{
                    className: '',
                    duration: 4000,
                    style: {
                        border: '1px solid var(--primary)',
                        padding: '16px',
                        color: 'var(--foreground)',
                        backgroundColor: 'var(--card)',
                        boxShadow: '0 0 20px rgba(0,0,0,0.5)',
                        zIndex: 50,
                    },
                }}
            />
        </>
    );
};


export const Providers = ({ children }: ProvidersProps) => {
  return (
    <SessionProvider>
      <AuthProvider>
        <MembersProvider>
          {children}
          <ToasterWithBackdrop />
        </MembersProvider>
      </AuthProvider>
    </SessionProvider>
  );
};
