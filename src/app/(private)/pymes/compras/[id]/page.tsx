"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  ArrowLeft,
  Loader2,
  AlertTriangle,
  DollarSign,
  Calendar,
  ShoppingBag,
  ListOrdered,
} from "lucide-react";
import Link from "next/link";
import { PATHROUTES } from "@/constants/pathroutes";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";

// Tipos
interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Item {
  productId: string;
  quantity: number;
  product?: Product;
}

interface Order {
  id: string;
  date: string;
  customerId: string;
  items: Item[];
}

export default function ClienteDetalle() {
  const params = useParams();
  const { data: session } = useSession();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!session?.accessToken || !session.user?.companyId) {
        setError("No se pudo autenticar la sesión.");
        setLoading(false);
        return;
      }
      setLoading(true);

      try {
        // 1. Cliente
        const customerRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/customers/${customerId}`,
          { headers: { Authorization: `Bearer ${session.accessToken}` } }
        );
        if (!customerRes.ok) throw new Error("Cliente no encontrado.");
        const customerData: Customer = await customerRes.json();
        setCustomer(customerData);

        // 2. Productos
        const productsRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
          { headers: { Authorization: `Bearer ${session.accessToken}` } }
        );
        const productsData: Product[] = await productsRes.json();
        setProducts(productsData);

        // 3. Órdenes de la empresa
        const ordersRes = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/company/${session.user.companyId}`,
          { headers: { Authorization: `Bearer ${session.accessToken}` } }
        );
        if (!ordersRes.ok) throw new Error("No se pudieron cargar las compras.");
        const ordersData: Order[] = await ordersRes.json();

        // 4. Filtrar por el cliente actual
        const filteredOrders = ordersData.filter((o) => o.customerId === customerId);

        // 5. Enriquecer con productos
        const enrichedOrders = filteredOrders.map((order) => ({
          ...order,
          items: order.items.map((item) => ({
            ...item,
            product: productsData.find((p) => p.id === item.productId),
          })),
        }));

        setOrders(enrichedOrders);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido.");
        toast.error("Hubo un error al cargar los datos.");
      } finally {
        setLoading(false);
      }
    };

    if (session && customerId) fetchData();
  }, [session, customerId]);

  // 🔹 Calcular total de una orden
  const calculateTotal = (items: Item[]) =>
    items.reduce(
      (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
      0
    );

  if (loading) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        {/* <Loader2 className="animate-spin h-12 w-12 text-primary" /> */}
       <ListOrdered className="animate-spin h-12 w-12 text-primary" /> 
        <p className="mt-4 text-foreground/70">Cargando cliente...</p>
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
        <p className="text-foreground/70">{error}</p>
        <Link href={PATHROUTES.pymes.clientes} className="mt-4">
          <Button>Volver a la lista</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-background">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">{customer.name}</h2>
          <p className="text-sm text-foreground/70">ID: {customer.id}</p>
        </div>
        <Link href={PATHROUTES.pymes.clientes}>
          <Button variant="outline" className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
        </Link>
      </div>

      {/* Info del cliente */}
      <Card isClickable={false} className="p-4 space-y-2">
        <h2 className="text-lg font-semibold">Información del Cliente</h2>
        <p>Email: {customer.email || "No especificado"}</p>
        <p>Teléfono: {customer.phone || "No especificado"}</p>
      </Card>

      {/* Historial de compras */}
      <Card isClickable={false} className="p-4 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" /> Historial de Compras
        </h2>

        {orders.length === 0 ? (
          <p className="text-sm text-foreground/60">
            Este cliente no tiene compras registradas.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-background border-b border-border">
                <tr>
                  <th className="p-3 font-semibold">Fecha</th>
                  <th className="p-3 font-semibold">Productos</th>
                  <th className="p-3 font-semibold">Total</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id} className="border-b border-border hover:bg-background">
                    <td className="p-3">
                      <Calendar className="inline h-4 w-4 mr-1" />
                      {new Date(order.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {order.items
                        .map((i) => `${i.product?.name || "Producto"} (${i.quantity})`)
                        .join(", ")}
                    </td>
                    <td className="p-3 font-semibold flex items-center gap-1">
                      <DollarSign className="h-4 w-4" /> ${calculateTotal(order.items).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
