'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, AlertCircle, History, Loader2, ListOrdered } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Customer {
  id: string;
  name: string;
  email?: string;
  companyId: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
  qty: number;
}

interface InvoiceAPI {
  id: string;
  number: string;
  issuedAt: string;
  customer?: {
    name: string;
  };
  total: number;
  status: string;
}

interface InvoiceItem {
  productId: string;
  description: string;
  qty: number;
  price: number;
}

interface InvoiceUI {
  id: string;
  number: string;
  fecha: Date;
  customerName: string;
  total: number;
  status: string;
}

export default function FacturacionPage() {
  const { data: session } = useSession();

  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [invoices, setInvoices] = useState<InvoiceUI[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    if (!session?.user?.companyId || !session.accessToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [customersRes, productsRes, invoicesRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
          headers: { 'Authorization': `Bearer ${session.accessToken}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`, {
          headers: { 'Authorization': `Bearer ${session.accessToken}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${session.user.companyId}`, {
          headers: { 'Authorization': `Bearer ${session.accessToken}` },
        })
      ]);

      if (!customersRes.ok) throw new Error('Error al cargar clientes.');
      const allCustomers: Customer[] = await customersRes.json();
      setCustomers(allCustomers.filter(c => c.companyId === session.user.companyId));

      if (!productsRes.ok) throw new Error('Error al cargar productos.');
      setProducts(await productsRes.json());
      
      if (invoicesRes.ok) {
          const invoicesAPI: InvoiceAPI[] = await invoicesRes.json();
          setInvoices(invoicesAPI.map((f: InvoiceAPI) => ({
            id: f.id,
            number: f.number,
            fecha: new Date(f.issuedAt),
            customerName: f.customer?.name || 'Cliente Desconocido',
            total: f.total,
            status: f.status
          })));
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session) {
      fetchData();
    }
  }, [session, fetchData]);

  const handleAddItem = () => {
    setItems([...items, { productId: '', description: '', qty: 1, price: 0 }]);
  };

  const handleRemoveItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const newItems = [...items];
    const currentItem = newItems[index];

    if (field === 'productId') {
      const product = products.find(p => p.id === value);
      if (product) {
        currentItem.productId = value as string;
        currentItem.description = product.name;
        currentItem.price = product.price;
      }
    } else if (field === 'qty') {
        const newQty = Number(value);
        if (newQty >= 1) {
            currentItem.qty = newQty;
        }
    }
    
    setItems(newItems);
  };

  const handleCreateInvoice = async () => {
    if (!session?.user?.companyId || !session.accessToken) {
        toast.error('Sesión no válida.');
        return;
    }
    if (!selectedCustomer || items.length === 0 || items.some(i => !i.productId)) {
        toast.error('Debe seleccionar un cliente y agregar al menos un producto válido.');
        return;
    }

    const toastId = toast.loading('Emitiendo factura...');

    try {
      const invoiceData = {
        number: `INV-${Date.now().toString().slice(-6)}`,
        dueAt: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        companyId: session.user.companyId,
        customerId: selectedCustomer,
        items: items.map(item => ({
          productId: item.productId,
          qty: item.qty
        }))
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices`, {
        method: 'POST',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`
        },
        body: JSON.stringify(invoiceData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al emitir la factura.');
      }

      const newInvoice = await response.json();
      toast.success(`Factura ${newInvoice.number} emitida con éxito.`, { id: toastId });
      
      setItems([]);
      setSelectedCustomer('');
      await fetchData();
      setShowHistory(true);

    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al conectar con el servidor.', { id: toastId });
    }
  };

  const total = items.reduce((sum, item) => sum + (item.qty * item.price), 0);

  if (loading) {
    return (
        <div className="p-8 h-full flex flex-col justify-center items-center">
               <ListOrdered className="animate-spin h-12 w-12 text-primary" /> 
            <p className="mt-4 text-foreground/70">Cargando datos de facturación...</p>
        </div>
    );
  }

  if (error) {
    return (
        <div className="p-8 h-full flex flex-col justify-center items-center">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
            <p className="text-foreground/70">{error}</p>
        </div>
    );
  }
  
  const renderNewInvoiceForm = () => (
    <Card className="p-4 md:p-6">
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2 text-foreground/80">Cliente *</label>
          <select 
            value={selectedCustomer} 
            onChange={(e) => setSelectedCustomer(e.target.value)}
            className="w-full p-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="">Seleccionar cliente</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>

        <div>
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-foreground">Productos / Servicios</h3>
            <Button onClick={handleAddItem}>
              <Plus className="h-4 w-4 mr-2" />
              Agregar Ítem
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-12 gap-3 items-center p-3 border rounded-md bg-background/50">
                <div className="col-span-12 md:col-span-5">
                  <select
                    value={item.productId}
                    onChange={(e) => handleUpdateItem(index, 'productId', e.target.value)}
                    className="w-full p-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">Seleccionar producto</option>
                    {products.map(prod => (
                      <option key={prod.id} value={prod.id}>{prod.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="col-span-6 md:col-span-2">
                  <Input
                    type="number"
                    id=""
                    label=""
                    min="1"
                    value={item.qty}
                    onChange={(e) => handleUpdateItem(index, 'qty', parseInt(e.target.value) || 1)}
                    placeholder="Cant."
                    className="text-center"
                  />
                </div>
                
                <div className="col-span-6 md:col-span-2 text-center">
                  <p className="p-2 text-foreground/80">${item.price.toFixed(2)}</p>
                </div>
                
                <div className="col-span-12 md:col-span-2 text-center">
                   <p className="p-2 font-semibold text-foreground">${(item.qty * item.price).toFixed(2)}</p>
                </div>

                <div className="col-span-12 md:col-span-1 flex justify-end">
                  <Button variant="danger" onClick={() => handleRemoveItem(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {items.length > 0 && (
            <div className="flex justify-between items-center pt-6 border-t mt-6">
              <div className="text-2xl font-bold text-foreground">Total: ${total.toFixed(2)}</div>
              <Button onClick={handleCreateInvoice}>Emitir Factura</Button>
            </div>
          )}
        </div>
      </div>
    </Card>
  );

  const renderHistory = () => (
    <Card className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4 text-foreground">Historial de Facturas</h2>
      {invoices.length === 0 ? (
        <p className="text-foreground/60 text-center py-8">No hay facturas emitidas todavía.</p>
      ) : (
        <div className="space-y-3">
          {invoices.sort((a, b) => b.fecha.getTime() - a.fecha.getTime()).map(invoice => (
            <div key={invoice.id} className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors">
              <div className="flex flex-wrap justify-between items-center gap-2">
                <div>
                  <h3 className="font-semibold text-primary">{invoice.number}</h3>
                  <p className="text-sm text-foreground">{invoice.customerName}</p>
                  <p className="text-xs text-foreground/60">{invoice.fecha.toLocaleDateString()}</p>
                </div>
                <div className='text-right'>
                    <p className='font-bold text-lg text-foreground'>${invoice.total.toFixed(2)}</p>
                    {/* <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      invoice.status === 'PAID' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status}
                    </span> */}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );

  return (
    <div className="container mx-auto p-4 md:p-8 space-y-6">
      <div className="flex flex-wrap justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-foreground">Facturación</h1>
        <Button variant="outline" onClick={() => setShowHistory(!showHistory)}>
          <History className="h-4 w-4 mr-2" />
          {showHistory ? 'Crear Nueva Factura' : 'Ver Historial'}
        </Button>
      </div>

      {showHistory ? renderHistory() : renderNewInvoiceForm()}
    </div>
  );
}

