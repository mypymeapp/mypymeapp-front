/* eslint-disable @typescript-eslint/no-explicit-any */

import { FiUser } from 'react-icons/fi'
import { Modal } from '@/app/(superadmin)/admin/_components/dashboard/Modal'
import { ChatHistory } from '@/app/(superadmin)/admin/(pages)/support/_components/ChatHistory'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { SupportActions } from '../useSupportActions'
import { convertToChatMessage } from '@/app/(superadmin)/admin/services/supportService'

interface SupportModalsProps {
  actions: SupportActions
}

export function SupportModals({ actions }: SupportModalsProps) {
  const {
    showCreateModal,
    setShowCreateModal,
    showEditModal,
    setShowEditModal,
    showDetailModal,
    setShowDetailModal,
    selectedTicket,
    newTicket,
    setNewTicket,
    handleCreateTicket,
    handleEditTicket,
    handleSendMessage
  } = actions

  return (
    <>
      {/* Modal para crear ticket */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Ticket"
        maxWidth="2xl"
      >
        <div className="p-6">
          <form onSubmit={handleCreateTicket} className="space-y-4">
            <div>
              <Input
                id="title"
                label="Título del ticket"
                value={newTicket.title || ''}
                onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Descripción
              </label>
              <textarea
                value={newTicket.description || ''}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Prioridad
                </label>
                <select
                  value={newTicket.priority || 'MEDIA'}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                  <option value="CRITICA">Crítica</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Departamento
                </label>
                <select
                  value={newTicket.department || 'TECNICO'}
                  onChange={(e) => setNewTicket({...newTicket, department: e.target.value as any})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="TECNICO">Técnico</option>
                  <option value="FINANCIERO">Financiero</option>
                  <option value="ADMINISTRATIVO">Administrativo</option>
                  <option value="VENTAS">Ventas</option>
                </select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium text-foreground">Información del Usuario</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <Input
                  id="clientName"
                  label="Nombre del usuario"
                  value={newTicket.clientName || ''}
                  onChange={(e) => setNewTicket({
                    ...newTicket, 
                    clientName: e.target.value
                  })}
                  required
                />
                
                <Input
                  id="clientEmail"
                  label="Email del usuario"
                  type="email"
                  value={newTicket.clientEmail || ''}
                  onChange={(e) => setNewTicket({
                    ...newTicket, 
                    clientEmail: e.target.value
                  })}
                  required
                />
              </div>
              
              <Input
                id="clientCompany"
                label="Empresa del usuario"
                value={newTicket.clientCompany || ''}
                onChange={(e) => setNewTicket({
                  ...newTicket, 
                  clientCompany: e.target.value
                })}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Crear Ticket
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal para editar ticket */}
      <Modal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        title="Editar Ticket"
        maxWidth="2xl"
      >
        <div className="p-6">
          <form onSubmit={handleEditTicket} className="space-y-4">
            <div>
              <Input
                id="editTitle"
                label="Título del ticket"
                value={newTicket.title || ''}
                onChange={(e) => setNewTicket({...newTicket, title: e.target.value})}
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Descripción
              </label>
              <textarea
                value={newTicket.description || ''}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
                className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                rows={4}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Prioridad
                </label>
                <select
                  value={newTicket.priority || 'MEDIA'}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value as any})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="BAJA">Baja</option>
                  <option value="MEDIA">Media</option>
                  <option value="ALTA">Alta</option>
                  <option value="CRITICA">Crítica</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  Departamento
                </label>
                <select
                  value={newTicket.department || 'TECNICO'}
                  onChange={(e) => setNewTicket({...newTicket, department: e.target.value as any})}
                  className="w-full px-3 py-2 border border-border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                >
                  <option value="TECNICO">Técnico</option>
                  <option value="FINANCIERO">Financiero</option>
                  <option value="ADMINISTRATIVO">Administrativo</option>
                  <option value="VENTAS">Ventas</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditModal(false)}
              >
                Cancelar
              </Button>
              <Button type="submit">
                Guardar Cambios
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Modal para vista detallada */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detalles del Ticket"
        maxWidth="4xl"
      >
        {selectedTicket && (
          <div className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{selectedTicket.title}</h3>
                  <p className="text-foreground/70">{selectedTicket.description}</p>
                </div>
                
                <div>
                  <ChatHistory
                    messages={selectedTicket?.messages?.map(convertToChatMessage) || []}
                    onSendMessage={handleSendMessage}
                    loading={false}
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-3">Información del Ticket</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">ID:</span>
                      <span className="font-medium">{selectedTicket.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-2 mb-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedTicket?.status === 'ABIERTO' ? 'bg-green-100 text-green-800' :
                          selectedTicket?.status === 'EN_PROCESO' ? 'bg-yellow-100 text-yellow-800' :
                          selectedTicket?.status === 'ESPERANDO_USUARIO' ? 'bg-blue-100 text-blue-800' :
                          selectedTicket?.status === 'RESUELTO' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedTicket?.status === 'ABIERTO' ? 'Abierto' :
                           selectedTicket?.status === 'EN_PROCESO' ? 'En Progreso' :
                           selectedTicket?.status === 'ESPERANDO_USUARIO' ? 'Esperando Usuario' :
                           selectedTicket?.status === 'RESUELTO' ? 'Resuelto' :
                           'Cerrado'}
                        </span>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          selectedTicket?.priority === 'CRITICA' ? 'bg-red-100 text-red-800' :
                          selectedTicket?.priority === 'ALTA' ? 'bg-orange-100 text-orange-800' :
                          selectedTicket?.priority === 'MEDIA' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {selectedTicket?.priority === 'CRITICA' ? 'Crítica' :
                           selectedTicket?.priority === 'ALTA' ? 'Alta' :
                           selectedTicket?.priority === 'MEDIA' ? 'Media' :
                           'Baja'}
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Categoría:</span>
                      <p><strong>Departamento:</strong> {selectedTicket?.department}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-lg p-4">
                  <h4 className="font-medium text-foreground mb-3 flex items-center gap-2">
                    <FiUser className="w-4 h-4" />
                    Cliente
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-foreground/60">Creado:</span>
                      <span>{new Date(selectedTicket.createdAt).toLocaleDateString('es-ES')}</span>
                    </div>
                    <div className="space-y-2">
                      <h4 className="font-medium text-foreground">Mensajes</h4>
                      <div className="max-h-40 overflow-y-auto space-y-2">
                        {selectedTicket?.messages?.map((message, index) => (
                          <div key={index} className="p-3 bg-muted rounded-lg">
                            <div className="flex justify-between items-start mb-2">
                              <span className="font-medium text-sm">
                                {message.isFromUser ? message.user?.name : message.admin?.name}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {new Date(message.createdAt).toLocaleString()}
                              </span>
                            </div>
                            <p className="text-sm">{message.message}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}
