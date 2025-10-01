// "use client";

// import { useState, useEffect } from "react";
// import { useParams } from "next/navigation";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import {
//   ArrowLeft,
//   Loader2,
//   AlertTriangle,
//   DollarSign,
//   Calendar,
//   Tag,
//   ShoppingBag,
// } from "lucide-react";
// import Link from "next/link";
// import { PATHROUTES } from "@/constants/pathroutes";
// import { useSession } from "next-auth/react";

// // Tipos
// interface Order {
//   id: string;
//   date: string;
//   companyId: string;
//   supplierId: string;
//   products: { productId: string; quantity: number }[];
// }

// interface Supplier {
//   id: string;
//   name: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// export default function CompraDetalle() {
//   const params = useParams();
//   const { data: session } = useSession();
//   const orderId = params.id as string;

//   const [order, setOrder] = useState<Order | null>(null);
//   const [supplier, setSupplier] = useState<Supplier | null>(null);
//   const [productsDetails, setProductsDetails] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const fetchOrderDetails = async () => {
//       if (!session?.accessToken) {
//         setError("No se pudo autenticar la sesión.");
//         setLoading(false);
//         return;
//       }
//       setLoading(true);
//       try {
//         // 1. Obtener la orden
//         const orderRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`,
//           {
//             headers: { Authorization: `Bearer ${session.accessToken}` },
//           }
//         );
//         if (!orderRes.ok) throw new Error("Compra no encontrada.");
//         const orderData: Order = await orderRes.json();
//         setOrder(orderData);

//         // 2. Obtener proveedor (endpoint correcto)
//         const supplierRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/companies/${orderData.companyId}/suppliers/${orderData.supplierId}`,
//           { headers: { Authorization: `Bearer ${session.accessToken}` } }
//         );
//         if (!supplierRes.ok) throw new Error("Proveedor no encontrado.");
//         const supplierData: Supplier = await supplierRes.json();
//         setSupplier(supplierData);

//         // 3. Obtener detalles de productos
//         const productPromises = (orderData.products ?? []).map((p) =>
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${p.productId}`, {
//             headers: { Authorization: `Bearer ${session.accessToken}` },
//           }).then((res) => res.json())
//         );
//         const productsData: Product[] = await Promise.all(productPromises);
//         setProductsDetails(productsData);
//       } catch (err) {
//         setError(
//           err instanceof Error
//             ? err.message
//             : "Error desconocido al cargar los datos."
//         );
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (session && orderId) {
//       fetchOrderDetails();
//     }
//   }, [session, orderId]);

//   // ✅ Totales seguros aunque products esté vacío o undefined
//   const totalAmount =
//     (order?.products ?? []).reduce((sum, item) => {
//       const product = productsDetails.find((p) => p.id === item.productId);
//       return sum + (product?.price ?? 0) * item.quantity;
//     }, 0) || 0;

//   const totalQuantity =
//     (order?.products ?? []).reduce((sum, item) => sum + item.quantity, 0) || 0;

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando compra...</p>
//       </div>
//     );
//   }

//   if (error || !order) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//         <Link href={PATHROUTES.pymes.compras} className="mt-4">
//           <Button>Volver a la lista</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">
//             Detalle de Compra
//           </h2>
//           <p className="text-sm text-foreground/70">ID: {order.id}</p>
//         </div>
//         <Link href={PATHROUTES.pymes.compras}>
//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </Link>
//       </div>

//       <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
//         {/* Info compra */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <h2 className="text-lg font-semibold">Información de la Compra</h2>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Tag className="w-4 h-4 text-primary" /> Proveedor:{" "}
//             {supplier?.name || "Desconocido"}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <DollarSign className="w-4 h-4 text-primary" /> Total: $
//             {totalAmount.toFixed(2)}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             Productos: {totalQuantity}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Calendar className="w-4 h-4 text-primary" /> Fecha:{" "}
//             {new Date(order.date).toLocaleDateString()}
//           </p>
//         </Card>

//         {/* Productos */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <h2 className="text-lg font-semibold flex items-center gap-2">
//             <ShoppingBag className="h-5 w-5" /> Productos
//           </h2>
//           <div className="space-y-2">
//             {(order?.products ?? []).map((item) => {
//               const product = productsDetails.find(
//                 (p) => p.id === item.productId
//               );
//               return (
//                 <div
//                   key={item.productId}
//                   className="flex justify-between items-center text-sm text-foreground/80 border-b border-border last:border-b-0 py-2"
//                 >
//                   <span className="font-medium">
//                     {product?.name || "Producto desconocido"}
//                   </span>
//                   <span className="text-xs text-foreground/60">
//                     Cantidad: {item.quantity}
//                   </span>
//                   <span className="font-semibold">
//                     ${((product?.price ?? 0) * item.quantity).toFixed(2)}
//                   </span>
//                 </div>
//               );
//             })}
//           </div>
//         </Card>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useMemo } from "react";
// import { useParams } from "next/navigation";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import {
//   ArrowLeft,
//   Loader2,
//   AlertTriangle,
//   DollarSign,
//   Calendar,
//   Package,
//   ShoppingBag,
// } from "lucide-react";
// import Link from "next/link";
// import { PATHROUTES } from "@/constants/pathroutes";
// import { useSession } from "next-auth/react";
// import { toast } from "react-hot-toast";

// // Tipos
// interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// interface Item {
//   productId: string;
//   quantity: number;
//   product?: Product;
// }

// interface Order {
//   id: string;
//   date: string;
//   items: Item[];
//   total: number;
// }

// export default function ClienteDetalle() {
//   const params = useParams();
//   const { data: session } = useSession();
//   const customerId = params.id as string;

//   const [customer, setCustomer] = useState<Customer | null>(null);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   // 🔹 Cargar detalles del cliente + historial de compras
//   useEffect(() => {
//     const fetchData = async () => {
//       if (!session?.accessToken) {
//         setError("No se pudo autenticar la sesión.");
//         setLoading(false);
//         return;
//       }
//       setLoading(true);

//       try {
//         // 1. Cliente
//         const customerRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/customers/${customerId}`,
//           { headers: { Authorization: `Bearer ${session.accessToken}` } }
//         );
//         if (!customerRes.ok) throw new Error("Cliente no encontrado.");
//         const customerData: Customer = await customerRes.json();
//         setCustomer(customerData);

