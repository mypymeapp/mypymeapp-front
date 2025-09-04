// src/app/(private)/pymes/compras/page.tsx
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { mockCompras, mockProveedores } from '@/mocks/data';
import { PlusCircle, Truck, CreditCard } from 'lucide-react';
import Link from 'next/link';

const getProveedorNombre = (id: string) => mockProveedores.find(p => p.id === id)?.nombre || 'N/A';

export default function ComprasPage() {
  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Registro de Compras</h1>
        <Link href="#"><Button><PlusCircle className="mr-2 h-5 w-5" /> Nueva Compra</Button></Link>
      </div>

      <div className="space-y-4">
        {mockCompras.map(compra => (
          <Card key={compra.id} isClickable={true}>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-center">
              {/* Col 1: Producto */}
              <div className="md:col-span-2">
                <p className="font-bold text-foreground">{compra.producto}</p>
                <p className="text-sm text-foreground/70">Proveedor: {getProveedorNombre(compra.proveedorId)}</p>
                <p className="text-xs text-foreground/50 mt-1">Factura: {compra.facturaId}</p>
              </div>

              {/* Col 2: Estados */}
              <div className="flex flex-col gap-2 text-sm">
                 <div className="flex items-center gap-2">
                    <Truck className={`w-4 h-4 ${compra.estadoEntrega === 'Recibido' ? 'text-blue-400' : 'text-orange-400'}`} />
                    <span>{compra.estadoEntrega}</span>
                 </div>
                 <div className="flex items-center gap-2">
                    <CreditCard className={`w-4 h-4 ${
                        compra.estadoPago === 'Pagada' ? 'text-green-400' :
                        compra.estadoPago === 'Pendiente' ? 'text-yellow-400' : 'text-red-400'}`} />
                    <span>{compra.estadoPago}</span>
                 </div>
              </div>
              
              {/* Col 3: Monto */}
              <div className="text-right">
                <p className="text-xl font-bold text-primary">${compra.monto.toFixed(2)}</p>
                <p className="text-xs text-foreground/60">{compra.fecha}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}