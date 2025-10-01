"use client";


import { useState, useEffect } from "react";
import { ArrowLeft, Plus, X, Package, DollarSign, ListOrdered } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { useSession } from "next-auth/react";
import { PATHROUTES } from "@/constants/pathroutes";

// 🚨 COMPONENTES DE UI REQUERIDOS PARA EL ASPECTO IDÉNTICO
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input"; // Importado
import { Select } from '@/components/ui/Select'; // Importado

// Interfaces (Mantenidas de tu código original)
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

  // 1. Lógica de Carga de Datos (INTACTA)
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

  // 2. Lógica de Manejo de Estado y Productos (INTACTA)
  const handleCurrentProductChange = (
    // Esta función maneja los cambios de producto y cantidad, usa e.target.name
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


  // 3. Renderizado (ASPECTO IDÉNTICO AL PROVEEDOR NUEVO usando <Input> y <Select>)

  if (isInitialLoading) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <ListOrdered className="animate-spin h-12 w-12 text-primary" />
        <p className="mt-4 text-foreground/70">Cargando datos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      {/* 🔹 HEADER */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={PATHROUTES.pymes.compras}>
          <Button variant="outline" className="px-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Registrar Nueva Compra</h1>
      </div>

      {/* 🔹 CONTENIDO EN TARJETA (CARD) */}
      <Card isClickable={false}>
        <form onSubmit={handleSave} className="space-y-6">
          
          {/* 🔹 SECCIÓN 1: DATOS DE FACTURA Y PROVEEDOR (Grid de 2 columnas) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Número de Factura (Usando <Input>) */}
            <Input 
                id="numeroFactura" 
                label="Número de Factura" 
                value={numeroFactura} 
                onChange={(e) => setNumeroFactura(e.target.value)} 
                required 
            />
            
            {/* Fecha de Factura (Usando <Input>) */}
            <Input
                id="fechaFactura"
                label="Fecha de Factura"
                type="date"
                value={fechaFactura}
                onChange={(e) => setFechaFactura(e.target.value)}
                required
            />

            {/* Proveedor (Usando <Select>) */}
            <Select
              id="proveedor"
              label="Proveedor"
              value={selectedSupplier}
              onChange={(e) => setSelectedSupplier(e.target.value)}
              required
            >
              <option value="" disabled>Selecciona un proveedor</option>
              {suppliers.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </Select>
          </div>
          
          {/* 🔹 SECCIÓN 2: PRODUCTOS A COMPRAR */}
          <div className="space-y-4 pt-4 border-t border-border">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Package className="h-5 w-5 text-primary" /> Productos
            </h3>

            {/* Panel de Agregar Producto (Grid de 3 columnas) */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-dashed border-border rounded-lg bg-background/50">
              
              {/* Selector de Producto (Usando <Select>) */}
              <div className="md:col-span-2">
                <Select
                  id="currentProduct"
                  name="productId" // ⬅️ CRÍTICO: Mantiene el 'name' para handleCurrentProductChange
                  label="Producto"
                  value={currentProduct.productId}
                  onChange={handleCurrentProductChange} // ⬅️ LÓGICA INTACTA
                >
                  <option value="" disabled>Selecciona un producto</option>
                  {products
                      .filter(p => !selectedProducts.some(sp => sp.productId === p.id))
                      .map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </Select>
              </div>
              
              {/* Campo Cantidad (Usando <Input>) */}
              <div>
                <Input
                  id="currentQuantity"
                  name="quantity" // ⬅️ CRÍTICO: Mantiene el 'name' para handleCurrentProductChange
                  label="Cantidad"
                  type="number"
                  min="1"
                  value={currentProduct.quantity.toString()}
                  onChange={handleCurrentProductChange} // ⬅️ LÓGICA INTACTA
                />
              </div>

              {/* Botón Agregar */}
              <div className="col-span-full flex justify-end">
                <Button
                  type="button"
                  onClick={handleAddProduct}
                  variant="outline" // ✅ CORREGIDO: Cambiado de 'secondary' a 'outline'
                  disabled={!currentProduct.productId || currentProduct.quantity <= 0}
                >
                  <Plus className="h-4 w-4 mr-2" /> Agregar
                </Button>
              </div>
            </div>

            {/* Lista de Productos Seleccionados */}
            {selectedProducts.length > 0 && (
              <ul className="mt-4 border rounded-md divide-y divide-border bg-muted/20">
                {selectedProducts.map((p) => {
                  const details = products.find((pr) => pr.id === p.productId);
                  const lineTotal = (details?.price ?? 0) * p.quantity;
                  return (
                    <li
                      key={p.productId}
                      className="flex justify-between items-center py-3 px-4"
                    >
                      <span className="font-medium text-foreground">
                        {details?.name}
                      </span>
                      <span className="text-sm text-foreground/80">
                         {p.quantity} unid. - <span className="font-semibold">${lineTotal.toFixed(2)}</span>
                      </span>
                      <Button
                        type="button"
                        variant="outline" // ✅ CORREGIDO: Cambiado de 'ghost' a 'outline'
                        // size="icon"
                        onClick={() => handleRemoveProduct(p.productId)}
                        className="text-red-500 hover:bg-red-100 h-8 w-8"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* 🔹 SECCIÓN 3: TOTALES Y ACCIONES */}
          <div className="border-t pt-4 mt-6 space-y-3">
            <div className="flex justify-between">
              <p className="text-sm font-semibold flex items-center gap-2">
                <ListOrdered className="h-4 w-4" /> Cantidad total de artículos:
              </p>
              <p className="font-semibold">{totalQuantity}</p>
            </div>
            <div className="flex justify-between">
              <p className="text-lg font-bold flex items-center gap-2 text-primary">
                <DollarSign className="h-5 w-5" /> Total Estimado:
              </p>
              <p className="text-2xl font-extrabold text-primary">${totalPrice.toFixed(2)}</p>
            </div>
          </div>

          {/* 🔹 BOTONES FINALES */}
          <div className="flex justify-end gap-4 pt-4">
            <Link href={PATHROUTES.pymes.compras}>
              <Button variant="outline" type="button">
                Cancelar
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting || !selectedSupplier || totalQuantity === 0}
            >
              {isSubmitting ? "Guardando..." : "Crear Compra"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}