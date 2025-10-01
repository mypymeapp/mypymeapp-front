// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // Interfaces
// interface Supplier {
//   id: string;
//   name: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// export default function NuevaCompraPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState<string>("");
//   const [selectedProducts, setSelectedProducts] = useState<
//     { productId: string; quantity: number }[]
//   >([]);

//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [numeroFactura, setNumeroFactura] = useState("");

//   const [currentProduct, setCurrentProduct] = useState({
//     productId: "",
//     quantity: 1,
//   });

//   useEffect(() => {
//     async function fetchData() {

//       if (status !== "authenticated" || !session) {
//         setIsInitialLoading(false);
//         return;
//       }
     

//       setIsInitialLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;

//         if (!companyId || !token) {
//           setError("Faltan datos de sesión. Por favor, inicia sesión de nuevo.");
//           setIsInitialLoading(false);
//           return;
//         }

//         const [supRes, prodRes] = await Promise.all([
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar los proveedores.");
//         if (!prodRes.ok) throw new Error("Error al cargar los productos.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         if (supData.length > 0) setSelectedSupplier(supData[0].id);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//         toast.error("Hubo un error al cargar los datos.");
//       } finally {
//         setIsInitialLoading(false);
//       }
//     }

//     fetchData();
//   }, [session, status]);

//   const handleCurrentProductChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setCurrentProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddProduct = () => {
//     if (currentProduct.productId && currentProduct.quantity > 0) {
//       const productExists = selectedProducts.some(
//         (p) => p.productId === currentProduct.productId
//       );
//       if (productExists) {
//         toast.error("Este producto ya ha sido añadido.");
//         return;
//       }
//       setSelectedProducts((prev) => [
//         ...prev,
//         { ...currentProduct, quantity: Number(currentProduct.quantity) },
//       ]);
//       setCurrentProduct({ productId: "", quantity: 1 });
//     } else {
//       toast.error("Selecciona un producto y una cantidad válida.");
//     }
//   };

//   const handleRemoveProduct = (productId: string) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
//   };

