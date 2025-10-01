"use client";

import { ListOrdered } from "lucide-react"; 
import { useState, useEffect } from "react";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { PATHROUTES } from "@/constants/pathroutes";

// 🟢 UI Components
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";

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

        setSelectedSupplier(orderData.supplierId);
        setFechaFactura(orderData.date.split("T")[0]);
        setInvoiceNumber(orderData.invoiceNumber);

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

  const totalQuantity = selectedProducts.reduce((s, p) => s + p.quantity, 0);
  const totalPrice = selectedProducts.reduce(
    (s, p) => s + (p.product?.price ?? 0) * p.quantity,
    0
  );

  // if (isLoading)
  //   return (
  //     <div className="p-8 h-full flex justify-center items-center">
  //       <Loader2 className="animate-spin h-8 w-8 text-primary" />
  //     </div>
  //   );
  if (isLoading) {
  return (
    <div className="p-8 h-full flex flex-col justify-center items-center">
      <ListOrdered className="animate-spin h-12 w-12 text-primary" /> {/* 👈 aquí lo cambié */}
      <p className="mt-4 text-foreground/70">Cargando compras...</p>
    </div>
  );
}

  if (error) return <p className="p-8 text-red-500">Error: {error}</p>;

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={PATHROUTES.pymes.compras}>
          <Button variant="outline" className="px-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Editar Compra</h1>
      </div>

      <Card isClickable={false}>
        <form onSubmit={handleUpdate} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Input
              id="fechaFactura"
              label="Fecha de Factura"
              type="date"
              value={fechaFactura}
              onChange={(e) => setFechaFactura(e.target.value)}
              required
            />
            <Input
              id="invoiceNumber"
              label="Número de Factura"
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
              required
            />

            <Select
              id="supplier"
              label="Proveedor"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              required
            >
              <option value="">Selecciona un proveedor</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>

          {/* Productos */}
          <div>
            <h3 className="font-semibold mb-2">Productos</h3>
            {selectedProducts.length > 0 && (
              <ul className="space-y-4 mb-6">
                {selectedProducts.map((p, index) => (
                  <li key={p.productId + index} className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    <Select
                      id={`product-${index}`}
                      label="Producto"
                      value={p.productId}
                      onChange={(e) => {
                        const newProducts = [...selectedProducts];
                        newProducts[index].productId = e.target.value;
                        newProducts[index].product = products.find(
                          (prod) => prod.id === e.target.value
                        );
                        setSelectedProducts(newProducts);
                      }}
                    >
                      {products.map((prod) => (
                        <option key={prod.id} value={prod.id}>
                          {prod.name}
                        </option>
                      ))}
                    </Select>

                    <Input
                      id={`quantity-${index}`}
                      label="Cantidad"
                      type="number"
                      min={1}
                      value={p.quantity}
                      onChange={(e) => {
                        const newProducts = [...selectedProducts];
                        newProducts[index].quantity = Number(e.target.value);
                        setSelectedProducts(newProducts);
                      }}
                    />

                    {p.product && (
                      <div className="text-right font-semibold pt-6">
                        ${(p.product.price * p.quantity).toFixed(2)}
                      </div>
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
          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Guardando..." : "Actualizar Compra"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}



