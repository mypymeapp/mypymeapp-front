'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Category } from '@/mocks/types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, Edit, Trash2, PlusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface ManageCategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onUpdate: () => void;
}

export const ManageCategoriesModal = ({ isOpen, onClose, categories, onUpdate }: ManageCategoriesModalProps) => {
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editingName, setEditingName] = useState('');
  const { data: session } = useSession();

  const handleCreate = async () => {
    if (!newCategoryName.trim()) {
        toast.error('El nombre de la categoría es obligatorio.');
        return;
    }
    if (!session?.user?.companyId || !session.accessToken) {
        toast.error('Error de sesión. Por favor, reinicia la sesión.');
        return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ 
            name: newCategoryName,
            companyId: session.user.companyId 
        }),
      });

      if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || 'No se pudo crear la categoría.');
      }

      toast.success(`Categoría "${newCategoryName}" creada con éxito.`);
      setNewCategoryName('');
      onUpdate();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido.');
    }
  };

  const handleDelete = (category: Category) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>¿Seguro que quieres eliminar <span className="font-bold text-primary">{category.name}</span>?</p>
        <div className="text-xs text-foreground/60">Esto no eliminará los productos asociados.</div>
        <div className="flex gap-2 mt-2">
          <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={async () => {
            toast.dismiss(t.id);
            if (!session?.accessToken) return;
            try {
              const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${category.id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${session.accessToken}` },
              });
              if (!res.ok) throw new Error('Otro miembro creo esta categoria!');
              toast.success(`Categoría "${category.name}" eliminada.`);
              onUpdate();
            } catch (err) {
              toast.error(err instanceof Error ? err.message : 'Error al eliminar.');
            }
          }}>
            Sí, eliminar
          </Button>
          <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
            Cancelar
          </Button>
        </div>
      </div>
    ));
  };

  const handleUpdate = async () => {
    if (!session?.accessToken || !editingCategory || !editingName.trim()) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/${editingCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ name: editingName }),
      });
      if (!res.ok) throw new Error('No se pudo actualizar la categoría.');
      
      toast.success('Categoría actualizada.');
      setEditingCategory(null);
      setEditingName('');
      onUpdate();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al actualizar.');
    }
  };

  const startEditing = (category: Category) => {
    setEditingCategory(category);
    setEditingName(category.name);
  };
  
  const cancelEditing = () => {
    setEditingCategory(null);
    setEditingName('');
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-card border border-border p-6">
          <Dialog.Title className="text-xl font-bold text-foreground flex justify-between items-center">
            Gestionar Categorías
            <button onClick={onClose}><X className="h-5 w-5" /></button>
          </Dialog.Title>
          <div className="mt-4 space-y-3 max-h-60 overflow-y-auto pr-2">
            {categories.map(cat => (
              <div key={cat.id} className="flex justify-between items-center bg-background p-2 rounded-lg">
                {editingCategory?.id === cat.id ? (
                  <div className="flex-grow flex gap-2">
                    <Input id="edit-category" label="" value={editingName} onChange={(e) => setEditingName(e.target.value)} className="h-10"/>
                    <Button onClick={handleUpdate} className="h-10">Guardar</Button>
                    <Button variant="outline" onClick={cancelEditing} className="h-10">Cancelar</Button>
                  </div>
                ) : (
                  <>
                    <span>{cat.name}</span>
                    <div className="flex gap-2">
                      <Button variant="outline" className="p-2 h-auto" onClick={() => startEditing(cat)}><Edit className="h-4 w-4" /></Button>
                      <Button variant="danger" className="p-2 h-auto" onClick={() => handleDelete(cat)}><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
          <div className="mt-6 border-t border-border pt-4">
            <h3 className="font-semibold mb-2">Crear Nueva Categoría</h3>
            <div className="flex gap-2">
              <Input id="new-category" label="Nombre de la Categoria" value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} />
              <Button onClick={handleCreate} disabled={!newCategoryName.trim()} className="h-[49px]">
                <PlusCircle className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};