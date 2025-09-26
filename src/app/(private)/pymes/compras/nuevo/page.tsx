"use client";

import { useState, useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { PATHROUTES } from "@/constants/pathroutes";

// Interfaces
interface Supplier {
  id: string;
  name: string;
}

interface Product {
  id: string;
  name: string;
  price: number;
}

export default function NuevaCompraPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedSupplier, setSelectedSupplier] = useState<string>("");
  const [selectedProducts, setSelectedProducts] = useState<
    { productId: string; quantity: number }[]
  >([]);

  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fechaFactura, setFechaFactura] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");

  const [currentProduct, setCurrentProduct] = useState({
    productId: "",
    quantity: 1,
  });

  useEffect(() => {
    async function fetchData() {

      if (status !== "authenticated" || !session) {
        setIsInitialLoading(false);
        return;
      }
     

      setIsInitialLoading(true);
      try {
        const companyId = session.user?.companyId;
        const token = session.accessToken;

        if (!companyId || !token) {
          setError("Faltan datos de sesión. Por favor, inicia sesión de nuevo.");
          setIsInitialLoading(false);
          return;
        }

        const [supRes, prodRes] = await Promise.all([
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
          fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`,
            { headers: { Authorization: `Bearer ${token}` } }
          ),
        ]);

        if (!supRes.ok) throw new Error("Error al cargar los proveedores.");
        if (!prodRes.ok) throw new Error("Error al cargar los productos.");

        const supData: Supplier[] = await supRes.json();
        const prodData: Product[] = await prodRes.json();

        setSuppliers(supData);
        setProducts(prodData);

        if (supData.length > 0) setSelectedSupplier(supData[0].id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido.");
        toast.error("Hubo un error al cargar los datos.");
      } finally {
        setIsInitialLoading(false);
      }
    }

    fetchData();
  }, [session, status]);

  const handleCurrentProductChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setCurrentProduct((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddProduct = () => {
    if (currentProduct.productId && currentProduct.quantity > 0) {
      const productExists = selectedProducts.some(
        (p) => p.productId === currentProduct.productId
      );
      if (productExists) {
        toast.error("Este producto ya ha sido añadido.");
        return;
      }
      setSelectedProducts((prev) => [
        ...prev,
        { ...currentProduct, quantity: Number(currentProduct.quantity) },
      ]);
      setCurrentProduct({ productId: "", quantity: 1 });
    } else {
      toast.error("Selecciona un producto y una cantidad válida.");
    }
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
  };

  const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
  const totalPrice = selectedProducts.reduce((sum, p) => {
    const product = products.find((pr) => pr.id === p.productId);
    return sum + (product?.price ?? 0) * p.quantity;
  }, 0);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (status !== "authenticated" || !session) {
      toast.error("No estás autenticado.");
      return;
    }
    
    setIsSubmitting(true);
    const companyId = session.user?.companyId;
    const token = session.accessToken;

    if (!companyId || !token) {
      toast.error("Faltan datos de sesión.");
      setIsSubmitting(false);
      return;
    }

    if (!selectedSupplier || selectedProducts.length === 0 || !numeroFactura) {
      toast.error("Completa todos los campos obligatorios.");
      setIsSubmitting(false);
      return;
    }

    const payload = {
      date: fechaFactura + "T10:30:00Z",
      invoiceNumber: numeroFactura,
      companyId,
      supplierId: selectedSupplier,
      products: selectedProducts.map((p) => ({
        productId: p.productId,
        quantity: p.quantity,
      })),
    };

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Error al crear la compra");
      }

      toast.success("¡Compra creada con éxito!");
      router.push(PATHROUTES.pymes.compras);
    } catch (err) {
      console.error("Error:", err);
      toast.error(err instanceof Error ? err.message : "Error desconocido.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isInitialLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center mb-8">
        <Link href={PATHROUTES.pymes.compras}>
          <button className="inline-flex items-center justify-center h-9 w-9 mr-2 rounded-md hover:bg-accent">
            <ArrowLeft className="h-5 w-5" />
          </button>
        </Link>
        <h1 className="text-3xl font-bold">Nueva Compra</h1>
      </div>

      <div className="rounded-xl border bg-card shadow p-6 md:p-8">
        <form onSubmit={handleSave} className="grid grid-cols-1 gap-6">
          <div>
            <label htmlFor="numeroFactura" className="text-sm font-medium">
              Número de Factura
            </label>
            <input
              id="numeroFactura"
              name="numeroFactura"
              type="text"
              className="flex h-9 w-full rounded-md border px-3 py-1 mt-2"
              value={numeroFactura}
              onChange={(e) => setNumeroFactura(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="fechaFactura" className="text-sm font-medium">
              Fecha de Factura
            </label>
            <input
              id="fechaFactura"
              name="fechaFactura"
              type="date"
              className="flex h-9 w-full rounded-md border px-3 py-1 mt-2"
              value={fechaFactura}
              onChange={(e) => setFechaFactura(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="proveedor" className="text-sm font-medium">
              Proveedor
            </label>
            <select
              id="proveedor"
              name="supplierId"
              className="flex h-9 w-full rounded-md border px-3 py-1 mt-2"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
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

          <div className="col-span-1">
            <h3 className="text-lg font-semibold mb-2">Productos</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="text-sm font-medium">Producto</label>
                <select
                  name="productId"
                  className="flex h-9 w-full rounded-md border px-3 py-1 mt-2"
                  value={currentProduct.productId}
                  onChange={handleCurrentProductChange}
                >
                  <option value="" disabled>
                    Selecciona un producto
                  </option>
                  {products.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Cantidad</label>
                <input
                  name="quantity"
                  type="number"
                  min="1"
                  className="flex h-9 w-full rounded-md border px-3 py-1 mt-2"
                  value={currentProduct.quantity}
                  onChange={handleCurrentProductChange}
                />
              </div>
              <div className="col-span-full flex items-end">
                <button
                  type="button"
                  onClick={handleAddProduct}
                  className="w-full bg-secondary text-secondary-foreground rounded-md h-9 px-4 py-2"
                >
                  Agregar
                </button>
              </div>
            </div>
            {selectedProducts.length > 0 && (
              <ul className="mt-4 border rounded-md p-4">
                {selectedProducts.map((p) => {
                  const details = products.find((pr) => pr.id === p.productId);
                  return (
                    <li
                      key={p.productId}
                      className="flex justify-between items-center py-2 border-b last:border-b-0"
                    >
                      <span>
                        {details?.name} ({p.quantity})
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveProduct(p.productId)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Quitar
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          <div className="col-span-full border-t pt-4 mt-6">
            <div className="flex justify-between mb-2">
              <p className="text-sm font-semibold">
                Cantidad total de productos:
              </p>
              <p className="font-semibold">{totalQuantity}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-lg font-bold">Total:</p>
              <p className="text-lg font-bold">${totalPrice.toFixed(2)}</p>
            </div>
          </div>

          <div className="col-span-full flex justify-end gap-4 mt-6">
            <Link href={PATHROUTES.pymes.compras}>
              <button
                type="button"
                className="border bg-background rounded-md h-9 px-4 py-2"
              >
                Cancelar
              </button>
            </Link>
            <button
              type="submit"
              disabled={isSubmitting || !selectedSupplier || totalQuantity === 0}
              className="bg-primary text-primary-foreground rounded-md h-9 px-4 py-2"
            >
              {isSubmitting ? "Guardando..." : "Crear Compra"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}