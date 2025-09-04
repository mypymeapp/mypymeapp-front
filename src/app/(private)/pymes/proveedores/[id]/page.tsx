'use client';

import { useState, useEffect } from 'react';
import { mockProveedores, mockProductos, mockFacturas } from '@/mocks/data';
import { Card } from '@/components/ui/Card';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { Button } from '@/components/ui/Button';
import { Map } from '@/components/ui/Map';
import { Phone, Mail, MapPin, Edit, Loader2, RefreshCw } from 'lucide-react';
import { Proveedor, Producto, FacturaProveedor } from '@/mocks/types';
import { ProductoCard } from '@/components/ui/ProductCard';
import { formatCurrency } from '@/utils/formatters';

const currencyData = {
    ARS: { isBaseCurrency: false, defaultRate: 900 },
    CLP: { isBaseCurrency: false, defaultRate: 950 },
    UYU: { isBaseCurrency: false, defaultRate: 40 },
    MXN: { isBaseCurrency: false, defaultRate: 18 },
    EUR: { isBaseCurrency: true, defaultRate: 1 },
};

function getProveedorData(id: string) {
  const proveedor = mockProveedores.find(p => p.id === id);
  if (!proveedor) return null;
  const productos = mockProductos.filter(p => p.proveedorId === id);
  const facturas = mockFacturas.filter(f => f.proveedorId === id);
  const totalComprado = facturas.reduce((acc, f) => acc + f.monto, 0);
  const deuda = facturas
    .filter(f => f.estado === 'Pendiente' || f.estado === 'Vencida')
    .reduce((acc, f) => acc + f.monto, 0);
  
  return { proveedor, productos, facturas, totalComprado, deuda };
}

const FacturasTable = ({ facturas, moneda }: { facturas: FacturaProveedor[], moneda: 'ARS' | 'CLP' | 'UYU' | 'MXN' | 'EUR' }) => (
    <div className="overflow-x-auto">
        <table className="w-full text-left">
            <thead>
                <tr className="border-b border-border">
                    <th className="p-2 font-semibold text-sm">N° Factura</th>
                    <th className="p-2 font-semibold text-sm">Vencimiento</th>
                    <th className="p-2 font-semibold text-sm">Monto</th>
                    <th className="p-2 font-semibold text-sm">Estado</th>
                </tr>
            </thead>
            <tbody>
                {facturas.map(f => (
                    <tr key={f.id} className="border-b border-border last:border-b-0 text-sm">
                        <td className="p-2">{f.numeroFactura}</td>
                        <td className="p-2">{f.fechaVencimiento}</td>
                        <td className="p-2">{formatCurrency(f.monto, moneda)}</td>
                        <td className="p-2">
                             <span className={`px-2 py-1 text-xs font-bold rounded-full ${
                                f.estado === 'Pagada' ? 'bg-green-500/20 text-green-400' :
                                f.estado === 'Pendiente' ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                            }`}>{f.estado}</span>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
);

export default function ProveedorDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [data, setData] = useState<ReturnType<typeof getProveedorData>>(null);
  const [exchangeRate, setExchangeRate] = useState(1);

  useEffect(() => {
    const loadedData = getProveedorData(id);
    if(loadedData) {
        setData(loadedData);
        setExchangeRate(currencyData[loadedData.proveedor.moneda].defaultRate);
    }
  }, [id]);

  if (!data) {
    return (
        <div className="p-8 text-center flex items-center justify-center h-full">
            <Loader2 className="animate-spin mr-2" /> Cargando datos del proveedor...
        </div>
    );
  }

  const { proveedor, productos, facturas, totalComprado, deuda } = data;
  const currencyInfo = currencyData[proveedor.moneda];

  return (
    <div className="p-4 md:p-8 space-y-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{proveedor.nombre}</h1>
          <p className="text-foreground/70">{proveedor.cif}</p>
        </div>
        <Button variant="outline"><Edit className="mr-2 h-4 w-4" /> Editar</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card isClickable={false}>
            <h2 className="text-xl font-bold mb-4">Información de Contacto</h2>
            <div className="space-y-3 text-foreground/80">
              <p className="flex items-center gap-3"><Phone className="w-4 h-4 text-primary" /> {proveedor.telefono}</p>
              <p className="flex items-center gap-3"><Mail className="w-4 h-4 text-primary" /> {proveedor.email}</p>
              <p className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" /> {proveedor.direccion}</p>
            </div>
          </Card>
          <Card isClickable={false} className="overflow-hidden">
            <h2 className="text-xl font-bold mb-4">Ubicación</h2>
            <div className="h-64 rounded-lg">
              <Map lat={proveedor.lat} lng={proveedor.lng} />
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <PremiumCard>
                    <h3 className="text-lg font-semibold text-foreground/70">Total Histórico Comprado</h3>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(totalComprado, proveedor.moneda)}</p>
                </PremiumCard>
                <PremiumCard>
                    <h3 className="text-lg font-semibold text-foreground/70">Deuda Actual</h3>
                    <p className={`text-3xl font-bold ${deuda > 0 ? 'text-red-500' : 'text-green-500'}`}>{formatCurrency(deuda, proveedor.moneda)}</p>
                </PremiumCard>
            </div>
            <PremiumCard>
                <h2 className="text-xl font-bold mb-4">Gestión Financiera</h2>
                 {!currencyInfo.isBaseCurrency && (
                     <div className='flex items-end gap-2'>
                        <div className='flex-grow'>
                            <label htmlFor="exchangeRate" className="block text-sm font-medium text-foreground/80 mb-2">Tasa de Cambio (1 USD = ? {proveedor.moneda})</label>
                            <input
                                id="exchangeRate"
                                type="number"
                                value={exchangeRate}
                                onChange={(e) => setExchangeRate(Number(e.target.value))}
                                className="w-full px-3 py-2 text-foreground bg-background border border-border rounded-lg"
                            />
                        </div>
                        <Button className="h-[42px]"><RefreshCw className="mr-2 w-4 h-4" />Actualizar</Button>
                    </div>
                )}
                {currencyInfo.isBaseCurrency && (
                    <p className='text-foreground/70'>Este proveedor opera en una moneda base (EUR). No se requiere tasa de cambio.</p>
                )}
            </PremiumCard>
            <Card isClickable={false}>
                <h2 className="text-xl font-bold mb-4">Facturas Asociadas</h2>
                <FacturasTable facturas={facturas} moneda={proveedor.moneda} />
            </Card>
            <Card isClickable={false}>
                <h2 className="text-xl font-bold mb-4">Productos de este Proveedor</h2>
                <div className='space-y-4'>
                    {productos.length > 0 ? (
                        productos.map(producto => (
                            <ProductoCard 
                                key={producto.id}
                                producto={producto}
                                moneda={proveedor.moneda}
                                isBaseCurrency={currencyInfo.isBaseCurrency}
                                exchangeRate={exchangeRate}
                            />
                        ))
                    ) : (
                        <p className='text-foreground/60'>No hay productos registrados para este proveedor.</p>
                    )}
                </div>
            </Card>
        </div>
      </div>
    </div>
  );
}