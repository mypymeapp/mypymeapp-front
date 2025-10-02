'use client';

import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-hot-toast';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Loader2, Mail, PlusCircle, UserCheck, LayoutGrid, List, Search, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useMembers } from '@/context/MembersContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

// Mapeo de roles a español
const ROLE_LABELS: Record<string, string> = {
  OWNER: 'Propietario',
  EMPLOYEE: 'Empleado',
  ADMIN: 'Administrador',
};

export default function MiembrosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { members, isLoading, fetchMembers, deleteMember } = useMembers();
  const [confirmDelete, setConfirmDelete] = useState<{ open: boolean; userId: string; userName: string }>(
    { open: false, userId: '', userName: '' }
  );
  const [isDeletingMember, setIsDeletingMember] = useState(false);
  const [viewMode, setViewMode] = useState<'cards' | 'list'>('cards');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredMembers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return members;
    return members.filter(m => m.user.name.toLowerCase().includes(term) || m.user.email.toLowerCase().includes(term));
  }, [members, searchTerm]);

  useEffect(() => {
    if (user?.role !== 'OWNER') {
      router.replace(PATHROUTES.pymes.configuracion);
      return;
    }
    fetchMembers().catch((e) => toast.error(e instanceof Error ? e.message : 'Error al cargar miembros'));
  }, [fetchMembers, user?.role, router]);

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

      <Card isClickable={false} className="mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Buscar por nombre o email..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}
              aria-label="Vista de tarjetas"
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}
              aria-label="Vista de tabla"
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Card>

      <h2 className="text-xl font-bold text-foreground mb-4">Miembros Actuales</h2>
      {isLoading ? (
        <div className="text-center p-8"><Loader2 className="animate-spin text-primary" /></div>
      ) : members.length === 0 ? (
        <Card isClickable={false}>
          <div className="text-center py-12">
            <h3 className="mt-2 text-xl font-semibold">No tienes miembros en tu empresa</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Añade miembros para colaborar con tu equipo.
            </p>
            <Link href={PATHROUTES.pymes.miembros_nuevo} className="mt-6 inline-block">
              <Button>Añadir miembro</Button>
            </Link>
          </div>
        </Card>
      ) : filteredMembers.length === 0 ? (
        <Card isClickable={false}>
          <div className="text-center py-12">
            <h3 className="mt-2 text-xl font-semibold">No se encontraron miembros</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Intenta ajustar tu búsqueda o limpiar el filtro.
            </p>
          </div>
        </Card>
      ) : (
        <>
          {viewMode === 'cards' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMembers.map(m => (
                <Card key={m.id} className="flex flex-col h-full hover:bg-muted/50 transition-colors">
                  <div className="flex-grow p-4">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center w-12 h-12">
                          <span className="font-bold text-primary text-4xl">{m.user.name.charAt(0)}</span>
                        </div>
                        <div>
                          <h2 className="font-bold text-lg text-foreground truncate max-w-[180px] sm:max-w-[220px]">{m.user.name}</h2>
                          <p className="text-sm text-foreground/60">{ROLE_LABELS[m.role] || m.role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm text-foreground/80">
                      <p className="flex items-center gap-2 break-all"><Mail className="w-4 h-4 text-primary/70" /> {m.user.email}</p>
                      <p className="flex items-center gap-2">
                        <UserCheck className={`w-4 h-4 ${m.user.isActive ? 'text-green-700' : 'text-red-700'}`} />
                        <span className={m.user.isActive ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                          {m.user.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 mt-auto p-4 border-t border-border">
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
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-x-auto">
              <table className="w-full text-left min-w-[720px]">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="p-4 font-semibold">Nombre</th>
                    <th className="p-4 font-semibold">Email</th>
                    <th className="p-4 font-semibold hidden md:table-cell">Rol</th>
                    <th className="p-4 font-semibold hidden lg:table-cell">Estado</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredMembers.map(m => (
                    <tr key={m.id} className="border-b border-border last:border-b-0 hover:bg-background">
                      <td className="p-4 font-medium text-primary">
                        <Link href={PATHROUTES.pymes.miembros_editar(m.id)} className="hover:underline">
                          {m.user.name}
                        </Link>
                      </td>
                      <td className="p-4">{m.user.email}</td>
                      <td className="p-4 hidden md:table-cell">{ROLE_LABELS[m.role] || m.role}</td>
                      <td className="p-4 hidden lg:table-cell">
                        <span className={m.user.isActive ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                          {m.user.isActive ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={PATHROUTES.pymes.miembros_editar(m.id)}>
                            <Button variant="outline" className="p-2 h-auto">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {m.role !== 'OWNER' && (
                            <Button
                              variant="danger"
                              onClick={() => openDeleteConfirm(m.userId, m.user.name)}
                              className="p-2 h-auto"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
      
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
