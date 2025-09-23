'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Loader2, PlusCircle, Trash2, User as UserIcon } from 'lucide-react';

interface Member {
  id: string;
  userId: string;
  role: 'OWNER' | 'EMPLOYEE';
  user: {
    name: string;
    email: string;
    image?: string | null;
  };
}

export default function MiembrosPage() {
  const { data: session } = useSession();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchMembers = async () => {
    if (!session?.user.companyId || !session.accessToken) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/members`, {
        headers: { 'Authorization': `Bearer ${session.accessToken}` },
      });
      if (!res.ok) throw new Error('No se pudieron cargar los miembros.');
      const data = await res.json();
      setMembers(data);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if(session) {
      fetchMembers();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string().email('Email no válido').required('El email es requerido'),
    }),
    onSubmit: async (values, { setSubmitting, resetForm }) => {
      if (!session?.user.companyId || !session.accessToken) return;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/members`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.accessToken}` },
          body: JSON.stringify({ email: values.email }),
        });
        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.message || 'No se pudo invitar al miembro.');
        }
        toast.success(`¡Invitación enviada a ${values.email}!`);
        resetForm();
        fetchMembers();
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'No se pudo invitar al miembro.');
      } finally {
        setSubmitting(false);
      }
    },
  });

  const handleDeleteMember = async (userId: string) => {
    if (!session?.user.companyId || !session.accessToken) return;
    if (window.confirm('¿Estás seguro de que quieres eliminar a este miembro?')) {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/members/${userId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${session.accessToken}` },
        });
        toast.success('Miembro eliminado.');
        fetchMembers();
      } catch (error) {
        toast.error('No se pudo eliminar al miembro.');
      }
    }
  };
  
  return (
    <div>
      <Card isClickable={false} className="mb-8">
        <h2 className="text-xl font-bold text-foreground mb-4">Invitar Nuevo Miembro</h2>
        <form onSubmit={formik.handleSubmit} className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="w-full">
            <Input id="email" label="Email del nuevo miembro" {...formik.getFieldProps('email')} />
            {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div> : null}
          </div>
          <Button type="submit" disabled={formik.isSubmitting} className="w-full sm:w-auto flex-shrink-0">
            {formik.isSubmitting ? <Loader2 className="animate-spin" /> : <PlusCircle className="mr-2" />}
            Invitar
          </Button>
        </form>
      </Card>

      <Card isClickable={false}>
        <h2 className="text-xl font-bold text-foreground mb-4">Miembros Actuales</h2>
        {isLoading ? (
          <div className="text-center p-8"><Loader2 className="animate-spin text-primary" /></div>
        ) : (
          <ul className="space-y-4">
            {members.length > 0 ? members.map(member => (
              <li key={member.id} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-border rounded-full flex items-center justify-center">
                    <UserIcon className="text-foreground/50" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{member.user.name}</p>
                    <p className="text-sm text-foreground/60">{member.user.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-xs font-bold uppercase text-foreground/50 bg-border px-2 py-1 rounded-full">
                    {member.role === 'OWNER' ? 'Dueño' : 'Empleado'}
                  </span>
                  {member.role === 'EMPLOYEE' && (
                    <Button variant="danger" className="p-2 h-9 w-9" onClick={() => handleDeleteMember(member.userId)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </li>
            )) : <p className="text-center text-foreground/60 py-4">Aún no has invitado a ningún miembro.</p>}
          </ul>
        )}
      </Card>
    </div>
  );
}