'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { supportService, UpdateTicketDto } from '@/app/(superadmin)/admin/services/supportService';

interface EditTicketModalProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: Partial<UpdateTicketDto> | null;
  ticketId: string | null;
  onSuccess: () => void;
}

export default function EditTicketModal({ 
  isOpen, 
  onClose, 
  ticket, 
  ticketId,
  onSuccess 
}: EditTicketModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'MEDIA' as 'BAJA' | 'MEDIA' | 'ALTA' | 'CRITICA',
    status: 'ABIERTO' as 'ABIERTO' | 'EN_PROCESO' | 'ESPERANDO_USUARIO' | 'RESUELTO' | 'CERRADO',
    department: 'TECNICO' as 'TECNICO' | 'FINANCIERO' | 'ADMINISTRATIVO' | 'VENTAS'
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (ticket) {
      setFormData({
        title: ticket.title ?? '',
        description: ticket.description ?? '',
        priority: ticket.priority ?? 'MEDIA',
        status: ticket.status ?? 'ABIERTO',
        department: ticket.department ?? 'TECNICO'
      });
    }
  }, [ticket]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!ticketId) {
      toast.error('Error: ID de ticket no válido');
      return;
    }

    if (!formData.title.trim() || !formData.description.trim()) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }

    try {
      setIsSubmitting(true);
      await supportService.updateTicket(ticketId, formData);
      toast.success('Ticket actualizado exitosamente');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error updating ticket:', error);
      toast.error('Error al actualizar el ticket');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-background border border-border rounded-lg shadow-xl"
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="sticky top-0 z-10 flex items-center justify-between p-6 border-b border-border bg-background"
            >
              <h2 className="text-2xl font-bold text-foreground">Editar Ticket</h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-muted rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </motion.div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="p-6 space-y-4"
              >
                {/* Título */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Título <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                {/* Descripción */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Descripción <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    required
                  />
                </div>

                {/* Prioridad y Estado */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Prioridad
                    </label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as typeof formData.priority })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="BAJA">Baja</option>
                      <option value="MEDIA">Media</option>
                      <option value="ALTA">Alta</option>
                      <option value="CRITICA">Crítica</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Estado
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value as typeof formData.status })}
                      className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="ABIERTO">Abierto</option>
                      <option value="EN_PROCESO">En Proceso</option>
                      <option value="ESPERANDO_USUARIO">Esperando Usuario</option>
                      <option value="RESUELTO">Resuelto</option>
                      <option value="CERRADO">Cerrado</option>
                    </select>
                  </div>
                </div>

                {/* Departamento */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Departamento
                  </label>
                  <select
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value as typeof formData.department })}
                    className="w-full px-4 py-2 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="TECNICO">Técnico</option>
                    <option value="FINANCIERO">Financiero</option>
                    <option value="ADMINISTRATIVO">Administrativo</option>
                    <option value="VENTAS">Ventas</option>
                  </select>
                </div>
              </motion.div>

              {/* Footer */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="sticky bottom-0 flex justify-end gap-3 p-6 border-t border-border bg-background"
              >
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-2 border border-border rounded-lg hover:bg-muted transition-colors"
                  disabled={isSubmitting}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </motion.div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
