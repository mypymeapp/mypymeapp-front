'use client';

import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Loader2, Mail, PlusCircle, UserCheck } from 'lucide-react';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useMembers } from '@/context/MembersContext';

export default function MiembrosPage() {
  const { members, isLoading, fetchMembers, deleteMember } = useMembers();
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; userId: string; userName: string }>(
    { open: false, userId: '', userName: '' }
  );
  const [isDeletingMember, setIsDeletingMember] = useState(false);

  useEffect(() => {
    fetchMembers().catch((e) => toast.error(e instanceof Error ? e.message : 'Error al cargar miembros'));
  }, [fetchMembers]);

  const handleDeleteMember = async () => {
    if (!confirmDelete.userId) return;
    setIsDeletingMember(true);
    try {
      await deleteMember(confirmDelete.userId);
      toast.success('Miembro eliminado.');
      await fetchMembers();
    } catch (error) {
      console.error('Error al eliminar miembro:', error);
      toast.error('No se pudo eliminar al miembro.');
    } finally {
      setIsDeletingMember(false);
      setConfirmDelete({ open: false, userId: '', userName: '' });
    }
  };

  const openDeleteConfirm = (userId: string, userName: string) => {
    setConfirmDelete({ open: true, userId, userName });
  };
  
  return (
    <div>
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-foreground">Miembros</h1>
        <Link href={PATHROUTES.pymes.miembros_nuevo}>
          <Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Miembro</Button>
        </Link>
      </div>

      <Card isClickable={false}>
        <h2 className="text-xl font-bold text-foreground mb-4">Miembros Actuales</h2>
        {isLoading ? (
          <div className="text-center p-8"><Loader2 className="animate-spin text-primary" /></div>
        ) : members.length === 0 ? (
          <div className="text-center p-4 text-foreground/60 bg-red-200 border-2 border-red-800">No tienes miembros en tu empresa!</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map(m => (
              <Card key={m.id} className="flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center w-12 h-12">
                      <span className="font-bold text-primary text-4xl">{m.user.name.charAt(0)}</span>
                    </div>
                    <div>
                      <h2 className="font-bold text-lg text-foreground">{m.user.name}</h2>
                      <p className="text-sm text-foreground/60">{m.role}</p>
                    </div>
                  </div>
                </div>
                <div className="flex-grow space-y-2 text-sm text-foreground/80 mb-6">
                  <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary/70" /> {m.user.email}</p>
                  <p className="flex items-center gap-2">
                    <UserCheck className={`w-4 h-4 ${m.user.isActive ? 'text-green-700' : 'text-red-700'}`} />
                    <span className={m.user.isActive ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                      {m.user.isActive ? 'Activo' : 'Inactivo'}
                    </span>
                  </p>
                </div>
                <div className="flex gap-2 mt-auto">
                  <Link href={PATHROUTES.pymes.miembros_editar(m.id)} className="w-full">
                    <Button variant="outline" className="w-full">Editar</Button>
                  </Link>
                  {m.role !== 'OWNER' && (
                    <Button variant="danger" className="w-full" onClick={() => openDeleteConfirm(m.userId, m.user.name)}>Eliminar</Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </Card>
      
      <ConfirmDialog
        open={confirmDelete.open}
        title="Eliminar Miembro"
        description={`¿Estás seguro de que quieres eliminar a ${confirmDelete.userName}? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
        cancelText="Cancelar"
        isLoading={isDeletingMember}
        onConfirm={handleDeleteMember}
        onCancel={() => setConfirmDelete({ open: false, userId: '', userName: '' })}
      />
    </div>
  );
}