//   const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce((sum, p) => {
//     const product = products.find((pr) => pr.id === p.productId);
//     return sum + (product?.price ?? 0) * p.quantity;
//   }, 0);

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (status !== "authenticated" || !session) {
//       toast.error("No estás autenticado.");
//       return;
//     }
    
//     setIsSubmitting(true);
//     const companyId = session.user?.companyId;
//     const token = session.accessToken;

//     if (!companyId || !token) {
//       toast.error("Faltan datos de sesión.");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!selectedSupplier || selectedProducts.length === 0 || !numeroFactura) {
//       toast.error("Completa todos los campos obligatorios.");
//       setIsSubmitting(false);
//       return;
//     }

//     const payload = {
//       date: fechaFactura + "T10:30:00Z",
//       invoiceNumber: numeroFactura,
//       companyId,
//       supplierId: selectedSupplier,
//       products: selectedProducts.map((p) => ({
//         productId: p.productId,
//         quantity: p.quantity,
//       })),
//     };

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al crear la compra");
//       }

//       toast.success("¡Compra creada con éxito!");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isInitialLoading) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p>Cargando datos...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex items-center justify-center h-screen">
//         <p className="text-red-500">Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex items-center mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           <button className="inline-flex items-center justify-center h-9 w-9 mr-2 rounded-md hover:bg-accent">
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//         </Link>
//         <h1 className="text-3xl font-bold">Nueva Compra</h1>
//       </div>

//       <div className="rounded-xl border bg-card shadow p-6 md:p-8">
//         <form onSubmit={handleSave} className="grid grid-cols-1 gap-6">
//           <div>
//             <label htmlFor="numeroFactura" className="text-sm font-medium">
//               Número de Factura
//             </label>
//             <input
//               id="numeroFactura"
//               name="numeroFactura"
//               type="text"
//               className="flex h-9 w-full rounded-md border px-3 py-1 mt-2"
//               value={numeroFactura}
//               onChange={(e) => setNumeroFactura(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="fechaFactura" className="text-sm font-medium">
//               Fecha de Factura
//             </label>
//             <input
//               id="fechaFactura"
//               name="fechaFactura"
//               type="date"
//               className="flex h-9 w-full rounded-md border px-3 py-1 mt-2"
//               value={fechaFactura}
//               onChange={(e) => setFechaFactura(e.target.value)}
//               required
//             />
//           </div>

//           <div>
//             <label htmlFor="proveedor" className="text-sm font-medium">
//               Proveedor
//             </label>
//             <select
//               id="proveedor"
//               name="supplierId"
//               className="flex h-9 w-full rounded-md border px-3 py-1 mt-2"
//               value={selectedSupplier}
//               onChange={(e) => setSelectedSupplier(e.target.value)}
//               required
//             >
//               <option value="" disabled>
//                 Selecciona un proveedor
//               </option>
//               {suppliers.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div className="col-span-1">
//             <h3 className="text-lg font-semibold mb-2">Productos</h3>
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               <div className="md:col-span-2">
//                 <label className="text-sm font-medium">Producto</label>
//                 <select
//                   name="productId"
//                   className="flex h-9 w-full rounded-md border px-3 py-1 mt-2"
//                   value={currentProduct.productId}
//                   onChange={handleCurrentProductChange}
//                 >
//                   <option value="" disabled>
//                     Selecciona un producto
//                   </option>
//                   {products.map((p) => (
//                     <option key={p.id} value={p.id}>
//                       {p.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//               <div>
//                 <label className="text-sm font-medium">Cantidad</label>
//                 <input
//                   name="quantity"
//                   type="number"
//                   min="1"
//                   className="flex h-9 w-full rounded-md border px-3 py-1 mt-2"
//                   value={currentProduct.quantity}
//                   onChange={handleCurrentProductChange}
//                 />
//               </div>
//               <div className="col-span-full flex items-end">
//                 <button
//                   type="button"
//                   onClick={handleAddProduct}
//                   className="w-full bg-secondary text-secondary-foreground rounded-md h-9 px-4 py-2"
//                 >
//                   Agregar
//                 </button>
//               </div>
//             </div>
//             {selectedProducts.length > 0 && (
//               <ul className="mt-4 border rounded-md p-4">
//                 {selectedProducts.map((p) => {
//                   const details = products.find((pr) => pr.id === p.productId);
//                   return (
//                     <li
//                       key={p.productId}
//                       className="flex justify-between items-center py-2 border-b last:border-b-0"
//                     >
//                       <span>
//                         {details?.name} ({p.quantity})
//                       </span>
//                       <button
//                         type="button"
//                         onClick={() => handleRemoveProduct(p.productId)}
//                         className="text-red-500 hover:text-red-700"
//                       >
//                         Quitar
//                       </button>
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//           </div>

//           <div className="col-span-full border-t pt-4 mt-6">
//             <div className="flex justify-between mb-2">
//               <p className="text-sm font-semibold">
//                 Cantidad total de productos:
//               </p>
//               <p className="font-semibold">{totalQuantity}</p>
//             </div>
//             <div className="flex justify-between">
//               <p className="text-lg font-bold">Total:</p>
//               <p className="text-lg font-bold">${totalPrice.toFixed(2)}</p>
//             </div>
//           </div>

//           <div className="col-span-full flex justify-end gap-4 mt-6">
//             <Link href={PATHROUTES.pymes.compras}>
//               <button
//                 type="button"
//                 className="border bg-background rounded-md h-9 px-4 py-2"
//               >
//                 Cancelar
//               </button>
//             </Link>
//             <button
//               type="submit"
//               disabled={isSubmitting || !selectedSupplier || totalQuantity === 0}
//               className="bg-primary text-primary-foreground rounded-md h-9 px-4 py-2"
//             >
//               {isSubmitting ? "Guardando..." : "Crear Compra"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, Plus, X, Package, DollarSign, ListOrdered } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// // 🚨 CAMBIO CRÍTICO: Importar los componentes Input y Select reales
// import { Input } from "@/components/ui/Input"; 
// import { Select } from '@/components/ui/Select'; 

// // Interfaces
// interface Supplier {
//   id: string;
//   name: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// // ❌ Se eliminan los componentes simulados FormInput y FormSelect

// export default function NuevaCompraPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState<string>("");
//   const [selectedProducts, setSelectedProducts] = useState<
//     { productId: string; quantity: number }[]
//   >([]);

//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [fechaFactura, setFechaFactura] = useState(new Date().toISOString().substring(0, 10)); // Default to today
//   const [numeroFactura, setNumeroFactura] = useState("");

//   const [currentProduct, setCurrentProduct] = useState({
//     productId: "",
//     quantity: 1,
//   });

//   useEffect(() => {
//     async function fetchData() {

//       if (status !== "authenticated" || !session) {
//         setIsInitialLoading(false);
//         return;
//       }
     
//       setIsInitialLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;

//         if (!companyId || !token) {
//           setError("Faltan datos de sesión. Por favor, inicia sesión de nuevo.");
//           setIsInitialLoading(false);
//           return;
//         }

//         const [supRes, prodRes] = await Promise.all([
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar los proveedores.");
//         if (!prodRes.ok) throw new Error("Error al cargar los productos.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         // Intenta seleccionar el primer proveedor si existe y no hay uno ya seleccionado
//         if (supData.length > 0 && !selectedSupplier) setSelectedSupplier(supData[0].id);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//         toast.error("Hubo un error al cargar los datos iniciales.");
//       } finally {
//         setIsInitialLoading(false);
//       }
//     }

//     fetchData();
//   // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [session, status]); // Dependencias

//   const handleCurrentProductChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setCurrentProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddProduct = () => {
//     if (currentProduct.productId && Number(currentProduct.quantity) > 0) {
//       const productExists = selectedProducts.some(
//         (p) => p.productId === currentProduct.productId
//       );
//       if (productExists) {
//         toast.error("Este producto ya ha sido añadido. Por favor, edita la cantidad existente.");
//         return;
//       }
//       setSelectedProducts((prev) => [
//         ...prev,
//         { ...currentProduct, quantity: Number(currentProduct.quantity) },
//       ]);
//       // Resetear para añadir el siguiente
//       setCurrentProduct({ productId: "", quantity: 1 });
//     } else {
//       toast.error("Selecciona un producto y una cantidad válida.");
//     }
//   };

//   const handleRemoveProduct = (productId: string) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
//   };

//   // 🔹 Cálculos de Totales
//   const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce((sum, p) => {
//     const product = products.find((pr) => pr.id === p.productId);
//     return sum + (product?.price ?? 0) * p.quantity;
//   }, 0);

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (status !== "authenticated" || !session) {
//       toast.error("No estás autenticado.");
//       return;
//     }
    
//     setIsSubmitting(true);
//     const companyId = session.user?.companyId;
//     const token = session.accessToken;

//     if (!companyId || !token) {
//       toast.error("Faltan datos de sesión.");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!selectedSupplier || selectedProducts.length === 0 || !numeroFactura || !fechaFactura) {
//       toast.error("Completa todos los campos obligatorios y añade al menos un producto.");
//       setIsSubmitting(false);
//       return;
//     }

//     const payload = {
//       // Formato para la API: Fecha y hora (ej: "2024-05-20T10:30:00Z")
//       date: fechaFactura + "T12:00:00Z", 
//       invoiceNumber: numeroFactura,
//       companyId,
//       supplierId: selectedSupplier,
//       items: selectedProducts.map((p) => ({
//         productId: p.productId,
//         quantity: p.quantity,
//       })),
//     };

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al crear la compra");
//       }

//       toast.success("¡Compra creada y productos actualizados en inventario!");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isInitialLoading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <ListOrdered className="animate-pulse h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos de proveedores y productos...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative max-w-lg" role="alert">
//             <strong className="font-bold">Error de carga:</strong>
//             <span className="block sm:inline ml-2">{error}</span>
//         </div>
//         <p className="mt-4 text-foreground/70">Inténtalo de nuevo más tarde o revisa tu conexión.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       {/* 🔹 HEADER - Estilo Proveedor Nuevo */}
//       <div className="flex items-center gap-4 mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           <Button variant="outline" className="px-3">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold text-foreground">Registrar Nueva Compra</h1>
//       </div>

//       <Card isClickable={false}>
//         <form onSubmit={handleSave} className="space-y-8">
          
//           {/* 🔹 SECCIÓN 1: DATOS DE FACTURA Y PROVEEDOR (Grid de 2 columnas) */}
//           <h2 className="text-xl font-semibold border-b pb-2 text-primary">Detalles de la Compra</h2>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Número de Factura - USANDO COMPONENTE REAL <Input> */}
//             <Input
//               id="numeroFactura"
//               label="Número de Factura"
//               value={numeroFactura}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNumeroFactura(e.target.value)}
//               required
//             />
            
//             {/* Fecha de Factura - USANDO COMPONENTE REAL <Input> */}
//             <Input
//               id="fechaFactura"
//               label="Fecha de Factura"
//               type="date"
//               value={fechaFactura}
//               onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFechaFactura(e.target.value)}
//               required
//             />

//             {/* Proveedor - USANDO COMPONENTE REAL <Select> */}
//             <Select
//               id="selectedSupplier"
//               label="Proveedor"
//               value={selectedSupplier}
//               onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSelectedSupplier(e.target.value)}
//               required
//             >
//               <option value="" disabled>Selecciona un proveedor</option>
//               {suppliers.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </Select>
//           </div>
          
//           {/* 🔹 SECCIÓN 2: PRODUCTOS A COMPRAR (Ocupa 1 columna de ancho completo) */}
//           <div className="space-y-6 pt-4">
//             <h2 className="text-xl font-semibold border-b pb-2 text-primary">Productos Adquiridos</h2>

//             {/* Panel de Agregar Producto (Grid de 3 columnas) */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-dashed border-border rounded-lg bg-background/50">
//                 {/* Selector de Producto - USANDO COMPONENTE REAL <Select> */}
//                 <div className="md:col-span-2">
//                     <Select
//                         id="productId"
//                         label="Producto de Inventario"
//                         value={currentProduct.productId}
//                         onChange={handleCurrentProductChange}
//                         required={false}
//                     >
//                         <option value="" disabled>Selecciona un producto</option>
//                         {products
//                             .filter(p => !selectedProducts.some(sp => sp.productId === p.id)) // Solo productos no añadidos
//                             .map((p) => (
//                                 <option key={p.id} value={p.id}>
//                                     {p.name}
//                                 </option>
//                             ))}
//                     </Select>
//                 </div>
                
//                 {/* Campo Cantidad - USANDO COMPONENTE REAL <Input> */}
//                 <Input
//                     id="quantity"
//                     label="Cantidad"
//                     type="number"
//                     min="1"
//                     value={currentProduct.quantity}
//                     onChange={handleCurrentProductChange}
//                     required={false}
//                 />
                
//                 {/* Botón Agregar */}
//                 <div className="md:col-span-3 flex justify-end pt-2">
//                     <Button
//                         type="button"
//                         onClick={handleAddProduct}
//                         variant="secondary"
//                         disabled={!currentProduct.productId || Number(currentProduct.quantity) <= 0}
//                     >
//                         <Plus className="h-4 w-4 mr-2" /> Agregar Producto
//                     </Button>
//                 </div>
//             </div>

//             {/* Lista de Productos Seleccionados */}
//             {selectedProducts.length > 0 && (
//                 <div className="border rounded-lg bg-background shadow-inner">
//                     <ul className="divide-y divide-border">
//                         {selectedProducts.map((p) => {
//                             const details = products.find((pr) => pr.id === p.productId);
//                             const productPrice = details?.price ?? 0;
//                             const lineTotal = productPrice * p.quantity;
//                             return (
//                                 <li
//                                     key={p.productId}
//                                     className="flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
//                                 >
//                                     <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 flex-grow">
//                                         <span className="font-semibold text-foreground flex items-center gap-2 w-48 truncate">
//                                             <Package className="h-4 w-4 text-primary" /> {details?.name}
//                                         </span>
//                                         <span className="text-sm text-foreground/80">
//                                             <span className="font-medium">Cant:</span> {p.quantity}
//                                         </span>
//                                         <span className="text-sm text-foreground/80">
//                                             <span className="font-medium">Subtotal:</span> ${lineTotal.toFixed(2)}
//                                         </span>
//                                     </div>
//                                     <Button
//                                         type="button"
//                                         variant="danger"
//                                         size="icon"
//                                         onClick={() => handleRemoveProduct(p.productId)}
//                                         className="h-8 w-8 flex-shrink-0"
//                                     >
//                                         <X className="h-4 w-4" />
//                                     </Button>
//                                 </li>
//                             );
//                         })}
//                     </ul>
//                 </div>
//             )}
//           </div>


//           {/* 🔹 SECCIÓN 3: TOTALES Y ACCIONES */}
//           <div className="pt-4 border-t border-border mt-8">
//             <div className="flex justify-between items-center mb-4">
//               <p className="text-base font-semibold text-foreground/70 flex items-center gap-2">
//                 <ListOrdered className="h-5 w-5" /> Productos diferentes:
//               </p>
//               <p className="font-bold text-lg">{selectedProducts.length}</p>
//             </div>
//             <div className="flex justify-between items-center mb-6">
//               <p className="text-xl font-bold text-foreground flex items-center gap-2">
//                 <DollarSign className="h-6 w-6 text-primary" /> TOTAL ESTIMADO:
//               </p>
//               <p className="text-2xl font-extrabold text-primary">${totalPrice.toFixed(2)}</p>
//             </div>
//           </div>
          
//           <div className="flex justify-end gap-4 pt-4">
//             <Link href={PATHROUTES.pymes.compras}>
//               <Button type="button" variant="outline">
//                 Cancelar
//               </Button>
//             </Link>
//             <Button
//               type="submit"
//               disabled={isSubmitting || !selectedSupplier || totalQuantity === 0}
//             >
//               {isSubmitting ? "Guardando Compra..." : "Crear Compra"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, Plus, X, Package, DollarSign, ListOrdered } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // 🚨 Componentes de UI importados del formulario de Proveedor Nuevo
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";


// // Interfaces
// interface Supplier {
//   id: string;
//   name: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// export default function NuevaCompraPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState<string>("");
//   const [selectedProducts, setSelectedProducts] = useState<
//     { productId: string; quantity: number }[]
//   >([]);

//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [numeroFactura, setNumeroFactura] = useState("");

//   const [currentProduct, setCurrentProduct] = useState({
//     productId: "",
//     quantity: 1,
//   });

//   // 1. Lógica de Carga de Datos (INTACTA)
//   useEffect(() => {
//     async function fetchData() {

//       if (status !== "authenticated" || !session) {
//         setIsInitialLoading(false);
//         return;
//       }
     
//       setIsInitialLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;

//         if (!companyId || !token) {
//           setError("Faltan datos de sesión. Por favor, inicia sesión de nuevo.");
//           setIsInitialLoading(false);
//           return;
//         }

//         const [supRes, prodRes] = await Promise.all([
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar los proveedores.");
//         if (!prodRes.ok) throw new Error("Error al cargar los productos.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         if (supData.length > 0) setSelectedSupplier(supData[0].id);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//         toast.error("Hubo un error al cargar los datos.");
//       } finally {
//         setIsInitialLoading(false);
//       }
//     }

//     fetchData();
//   }, [session, status]);

//   // 2. Lógica de Manejo de Estado y Productos (INTACTA)
//   const handleCurrentProductChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     // Usamos el `name` y `value` del evento para actualizar el estado
//     const { name, value } = e.target;
//     setCurrentProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddProduct = () => {
//     if (currentProduct.productId && currentProduct.quantity > 0) {
//       const productExists = selectedProducts.some(
//         (p) => p.productId === currentProduct.productId
//       );
//       if (productExists) {
//         toast.error("Este producto ya ha sido añadido.");
//         return;
//       }
//       setSelectedProducts((prev) => [
//         ...prev,
//         { ...currentProduct, quantity: Number(currentProduct.quantity) },
//       ]);
//       setCurrentProduct({ productId: "", quantity: 1 });
//     } else {
//       toast.error("Selecciona un producto y una cantidad válida.");
//     }
//   };

//   const handleRemoveProduct = (productId: string) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
//   };

//   const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce((sum, p) => {
//     const product = products.find((pr) => pr.id === p.productId);
//     // Usamos el precio del producto * cantidad
//     return sum + (product?.price ?? 0) * p.quantity;
//   }, 0);

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (status !== "authenticated" || !session) {
//       toast.error("No estás autenticado.");
//       return;
//     }
    
//     setIsSubmitting(true);
//     const companyId = session.user?.companyId;
//     const token = session.accessToken;

//     if (!companyId || !token) {
//       toast.error("Faltan datos de sesión.");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!selectedSupplier || selectedProducts.length === 0 || !numeroFactura) {
//       toast.error("Completa todos los campos obligatorios.");
//       setIsSubmitting(false);
//       return;
//     }

//     // Nota: Usamos el campo `products` como estaba en tu código original,
//     // aunque en la respuesta anterior lo llamé 'items'. Lo dejamos como 'products'.
//     const payload = {
//       date: fechaFactura + "T10:30:00Z",
//       invoiceNumber: numeroFactura,
//       companyId,
//       supplierId: selectedSupplier,
//       products: selectedProducts.map((p) => ({
//         productId: p.productId,
//         quantity: p.quantity,
//       })),
//     };

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al crear la compra");
//       }

//       toast.success("¡Compra creada con éxito!");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   // 3. Renderizado (NUEVO ASPECTO + LÓGICA ANTIGUA)

//   if (isInitialLoading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <ListOrdered className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <p className="text-red-500">Error: {error}</p>
//       </div>
//     );
//   }

//   // 🚨 Estilos de los campos de formulario: He replicado las clases
//   // que usa tu componente `Input` (h-10, rounded-md, border, etc.)
//   // para que los campos nativos de HTML se vean como tus componentes de UI.
//   const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors mt-2";
//   const labelClass = "text-sm font-medium text-foreground";


//   return (
//     <div className="p-4 md:p-8">
//       {/* 🔹 HEADER - ESTILO PROVEEDOR NUEVO */}
//       <div className="flex items-center gap-4 mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           {/* Usamos el componente Button de tu UI */}
//           <Button variant="outline" className="px-3">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold text-foreground">Registrar Nueva Compra</h1>
//       </div>

//       {/* 🔹 CONTENIDO EN TARJETA (CARD) */}
//       <Card isClickable={false}>
//         <form onSubmit={handleSave} className="space-y-6">
          
//           {/* 🔹 SECCIÓN 1: DATOS DE FACTURA Y PROVEEDOR (Grid de 2 columnas) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Número de Factura */}
//             <div>
//               <label htmlFor="numeroFactura" className={labelClass}>Número de Factura</label>
//               <input
//                 id="numeroFactura"
//                 name="numeroFactura"
//                 type="text"
//                 className={inputClass}
//                 value={numeroFactura}
//                 onChange={(e) => setNumeroFactura(e.target.value)}
//                 required
//               />
//             </div>
            
//             {/* Fecha de Factura */}
//             <div>
//               <label htmlFor="fechaFactura" className={labelClass}>Fecha de Factura</label>
//               <input
//                 id="fechaFactura"
//                 name="fechaFactura"
//                 type="date"
//                 className={inputClass}
//                 value={fechaFactura}
//                 onChange={(e) => setFechaFactura(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Proveedor */}
//             <div>
//               <label htmlFor="proveedor" className={labelClass}>Proveedor</label>
//               <select
//                 id="proveedor"
//                 name="supplierId"
//                 className={inputClass} // Usamos la misma clase para un look uniforme
//                 value={selectedSupplier}
//                 onChange={(e) => setSelectedSupplier(e.target.value)}
//                 required
//               >
//                 <option value="" disabled>Selecciona un proveedor</option>
//                 {suppliers.map((s) => (
//                   <option key={s.id} value={s.id}>
//                     {s.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           {/* 🔹 SECCIÓN 2: PRODUCTOS A COMPRAR */}
//           <div className="space-y-4 pt-4 border-t border-border">
//             <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <Package className="h-5 w-5 text-primary" /> Productos
//             </h3>

//             {/* Panel de Agregar Producto */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//               {/* Selector de Producto */}
//               <div className="md:col-span-2">
//                 <label className={labelClass}>Producto</label>
//                 <select
//                   name="productId"
//                   className={inputClass} // Usamos la misma clase para un look uniforme
//                   value={currentProduct.productId}
//                   onChange={handleCurrentProductChange}
//                 >
//                   <option value="" disabled>Selecciona un producto</option>
//                   {products.map((p) => (
//                     <option key={p.id} value={p.id}>
//                       {p.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               {/* Campo Cantidad */}
//               <div>
//                 <label className={labelClass}>Cantidad</label>
//                 <input
//                   name="quantity"
//                   type="number"
//                   min="1"
//                   className={inputClass}
//                   value={currentProduct.quantity}
//                   onChange={handleCurrentProductChange}
//                 />
//               </div>

//               {/* Botón Agregar */}
//               <div className="col-span-full flex justify-end">
//                 <Button
//                   type="button"
//                   onClick={handleAddProduct}
//                   variant="secondary"
//                 >
//                   <Plus className="h-4 w-4 mr-2" /> Agregar
//                 </Button>
//               </div>
//             </div>

//             {/* Lista de Productos Seleccionados */}
//             {selectedProducts.length > 0 && (
//               <ul className="mt-4 border rounded-md divide-y divide-border bg-muted/20">
//                 {selectedProducts.map((p) => {
//                   const details = products.find((pr) => pr.id === p.productId);
//                   return (
//                     <li
//                       key={p.productId}
//                       className="flex justify-between items-center py-3 px-4"
//                     >
//                       <span className="font-medium text-foreground">
//                         {details?.name}
//                       </span>
//                       <span className="text-sm text-foreground/80">
//                          ({p.quantity} unidades)
//                       </span>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleRemoveProduct(p.productId)}
//                         className="text-red-500 hover:bg-red-100 h-8 w-8"
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//           </div>

//           {/* 🔹 SECCIÓN 3: TOTALES Y ACCIONES */}
//           <div className="border-t pt-4 mt-6 space-y-3">
//             <div className="flex justify-between">
//               <p className="text-sm font-semibold flex items-center gap-2">
//                 <ListOrdered className="h-4 w-4" /> Cantidad total de artículos:
//               </p>
//               <p className="font-semibold">{totalQuantity}</p>
//             </div>
//             <div className="flex justify-between">
//               <p className="text-lg font-bold flex items-center gap-2 text-primary">
//                 <DollarSign className="h-5 w-5" /> Total Estimado:
//               </p>
//               <p className="text-lg font-bold text-primary">${totalPrice.toFixed(2)}</p>
//             </div>
//           </div>

//           {/* 🔹 BOTONES FINALES */}
//           <div className="flex justify-end gap-4 pt-4">
//             <Link href={PATHROUTES.pymes.compras}>
//               <Button variant="outline" type="button">
//                 Cancelar
//               </Button>
//             </Link>
//             <Button
//               type="submit"
//               disabled={isSubmitting || !selectedSupplier || totalQuantity === 0}
//             >
//               {isSubmitting ? "Guardando..." : "Crear Compra"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, Plus, X, Package, DollarSign, ListOrdered } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // 🚨 Componentes de UI importados para el aspecto
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";


// // Interfaces (Mantenidas de tu código original)
// interface Supplier {
//   id: string;
//   name: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// export default function NuevaCompraPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState<string>("");
//   const [selectedProducts, setSelectedProducts] = useState<
//     { productId: string; quantity: number }[]
//   >([]);

//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [numeroFactura, setNumeroFactura] = useState("");

//   const [currentProduct, setCurrentProduct] = useState({
//     productId: "",
//     quantity: 1,
//   });

//   // 1. Lógica de Carga de Datos (INTACTA)
//   useEffect(() => {
//     async function fetchData() {

//       if (status !== "authenticated" || !session) {
//         setIsInitialLoading(false);
//         return;
//       }
     
//       setIsInitialLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;

//         if (!companyId || !token) {
//           setError("Faltan datos de sesión. Por favor, inicia sesión de nuevo.");
//           setIsInitialLoading(false);
//           return;
//         }

//         const [supRes, prodRes] = await Promise.all([
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar los proveedores.");
//         if (!prodRes.ok) throw new Error("Error al cargar los productos.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         if (supData.length > 0) setSelectedSupplier(supData[0].id);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//         toast.error("Hubo un error al cargar los datos.");
//       } finally {
//         setIsInitialLoading(false);
//       }
//     }

//     fetchData();
//   }, [session, status]);

//   // 2. Lógica de Manejo de Estado y Productos (INTACTA)
//   const handleCurrentProductChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     // ESTA LÓGICA USA EL ATRIBUTO 'name' del input/select, por eso es crítico no cambiarlo.
//     const { name, value } = e.target;
//     setCurrentProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddProduct = () => {
//     if (currentProduct.productId && currentProduct.quantity > 0) {
//       const productExists = selectedProducts.some(
//         (p) => p.productId === currentProduct.productId
//       );
//       if (productExists) {
//         toast.error("Este producto ya ha sido añadido.");
//         return;
//       }
//       setSelectedProducts((prev) => [
//         ...prev,
//         { ...currentProduct, quantity: Number(currentProduct.quantity) },
//       ]);
//       setCurrentProduct({ productId: "", quantity: 1 });
//     } else {
//       toast.error("Selecciona un producto y una cantidad válida.");
//     }
//   };

//   const handleRemoveProduct = (productId: string) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
//   };

//   const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce((sum, p) => {
//     const product = products.find((pr) => pr.id === p.productId);
//     return sum + (product?.price ?? 0) * p.quantity;
//   }, 0);

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (status !== "authenticated" || !session) {
//       toast.error("No estás autenticado.");
//       return;
//     }
    
//     setIsSubmitting(true);
//     const companyId = session.user?.companyId;
//     const token = session.accessToken;

//     if (!companyId || !token) {
//       toast.error("Faltan datos de sesión.");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!selectedSupplier || selectedProducts.length === 0 || !numeroFactura) {
//       toast.error("Completa todos los campos obligatorios.");
//       setIsSubmitting(false);
//       return;
//     }

//     const payload = {
//       date: fechaFactura + "T10:30:00Z",
//       invoiceNumber: numeroFactura,
//       companyId,
//       supplierId: selectedSupplier,
//       products: selectedProducts.map((p) => ({
//         productId: p.productId,
//         quantity: p.quantity,
//       })),
//     };

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al crear la compra");
//       }

//       toast.success("¡Compra creada con éxito!");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   // 3. Renderizado (ASPECTO IDÉNTICO AL PROVEEDOR NUEVO)

//   if (isInitialLoading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <ListOrdered className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <p className="text-red-500">Error: {error}</p>
//       </div>
//     );
//   }

//   // Clases CSS para simular la apariencia de los componentes Input/Select de UI
//   const inputClass = "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors mt-1";
//   const labelClass = "text-sm font-medium text-foreground";


//   return (
//     <div className="p-4 md:p-8">
//       {/* 🔹 HEADER */}
//       <div className="flex items-center gap-4 mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           <Button variant="outline" className="px-3">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold text-foreground">Registrar Nueva Compra</h1>
//       </div>

//       {/* 🔹 CONTENIDO EN TARJETA (CARD) */}
//       <Card isClickable={false}>
//         <form onSubmit={handleSave} className="space-y-6">
          
//           {/* 🔹 SECCIÓN 1: DATOS DE FACTURA Y PROVEEDOR (Grid de 2 columnas) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Número de Factura */}
//             <div>
//               <label htmlFor="numeroFactura" className={labelClass}>Número de Factura</label>
//               <input
//                 id="numeroFactura"
//                 name="numeroFactura"
//                 type="text"
//                 className={inputClass}
//                 value={numeroFactura}
//                 onChange={(e) => setNumeroFactura(e.target.value)}
//                 required
//               />
//             </div>
            
//             {/* Fecha de Factura */}
//             <div>
//               <label htmlFor="fechaFactura" className={labelClass}>Fecha de Factura</label>
//               <input
//                 id="fechaFactura"
//                 name="fechaFactura"
//                 type="date"
//                 className={inputClass}
//                 value={fechaFactura}
//                 onChange={(e) => setFechaFactura(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Proveedor */}
//             <div>
//               <label htmlFor="proveedor" className={labelClass}>Proveedor</label>
//               <select
//                 id="proveedor"
//                 name="supplierId"
//                 className={inputClass}
//                 value={selectedSupplier}
//                 onChange={(e) => setSelectedSupplier(e.target.value)}
//                 required
//               >
//                 <option value="" disabled>Selecciona un proveedor</option>
//                 {suppliers.map((s) => (
//                   <option key={s.id} value={s.id}>
//                     {s.name}
//                   </option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           {/* 🔹 SECCIÓN 2: PRODUCTOS A COMPRAR */}
//           <div className="space-y-4 pt-4 border-t border-border">
//             <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <Package className="h-5 w-5 text-primary" /> Productos
//             </h3>

//             {/* Panel de Agregar Producto (Grid de 3 columnas) */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border border-dashed border-border rounded-lg bg-background/50">
              
//               {/* Selector de Producto */}
//               <div className="md:col-span-2">
//                 <label className={labelClass}>Producto</label>
//                 <select
//                   name="productId"
//                   className={inputClass}
//                   value={currentProduct.productId}
//                   onChange={handleCurrentProductChange} // ⬅️ Lógica original: Usa name="productId"
//                 >
//                   <option value="" disabled>Selecciona un producto</option>
//                   {products
//                       .filter(p => !selectedProducts.some(sp => sp.productId === p.id)) // Excluir productos ya seleccionados
//                       .map((p) => (
//                     <option key={p.id} value={p.id}>
//                       {p.name}
//                     </option>
//                   ))}
//                 </select>
//               </div>
              
//               {/* Campo Cantidad */}
//               <div>
//                 <label className={labelClass}>Cantidad</label>
//                 <input
//                   name="quantity"
//                   type="number"
//                   min="1"
//                   className={inputClass}
//                   value={currentProduct.quantity}
//                   onChange={handleCurrentProductChange} // ⬅️ Lógica original: Usa name="quantity"
//                 />
//               </div>

//               {/* Botón Agregar */}
//               <div className="col-span-full flex justify-end">
//                 <Button
//                   type="button"
//                   onClick={handleAddProduct}
//                   variant="secondary"
//                   disabled={!currentProduct.productId || currentProduct.quantity <= 0}
//                 >
//                   <Plus className="h-4 w-4 mr-2" /> Agregar
//                 </Button>
//               </div>
//             </div>

//             {/* Lista de Productos Seleccionados */}
//             {selectedProducts.length > 0 && (
//               <ul className="mt-4 border rounded-md divide-y divide-border bg-muted/20">
//                 {selectedProducts.map((p) => {
//                   const details = products.find((pr) => pr.id === p.productId);
//                   const lineTotal = (details?.price ?? 0) * p.quantity;
//                   return (
//                     <li
//                       key={p.productId}
//                       className="flex justify-between items-center py-3 px-4"
//                     >
//                       <span className="font-medium text-foreground">
//                         {details?.name}
//                       </span>
//                       <span className="text-sm text-foreground/80">
//                          {p.quantity} unid. - ${lineTotal.toFixed(2)}
//                       </span>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleRemoveProduct(p.productId)}
//                         className="text-red-500 hover:bg-red-100 h-8 w-8"
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//           </div>

//           {/* 🔹 SECCIÓN 3: TOTALES Y ACCIONES */}
//           <div className="border-t pt-4 mt-6 space-y-3">
//             <div className="flex justify-between">
//               <p className="text-sm font-semibold flex items-center gap-2">
//                 <ListOrdered className="h-4 w-4" /> Cantidad total de artículos:
//               </p>
//               <p className="font-semibold">{totalQuantity}</p>
//             </div>
//             <div className="flex justify-between">
//               <p className="text-lg font-bold flex items-center gap-2 text-primary">
//                 <DollarSign className="h-5 w-5" /> Total Estimado:
//               </p>
//               <p className="text-2xl font-extrabold text-primary">${totalPrice.toFixed(2)}</p>
//             </div>
//           </div>

//           {/* 🔹 BOTONES FINALES */}
//           <div className="flex justify-end gap-4 pt-4">
//             <Link href={PATHROUTES.pymes.compras}>
//               <Button variant="outline" type="button">
//                 Cancelar
//               </Button>
//             </Link>
//             <Button
//               type="submit"
//               disabled={isSubmitting || !selectedSupplier || totalQuantity === 0}
//             >
//               {isSubmitting ? "Guardando..." : "Crear Compra"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, Plus, X, Package, DollarSign, ListOrdered } from "lucide-react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // 🚨 COMPONENTES DE UI REQUERIDOS PARA EL ASPECTO IDÉNTICO
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input"; // Importado
// import { Select } from '@/components/ui/Select'; // Importado

// // Interfaces (Mantenidas de tu código original)
// interface Supplier {
//   id: string;
//   name: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// export default function NuevaCompraPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState<string>("");
//   const [selectedProducts, setSelectedProducts] = useState<
//     { productId: string; quantity: number }[]
//   >([]);

//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [numeroFactura, setNumeroFactura] = useState("");

//   const [currentProduct, setCurrentProduct] = useState({
//     productId: "",
//     quantity: 1,
//   });

//   // 1. Lógica de Carga de Datos (INTACTA)
//   useEffect(() => {
//     async function fetchData() {
//       if (status !== "authenticated" || !session) {
//         setIsInitialLoading(false);
//         return;
//       }
     
//       setIsInitialLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;

//         if (!companyId || !token) {
//           setError("Faltan datos de sesión. Por favor, inicia sesión de nuevo.");
//           setIsInitialLoading(false);
//           return;
//         }

//         const [supRes, prodRes] = await Promise.all([
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar los proveedores.");
//         if (!prodRes.ok) throw new Error("Error al cargar los productos.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         if (supData.length > 0) setSelectedSupplier(supData[0].id);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//         toast.error("Hubo un error al cargar los datos.");
//       } finally {
//         setIsInitialLoading(false);
//       }
//     }

//     fetchData();
//   }, [session, status]);

//   // 2. Lógica de Manejo de Estado y Productos (INTACTA)
//   const handleCurrentProductChange = (
//     // Esta función maneja los cambios de producto y cantidad, usa e.target.name
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setCurrentProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddProduct = () => {
//     if (currentProduct.productId && currentProduct.quantity > 0) {
//       const productExists = selectedProducts.some(
//         (p) => p.productId === currentProduct.productId
//       );
//       if (productExists) {
//         toast.error("Este producto ya ha sido añadido.");
//         return;
//       }
//       setSelectedProducts((prev) => [
//         ...prev,
//         { ...currentProduct, quantity: Number(currentProduct.quantity) },
//       ]);
//       setCurrentProduct({ productId: "", quantity: 1 });
//     } else {
//       toast.error("Selecciona un producto y una cantidad válida.");
//     }
//   };

//   const handleRemoveProduct = (productId: string) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
//   };

//   const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce((sum, p) => {
//     const product = products.find((pr) => pr.id === p.productId);
//     return sum + (product?.price ?? 0) * p.quantity;
//   }, 0);

//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (status !== "authenticated" || !session) {
//       toast.error("No estás autenticado.");
//       return;
//     }
    
//     setIsSubmitting(true);
//     const companyId = session.user?.companyId;
//     const token = session.accessToken;

//     if (!companyId || !token) {
//       toast.error("Faltan datos de sesión.");
//       setIsSubmitting(false);
//       return;
//     }

//     if (!selectedSupplier || selectedProducts.length === 0 || !numeroFactura) {
//       toast.error("Completa todos los campos obligatorios.");
//       setIsSubmitting(false);
//       return;
//     }

//     const payload = {
//       date: fechaFactura + "T10:30:00Z",
//       invoiceNumber: numeroFactura,
//       companyId,
//       supplierId: selectedSupplier,
//       products: selectedProducts.map((p) => ({
//         productId: p.productId,
//         quantity: p.quantity,
//       })),
//     };

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al crear la compra");
//       }

//       toast.success("¡Compra creada con éxito!");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   // 3. Renderizado (ASPECTO IDÉNTICO AL PROVEEDOR NUEVO usando <Input> y <Select>)

//   if (isInitialLoading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <ListOrdered className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <p className="text-red-500">Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       {/* 🔹 HEADER */}
//       <div className="flex items-center gap-4 mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           <Button variant="outline" className="px-3">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold text-foreground">Registrar Nueva Compra</h1>
//       </div>

//       {/* 🔹 CONTENIDO EN TARJETA (CARD) */}
//       <Card isClickable={false}>
//         <form onSubmit={handleSave} className="space-y-6">
          
//           {/* 🔹 SECCIÓN 1: DATOS DE FACTURA Y PROVEEDOR (Grid de 2 columnas) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Número de Factura (Usando <Input>) */}
//             <Input 
//                 id="numeroFactura" 
//                 label="Número de Factura" 
//                 value={numeroFactura} 
//                 onChange={(e) => setNumeroFactura(e.target.value)} 
//                 required 
//             />
            
//             {/* Fecha de Factura (Usando <Input>) */}
//             <Input
//                 id="fechaFactura"
//                 label="Fecha de Factura"
//                 type="date"
//                 value={fechaFactura}
//                 onChange={(e) => setFechaFactura(e.target.value)}
//                 required
//             />

//             {/* Proveedor (Usando <Select>) */}
//             <Select
//               id="proveedor"
//               label="Proveedor"
//               value={selectedSupplier}
//               onChange={(e) => setSelectedSupplier(e.target.value)}
//               required
//             >
//               <option value="" disabled>Selecciona un proveedor</option>
//               {suppliers.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </Select>
//           </div>
          
//           {/* 🔹 SECCIÓN 2: PRODUCTOS A COMPRAR */}
//           <div className="space-y-4 pt-4 border-t border-border">
//             <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <Package className="h-5 w-5 text-primary" /> Productos
//             </h3>

//             {/* Panel de Agregar Producto (Grid de 3 columnas) */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-dashed border-border rounded-lg bg-background/50">
              
//               {/* Selector de Producto (Usando <Select>) */}
//               <div className="md:col-span-2">
//                 <Select
//                   id="currentProduct"
//                   name="productId" // ⬅️ CRÍTICO: Mantiene el 'name' para handleCurrentProductChange
//                   label="Producto"
//                   value={currentProduct.productId}
//                   onChange={handleCurrentProductChange} // ⬅️ LÓGICA INTACTA
//                 >
//                   <option value="" disabled>Selecciona un producto</option>
//                   {products
//                       .filter(p => !selectedProducts.some(sp => sp.productId === p.id))
//                       .map((p) => (
//                     <option key={p.id} value={p.id}>
//                       {p.name}
//                     </option>
//                   ))}
//                 </Select>
//               </div>
              
//               {/* Campo Cantidad (Usando <Input>) */}
//               <div>
//                 <Input
//                   id="currentQuantity"
//                   name="quantity" // ⬅️ CRÍTICO: Mantiene el 'name' para handleCurrentProductChange
//                   label="Cantidad"
//                   type="number"
//                   min="1"
//                   value={currentProduct.quantity.toString()}
//                   onChange={handleCurrentProductChange} // ⬅️ LÓGICA INTACTA
//                 />
//               </div>

//               {/* Botón Agregar */}
//               <div className="col-span-full flex justify-end">
//                 <Button
//                   type="button"
//                   onClick={handleAddProduct}
//                   variant="secondary"
//                   disabled={!currentProduct.productId || currentProduct.quantity <= 0}
//                 >
//                   <Plus className="h-4 w-4 mr-2" /> Agregar
//                 </Button>
//               </div>
//             </div>

//             {/* Lista de Productos Seleccionados */}
//             {selectedProducts.length > 0 && (
//               <ul className="mt-4 border rounded-md divide-y divide-border bg-muted/20">
//                 {selectedProducts.map((p) => {
//                   const details = products.find((pr) => pr.id === p.productId);
//                   const lineTotal = (details?.price ?? 0) * p.quantity;
//                   return (
//                     <li
//                       key={p.productId}
//                       className="flex justify-between items-center py-3 px-4"
//                     >
//                       <span className="font-medium text-foreground">
//                         {details?.name}
//                       </span>
//                       <span className="text-sm text-foreground/80">
//                          {p.quantity} unid. - <span className="font-semibold">${lineTotal.toFixed(2)}</span>
//                       </span>
//                       <Button
//                         type="button"
//                         variant="ghost"
//                         size="icon"
//                         onClick={() => handleRemoveProduct(p.productId)}
//                         className="text-red-500 hover:bg-red-100 h-8 w-8"
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//           </div>

//           {/* 🔹 SECCIÓN 3: TOTALES Y ACCIONES */}
//           <div className="border-t pt-4 mt-6 space-y-3">
//             <div className="flex justify-between">
//               <p className="text-sm font-semibold flex items-center gap-2">
//                 <ListOrdered className="h-4 w-4" /> Cantidad total de artículos:
//               </p>
//               <p className="font-semibold">{totalQuantity}</p>
//             </div>
//             <div className="flex justify-between">
//               <p className="text-lg font-bold flex items-center gap-2 text-primary">
//                 <DollarSign className="h-5 w-5" /> Total Estimado:
//               </p>
//               <p className="text-2xl font-extrabold text-primary">${totalPrice.toFixed(2)}</p>
//             </div>
//           </div>

//           {/* 🔹 BOTONES FINALES */}
//           <div className="flex justify-end gap-4 pt-4">
//             <Link href={PATHROUTES.pymes.compras}>
//               <Button variant="outline" type="button">
//                 Cancelar
//               </Button>
//             </Link>
//             <Button
//               type="submit"
//               disabled={isSubmitting || !selectedSupplier || totalQuantity === 0}
//             >
//               {isSubmitting ? "Guardando..." : "Crear Compra"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }


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