//         // 2. Productos (para enriquecer pedidos)
//         const productsRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//           { headers: { Authorization: `Bearer ${session.accessToken}` } }
//         );
//         const productsData: Product[] = await productsRes.json();
//         setProducts(productsData);

//         // 3. Órdenes del cliente
//         const ordersRes = await fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/orders/customer/${customerId}`,
//           { headers: { Authorization: `Bearer ${session.accessToken}` } }
//         );
//         if (!ordersRes.ok) throw new Error("No se pudieron cargar las compras.");
//         const ordersData: Order[] = await ordersRes.json();

//         // Enriquecer con productos
//         const enrichedOrders = ordersData.map((order) => ({
//           ...order,
//           items: order.items.map((item) => ({
//             ...item,
//             product: productsData.find((p) => p.id === item.productId),
//           })),
//           total: order.items.reduce(
//             (sum, i) => sum + (productsData.find((p) => p.id === i.productId)?.price ?? 0) * i.quantity,
//             0
//           ),
//         }));

//         setOrders(enrichedOrders);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//         toast.error("Hubo un error al cargar los datos.");
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (session && customerId) fetchData();
//   }, [session, customerId]);

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando cliente...</p>
//       </div>
//     );
//   }

//   if (error || !customer) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4">
//           <Button>Volver a la lista</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">{customer.name}</h2>
//           <p className="text-sm text-foreground/70">ID: {customer.id}</p>
//         </div>
//         <Link href={PATHROUTES.pymes.clientes}>
//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </Link>
//       </div>

//       {/* Info del cliente */}
//       <Card isClickable={false} className="p-4 space-y-2">
//         <h2 className="text-lg font-semibold">Información del Cliente</h2>
//         <p>Email: {customer.email || "No especificado"}</p>
//         <p>Teléfono: {customer.phone || "No especificado"}</p>
//       </Card>

//       {/* Historial de compras */}
//       <Card isClickable={false} className="p-4 space-y-4">
//         <h2 className="text-lg font-semibold flex items-center gap-2">
//           <ShoppingBag className="h-5 w-5" /> Historial de Compras
//         </h2>

//         {orders.length === 0 ? (
//           <p className="text-sm text-foreground/60">Este cliente no tiene compras registradas.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="w-full text-left">
//               <thead className="bg-background border-b border-border">
//                 <tr>
//                   <th className="p-3 font-semibold">Fecha</th>
//                   <th className="p-3 font-semibold">Productos</th>
//                   <th className="p-3 font-semibold">Total</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {orders.map((order) => (
//                   <tr key={order.id} className="border-b border-border hover:bg-background">
//                     <td className="p-3">
//                       <Calendar className="inline h-4 w-4 mr-1" />
//                       {new Date(order.date).toLocaleDateString()}
//                     </td>
//                     <td className="p-3">
//                       {order.items.map((i) => `${i.product?.name || "Producto"} (${i.quantity})`).join(", ")}
//                     </td>
//                     <td className="p-3 font-semibold flex items-center gap-1">
//                       <DollarSign className="h-4 w-4" /> ${order.total.toFixed(2)}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }


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
