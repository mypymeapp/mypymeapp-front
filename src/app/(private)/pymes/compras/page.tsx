"use client";

import { ListOrdered } from "lucide-react"; // 👈 usa el icono que te gusta
import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  PlusCircle,
  Loader2,
  AlertTriangle,
  LayoutGrid,
  List,
  Search,
  Truck, // Usado prominentemente en la tarjeta
  DollarSign, // Usado para el precio total
  Package, // Usado para los productos
  Edit,
  Trash2,
} from "lucide-react";
import { PATHROUTES } from "@/constants/pathroutes";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";


// Tipos
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
interface Supplier {
  id: string;
  name: string;
}
interface Order {
  id: string;
  date: string;
  supplier: Supplier;
  items: Item[];
}

type ViewMode = "cards" | "list";

export default function ComprasPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchTerm, setSearchTerm] = useState("");

  // 🔹 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // 🔹 Cargar productos del inventario
  const fetchProducts = useCallback(async () => {
    if (!session?.user?.companyId || !session.accessToken) return [];

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );
      if (!res.ok) throw new Error("Error al cargar productos del inventario");
      const data: Product[] = await res.json();
      return data;
    } catch (err) {
      console.error(err);
      toast.error("No se pudieron cargar los productos");
      return [];
    }
  }, [session]);

  // 🔹 Cargar órdenes y cruzar con productos
  const fetchData = useCallback(async () => {
    if (status !== "authenticated" || !session) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const companyId = session.user?.companyId;
      const token = session.accessToken;

      if (!companyId || !token) {
        setError("Faltan datos de sesión. Por favor, inicia sesión de nuevo.");
        setIsLoading(false);
        return;
      }

      // 1. Traer productos
      const inventoryProducts = await fetchProducts();
      setProducts(inventoryProducts);

      // 2. Traer órdenes
      const ordersRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!ordersRes.ok) {
        if (ordersRes.status === 404) {
          setOrders([]);
          return;
        }
        const errorData = await ordersRes.json();
        throw new Error(errorData.message || "Error al cargar compras.");
      }

      const ordersData: Order[] = await ordersRes.json();

      // 3. Enriquecer cada item con su producto
      const enrichedOrders = ordersData.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          product: inventoryProducts.find((p) => p.id === item.productId),
        })),
      }));

      setOrders(enrichedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido.");
      toast.error("Hubo un error al cargar las compras.");
    } finally {
      setIsLoading(false);
    }
  }, [session, status, fetchProducts]);

  useEffect(() => {
    if (session?.user?.companyId) {
      fetchData();
    }
  }, [session, fetchData]);

  // 🔹 Helpers
  const calculateTotalPrice = (items: Item[]) =>
    items.reduce((sum, item) => sum + (item.product?.price ?? 0) * item.quantity, 0);

  const getProductDetails = (items: Item[]) =>
    items.map((i) => `${i.product?.name || "Producto"} (${i.quantity})`).join(", ");

  const filteredOrders = useMemo(() => {
    return orders.filter(
      (o) =>
        o.supplier?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        o.items.some((i) =>
          i.product?.name?.toLowerCase().includes(searchTerm.toLowerCase())
        )
    );
  }, [orders, searchTerm]);

  // 🔹 Paginación
  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleOrders = filteredOrders.slice(startIndex, endIndex);


  const handleDelete = async (id: string) => {
    if (!session?.accessToken) {
      toast.error("Sesión no válida.");
      return;
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });

      if (!res.ok) throw new Error("No se pudo eliminar la compra.");

      setOrders((prev) => prev.filter((o) => o.id !== id));
      toast.success("¡Compra eliminada con éxito!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Error al eliminar");
    }
  };

  const confirmDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>¿Seguro que quieres eliminar esta compra?</p>
        <div className="flex gap-2">
          <Button
            variant="danger"
            className="px-3 py-1 text-sm h-auto"
            onClick={() => {
              toast.dismiss(t.id);
              handleDelete(id);
            }}
          >
            Sí, eliminar
          </Button>
          <Button
            variant="outline"
            className="px-3 py-1 text-sm h-auto"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancelar
          </Button>
        </div>
      </div>
    ));
  };

  // if (isLoading) {
  //   return (
  //     <div className="p-8 h-full flex flex-col justify-center items-center">
  //       <Loader2 className="animate-spin h-12 w-12 text-primary" />
  //       <p className="mt-4 text-foreground/70">Cargando compras...</p>
  //     </div>
  //   );
  // }
  if (isLoading) {
  return (
    <div className="p-8 h-full flex flex-col justify-center items-center">
      <ListOrdered className="animate-spin h-12 w-12 text-primary" /> {/* 👈 aquí lo cambié */}
      <p className="mt-4 text-foreground/70">Cargando compras...</p>
    </div>
  );
}

  if (error) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4 font-bold text-lg">Error al cargar compras</p>
        <p className="text-foreground/70">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">

    

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Compras</h1>
        <Link href={PATHROUTES.pymes.compras_nuevo}>
          <Button>
            <PlusCircle className="mr-2 h-5 w-5" />
            Nueva Compra
          </Button>
        </Link>
      </div>

      {/* Buscador + view mode */}
      <Card isClickable={false} className="mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Buscar por proveedor o producto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
            <button
              onClick={() => setViewMode("cards")}
              className={`p-2 rounded ${
                viewMode === "cards" ? "bg-primary text-button-text" : ""
              }`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list" ? "bg-primary text-button-text" : ""
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Card>

      {orders.length === 0 ? (
        <Card isClickable={false}>
          <div className="text-center py-12">
            <Truck className="mx-auto h-12 w-12 text-foreground/30" />
            <h3 className="mt-2 text-xl font-semibold">
              No tienes compras registradas
            </h3>
            <p className="mt-1 text-sm text-foreground/60">
              Empieza a añadir compras para gestionar tu inventario.
            </p>
            <Link
              href={PATHROUTES.pymes.compras_nuevo}
              className="mt-6 inline-block"
            >
              <Button>Añadir tu primera compra</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {viewMode === "cards" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visibleOrders.map((order) => (
                <Card 
                  key={order.id} 
                  className="flex flex-col h-full hover:shadow-lg transition-shadow"
                  isClickable={false} // La tarjeta no es clickeable
                >
                  
                  {/* Contenido principal (Visual/Informativo) */}
                  {/* **SE ELIMINÓ EL LINK EXTERNO** */}
                  <div className="flex-grow p-4 space-y-3"> 
                    
                    {/* Header con Icono y Proveedor */}
                    <div className="flex items-center gap-3">
                      <div className="bg-primary/10 p-2 rounded-full flex items-center justify-center w-10 h-10 flex-shrink-0">
                        <Truck className="h-6 w-6 text-primary" /> {/* Icono de camión prominente */}
                      </div>
                      <div>
                        <h2 className="font-bold text-lg text-foreground truncate">{order.supplier?.name}</h2>
                        <p className="text-xs text-foreground/60">
                            Fecha: {new Date(order.date).toLocaleDateString()} {/* Fecha más pequeña abajo */}
                        </p>
                      </div>
                    </div>

                    {/* Información Financiera y Productos (Key Info) */}
                    <div className="space-y-1 text-sm pt-3">
                      {/* Precio Total Grande y Destacado */}
                      <p className="flex items-center gap-2 font-bold text-xl text-primary">
                        <DollarSign className="w-5 h-5 flex-shrink-0" />
                        ${calculateTotalPrice(order.items).toFixed(2)}
                      </p>
                      {/* Detalles de Productos */}
                      <p className="flex items-start gap-2 text-foreground/80 mt-2 line-clamp-2"> 
                          <Package className="w-4 h-4 text-primary/70 flex-shrink-0 mt-1" /> 
                          <span className="truncate">{getProductDetails(order.items)}</span>
                      </p>
                    </div>
                    
                  </div>
                  {/* Fin Contenido de la tarjeta */}

                  {/* Botones (Editar largo, Eliminar icono) - Acciones directas */}
                  <div className="flex gap-2 p-4 pt-0">
                    <Link
                      href={PATHROUTES.pymes.compras_editar(order.id)}
                      className="flex-grow" // Ocupa todo el espacio disponible
                      // Ya no se necesita e.stopPropagation() porque el padre (Card) no es un Link/botón.
                    >
                      <Button
                        variant="outline"
                        className="w-full" // Ocupa el 100% de su contenedor (flex-grow)
                      >
                        Editar
                      </Button>
                    </Link>
                    <Button
                      variant="danger"
                      className="flex-shrink-0 p-2 h-auto" // Botón de eliminar con icono, tamaño fijo
                      onClick={() => confirmDelete(order.id)}
                      // Ya no se necesita e.stopPropagation() porque el padre (Card) no es un Link/botón.
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="p-4 font-semibold">Fecha</th>
                    <th className="p-4 font-semibold">Proveedor</th>
                    <th className="p-4 font-semibold">Productos</th>
                    <th className="p-4 font-semibold">Total</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {visibleOrders.map((order) => (
                    <tr
                      key={order.id}
                      className="border-b border-border last:border-b-0 hover:bg-background"
                      // Mantenemos el onClick en la tabla para ir a detalles en la vista de lista
                      onClick={() => router.push(PATHROUTES.pymes.compras_detalle(order.id))}
                      role="button"
                      tabIndex={0}
                    >
                      <td className="p-4">
                        {new Date(order.date).toLocaleDateString()}
                      </td>
                      <td className="p-4 font-medium text-primary">{order.supplier?.name}</td>
                      <td className="p-4">{getProductDetails(order.items)}</td>
                      <td className="p-4 font-semibold">${calculateTotalPrice(order.items).toFixed(2)}</td>
                      {/* 🔹 Botones editar / eliminar en la vista de lista */}
                      <td className="p-4 text-right flex gap-2 justify-end">
                          {/* Botón Editar (outline, icono) */}
                          <Link 
                            href={PATHROUTES.pymes.compras_editar(order.id)} 
                            onClick={(e) => e.stopPropagation()} // Necesario para evitar que el clic active la navegación de la fila (tr)
                          >
                            <Button variant="outline" className="p-2 h-auto">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          {/* Botón Eliminar (danger, icono) */}
                          <Button
                            variant="danger"
                            onClick={(e) => {
                              e.stopPropagation(); // Necesario para evitar que el clic active la navegación de la fila (tr)
                              confirmDelete(order.id);
                            }}
                            className="p-2 h-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Navegación de paginación */}
          <div className="flex justify-center items-center gap-4 mt-8">
            <Button
              onClick={() => setCurrentPage((p) => p - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              onClick={() => setCurrentPage((p) => p + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </>
      )}
    </div>
  );
}

