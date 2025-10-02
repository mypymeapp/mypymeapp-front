'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, FolderKanban, Package, SearchX, ListOrdered } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { toast } from 'react-hot-toast';
import { Product, Category } from '@/mocks/types';
import { formatCurrency } from '@/utils/formatters';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { ManageCategoriesModal } from '@/components/modals/ManageCategoriesModal';

type ViewMode = 'cards' | 'list';

export default function InventarioPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { data: session } = useSession();

  const fetchAllData = useCallback(async () => {
      if (!session?.user?.companyId || !session?.accessToken) return;
      try {
        setLoading(true);
        setError(null);
        const [inventoryRes, categoriesRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`, { headers: { 'Authorization': `Bearer ${session.accessToken}` } }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/company/${session.user.companyId}`, { headers: { 'Authorization': `Bearer ${session.accessToken}` } })
        ]);

        if (!inventoryRes.ok) throw new Error('Error al cargar el inventario.');
        if (!categoriesRes.ok) throw new Error('Error al cargar las categorías.');
        
        const productsData = await inventoryRes.json();
        const categoriesData = await categoriesRes.json();
        
        setProducts(productsData);
        setCategories(categoriesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error.');
      } finally {
        setLoading(false);
      }
  }, [session]);
  
  useEffect(() => {
    if (session?.user?.companyId) {
      fetchAllData();
    }
  }, [session, fetchAllData]);

  const filteredProducts = useMemo(() => {
    return products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [products, searchTerm]);

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.accessToken}` },
      });
      if (!res.ok) throw new Error('No se pudo eliminar el producto.');
      setProducts(prev => prev.filter(p => p.id !== id));
      toast.success('¡Producto eliminado con éxito!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido.');
    }
  };
  
  const confirmDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>¿Seguro que quieres eliminar este producto?</p>
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
            <p className="mt-4 text-foreground/70">Cargando inventario...</p>
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
    <>
      <ManageCategoriesModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        onUpdate={fetchAllData}
      />
      <div className="p-4 md:p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Inventario</h1>
          <Link href={PATHROUTES.pymes.inventario_nuevo}><Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Producto</Button></Link>
        </div>
        
        <Card isClickable={false} className="mb-8">
          <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="relative flex-grow max-w-xs">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
                <input type="text" placeholder="Buscar producto..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="flex items-center gap-2">
                  <Button variant="outline" onClick={() => setIsModalOpen(true)}>
                      <FolderKanban className="mr-2 h-4 w-4" />
                      Categorias
                  </Button>
                  <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
                    <button onClick={() => setViewMode('cards')} className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}><LayoutGrid className="h-5 w-5"/></button>
                    <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}><List className="h-5 w-5"/></button>
                  </div>
              </div>
          </div>
        </Card>

        {/* Mostrar mensaje especial si no hay categorías */}
        {categories.length === 0 && products.length === 0 ? (
            <Card isClickable={false}>
                <div className="text-center py-12">
                    <FolderKanban className="mx-auto h-12 w-12 text-primary/50" />
                    <h3 className="mt-2 text-xl font-semibold">¡Comienza organizando tu inventario!</h3>
                    <p className="mt-1 text-sm text-foreground/60">Primero crea categorías para organizar tus productos de manera eficiente.</p>
                    <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                            <FolderKanban className="h-4 w-4" />
                            Añadir tu primera categoría
                        </Button>
                        <p className='mt-4'>O</p>
                        <Link href={PATHROUTES.pymes.inventario_nuevo}>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Package className="h-4 w-4" />
                                  Crear tu primer producto
                            </Button>
                        </Link>
                    </div>
                </div>
            </Card>
        ) : products.length === 0 ? (
            <Card isClickable={false}>
                <div className="text-center py-12">
                    <Package className="mx-auto h-12 w-12 text-foreground/30" />
                    <h3 className="mt-2 text-xl font-semibold">Tu inventario está vacío</h3>
                    <p className="mt-1 text-sm text-foreground/60">¡Ahora añade tus productos!</p>
                    <Link href={PATHROUTES.pymes.inventario_nuevo} className="mt-6 inline-block">
                        <Button>Añadir tu primer producto</Button>
                    </Link>
                </div>
            </Card>
        ) : filteredProducts.length === 0 && searchTerm ? (
            <Card isClickable={false}>
                <div className="text-center py-12">
                    <SearchX className="mx-auto h-12 w-12 text-foreground/30" />
                    <h3 className="mt-2 text-xl font-semibold">No se encontraron productos</h3>
                    <p className="mt-1 text-sm text-foreground/60">No hay productos que coincidan con <span className="font-semibold text-primary">{searchTerm}</span></p>
                    <div className="mt-6">
                        <Link href={PATHROUTES.pymes.inventario_nuevo}>
                            <Button>Agregar nuevo producto</Button>
                        </Link>
                    </div>
                </div>
            </Card>
        ) : (
            <>
                {viewMode === 'cards' ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map(product => (
                      <Card key={product.id} className="flex flex-col">
                        <div className="flex-grow">
                          <h2 className="font-bold text-lg text-foreground truncate">{product.name}</h2>
                          <p className="text-sm text-primary font-semibold">{product.category?.name || 'Sin categoría'}</p>
                          <div className="my-4 text-center">
                            <p className="text-3xl font-bold text-foreground">{formatCurrency(product.price, 'USD')}</p>
                            <p className="text-xs text-foreground/60">Precio de Venta</p>
                          </div>
                           <div className="text-center bg-background rounded-lg p-2">
                            <p className="text-2xl font-mono font-bold text-foreground">{product.qty || 0}</p>
                            <p className="text-xs text-foreground/60">Stock Actual</p>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                          <Link href={PATHROUTES.pymes.inventario_editar(product.id)} className="w-full flex-grow">
                            <Button variant="outline" className="w-full"><Edit className="mr-2 h-4 w-4"/> Editar</Button>
                          </Link>
                          <Button variant="danger" className="flex-shrink-0" onClick={() => confirmDelete(product.id)}><Trash2 className="h-4 w-4"/></Button>
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
                          <th className="p-4 font-semibold hidden md:table-cell">SKU</th>
                          <th className="p-4 font-semibold hidden lg:table-cell">Categoría</th>
                          <th className="p-4 font-semibold text-center">Stock</th>
                          <th className="p-4 font-semibold text-right">Precio</th>
                          <th className="p-4"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.map(product => (
                          <tr key={product.id} className="border-b border-border last:border-b-0 hover:bg-background">
                            <td className="p-4 font-medium text-primary">{product.name}</td>
                            <td className="p-4 hidden md:table-cell">{product.sku}</td>
                            <td className="p-4 hidden lg:table-cell">{product.category?.name || 'N/A'}</td>
                            <td className="p-4 text-center font-mono font-bold">{product.qty || 0}</td>
                            <td className="p-4 text-right font-semibold">{formatCurrency(product.price, 'USD')}</td>
                            <td className="p-4 text-right">
                              <div className="flex justify-end gap-2">
                                <Link href={PATHROUTES.pymes.inventario_editar(product.id)}>
                                  <Button variant="outline" className="p-2 h-auto"><Edit className="h-4 w-4" /></Button>
                                </Link>
                                <Button variant="danger" onClick={() => confirmDelete(product.id)} className="p-2 h-auto"><Trash2 className="h-4 w-4" /></Button>
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
    </>
  );
}