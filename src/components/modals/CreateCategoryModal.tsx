'use client';

import { useState } from 'react';
import { Dialog } from '@headlessui/react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { X, PlusCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCategoryCreated: (categoryId: string) => void;
}

export const CreateCategoryModal = ({ isOpen, onClose, onCategoryCreated }: CreateCategoryModalProps) => {
  const [categoryName, setCategoryName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session } = useSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!categoryName.trim()) {
      toast.error('El nombre de la categoría es obligatorio.');
      return;
    }

    if (!session?.user?.companyId || !session.accessToken) {
      toast.error('Error de sesión. Por favor, reinicia la sesión.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({ 
          name: categoryName,
          companyId: session.user.companyId 
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.message || 'No se pudo crear la categoría.');
      }

      const newCategory = await res.json();
      toast.success(`Categoría "${categoryName}" creada con éxito.`);
      
      // Llamar callback con el ID de la nueva categoría
      onCategoryCreated(newCategory.id);
      
      // Limpiar y cerrar
      setCategoryName('');
      onClose();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    if (!isSubmitting) {
      setCategoryName('');
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onClose={handleClose} className="relative z-50">
      <div className="fixed inset-0 bg-background/60 backdrop-blur-sm" aria-hidden="true" />
      <div className="fixed inset-0 flex w-screen items-center justify-center p-4">
        <Dialog.Panel className="w-full max-w-md rounded-2xl bg-card border border-border p-6">
          <Dialog.Title className="text-xl font-bold text-foreground flex justify-between items-center">
            Crear Nueva Categoría
            <button onClick={handleClose} disabled={isSubmitting}>
              <X className="h-5 w-5" />
            </button>
          </Dialog.Title>
          
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <Input 
                id="category-name" 
                label="Nombre de la Categoría" 
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                disabled={isSubmitting}
                autoFocus
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-border">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleClose}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={!categoryName.trim() || isSubmitting}
                className="flex items-center gap-2"
              >
                <PlusCircle className="h-4 w-4" />
                {isSubmitting ? 'Creando...' : 'Crear Categoría'}
              </Button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
};