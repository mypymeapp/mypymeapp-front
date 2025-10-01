'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PATHROUTES } from '@/constants/pathroutes';
import { PlusCircle, Phone, Mail, User, LayoutGrid, List, Search, Loader2, AlertTriangle, Package, DollarSign, Truck, ListOrdered } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { Proveedor } from '@/mocks/types';
import { useRouter } from 'next/navigation'; 


type ViewMode = 'cards' | 'list';

export default function ProveedoresPage() {
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'deuda' | 'mercaderia'>('all');
  const { data: session } = useSession();
  const router = useRouter(); 

  const fetchProveedores = useCallback(async () => {
      if (!session?.user?.companyId || !session?.accessToken) return;
      try {
        setLoading(true);
        setError(null);
        const companyId = session.user.companyId;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`, {
          headers: { 'Authorization': `Bearer ${session.accessToken}` }
        });
        if (!res.ok) throw new Error('No se pudieron cargar los proveedores. Verifica que la ruta de la API sea correcta.');
        const data = await res.json();
        setProveedores(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error');
      } finally {
        setLoading(false);
      }
    }, [session]);

  useEffect(() => {
    if (session?.user?.companyId) {
      fetchProveedores();
    }
  }, [session, fetchProveedores]);

  const filteredProveedores = useMemo(() => {
    return proveedores
      .filter(proveedor => {
        const matchesSearch = proveedor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              (proveedor.contactName && proveedor.contactName.toLowerCase().includes(searchTerm.toLowerCase()));
        
        if (filter === 'deuda') return proveedor.debeDinero && matchesSearch;
        if (filter === 'mercaderia') return proveedor.mercaderiaPendiente && matchesSearch;
        return matchesSearch;
      })
      .sort((a, b) => a.name.localeCompare(b.name));
  }, [proveedores, searchTerm, filter]);

  // const handleEdit = (id: string) => alert(`Redirigiendo a la página de edición para el proveedor ${id} (funcionalidad por implementar)`);
 const handleEdit = (id: string) => {
    router.push(PATHROUTES.pymes.proveedor_editar(id));
  };
  const deudaActivo = filter === 'deuda';
  const mercaderiaActivo = filter === 'mercaderia';

  if (loading) {
    return <div className="p-8 h-full flex justify-center items-center"> <ListOrdered className="animate-spin h-12 w-12 text-primary" /></div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500 h-full flex flex-col justify-center items-center"><AlertTriangle className="w-12 h-12 mb-4" /><p>{error}</p></div>;
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-foreground">Proveedores</h1>
        <Link href={PATHROUTES.pymes.proveedores_nuevo}><Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Proveedor</Button></Link>
      </div>

      <Card isClickable={false} className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Buscar por nombre o contacto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-foreground/50"
            />
          </div>
           <div className="flex items-center gap-2">
            <button 
              onClick={() => setFilter(deudaActivo ? 'all' : 'deuda')}
              className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${deudaActivo ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-transparent border border-border hover:bg-border'}`}
            >
              <DollarSign className="mr-2 h-4 w-4"/> Con Deuda
            </button>
            <button 
              onClick={() => setFilter(mercaderiaActivo ? 'all' : 'mercaderia')}
              className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${mercaderiaActivo ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30' : 'bg-transparent border border-border hover:bg-border'}`}
            >
              <Package className="mr-2 h-4 w-4"/> Mercadería Pendiente
            </button>
          </div>
          <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
            <button onClick={() => setViewMode('cards')} className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}><LayoutGrid className="h-5 w-5"/></button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}><List className="h-5 w-5"/></button>
          </div>
        </div>
      </Card>

      {proveedores.length === 0 ? (
        <Card isClickable={false}>
            <div className="text-center py-12">
                <Truck className="mx-auto h-12 w-12 text-foreground/30" />
                <h3 className="mt-2 text-xl font-semibold">No tienes proveedores</h3>
                <p className="mt-1 text-sm text-foreground/60">Empieza a añadir proveedores para gestionar tus compras.</p>
                <Link href={PATHROUTES.pymes.proveedores_nuevo} className="mt-6 inline-block"><Button>Añadir tu primer proveedor</Button></Link>
            </div>
        </Card>
      ) : viewMode === 'cards' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
          {filteredProveedores.map(p => (
            <Card key={p.id} className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center w-12 h-12">
                    <span className="font-bold text-primary text-2xl">{p.name.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-foreground">{p.name}</h2>
                    <p className="text-sm text-foreground/60">{p.cif}</p>
                  </div>
                </div>
              </div>
              <div className="flex-grow space-y-2 text-sm text-foreground/80 mb-6">
                <p className="flex items-center gap-2"><User className="w-4 h-4 text-primary/70" /> {p.contactName || 'N/A'}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary/70" /> {p.phone || 'N/A'}</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary/70" /> {p.email || 'N/A'}</p>
              </div>
              <div className="flex flex-wrap gap-2 mt-auto">
                
                 <Link href={PATHROUTES.pymes.proveedor_detalle(p.id)} className="flex-grow"><Button variant='outline' className="w-full">Ver Detalles</Button></Link>
                 
                 <Button variant="outline" className="flex-grow sm:flex-grow-0" onClick={() => handleEdit(p.id)}>Editar</Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold hidden md:table-cell">Contacto</th>
                <th className="p-4 font-semibold hidden lg:table-cell">Email</th>
                <th className="p-4 font-semibold text-center">Deuda</th>
                <th className="p-4 font-semibold text-center">Pendiente</th>
                <th className="p-4"></th>
              </tr>
            </thead>
            <tbody>
              {filteredProveedores.map(p => (
                <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-background">
                  <td className="p-4 font-medium"><Link href={PATHROUTES.pymes.proveedor_detalle(p.id)} className="text-primary hover:underline">{p.name}</Link></td>
                  <td className="p-4 hidden md:table-cell">{p.contactName}</td>
                  <td className="p-4 hidden lg:table-cell">{p.email}</td>
                  <td className="p-4 text-center">{p.debeDinero ? <span className="text-yellow-400">Sí</span> : 'No'}</td>
                  <td className="p-4 text-center">{p.mercaderiaPendiente ? <span className="text-orange-400">Sí</span> : 'No'}</td>
                  <td className="p-4 text-right flex gap-2">
                    <Button variant="outline" onClick={() => handleEdit(p.id)} className="px-3 py-1 text-xs h-auto">Editar</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
