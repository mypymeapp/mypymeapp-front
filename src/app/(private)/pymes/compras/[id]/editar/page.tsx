"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { PATHROUTES } from "@/constants/pathroutes";

// Tipos
interface Supplier {
  id: string;
  name: string;
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
  invoiceNumber: string;
  supplierId: string;
  items: Item[];
}

export default function EditarCompraPage() {
  const { data: session, status } = useSession();
  const { id } = useParams();
  const router = useRouter();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState("");
  const [selectedProducts, setSelectedProducts] = useState<Item[]>([]);
  const [fechaFactura, setFechaFactura] = useState("");
  const [invoiceNumber, setInvoiceNumber] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (status !== "authenticated" || !session) return;

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const companyId = session.user?.companyId;
        const token = session.accessToken;
        if (!companyId || !token) throw new Error("Faltan datos de sesión.");

        // Cargar proveedores, productos e información de la orden
        const [supRes, prodRes, orderRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!supRes.ok) throw new Error("Error cargando proveedores.");
        if (!prodRes.ok) throw new Error("Error cargando productos.");
        if (!orderRes.ok) throw new Error("Error cargando orden.");

        const supData: Supplier[] = await supRes.json();
        const prodData: Product[] = await prodRes.json();
        const orderData: Order = await orderRes.json();

        setSuppliers(supData);
        setProducts(prodData);

        // Prellenar datos de la orden
        setSelectedSupplier(orderData.supplierId);
        setFechaFactura(orderData.date.split("T")[0]);
        setInvoiceNumber(orderData.invoiceNumber);

        // Normalizar items con información del producto
        setSelectedProducts(
          (orderData.items || []).map((item) => ({
            ...item,
            product: prodData.find((p) => p.id === item.productId),
          }))
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [session, status, id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = session?.accessToken;
      if (!token) throw new Error("No autenticado");

      const payload = {
        date: fechaFactura + "T10:30:00Z",
        invoiceNumber,
        supplierId: selectedSupplier,
        products: selectedProducts.map((p) => ({
          productId: p.productId,
          quantity: p.quantity,
        })),
      };

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al actualizar la orden.");
      }

      toast.success("Orden actualizada con éxito.");
      router.push(PATHROUTES.pymes.compras);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
  };

  const totalQuantity = selectedProducts.reduce((s, p) => s + p.quantity, 0);
  const totalPrice = selectedProducts.reduce(
    (s, p) => s + (p.product?.price ?? 0) * p.quantity,
    0
  );

  if (isLoading) return <p className="p-8">Cargando...</p>;
  if (error) return <p className="p-8 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center mb-8">
        <Link href={PATHROUTES.pymes.compras}>
          <button className="mr-2 h-9 w-9 flex items-center justify-center rounded-md border hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <h1 className="text-3xl font-bold">Editar Compra</h1>
      </div>

      <div className="rounded-xl border bg-card shadow p-6">
        <form onSubmit={handleUpdate} className="grid gap-6">
          {/* Fecha */}
          <div>
            <label className="block text-sm font-medium">Fecha de factura</label>
            <input
              type="date"
              value={fechaFactura}
              onChange={(e) => setFechaFactura(e.target.value)}
              className="mt-2 w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Número de factura */}
          <div>
            <label className="block text-sm font-medium">Número de factura</label>
            <input
              type="text"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              className="mt-2 w-full border rounded px-3 py-2"
              required
            />
          </div>

          {/* Proveedor */}
          <div>
            <label className="block text-sm font-medium">Proveedor</label>
            <select
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              className="mt-2 w-full border rounded px-3 py-2"
              required
            >
              <option value="" disabled>
                Selecciona un proveedor
              </option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-semibold mb-2">Productos</h3>
            {selectedProducts.length > 0 && (
              <ul className="space-y-4 mb-6">
                {selectedProducts.map((p, index) => (
                  <li key={p.productId + index} className="flex gap-4 items-center">
                    <select
                      value={p.productId}
                      onChange={(e) => {
                        const newProducts = [...selectedProducts];
                        newProducts[index].productId = e.target.value;
                        newProducts[index].product = products.find(
                          (prod) => prod.id === e.target.value
                        );
                        setSelectedProducts(newProducts);
                      }}
                      className="border rounded px-2 py-1"
                    >
                      {products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      value={p.quantity}
                      min={1}
                      onChange={(e) => {
                        const newProducts = [...selectedProducts];
                        newProducts[index].quantity = Number(e.target.value);
                        setSelectedProducts(newProducts);
                      }}
                      className="w-20 border rounded px-2 py-1"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveProduct(p.productId)}
                      className="text-red-500 hover:text-red-700"
                    >
                      Quitar
                    </button>
                    {p.product && (
                      <span className="ml-auto">
                        ${(p.product.price * p.quantity).toFixed(2)}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Totales */}
          <div className="border-t pt-4 flex justify-between font-semibold">
            <span>Total productos: {totalQuantity}</span>
            <span>Total: ${totalPrice.toFixed(2)}</span>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-4">
            <Link href={PATHROUTES.pymes.compras}>
              <button type="button" className="px-4 py-2 border rounded">
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-primary text-white rounded"
            >
              {isSubmitting ? "Guardando..." : "Actualizar Compra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}



