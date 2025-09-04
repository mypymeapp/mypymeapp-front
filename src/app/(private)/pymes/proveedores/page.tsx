'use client';

import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockProveedores } from '@/mocks/data';
import { PATHROUTES } from '@/constants/pathroutes';
import { PlusCircle, MoreVertical, Phone, Mail, User, LayoutGrid, List, Search, DollarSign, Package } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';

type ViewMode = 'cards' | 'list';

export default function ProveedoresPage() {
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'deuda' | 'mercaderia'>('all');

  const sortedProveedores = useMemo(() => {
    return mockProveedores
      .filter(proveedor => {
        const matchesSearch = proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                              proveedor.nombreContacto.toLowerCase().includes(searchTerm.toLowerCase());
        
        if (filter === 'deuda') {
          return matchesSearch && proveedor.debeDinero;
        }
        if (filter === 'mercaderia') {
          return matchesSearch && proveedor.mercaderiaPendiente;
        }
        return matchesSearch;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [searchTerm, filter]);

  const handleEdit = (id: string) => toast.success(`Editando proveedor ${id} (simulación)`);
  const handleDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>¿Seguro que quieres eliminar este proveedor?</p>
        <div className="flex gap-2">
          <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
            toast.dismiss(t.id);
            toast.error(`Proveedor ${id} eliminado (simulación)`);
          }}>
            Sí, eliminar
          </Button>
          <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
            Cancelar
          </Button>
        </div>
      </div>
    ), { duration: 5000 });
  };

  const deudaActivo = filter === 'deuda';
  const mercaderiaActivo = filter === 'mercaderia';

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-foreground">Proveedores</h1>
        <Link href={PATHROUTES.pymes.proveedores_nuevo}>
          <Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Proveedor</Button>
        </Link>
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
            <button onClick={() => setViewMode('cards')} className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}>
              <LayoutGrid className="h-5 w-5"/>
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}>
              <List className="h-5 w-5"/>
            </button>
          </div>
        </div>
      </Card>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedProveedores.map(p => (
            <Card key={p.id} className="flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center w-12 h-12">
                    <span className="font-bold text-primary text-2xl">{p.nombre.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-foreground">{p.nombre}</h2>
                    <p className="text-sm text-foreground/60">{p.cif}</p>
                  </div>
                </div>
              </div>
              <div className="flex-grow space-y-2 text-sm text-foreground/80 mb-6">
                <p className="flex items-center gap-2"><User className="w-4 h-4 text-primary/70" /> {p.nombreContacto}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary/70" /> {p.telefono}</p>
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary/70" /> {p.email}</p>
              </div>
              <div className="flex gap-2 mt-auto">
                 <Link href={PATHROUTES.pymes.proveedor_detalle(p.id)} className="flex-grow"><Button variant='outline' className="w-full">Ver Detalles</Button></Link>
                 <Button variant="outline" className="px-4" onClick={() => handleEdit(p.id)}>Editar</Button>
                 <Button variant="danger" className="px-4" onClick={() => handleDelete(p.id)}>Eliminar</Button>
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
              {sortedProveedores.map(p => (
                <tr key={p.id} className="border-b border-border last:border-b-0 hover:bg-background">
                  <td className="p-4 font-medium"><Link href={PATHROUTES.pymes.proveedor_detalle(p.id)} className="text-primary hover:underline">{p.nombre}</Link></td>
                  <td className="p-4 hidden md:table-cell">{p.nombreContacto}</td>
                  <td className="p-4 hidden lg:table-cell">{p.email}</td>
                  <td className="p-4 text-center">{p.debeDinero ? <span className="text-yellow-400">Sí</span> : 'No'}</td>
                  <td className="p-4 text-center">{p.mercaderiaPendiente ? <span className="text-orange-400">Sí</span> : 'No'}</td>
                  <td className="p-4 text-right flex gap-2">
                    <Button variant="outline" onClick={() => handleEdit(p.id)} className="px-3 py-1 text-xs h-auto">Editar</Button>
                    <Button variant="danger" onClick={() => handleDelete(p.id)} className="px-3 py-1 text-xs h-auto">Eliminar</Button>
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