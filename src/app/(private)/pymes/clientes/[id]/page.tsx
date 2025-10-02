


'use client';

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Phone,
  Mail,
  ArrowLeft,
  Check,
  Loader2,
  Trash2,
  AlertTriangle,
  StickyNote,
  ShoppingBag,
  Calendar,
  DollarSign,
  User,
  ListOrdered,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { PATHROUTES } from "@/constants/pathroutes";
import { Customer } from "@/types/customer";

// Tipos auxiliares
interface Product {
  id: string;
  name: string;
  price: number;
}

interface Item {
  productId: string;
  qty: number; // <-- CORREGIDO: Usar 'qty' según el API de facturas
  product?: Product;
}

interface Order {
  id: string;
  issuedAt: string; // <-- CORREGIDO: Usar 'issuedAt' en lugar de 'date' o 'issueDate'
  customerId: string;
  items: Item[];
}

// 🔹 Calcula antigüedad de cliente
const calcularAntiguedad = (fecha: string) => {
  const fechaCliente = new Date(fecha);
  const ahora = new Date();
  const diffMeses =
    (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 +
    (ahora.getMonth() - fechaCliente.getMonth());
  if (diffMeses < 12) {
    return `${diffMeses} mes${diffMeses === 1 ? "" : "es"}`;
  }
  const diffAnios = Math.floor(diffMeses / 12);
  return `${diffAnios} año${diffAnios === 1 ? "" : "s"}`;
};

export default function ClienteDetalle() {
  const { data: session } = useSession();
  const params = useParams();
  const clienteId = params.id as string;

  const [cliente, setCliente] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [notas, setNotas] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Historial de compras
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // 🔹 Fetch cliente
  const fetchCliente = useCallback(async () => {
    if (!session?.accessToken || !clienteId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo cargar la información del cliente.");
      }

      const clienteData = await res.json();
      setCliente(clienteData);
      setNotas(clienteData.notes || "");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    } 
    // NOTA: Se ha quitado el setLoading(false) de aquí para que se ejecute una vez cargue el historial también.
  }, [session, clienteId]);

  // 🔹 Fetch historial de compras (CORREGIDO el ENDPOINT)
  const fetchHistorial = useCallback(async () => {
    if (!session?.accessToken || !session.user?.companyId) return;

    try {
      // Productos
      const productsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
      const productsData: Product[] = await productsRes.json();
      setProducts(productsData);

      // Órdenes (Ahora Facturas/Ventas)
      const ordersRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${session.user.companyId}`, // <--- ¡ENDPOINT CORREGIDO!
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
      if (!ordersRes.ok) throw new Error("No se pudieron cargar las facturas de venta (historial).");
      const ordersData: Order[] = await ordersRes.json();

      // Filtrar por cliente
      const filtered = ordersData.filter((o) => o.customerId === clienteId);

      // Enriquecer con productos
      const enriched = filtered.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          product: productsData.find((p) => p.id === item.productId),
        })),
      }));

      setOrders(enriched);
    } catch (err) {
      toast.error("Error cargando historial de compras.");
    } finally {
      setLoading(false); // <--- El loading general finaliza aquí (después de ambos fetches)
    }
  }, [session, clienteId]);

  useEffect(() => {
    if (session) {
      // Se llama a fetchCliente primero, pero setLoading(false) se ejecuta en fetchHistorial.
      fetchCliente(); 
      fetchHistorial();
    }
  }, [session, fetchCliente, fetchHistorial]);

  // 🔹 Guardar notas
  const handleGuardarNotas = async () => {
    if (!cliente || !session?.accessToken) return;
    setIsPublishing(true);

    const payload = { ...cliente, notes: notas };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("No se pudieron guardar las notas.");

      let updatedCliente: Customer;
      try {
        updatedCliente = await res.json();
      } catch {
        updatedCliente = { ...cliente, notes: notas };
      }

      setCliente(updatedCliente);
      toast.success("¡Notas guardadas con éxito!");
    } catch {
      toast.error("Error al guardar las notas.");
    } finally {
      setIsPublishing(false);
    }
  };

  // 🔹 Eliminar notas
  const handleEliminarNotas = async () => {
    if (!cliente || !session?.accessToken) return;
    setIsPublishing(true);

    const payload = { ...cliente, notes: "" };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("No se pudieron eliminar las notas.");

      let updatedCliente: Customer;
      try {
        updatedCliente = await res.json();
      } catch {
        updatedCliente = { ...cliente, notes: "" };
      }

      setCliente(updatedCliente);
      setNotas("");
      toast.success("¡Notas eliminadas con éxito!");
    } catch {
      toast.error("Error al eliminar las notas.");
    } finally {
      setIsPublishing(false);
    }
  };

  // 🔹 Calcular total orden (Usando 'qty')
  const calculateTotal = (items: Item[]) =>
    items.reduce(
      // Usamos i.qty en lugar de i.quantity
      (sum, i) => sum + (i.product?.price ?? 0) * (i.qty ?? 0), 
      0
    );

  // 🔹 Loading
  if (loading) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
         <ListOrdered className="animate-spin h-12 w-12 text-primary" />
        <p className="mt-4 text-foreground/70">Cargando cliente y historial...</p>
      </div>
    );
  }

  // 🔹 Error
  if (error) {
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

  if (!cliente) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
        <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
        <Link href={PATHROUTES.pymes.clientes} className="mt-4">
          <Button>Volver a la lista</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-background">
      {/* Header MODIFICADO: Botón a la izquierda y título de página */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={PATHROUTES.pymes.clientes}>
          <Button variant="outline" className="px-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Detalles de Cliente</h1>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información de contacto - Ahora con el nombre, sin correo repetido */}
        <Card isClickable={false} className="p-4 space-y-3">
          <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
            <div className="bg-primary/10 p-2 rounded-full flex items-center justify-center w-10 h-10 shrink-0">
                <User className="w-6 h-6 text-primary" /> {/* Icono de Cliente */}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground truncate">{cliente.name}</h2>
              {/* ❌ Línea de correo eliminada para evitar redundancia: <p className="text-sm text-foreground/70">{cliente.email}</p> */}
            </div>
          </div>

          <h3 className="text-lg font-semibold">Datos de Contacto</h3>
          
          <p className="flex items-center gap-2 text-sm text-foreground/80">
            <Phone className="w-4 h-4 text-primary" /> {cliente.phone || "N/A"}
          </p>
          {/* ✅ Se mantiene aquí, es su lugar principal */}
          <p className="flex items-center gap-2 text-sm text-foreground/80">
            <Mail className="w-4 h-4 text-primary" /> {cliente.email || "N/A"}
          </p>
          <p className="text-sm text-foreground/60 pt-2 border-t border-border mt-3">
            Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()} <br />
            <span className="italic">
              ({calcularAntiguedad(cliente.memberSince)})
            </span>
          </p>
        </Card>

        {/* Historial compras */}
        <Card isClickable={false} className="lg:col-span-2 p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Historial de compras
          </h2>
          {orders.length === 0 ? (
            <p className="text-foreground/60 text-sm">
              Este cliente no tiene compras registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Productos</th>
                    <th className="p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    // Usamos order.issuedAt para la fecha
                    const orderDate = new Date(order.issuedAt); 
                    const isValidDate = order.issuedAt && !isNaN(orderDate.getTime());
                    
                    return (
                      <tr key={order.id} className="border-b border-border">
                        <td className="p-3">
                          <Calendar className="inline h-4 w-4 mr-1 text-primary/70" />
                          {/* Muestra la fecha o un mensaje si es inválida */}
                          {isValidDate ? orderDate.toLocaleDateString() : "Fecha no válida"}
                        </td>
                        <td className="p-3">
                          {order.items.length > 0
                            ? order.items
                                .map(
                                  // Usamos i.qty para la cantidad
                                  (i) =>
                                    `${i.product?.name || "Producto desconocido"} (${i.qty ?? 0})` 
                                )
                                .join(", ")
                            : "N/A"}
                        </td>
                        <td className="p-3 font-semibold flex items-center gap-1 text-green-600">
                          <DollarSign className="h-4 w-4" />
                          ${calculateTotal(order.items).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Notas internas */}
      <Card isClickable={false} className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Observaciones internas</h2>

        <textarea
          className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          rows={4}
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Añade notas importantes sobre este cliente..."
        />

        <div className="flex justify-end gap-2">
          <Button
            onClick={handleGuardarNotas}
            disabled={isPublishing || !notas.trim()}
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Guardar
              </>
            )}
          </Button>
          <Button
            onClick={handleEliminarNotas}
            variant="danger"
            disabled={!cliente.notes}
          >
            <Trash2 className="h-4 w-4" /> Eliminar
          </Button>
        </div>

        {cliente.notes && (
          <div className="border-t border-border pt-4">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-primary" /> Observaciones publicada
            </h3>
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">
              {cliente.notes}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}