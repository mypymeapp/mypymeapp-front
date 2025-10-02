

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Phone, Mail, PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users, ListOrdered } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { PATHROUTES } from '@/constants/pathroutes';
import { Customer } from '@/types/customer';

type ViewMode = 'cards' | 'list';

export default function ClientesPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchTerm, setSearchTerm] = useState('');

  // 🟢 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchCustomers = useCallback(async () => {
    if (!session?.user?.companyId || !session?.accessToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
        headers: { 'Authorization': `Bearer ${session.accessToken}` },
      });

      if (!res.ok) {
        throw new Error(`Error al cargar clientes. Código: ${res.status}`);
      }

      const customersData: Customer[] = await res.json();
      const filteredData = customersData.filter(
        (c) => c.companyId === session.user.companyId
      );

      setCustomers(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error.');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.companyId) {
      fetchCustomers();
    }
  }, [session, fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [customers, searchTerm]);

  // 🟢 Paginación
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.accessToken}` },
      });

      if (!res.ok) {
        throw new Error('No se pudo eliminar el cliente.');
      }

      setCustomers(prev => prev.filter(c => c.id !== id));
      toast.success('¡Cliente eliminado con éxito!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido.');
    }
  };

  const confirmDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>¿Seguro que quieres eliminar este cliente?</p>
        <div className="flex gap-2">
          <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
            toast.dismiss(t.id);
            handleDelete(id);
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

  if (loading) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
         <ListOrdered className="animate-spin h-12 w-12 text-primary" />
        <p className="mt-4 text-foreground/70">Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
        <p className="text-foreground/70">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
        <Link href={PATHROUTES.pymes.clientes_nuevo}>
          <Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button>
        </Link>
      </div>

      <Card isClickable={false} className="mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Card>

      {customers.length === 0 ? (
        <Card isClickable={false}>
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-foreground/30" />
            <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Empieza a añadir clientes para gestionar su información.
            </p>
            <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
              <Button>Añadir tu primer cliente</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {viewMode === 'cards' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCustomers.map(customer => (
                  <div
                    key={customer.id}
                    // Quitamos el onClick del div principal ya que tendremos un botón "Ver Detalles"
                    className="cursor-pointer" 
                  >
                    <Card className="flex flex-col h-full hover:bg-muted/50 transition-colors">
                      
                      {/* Contenido de la tarjeta */}
                      <div className="flex-grow p-4 space-y-3">
                        {/* Header con Iniciales, Nombre, y ID */}
                        <div className="flex items-center gap-3">
                          <div className="bg-primary/10 p-2 rounded-full flex items-center justify-center w-10 h-10 flex-shrink-0">
                            <span className="font-bold text-primary text-xl">{customer.name.charAt(0)}</span>
                          </div>
                          <div>
                            <h2 className="font-bold text-lg text-foreground truncate">{customer.name}</h2>
                            {/* <p className="text-xs text-foreground/60">{customer.cif || customer.dni || 'ID no disponible'}</p> */}
                          </div>
                        </div>

                        {/* Contacto */}
                        <div className="space-y-1 text-sm pt-3"> 
                          <p className="flex items-center gap-2 text-foreground/80">
                            <Mail className="w-4 h-4 text-primary/70" /> {customer.email || 'Sin email'}
                          </p>
                          <p className="flex items-center gap-2 text-foreground/80">
                            <Phone className="w-4 h-4 text-primary/70" /> {customer.phone || 'Sin teléfono'}
                          </p>
                        </div>
                        
                      </div>
                      {/* Fin Contenido de la tarjeta */}

                      {/* Botones de acción */}
                      {/* Se quitó 'border-t border-border' para eliminar la línea divisoria. */}
                      <div className="flex gap-2 mt-auto p-4"> 
                        <Link
                          href={PATHROUTES.pymes.clientes_detalle(customer.id)}
                          className="flex-grow" // Ocupa el espacio principal
                          onClick={(e) => e.stopPropagation()} 
                        >
                          <Button variant="outline" className="w-full">
                            Ver Detalles
                          </Button>
                        </Link>
                        {/* Se ajustó el botón Editar para que tenga texto en lugar de solo icono, y se quitó el padding extra para igualar altura */}
                        <Link
                          href={PATHROUTES.pymes.clientes_editar(customer.id)}
                          className="flex-shrink-0" // Ocupa el espacio mínimo
                          onClick={(e) => e.stopPropagation()} 
                        >
                          <Button variant="outline" className="px-4 h-full">
                            Editar
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          // Este botón se mantiene con icono, ya que eliminar suele ser una acción de alto contraste y necesita menos espacio
                          className="flex-shrink-0 p-2 h-auto" 
                          onClick={(e) => {
                            e.stopPropagation(); 
                            confirmDelete(customer.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Navegación de paginación */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span>Página {currentPage} de {totalPages}</span>
                <Button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="p-4 font-semibold">Nombre</th>
                    <th className="p-4 font-semibold hidden md:table-cell">Email</th>
                    <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(customer => (
                    <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-background">
                      <td className="p-4 font-medium text-primary">
                        <Link href={PATHROUTES.pymes.clientes_detalle(customer.id)} className="hover:underline">
                          {customer.name}
                        </Link>
                      </td>
                      <td className="p-4 hidden md:table-cell">{customer.email || 'N/A'}</td>
                      <td className="p-4 hidden lg:table-cell">{customer.phone || 'N/A'}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} onClick={(e) => e.stopPropagation()}>
                            <Button variant="outline" className="p-2 h-auto">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(customer.id);
                            }}
                            className="p-2 h-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
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
    </div>
  );
}