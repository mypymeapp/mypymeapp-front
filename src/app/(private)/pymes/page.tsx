import { Card } from '@/components/ui/Card';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { ShoppingCart, DollarSign, FileText, Package, Users, Truck } from 'lucide-react';

const menuItems = [
  { title: 'Ventas', href: PATHROUTES.pymes.ventas, icon: DollarSign, description: 'Gestiona tus ventas' },
  { title: 'Compras', href: PATHROUTES.pymes.compras, icon: ShoppingCart, description: 'Registra tus compras' },
  { title: 'Facturación', href: PATHROUTES.pymes.facturacion, icon: FileText, description: 'Crea y envía facturas' },
  { title: 'Inventario', href: PATHROUTES.pymes.inventario, icon: Package, description: 'Controla tu stock' },
  { title: 'Clientes', href: PATHROUTES.pymes.clientes, icon: Users, description: 'Administra tus clientes' },
  { title: 'Proveedores', href: PATHROUTES.pymes.proveedores, icon: Truck, description: 'Organiza tus proveedores' },
];

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-foreground mb-8">Panel de Control</h1>
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item) => (
          <Link href={item.href} key={item.href} className="group">
            <Card className="flex flex-col justify-between p-6 h-52">
                <div className="bg-primary/10 p-3 rounded-lg self-start">
                    <item.icon className="w-7 h-7 text-primary" />
                </div>
                <div className="text-left">
                  <h2 className="text-2xl font-semibold text-foreground">{item.title}</h2>
                  <p className="text-foreground/60 mt-1">{item.description}</p>
                </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}