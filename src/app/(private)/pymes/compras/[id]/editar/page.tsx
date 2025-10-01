// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // Tipos
// interface Supplier {
//   id: string;
//   name: string;
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
//   invoiceNumber: string;
//   supplierId: string;
//   items: Item[];
// }

// export default function EditarCompraPage() {
//   const { data: session, status } = useSession();
//   const { id } = useParams();
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState("");
//   const [selectedProducts, setSelectedProducts] = useState<Item[]>([]);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [invoiceNumber, setInvoiceNumber] = useState("");

//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (status !== "authenticated" || !session) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;
//         if (!companyId || !token) throw new Error("Faltan datos de sesión.");

//         // Cargar proveedores, productos e información de la orden
//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!supRes.ok) throw new Error("Error cargando proveedores.");
//         if (!prodRes.ok) throw new Error("Error cargando productos.");
//         if (!orderRes.ok) throw new Error("Error cargando orden.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         // Prellenar datos de la orden
//         setSelectedSupplier(orderData.supplierId);
//         setFechaFactura(orderData.date.split("T")[0]);
//         setInvoiceNumber(orderData.invoiceNumber);

//         // Normalizar items con información del producto
//         setSelectedProducts(
//           (orderData.items || []).map((item) => ({
//             ...item,
//             product: prodData.find((p) => p.id === item.productId),
//           }))
//         );
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [session, status, id]);

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const token = session?.accessToken;
//       if (!token) throw new Error("No autenticado");

//       const payload = {
//         date: fechaFactura + "T10:30:00Z",
//         invoiceNumber,
//         supplierId: selectedSupplier,
//         products: selectedProducts.map((p) => ({
//           productId: p.productId,
//           quantity: p.quantity,
//         })),
//       };

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la orden.");
//       }

//       toast.success("Orden actualizada con éxito.");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const handleRemoveProduct = (productId: string) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
//   };

//   const totalQuantity = selectedProducts.reduce((s, p) => s + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce(
//     (s, p) => s + (p.product?.price ?? 0) * p.quantity,
//     0
//   );

//   if (isLoading) return <p className="p-8">Cargando...</p>;
//   if (error) return <p className="p-8 text-red-500">Error: {error}</p>;

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex items-center mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           <button className="mr-2 h-9 w-9 flex items-center justify-center rounded-md border hover:bg-accent">
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//         </Link>
//         <h1 className="text-3xl font-bold">Editar Compra</h1>
//       </div>

//       <div className="rounded-xl border bg-card shadow p-6">
//         <form onSubmit={handleUpdate} className="grid gap-6">
//           {/* Fecha */}
//           <div>
//             <label className="block text-sm font-medium">Fecha de factura</label>
//             <input
//               type="date"
//               value={fechaFactura}
//               onChange={(e) => setFechaFactura(e.target.value)}
//               className="mt-2 w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {/* Número de factura */}
//           <div>
//             <label className="block text-sm font-medium">Número de factura</label>
//             <input
//               type="text"
//               value={invoiceNumber}
//               onChange={(e) => setInvoiceNumber(e.target.value)}
//               className="mt-2 w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {/* Proveedor */}
//           <div>
//             <label className="block text-sm font-medium">Proveedor</label>
//             <select
//               value={selectedSupplier}
//               onChange={(e) => setSelectedSupplier(e.target.value)}
//               className="mt-2 w-full border rounded px-3 py-2"
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

//           {/* Productos */}
//           <div>
//             <h3 className="font-semibold mb-2">Productos</h3>
//             {selectedProducts.length > 0 && (
//               <ul className="space-y-4 mb-6">
//                 {selectedProducts.map((p, index) => (
//                   <li key={p.productId + index} className="flex gap-4 items-center">
//                     <select
//                       value={p.productId}
//                       onChange={(e) => {
//                         const newProducts = [...selectedProducts];
//                         newProducts[index].productId = e.target.value;
//                         newProducts[index].product = products.find(
//                           (prod) => prod.id === e.target.value
//                         );
//                         setSelectedProducts(newProducts);
//                       }}
//                       className="border rounded px-2 py-1"
//                     >
//                       {products.map((prod) => (
//                         <option key={prod.id} value={prod.id}>
//                           {prod.name}
//                         </option>
//                       ))}
//                     </select>
//                     <input
//                       type="number"
//                       value={p.quantity}
//                       min={1}
//                       onChange={(e) => {
//                         const newProducts = [...selectedProducts];
//                         newProducts[index].quantity = Number(e.target.value);
//                         setSelectedProducts(newProducts);
//                       }}
//                       className="w-20 border rounded px-2 py-1"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => handleRemoveProduct(p.productId)}
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       Quitar
//                     </button>
//                     {p.product && (
//                       <span className="ml-auto">
//                         ${(p.product.price * p.quantity).toFixed(2)}
//                       </span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Totales */}
//           <div className="border-t pt-4 flex justify-between font-semibold">
//             <span>Total productos: {totalQuantity}</span>
//             <span>Total: ${totalPrice.toFixed(2)}</span>
//           </div>

//           {/* Botones */}
//           <div className="flex justify-end gap-4">
//             <Link href={PATHROUTES.pymes.compras}>
//               <button type="button" className="px-4 py-2 border rounded">
//                 Cancelar
//               </button>
//             </Link>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-4 py-2 bg-primary text-white rounded"
//             >
//               {isSubmitting ? "Guardando..." : "Actualizar Compra"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }



// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, X, Package, DollarSign, ListOrdered, Edit, Loader2 } from "lucide-react"; // Se añaden iconos
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // 🚨 COMPONENTES DE UI REQUERIDOS
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input"; 
// import { Select } from '@/components/ui/Select'; 

// // Tipos (INTACTOS)
// interface Supplier {
//   id: string;
//   name: string;
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
//   invoiceNumber: string;
//   supplierId: string;
//   items: Item[];
// }

// export default function EditarCompraPage() {
//   const { data: session, status } = useSession();
//   const { id } = useParams();
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState("");
//   const [selectedProducts, setSelectedProducts] = useState<Item[]>([]);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [invoiceNumber, setInvoiceNumber] = useState("");

//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Lógica de Carga de Datos (INTACTA)
//   useEffect(() => {
//     if (status !== "authenticated" || !session) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;
//         if (!companyId || !token) throw new Error("Faltan datos de sesión.");

//         // Cargar proveedores, productos e información de la orden
//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!supRes.ok) throw new Error("Error cargando proveedores.");
//         if (!prodRes.ok) throw new Error("Error cargando productos.");
//         if (!orderRes.ok) throw new Error("Error cargando orden.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         // Prellenar datos de la orden
//         setSelectedSupplier(orderData.supplierId);
//         setFechaFactura(orderData.date.split("T")[0]);
//         setInvoiceNumber(orderData.invoiceNumber);

//         // Normalizar items con información del producto
//         setSelectedProducts(
//           (orderData.items || []).map((item) => ({
//             ...item,
//             product: prodData.find((p) => p.id === item.productId),
//           }))
//         );
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [session, status, id]);

//   // Lógica de Actualización (INTACTA)
//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const token = session?.accessToken;
//       if (!token) throw new Error("No autenticado");

//       const payload = {
//         date: fechaFactura + "T10:30:00Z",
//         invoiceNumber,
//         supplierId: selectedSupplier,
//         products: selectedProducts.map((p) => ({
//           productId: p.productId,
//           quantity: p.quantity,
//         })),
//       };

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la orden.");
//       }

//       toast.success("Orden actualizada con éxito.");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Lógica de Eliminación (INTACTA)
//   const handleRemoveProduct = (productId: string) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
//   };

//   // Lógica de Cálculo (INTACTA)
//   const totalQuantity = selectedProducts.reduce((s, p) => s + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce(
//     (s, p) => s + (p.product?.price ?? 0) * p.quantity,
//     0
//   );
  
//   // Lógica de Actualización de Item (NECESARIA para los campos dinámicos - LÓGICA INTACTA)
//   const handleItemChange = (
//     index: number,
//     field: 'productId' | 'quantity',
//     value: string | number
//   ) => {
//     setSelectedProducts((prev) => {
//       const newProducts = [...prev];
//       if (field === 'productId' && typeof value === 'string') {
//         newProducts[index].productId = value;
//         // La lógica de buscar y adjuntar el producto para el cálculo de precio es crucial
//         newProducts[index].product = products.find((prod) => prod.id === value);
//       } else if (field === 'quantity' && typeof value === 'number') {
//         newProducts[index].quantity = value;
//       }
//       return newProducts;
//     });
//   };


//   if (isLoading) return (
//     <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos de la compra...</p>
//     </div>
//   );
//   if (error) return <p className="p-8 text-red-500">Error: {error}</p>;

//   return (
//     <div className="p-4 md:p-8">
//       {/* 🔹 HEADER */}
//       <div className="flex items-center gap-4 mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           {/* Usando el componente Button */}
//           <Button variant="outline" className="px-3">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
//             <Edit className="h-7 w-7 text-primary" />
//             Editar Compra
//         </h1>
//       </div>

//       {/* 🔹 CONTENIDO EN TARJETA (CARD) */}
//       <Card isClickable={false}>
//         <form onSubmit={handleUpdate} className="space-y-6">
          
//           {/* 🔹 SECCIÓN 1: DATOS DE FACTURA Y PROVEEDOR (Grid de 2 columnas) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Número de Factura (Usando <Input>) */}
//             <Input 
//                 id="invoiceNumber" 
//                 label="Número de Factura" 
//                 value={invoiceNumber} 
//                 onChange={(e) => setInvoiceNumber(e.target.value)} 
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
          
//           {/* 🔹 SECCIÓN 2: PRODUCTOS EDITABLES */}
//           <div className="space-y-4 pt-4 border-t border-border">
//             <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <Package className="h-5 w-5 text-primary" /> Productos en la Compra
//             </h3>

//             {selectedProducts.length > 0 && (
//               <ul className="mt-4 border rounded-md divide-y divide-border bg-muted/20">
//                 {selectedProducts.map((p, index) => {
//                   const lineTotal = (p.product?.price ?? 0) * p.quantity;
//                   return (
//                     <li
//                       key={p.productId + index} // Usar productId + index para key, aunque la lógica del original solo usaba productId. Se mantiene como productId + index por si hay productos repetidos en la lista.
//                       className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center py-3 px-4"
//                     >
                      
//                       {/* Selector de Producto (Se usa Select y se ajusta el onChange para mantener la lógica) */}
//                       <Select
//                         id={`product-${index}`}
//                         label="Producto"
//                         value={p.productId}
//                         onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
//                         className="w-full md:w-2/5"
//                       >
//                          {products.map((prod) => (
//                             <option key={prod.id} value={prod.id}>
//                               {prod.name}
//                             </option>
//                           ))}
//                       </Select>
                      
//                       {/* Input de Cantidad (Se usa Input y se ajusta el onChange para mantener la lógica) */}
//                       <Input
//                         id={`quantity-${index}`}
//                         label="Cantidad"
//                         type="number"
//                         min="1"
//                         value={p.quantity.toString()}
//                         onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
//                         className="w-full md:w-32"
//                       />
                      
//                       {/* Total y Botón de Quitar */}
//                       <div className="flex justify-between items-center w-full md:w-auto md:ml-auto gap-4">
//                         <span className="text-sm font-semibold text-foreground/80 whitespace-nowrap">
//                             Total: <span className="text-lg font-bold text-primary">${lineTotal.toFixed(2)}</span>
//                         </span>
                        
//                         {/* Botón de Quitar (Se usa Button y se ajusta el estilo) */}
//                         <Button
//                           type="button"
//                           variant="danger" 
//                           onClick={() => handleRemoveProduct(p.productId)}
//                           className="h-9 w-9 p-0" // Estilo de botón de icono
//                         >
//                           <X className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//             {selectedProducts.length === 0 && (
//                  <div className="p-4 text-center text-foreground/70 border-dashed border-2 rounded-lg">
//                     No hay productos en esta compra.
//                  </div>
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
//               {isSubmitting ? "Guardando..." : "Actualizar Compra"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, Package, DollarSign, ListOrdered, Edit, Loader2, AlertTriangle } from "lucide-react"; 
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // 🚨 COMPONENTES DE UI REQUERIDOS
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input"; 
// import { Select } from '@/components/ui/Select'; 

// // Tipos 
// interface Supplier {
//   id: string;
//   name: string;
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
//   invoiceNumber: string;
//   supplierId: string;
//   items: Item[];
// }

// export default function EditarCompraPage() {
//   const { data: session, status } = useSession();
//   const { id } = useParams();
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState("");
//   const [selectedProducts, setSelectedProducts] = useState<Item[]>([]);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [invoiceNumber, setInvoiceNumber] = useState("");

//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Lógica de Carga de Datos
//   useEffect(() => {
//     if (status !== "authenticated" || !session) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;
//         if (!companyId || !token) throw new Error("Faltan datos de sesión.");

//         // Cargar proveedores, productos e información de la orden
//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!supRes.ok) throw new Error("Error cargando proveedores.");
//         if (!prodRes.ok) throw new Error("Error cargando productos.");
//         if (!orderRes.ok) throw new Error("Error cargando orden.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         // Prellenar datos de la orden
//         setSelectedSupplier(orderData.supplierId);
//         setFechaFactura(orderData.date.split("T")[0]);
//         setInvoiceNumber(orderData.invoiceNumber);

//         // Normalizar items con información del producto
//         setSelectedProducts(
//           (orderData.items || []).map((item) => ({
//             ...item,
//             product: prodData.find((p) => p.id === item.productId),
//           }))
//         );
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [session, status, id]);

//   // Lógica de Actualización
//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const token = session?.accessToken;
//       if (!token) throw new Error("No autenticado");

//       const payload = {
//         date: fechaFactura + "T10:30:00Z",
//         invoiceNumber,
//         supplierId: selectedSupplier,
//         // Solo enviar los datos esenciales de los productos
//         products: selectedProducts.map((p) => ({
//           productId: p.productId,
//           quantity: p.quantity,
//         })),
//       };

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la orden.");
//       }

//       toast.success("Orden actualizada con éxito.");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Lógica de Cálculo
//   const totalQuantity = selectedProducts.reduce((s, p) => s + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce(
//     (s, p) => s + (p.product?.price ?? 0) * p.quantity,
//     0
//   );
  
//   // Lógica de Actualización de Item
//   const handleItemChange = (
//     index: number,
//     field: 'productId' | 'quantity',
//     value: string | number
//   ) => {
//     setSelectedProducts((prev) => {
//       const newProducts = [...prev];
//       if (field === 'productId' && typeof value === 'string') {
//         newProducts[index].productId = value;
//         // La lógica de buscar y adjuntar el producto para el cálculo de precio es crucial
//         newProducts[index].product = products.find((prod) => prod.id === value);
//       } else if (field === 'quantity' && typeof value === 'number') {
//         // Aseguramos que la cantidad sea al menos 1
//         newProducts[index].quantity = Math.max(1, value as number); 
//       }
//       return newProducts;
//     });
//   };


//   if (isLoading) return (
//     <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos de la compra...</p>
//     </div>
//   );
//   if (error) return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error</p>
//         <p className="text-foreground/70">{error}</p>
//         <Link href={PATHROUTES.pymes.compras} className="mt-4">
//           <Button>Volver</Button>
//         </Link>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">
//       {/* 🔹 HEADER */}
//       <div className="flex items-center gap-4 mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           {/* Usando el componente Button */}
//           <Button variant="outline" className="px-3">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
//             <Edit className="h-7 w-7 text-primary" />
//             Editar Compra
//         </h1>
//       </div>

//       {/* 🔹 CONTENIDO EN TARJETA (CARD) */}
//       <Card isClickable={false}>
//         <form onSubmit={handleUpdate} className="space-y-6">
          
//           {/* 🔹 SECCIÓN 1: DATOS DE FACTURA Y PROVEEDOR (Grid de 2 columnas) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Número de Factura (Usando <Input>) */}
//             <Input 
//                 id="invoiceNumber" 
//                 label="Número de Factura" 
//                 value={invoiceNumber} 
//                 onChange={(e) => setInvoiceNumber(e.target.value)} 
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
          
//           {/* 🔹 SECCIÓN 2: PRODUCTOS EDITABLES */}
//           <div className="space-y-4 pt-4 border-t border-border">
//             <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <Package className="h-5 w-5 text-primary" /> Productos en la Compra
//             </h3>

//             {selectedProducts.length > 0 ? (
//               <ul className="mt-4 border rounded-md divide-y divide-border bg-muted/20">
//                 {selectedProducts.map((p, index) => {
//                   const lineTotal = (p.product?.price ?? 0) * p.quantity;
//                   return (
//                     <li
//                       key={p.productId + index} // Clave única para la lista
//                       className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center py-3 px-4"
//                     >
                      
//                       {/* Selector de Producto (Permite cambiar el producto por cualquier otro) */}
//                       <Select
//                         id={`product-${index}`}
//                         label="Producto"
//                         value={p.productId}
//                         onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
//                         className="w-full md:w-2/5"
//                       >
//                          {products.map((prod) => (
//                             <option key={prod.id} value={prod.id}>
//                               {prod.name}
//                             </option>
//                           ))}
//                       </Select>
                      
//                       {/* Input de Cantidad */}
//                       <Input
//                         id={`quantity-${index}`}
//                         label="Cantidad"
//                         type="number"
//                         min="1"
//                         value={p.quantity.toString()}
//                         onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
//                         className="w-full md:w-32"
//                       />
                      
//                       {/* Total */}
//                       <div className="flex justify-between items-center w-full md:w-auto md:ml-auto gap-4">
//                         <span className="text-sm font-semibold text-foreground/80 whitespace-nowrap">
//                             Total: <span className="text-lg font-bold text-primary">${lineTotal.toFixed(2)}</span>
//                         </span>
                        
//                         {/* El botón de Quitar ha sido eliminado, forzando al usuario a editar o sustituir el producto */}
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             ) : (
//                  <div className="p-4 text-center text-foreground/70 border-dashed border-2 rounded-lg">
//                     No hay productos en esta compra. Una compra debe tener al menos un producto.
//                  </div>
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
//               {isSubmitting ? "Guardando..." : "Actualizar Compra"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, Package, DollarSign, ListOrdered, Edit, Loader2, AlertTriangle } from "lucide-react"; 
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // 🚨 COMPONENTES DE UI REQUERIDOS
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input"; 
// import { Select } from '@/components/ui/Select'; 

// // Tipos 
// interface Supplier {
//   id: string;
//   name: string;
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
//   invoiceNumber: string;
//   supplierId: string;
//   items: Item[];
// }

// export default function EditarCompraPage() {
//   const { data: session, status } = useSession();
//   const { id } = useParams();
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState("");
//   const [selectedProducts, setSelectedProducts] = useState<Item[]>([]);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [invoiceNumber, setInvoiceNumber] = useState("");

//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Lógica de Carga de Datos
//   useEffect(() => {
//     if (status !== "authenticated" || !session) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;
//         if (!companyId || !token) throw new Error("Faltan datos de sesión.");

//         // Cargar proveedores, productos e información de la orden
//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!supRes.ok) throw new Error("Error cargando proveedores.");
//         if (!prodRes.ok) throw new Error("Error cargando productos.");
//         if (!orderRes.ok) throw new Error("Error cargando orden.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         // Prellenar datos de la orden
//         setSelectedSupplier(orderData.supplierId);
//         setFechaFactura(orderData.date.split("T")[0]);
//         setInvoiceNumber(orderData.invoiceNumber);

//         // Normalizar items con información del producto
//         setSelectedProducts(
//           (orderData.items || []).map((item) => ({
//             ...item,
//             product: prodData.find((p) => p.id === item.productId),
//           }))
//         );
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [session, status, id]);

//   // Lógica de Actualización
//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const token = session?.accessToken;
//       if (!token) throw new Error("No autenticado");

//       const payload = {
//         date: fechaFactura + "T10:30:00Z",
//         invoiceNumber,
//         supplierId: selectedSupplier,
//         // Solo enviar los datos esenciales de los productos
//         products: selectedProducts.map((p) => ({
//           productId: p.productId,
//           quantity: p.quantity,
//         })),
//       };

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la orden.");
//       }

//       toast.success("Orden actualizada con éxito.");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Lógica de Cálculo
//   const totalQuantity = selectedProducts.reduce((s, p) => s + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce(
//     (s, p) => s + (p.product?.price ?? 0) * p.quantity,
//     0
//   );
  
//   // Lógica de Actualización de Item
//   const handleItemChange = (
//     index: number,
//     field: 'productId' | 'quantity',
//     value: string | number
//   ) => {
//     setSelectedProducts((prev) => {
//       const newProducts = [...prev];
//       if (field === 'productId' && typeof value === 'string') {
//         newProducts[index].productId = value;
//         // La lógica de buscar y adjuntar el producto para el cálculo de precio es crucial
//         newProducts[index].product = products.find((prod) => prod.id === value);
//       } else if (field === 'quantity' && typeof value === 'number') {
//         // Aseguramos que la cantidad sea al menos 1
//         newProducts[index].quantity = Math.max(1, value as number); 
//       }
//       return newProducts;
//     });
//   };


//   if (isLoading) return (
//     <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos de la compra...</p>
//     </div>
//   );
//   if (error) return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error</p>
//         <p className="text-foreground/70">{error}</p>
//         <Link href={PATHROUTES.pymes.compras} className="mt-4">
//           <Button>Volver</Button>
//         </Link>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">
//       {/* 🔹 HEADER */}
//       <div className="flex items-center gap-4 mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           {/* Usando el componente Button */}
//           <Button variant="outline" className="px-3">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
//             <Edit className="h-7 w-7 text-primary" />
//             Editar Compra
//         </h1>
//       </div>

//       {/* 🔹 CONTENIDO EN TARJETA (CARD) */}
//       <Card isClickable={false}>
//         <form onSubmit={handleUpdate} className="space-y-6">
          
//           {/* 🔹 SECCIÓN 1: DATOS DE FACTURA Y PROVEEDOR (Grid de 2 columnas) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Número de Factura (Usando <Input>) */}
//             <Input 
//                 id="invoiceNumber" 
//                 label="Número de Factura" 
//                 value={invoiceNumber} 
//                 onChange={(e) => setInvoiceNumber(e.target.value)} 
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
          
//           {/* 🔹 SECCIÓN 2: PRODUCTOS EDITABLES */}
//           <div className="space-y-4 pt-4 border-t border-border">
//             <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <Package className="h-5 w-5 text-primary" /> Productos en la Compra
//             </h3>

//             {selectedProducts.length > 0 ? (
//               <ul className="mt-4 border rounded-md divide-y divide-border bg-muted/20">
//                 {selectedProducts.map((p, index) => {
//                   const lineTotal = (p.product?.price ?? 0) * p.quantity;
//                   return (
//                     <li
//                       key={p.productId + index} // Clave única para la lista
//                       className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center py-3 px-4"
//                     >
                      
//                       {/* Selector de Producto (Permite cambiar el producto por cualquier otro) */}
//                       <Select
//                         id={`product-${index}`}
//                         label="Producto"
//                         value={p.productId}
//                         onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
//                         className="w-full md:w-2/5"
//                       >
//                          {products.map((prod) => (
//                             <option key={prod.id} value={prod.id}>
//                               {prod.name}
//                             </option>
//                           ))}
//                       </Select>
                      
//                       {/* Input de Cantidad */}
//                       <Input
//                         id={`quantity-${index}`}
//                         label="Cantidad"
//                         type="number"
//                         min="1"
//                         value={p.quantity.toString()}
//                         onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
//                         className="w-full md:w-32"
//                       />
                      
//                       {/* Total */}
//                       <div className="flex justify-between items-center w-full md:w-auto md:ml-auto gap-4">
//                         <span className="text-sm font-semibold text-foreground/80 whitespace-nowrap">
//                             Total: <span className="text-lg font-bold text-primary">${lineTotal.toFixed(2)}</span>
//                         </span>
                        
//                         {/* El botón de Quitar ha sido eliminado, forzando al usuario a editar o sustituir el producto */}
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             ) : (
//                  <div className="p-4 text-center text-foreground/70 border-dashed border-2 rounded-lg">
//                     No hay productos en esta compra. Una compra debe tener al menos un producto.
//                  </div>
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
//               {isSubmitting ? "Guardando..." : "Actualizar Compra"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, Package, DollarSign, ListOrdered, Edit, Loader2, AlertTriangle } from "lucide-react"; 
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // 🚨 COMPONENTES DE UI REQUERIDOS
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input"; 
// import { Select } from '@/components/ui/Select'; 

// // Tipos 
// interface Supplier {
//   id: string;
//   name: string;
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
//   invoiceNumber: string;
//   supplierId: string;
//   items: Item[];
// }

// export default function EditarCompraPage() {
//   const { data: session, status } = useSession();
//   const { id } = useParams();
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState("");
//   const [selectedProducts, setSelectedProducts] = useState<Item[]>([]);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [invoiceNumber, setInvoiceNumber] = useState("");

//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Lógica de Carga de Datos
//   useEffect(() => {
//     if (status !== "authenticated" || !session) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;
//         if (!companyId || !token) throw new Error("Faltan datos de sesión.");

//         // Cargar proveedores, productos e información de la orden
//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!supRes.ok) throw new Error("Error cargando proveedores.");
//         if (!prodRes.ok) throw new Error("Error cargando productos.");
//         if (!orderRes.ok) throw new Error("Error cargando orden.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         // Prellenar datos de la orden
//         setSelectedSupplier(orderData.supplierId);
//         setFechaFactura(orderData.date.split("T")[0]);
//         setInvoiceNumber(orderData.invoiceNumber);

//         // Normalizar items con información del producto
//         setSelectedProducts(
//           (orderData.items || []).map((item) => ({
//             ...item,
//             product: prodData.find((p) => p.id === item.productId),
//           }))
//         );
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [session, status, id]);

//   // Lógica de Actualización
//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const token = session?.accessToken;
//       if (!token) throw new Error("No autenticado");

//       const payload = {
//         date: fechaFactura + "T10:30:00Z",
//         invoiceNumber,
//         supplierId: selectedSupplier,
//         // Solo enviar los datos esenciales de los productos
//         products: selectedProducts.map((p) => ({
//           productId: p.productId,
//           quantity: p.quantity,
//         })),
//       };

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la orden.");
//       }

//       toast.success("Orden actualizada con éxito.");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // Lógica de Cálculo
//   const totalQuantity = selectedProducts.reduce((s, p) => s + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce(
//     (s, p) => s + (p.product?.price ?? 0) * p.quantity,
//     0
//   );
  
//   // Lógica de Actualización de Item
//   const handleItemChange = (
//     index: number,
//     field: 'productId' | 'quantity',
//     value: string | number
//   ) => {
//     setSelectedProducts((prev) => {
//       const newProducts = [...prev];
//       if (field === 'productId' && typeof value === 'string') {
//         newProducts[index].productId = value;
//         // La lógica de buscar y adjuntar el producto para el cálculo de precio es crucial
//         newProducts[index].product = products.find((prod) => prod.id === value);
//       } else if (field === 'quantity' && typeof value === 'number') {
//         // Aseguramos que la cantidad sea al menos 1
//         newProducts[index].quantity = Math.max(1, value as number); 
//       }
//       return newProducts;
//     });
//   };


//   if (isLoading) return (
//     <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos de la compra...</p>
//     </div>
//   );
//   if (error) return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error</p>
//         <p className="text-foreground/70">{error}</p>
//         <Link href={PATHROUTES.pymes.compras} className="mt-4">
//           <Button>Volver</Button>
//         </Link>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">
//       {/* 🔹 HEADER */}
//       <div className="flex items-center gap-4 mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           {/* Usando el componente Button */}
//           <Button variant="outline" className="px-3">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
//             <Edit className="h-7 w-7 text-primary" />
//             {/* Título cambiado a plural: "Editar Compras" */}
//             Editar Compras
//         </h1>
//       </div>

//       {/* 🔹 CONTENIDO EN TARJETA (CARD) */}
//       <Card isClickable={false}>
//         <form onSubmit={handleUpdate} className="space-y-6">
          
//           {/* 🔹 SECCIÓN 1: DATOS DE FACTURA Y PROVEEDOR (Grid de 2 columnas) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Número de Factura (Usando <Input>) */}
//             <Input 
//                 id="invoiceNumber" 
//                 label="Número de Factura" 
//                 value={invoiceNumber} 
//                 onChange={(e) => setInvoiceNumber(e.target.value)} 
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
          
//           {/* 🔹 SECCIÓN 2: PRODUCTOS EDITABLES */}
//           <div className="space-y-4 pt-4 border-t border-border">
//             <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <Package className="h-5 w-5 text-primary" /> Productos en la Compra
//             </h3>

//             {selectedProducts.length > 0 ? (
//               <ul className="mt-4 border rounded-md divide-y divide-border bg-muted/20">
//                 {selectedProducts.map((p, index) => {
//                   const lineTotal = (p.product?.price ?? 0) * p.quantity;
//                   return (
//                     <li
//                       key={p.productId + index} // Clave única para la lista
//                       className="flex flex-col md:flex-row gap-2 md:gap-4 items-start md:items-center py-3 px-4"
//                     >
                      
//                       {/* Selector de Producto (Permite cambiar el producto por cualquier otro) */}
//                       <Select
//                         id={`product-${index}`}
//                         label="Producto"
//                         value={p.productId}
//                         onChange={(e) => handleItemChange(index, 'productId', e.target.value)}
//                         className="w-full md:w-2/5"
//                       >
//                          {products.map((prod) => (
//                             <option key={prod.id} value={prod.id}>
//                               {prod.name}
//                             </option>
//                           ))}
//                       </Select>
                      
//                       {/* Input de Cantidad */}
//                       <Input
//                         id={`quantity-${index}`}
//                         label="Cantidad"
//                         type="number"
//                         min="1"
//                         value={p.quantity.toString()}
//                         onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
//                         className="w-full md:w-32"
//                       />
                      
//                       {/* Total */}
//                       <div className="flex justify-between items-center w-full md:w-auto md:ml-auto gap-4">
//                         <span className="text-sm font-semibold text-foreground/80 whitespace-nowrap">
//                             Total: <span className="text-lg font-bold text-primary">${lineTotal.toFixed(2)}</span>
//                         </span>
                        
//                         {/* El botón de Quitar ha sido eliminado, forzando al usuario a editar o sustituir el producto */}
//                       </div>
//                     </li>
//                   );
//                 })}
//               </ul>
//             ) : (
//                  <div className="p-4 text-center text-foreground/70 border-dashed border-2 rounded-lg">
//                     No hay productos en esta compra. Una compra debe tener al menos un producto.
//                  </div>
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
//               {isSubmitting ? "Guardando..." : "Actualizar Compra"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, Plus, X, Package, DollarSign, ListOrdered, Edit, Loader2, AlertTriangle } from "lucide-react"; // Añadido Edit, Loader2, AlertTriangle para el flujo de carga
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation"; // Importado useParams
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // 🚨 COMPONENTES DE UI REQUERIDOS PARA EL ASPECTO IDÉNTICO
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input"; 
// import { Select } from '@/components/ui/Select'; 

// // Tipos requeridos para cargar la orden
// interface Supplier {
//   id: string;
//   name: string;
// }
// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }
// interface Item { // Tipo para los ítems tal como vienen de la API de Order
//   productId: string;
//   quantity: number;
// }
// interface Order { // Tipo para la Orden a editar
//   id: string;
//   date: string;
//   invoiceNumber: string;
//   supplierId: string;
//   items: Item[];
// }

// export default function EditarCompraPage() { // Renombrado de la función
//   const { data: session, status } = useSession();
//   const { id } = useParams(); // ⬅️ OBTENEMOS EL ID PARA LA EDICIÓN
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState<string>("");
//   const [selectedProducts, setSelectedProducts] = useState<
//     { productId: string; quantity: number }[] // Mantenemos la estructura original para la UI de Nueva Compra
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

//   // 1. Lógica de Carga de Datos y PRE-RELLENO (MODIFICADA)
//   useEffect(() => {
//     async function fetchData() {
//       if (status !== "authenticated" || !session || !id) {
//         setIsInitialLoading(false);
//         return;
//       }
     
//       setIsInitialLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;

//         if (!companyId || !token) {
//           throw new Error("Faltan datos de sesión. Por favor, inicia sesión de nuevo.");
//         }

//         // ⬅️ FETCH DE TRES DATOS: Proveedores, Productos y la ORDEN EXISTENTE
//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, // ⬅️ FETCH DE LA ORDEN
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar los proveedores.");
//         if (!prodRes.ok) throw new Error("Error al cargar los productos.");
//         if (!orderRes.ok) throw new Error("Error al cargar la orden de compra.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json(); // ⬅️ ORDEN CARGADA

//         setSuppliers(supData);
//         setProducts(prodData);
        
//         // ⬅️ PRE-RELLENAR CAMPOS CON DATOS DE LA ORDEN
//         setSelectedSupplier(orderData.supplierId);
//         setNumeroFactura(orderData.invoiceNumber);
//         setFechaFactura(orderData.date.split("T")[0]); // Formato YYYY-MM-DD
//         setSelectedProducts(orderData.items); // Usamos los items de la orden
        
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//         toast.error("Hubo un error al cargar los datos.");
//       } finally {
//         setIsInitialLoading(false);
//       }
//     }

//     fetchData();
//   }, [session, status, id]); // Añadido 'id' a las dependencias

//   // 2. Lógica de Manejo de Estado y Productos (INTACTA)
//   const handleCurrentProductChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setCurrentProduct((prev) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
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

//   // 3. Lógica de Actualización (MODIFICADA de handleSave a handleUpdate)
//   const handleUpdate = async (e: React.FormEvent) => {
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
//       // companyId ya no es necesario en PATCH/PUT de la orden
//       supplierId: selectedSupplier,
//       products: selectedProducts.map((p) => ({
//         productId: p.productId,
//         quantity: p.quantity,
//       })),
//     };

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, { // ⬅️ URL con ID
//         method: "PATCH", // ⬅️ CAMBIADO a PATCH
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la compra");
//       }

//       toast.success("¡Compra actualizada con éxito!");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   // 4. Renderizado y Manejo de Carga
//   if (isInitialLoading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos de la compra...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error</p>
//         <p className="text-foreground/70">{error}</p>
//         <Link href={PATHROUTES.pymes.compras} className="mt-4">
//           <Button>Volver</Button>
//         </Link>
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
//         <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
//             <Edit className="h-7 w-7 text-primary" /> {/* Añadido el ícono Edit */}
//             Editar Compras {/* ⬅️ TÍTULO ACTUALIZADO */}
//         </h1>
//       </div>

//       {/* 🔹 CONTENIDO EN TARJETA (CARD) */}
//       <Card isClickable={false}>
//         <form onSubmit={handleUpdate} className="space-y-6"> {/* ⬅️ CAMBIADO a handleUpdate */}
          
//           {/* 🔹 SECCIÓN 1: DATOS DE FACTURA Y PROVEEDOR (Grid de 2 columnas) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Número de Factura (Usando <Input> con dato pre-llenado) */}
//             <Input 
//                 id="numeroFactura" 
//                 label="Número de Factura" 
//                 value={numeroFactura} 
//                 onChange={(e) => setNumeroFactura(e.target.value)} 
//                 required 
//             />
            
//             {/* Fecha de Factura (Usando <Input> con dato pre-llenado) */}
//             <Input
//                 id="fechaFactura"
//                 label="Fecha de Factura"
//                 type="date"
//                 value={fechaFactura}
//                 onChange={(e) => setFechaFactura(e.target.value)}
//                 required
//             />

//             {/* Proveedor (Usando <Select> con dato pre-llenado) */}
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
          
//           {/* 🔹 SECCIÓN 2: PRODUCTOS A COMPRAR (Mantiene la UI de añadir/quitar) */}
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
//                   name="productId" 
//                   label="Producto"
//                   value={currentProduct.productId}
//                   onChange={handleCurrentProductChange} 
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
//                   name="quantity" 
//                   label="Cantidad"
//                   type="number"
//                   min="1"
//                   value={currentProduct.quantity.toString()}
//                   onChange={handleCurrentProductChange} 
//                 />
//               </div>

//               {/* Botón Agregar */}
//               <div className="col-span-full flex justify-end">
//                 <Button
//                   type="button"
//                   onClick={handleAddProduct}
//                   variant="outline" 
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
//                         {details?.name || 'Producto Desconocido'}
//                       </span>
//                       <span className="text-sm text-foreground/80">
//                          {p.quantity} unid. - <span className="font-semibold">${lineTotal.toFixed(2)}</span>
//                       </span>
//                       <Button
//                         type="button"
//                         variant="outline"
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
//               {isSubmitting ? "Guardando..." : "Actualizar Compra"} {/* ⬅️ BOTÓN ACTUALIZADO */}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, Plus, X, Package, DollarSign, ListOrdered, Edit, Loader2, AlertTriangle } from "lucide-react"; 
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation"; // Importado useParams
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // 🚨 COMPONENTES DE UI REQUERIDOS PARA EL ASPECTO IDÉNTICO
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input"; 
// import { Select } from '@/components/ui/Select'; 

// // Tipos requeridos
// interface Supplier {
//   id: string;
//   name: string;
// }
// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }
// interface Item { // Tipo para los ítems tal como vienen de la API de Order
//   productId: string;
//   quantity: number;
// }
// interface Order { // Tipo para la Orden a editar
//   id: string;
//   date: string;
//   invoiceNumber: string;
//   supplierId: string;
//   items: Item[];
// }

// export default function EditarCompraPage() {
//   const { data: session, status } = useSession();
//   const { id } = useParams(); // OBTENEMOS EL ID PARA LA EDICIÓN
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

//   // 1. Lógica de Carga de Datos y PRE-RELLENO
//   useEffect(() => {
//     async function fetchData() {
//       if (status !== "authenticated" || !session || !id) {
//         setIsInitialLoading(false);
//         return;
//       }
     
//       setIsInitialLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;

//         if (!companyId || !token) {
//           throw new Error("Faltan datos de sesión. Por favor, inicia sesión de nuevo.");
//         }

//         // FETCH DE TRES DATOS: Proveedores, Productos y la ORDEN EXISTENTE
//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, 
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar los proveedores.");
//         if (!prodRes.ok) throw new Error("Error al cargar los productos.");
//         if (!orderRes.ok) throw new Error("Error al cargar la orden de compra.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json(); 

//         setSuppliers(supData);
//         setProducts(prodData);
        
//         // PRE-RELLENAR CAMPOS CON DATOS DE LA ORDEN
//         setSelectedSupplier(orderData.supplierId);
//         setNumeroFactura(orderData.invoiceNumber);
//         setFechaFactura(orderData.date.split("T")[0]); 
//         setSelectedProducts(orderData.items); 
        
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//         toast.error("Hubo un error al cargar los datos.");
//       } finally {
//         setIsInitialLoading(false);
//       }
//     }

//     fetchData();
//   }, [session, status, id]);

//   // 2. Lógica de Manejo de Estado y Productos (INTACTA para la UI de Agregar/Quitar)
//   const handleCurrentProductChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     // Asegura que la cantidad sea numérica para el estado
//     setCurrentProduct((prev) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
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

//   // 3. Lógica de Actualización (handleUpdate)
//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (status !== "authenticated" || !session) {
//       toast.error("No estás autenticado.");
//       return;
//     }
    
//     setIsSubmitting(true);
//     const token = session.accessToken;

//     if (!token) {
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
//       supplierId: selectedSupplier,
//       products: selectedProducts.map((p) => ({
//         productId: p.productId,
//         quantity: p.quantity,
//       })),
//     };

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, { 
//         method: "PATCH", // CAMBIADO a PATCH para edición
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la compra");
//       }

//       toast.success("¡Compra actualizada con éxito!");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   // 4. Renderizado y Manejo de Carga
//   if (isInitialLoading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos de la compra...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error</p>
//         <p className="text-foreground/70">{error}</p>
//         <Link href={PATHROUTES.pymes.compras} className="mt-4">
//           <Button>Volver</Button>
//         </Link>
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
//         <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
//             <Edit className="h-7 w-7 text-primary" />
//             Editar Compras {/* TÍTULO ACTUALIZADO */}
//         </h1>
//       </div>

//       {/* 🔹 CONTENIDO EN TARJETA (CARD) */}
//       <Card isClickable={false}>
//         <form onSubmit={handleUpdate} className="space-y-6"> {/* CAMBIADO a handleUpdate */}
          
//           {/* 🔹 SECCIÓN 1: DATOS DE FACTURA Y PROVEEDOR (Grid de 2 columnas) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Número de Factura (Usando <Input> con dato pre-llenado) */}
//             <Input 
//                 id="numeroFactura" 
//                 label="Número de Factura" 
//                 value={numeroFactura} 
//                 onChange={(e) => setNumeroFactura(e.target.value)} 
//                 required 
//             />
            
//             {/* Fecha de Factura (Usando <Input> con dato pre-llenado) */}
//             <Input
//                 id="fechaFactura"
//                 label="Fecha de Factura"
//                 type="date"
//                 value={fechaFactura}
//                 onChange={(e) => setFechaFactura(e.target.value)}
//                 required
//             />

//             {/* Proveedor (Usando <Select> con dato pre-llenado) */}
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
          
//           {/* 🔹 SECCIÓN 2: PRODUCTOS A COMPRAR (ASPECTO DE NUEVA COMPRA) */}
//           <div className="space-y-4 pt-4 border-t border-border">
//             <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <Package className="h-5 w-5 text-primary" /> Productos
//             </h3>

//             {/* Panel de Agregar Producto (Grid de 3 columnas - Igual a Nueva Compra) */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-dashed border-border rounded-lg bg-background/50">
              
//               {/* Selector de Producto */}
//               <div className="md:col-span-2">
//                 <Select
//                   id="currentProduct"
//                   name="productId" 
//                   label="Producto"
//                   value={currentProduct.productId}
//                   onChange={handleCurrentProductChange} 
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
              
//               {/* Campo Cantidad */}
//               <div>
//                 <Input
//                   id="currentQuantity"
//                   name="quantity" 
//                   label="Cantidad"
//                   type="number"
//                   min="1"
//                   value={currentProduct.quantity.toString()}
//                   onChange={handleCurrentProductChange} 
//                 />
//               </div>

//               {/* Botón Agregar */}
//               <div className="col-span-full flex justify-end">
//                 <Button
//                   type="button"
//                   onClick={handleAddProduct}
//                   variant="outline" 
//                   disabled={!currentProduct.productId || currentProduct.quantity <= 0}
//                 >
//                   <Plus className="h-4 w-4 mr-2" /> Agregar
//                 </Button>
//               </div>
//             </div>

//             {/* Lista de Productos Seleccionados (Igual a Nueva Compra) */}
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
//                         {details?.name || 'Producto Desconocido'}
//                       </span>
//                       <span className="text-sm text-foreground/80">
//                          {p.quantity} unid. - <span className="font-semibold">${lineTotal.toFixed(2)}</span>
//                       </span>
//                       <Button
//                         type="button"
//                         variant="outline"
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
//               {isSubmitting ? "Guardando..." : "Actualizar Compra"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, Plus, X, Package, DollarSign, ListOrdered, Edit, Loader2, AlertTriangle } from "lucide-react"; 
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation"; // Importado useParams
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // 🚨 COMPONENTES DE UI REQUERIDOS PARA EL ASPECTO IDÉNTICO
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input"; 
// import { Select } from '@/components/ui/Select'; 

// // Tipos requeridos
// interface Supplier {
//   id: string;
//   name: string;
// }
// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }
// interface Item { // Tipo para los ítems tal como vienen de la API de Order
//   productId: string;
//   quantity: number;
// }
// interface Order { // Tipo para la Orden a editar
//   id: string;
//   date: string;
//   invoiceNumber: string;
//   supplierId: string;
//   items: Item[];
// }

// export default function EditarCompraPage() {
//   const { data: session, status } = useSession();
//   const { id } = useParams(); // OBTENEMOS EL ID PARA LA EDICIÓN
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

//   // 1. Lógica de Carga de Datos y PRE-RELLENO
//   useEffect(() => {
//     async function fetchData() {
//       if (status !== "authenticated" || !session || !id) {
//         setIsInitialLoading(false);
//         return;
//       }
     
//       setIsInitialLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;

//         if (!companyId || !token) {
//           throw new Error("Faltan datos de sesión. Por favor, inicia sesión de nuevo.");
//         }

//         // FETCH DE TRES DATOS: Proveedores, Productos y la ORDEN EXISTENTE
//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, 
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar los proveedores.");
//         if (!prodRes.ok) throw new Error("Error al cargar los productos.");
//         if (!orderRes.ok) throw new Error("Error al cargar la orden de compra.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json(); 

//         setSuppliers(supData);
//         setProducts(prodData);
        
//         // PRE-RELLENAR CAMPOS CON DATOS DE LA ORDEN
//         setSelectedSupplier(orderData.supplierId);
//         setNumeroFactura(orderData.invoiceNumber);
//         setFechaFactura(orderData.date.split("T")[0]); 
//         setSelectedProducts(orderData.items); 
        
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//         toast.error("Hubo un error al cargar los datos.");
//       } finally {
//         setIsInitialLoading(false);
//       }
//     }

//     fetchData();
//   }, [session, status, id]);

//   // 2. Lógica de Manejo de Estado y Productos (INTACTA para la UI de Agregar/Quitar)
//   const handleCurrentProductChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     // Asegura que la cantidad sea numérica para el estado
//     setCurrentProduct((prev) => ({ ...prev, [name]: name === 'quantity' ? Number(value) : value }));
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

//   // 3. Lógica de Actualización (handleUpdate)
//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();

//     if (status !== "authenticated" || !session) {
//       toast.error("No estás autenticado.");
//       return;
//     }
    
//     setIsSubmitting(true);
//     const token = session.accessToken;

//     if (!token) {
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
//       supplierId: selectedSupplier,
//       products: selectedProducts.map((p) => ({
//         productId: p.productId,
//         quantity: p.quantity,
//       })),
//     };

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, { 
//         method: "PATCH", // CAMBIADO a PATCH para edición
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la compra");
//       }

//       toast.success("¡Compra actualizada con éxito!");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };


//   // 4. Renderizado y Manejo de Carga
//   if (isInitialLoading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos de la compra...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error</p>
//         <p className="text-foreground/70">{error}</p>
//         <Link href={PATHROUTES.pymes.compras} className="mt-4">
//           <Button>Volver</Button>
//         </Link>
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
//         <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
//             <Edit className="h-7 w-7 text-primary" />
//             Editar Compras {/* TÍTULO ACTUALIZADO */}
//         </h1>
//       </div>

//       {/* 🔹 CONTENIDO EN TARJETA (CARD) */}
//       <Card isClickable={false}>
//         <form onSubmit={handleUpdate} className="space-y-6"> {/* CAMBIADO a handleUpdate */}
          
//           {/* 🔹 SECCIÓN 1: DATOS DE FACTURA Y PROVEEDOR (Grid de 2 columnas) */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
//             {/* Número de Factura (Usando <Input> con dato pre-llenado) */}
//             <Input 
//                 id="numeroFactura" 
//                 label="Número de Factura" 
//                 value={numeroFactura} 
//                 onChange={(e) => setNumeroFactura(e.target.value)} 
//                 required 
//             />
            
//             {/* Fecha de Factura (Usando <Input> con dato pre-llenado) */}
//             <Input
//                 id="fechaFactura"
//                 label="Fecha de Factura"
//                 type="date"
//                 value={fechaFactura}
//                 onChange={(e) => setFechaFactura(e.target.value)}
//                 required
//             />

//             {/* Proveedor (Usando <Select> con dato pre-llenado) */}
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
          
//           {/* 🔹 SECCIÓN 2: PRODUCTOS A COMPRAR (ASPECTO DE NUEVA COMPRA) */}
//           <div className="space-y-4 pt-4 border-t border-border">
//             <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//                 <Package className="h-5 w-5 text-primary" /> Productos
//             </h3>

//             {/* Panel de Agregar Producto (Grid de 3 columnas - Igual a Nueva Compra) */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-dashed border-border rounded-lg bg-background/50">
              
//               {/* Selector de Producto */}
//               <div className="md:col-span-2">
//                 <Select
//                   id="currentProduct"
//                   name="productId" 
//                   label="Producto"
//                   value={currentProduct.productId}
//                   onChange={handleCurrentProductChange} 
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
              
//               {/* Campo Cantidad */}
//               <div>
//                 <Input
//                   id="currentQuantity"
//                   name="quantity" 
//                   label="Cantidad"
//                   type="number"
//                   min="1"
//                   value={currentProduct.quantity.toString()}
//                   onChange={handleCurrentProductChange} 
//                 />
//               </div>

//               {/* Botón Agregar */}
//               <div className="col-span-full flex justify-end">
//                 <Button
//                   type="button"
//                   onClick={handleAddProduct}
//                   variant="outline" 
//                   disabled={!currentProduct.productId || currentProduct.quantity <= 0}
//                 >
//                   <Plus className="h-4 w-4 mr-2" /> Agregar
//                 </Button>
//               </div>
//             </div>

//             {/* Lista de Productos Seleccionados (Igual a Nueva Compra) */}
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
//                         {details?.name || 'Producto Desconocido'}
//                       </span>
//                       <span className="text-sm text-foreground/80">
//                          {p.quantity} unid. - <span className="font-semibold">${lineTotal.toFixed(2)}</span>
//                       </span>
//                       <Button
//                         type="button"
//                         variant="outline"
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
//               {isSubmitting ? "Guardando..." : "Actualizar Compra"}
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
// import { useRouter, useParams } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Select } from "@/components/ui/Select";

// interface Supplier {
//   id: string;
//   name: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// interface OrderProduct {
//   productId: string;
//   quantity: number;
// }

// interface Order {
//   id: string;
//   invoiceNumber: string;
//   date: string;
//   supplierId: string;
//   products: OrderProduct[];
// }

// export default function EditarCompraPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const params = useParams();

//   const compraId = params?.id as string;

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState<string>("");
//   const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([]);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [numeroFactura, setNumeroFactura] = useState("");

//   const [currentProduct, setCurrentProduct] = useState({
//     productId: "",
//     quantity: 1,
//   });

//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // 🔹 Fetch datos iniciales (proveedores, productos y la compra a editar)
//   useEffect(() => {
//     async function fetchData() {
//       if (status !== "authenticated" || !session) {
//         setIsInitialLoading(false);
//         return;
//       }

//       try {
//         setIsInitialLoading(true);
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;

//         if (!companyId || !token) {
//           setError("Faltan datos de sesión.");
//           setIsInitialLoading(false);
//           return;
//         }

//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${compraId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar proveedores.");
//         if (!prodRes.ok) throw new Error("Error al cargar productos.");
//         if (!orderRes.ok) throw new Error("Error al cargar la compra.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         // 🔹 Rellenar datos de la compra en el formulario
//         setNumeroFactura(orderData.invoiceNumber);
//         setFechaFactura(orderData.date.split("T")[0]); // Formato YYYY-MM-DD
//         setSelectedSupplier(orderData.supplierId);
//         setSelectedProducts(orderData.products);
//       } catch (err) {
//         console.error(err);
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//       } finally {
//         setIsInitialLoading(false);
//       }
//     }

//     if (compraId) fetchData();
//   }, [session, status, compraId]);

//   // 🔹 Manejo de inputs
//   const handleCurrentProductChange = (
//     e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
//   ) => {
//     const { name, value } = e.target;
//     setCurrentProduct((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleAddProduct = () => {
//     if (currentProduct.productId && currentProduct.quantity > 0) {
//       const exists = selectedProducts.some((p) => p.productId === currentProduct.productId);
//       if (exists) {
//         toast.error("Este producto ya está en la lista.");
//         return;
//       }
//       setSelectedProducts((prev) => [
//         ...prev,
//         { ...currentProduct, quantity: Number(currentProduct.quantity) },
//       ]);
//       setCurrentProduct({ productId: "", quantity: 1 });
//     } else {
//       toast.error("Selecciona un producto válido.");
//     }
//   };

//   const handleRemoveProduct = (productId: string) => {
//     setSelectedProducts((prev) => prev.filter((p) => p.productId !== productId));
//   };

//   const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce((sum, p) => {
//     const prod = products.find((pr) => pr.id === p.productId);
//     return sum + (prod?.price ?? 0) * p.quantity;
//   }, 0);

//   // 🔹 Guardar cambios
//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (status !== "authenticated" || !session) return;

//     try {
//       setIsSubmitting(true);
//       const companyId = session.user?.companyId;
//       const token = session.accessToken;

//       const payload = {
//         date: fechaFactura + "T10:30:00Z",
//         invoiceNumber: numeroFactura,
//         companyId,
//         supplierId: selectedSupplier,
//         products: selectedProducts,
//       };

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${compraId}`, {
//         method: "PUT", // ⬅️ IMPORTANTE
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la compra");
//       }

//       toast.success("Compra actualizada con éxito");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // 🔹 Renderizado
//   if (isInitialLoading) {
//     return (
//       <div className="p-8 flex flex-col justify-center items-center">
//         <ListOrdered className="animate-spin h-10 w-10 text-primary" />
//         <p className="mt-2 text-foreground/60">Cargando datos...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 text-red-500 text-center">
//         <p>Error: {error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       {/* HEADER */}
//       <div className="flex items-center gap-4 mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           <Button variant="outline">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold">Editar Compra</h1>
//       </div>

//       {/* FORMULARIO */}
//       <Card isClickable={false}>
//         <form onSubmit={handleUpdate} className="space-y-6">
//           {/* FACTURA + PROVEEDOR */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Input
//               id="numeroFactura"
//               label="Número de Factura"
//               value={numeroFactura}
//               onChange={(e) => setNumeroFactura(e.target.value)}
//               required
//             />
//             <Input
//               id="fechaFactura"
//               label="Fecha de Factura"
//               type="date"
//               value={fechaFactura}
//               onChange={(e) => setFechaFactura(e.target.value)}
//               required
//             />
//             <Select
//               id="proveedor"
//               label="Proveedor"
//               value={selectedSupplier}
//               onChange={(e) => setSelectedSupplier(e.target.value)}
//               required
//             >
//               <option value="" disabled>Selecciona un proveedor</option>
//               {suppliers.map((s) => (
//                 <option key={s.id} value={s.id}>{s.name}</option>
//               ))}
//             </Select>
//           </div>

//           {/* PRODUCTOS */}
//           <div className="space-y-4 border-t pt-4">
//             <h3 className="text-lg font-semibold flex items-center gap-2">
//               <Package className="h-5 w-5 text-primary" /> Productos
//             </h3>

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-md">
//               <div className="md:col-span-2">
//                 <Select
//                   id="currentProduct"
//                   name="productId"
//                   label="Producto"
//                   value={currentProduct.productId}
//                   onChange={handleCurrentProductChange}
//                 >
//                   <option value="" disabled>Selecciona un producto</option>
//                   {products
//                     .filter((p) => !selectedProducts.some((sp) => sp.productId === p.id))
//                     .map((p) => (
//                       <option key={p.id} value={p.id}>{p.name}</option>
//                     ))}
//                 </Select>
//               </div>
//               <Input
//                 id="currentQuantity"
//                 name="quantity"
//                 label="Cantidad"
//                 type="number"
//                 min="1"
//                 value={currentProduct.quantity.toString()}
//                 onChange={handleCurrentProductChange}
//               />
//               <div className="col-span-full flex justify-end">
//                 <Button type="button" variant="outline" onClick={handleAddProduct}>
//                   <Plus className="h-4 w-4 mr-2" /> Agregar
//                 </Button>
//               </div>
//             </div>

//             {selectedProducts.length > 0 && (
//               <ul className="mt-4 border rounded-md divide-y">
//                 {selectedProducts.map((p) => {
//                   const details = products.find((pr) => pr.id === p.productId);
//                   const lineTotal = (details?.price ?? 0) * p.quantity;
//                   return (
//                     <li key={p.productId} className="flex justify-between items-center p-3">
//                       <span>{details?.name}</span>
//                       <span>{p.quantity} unid. - ${lineTotal.toFixed(2)}</span>
//                       <Button
//                         type="button"
//                         variant="outline"
//                         className="text-red-500 h-8 w-8"
//                         onClick={() => handleRemoveProduct(p.productId)}
//                       >
//                         <X className="h-4 w-4" />
//                       </Button>
//                     </li>
//                   );
//                 })}
//               </ul>
//             )}
//           </div>

//           {/* TOTALES */}
//           <div className="border-t pt-4 space-y-2">
//             <div className="flex justify-between">
//               <span>Total artículos:</span>
//               <span>{totalQuantity}</span>
//             </div>
//             <div className="flex justify-between font-bold text-primary">
//               <span>Total Estimado:</span>
//               <span>${totalPrice.toFixed(2)}</span>
//             </div>
//           </div>

//           {/* BOTONES */}
//           <div className="flex justify-end gap-4 pt-4">
//             <Link href={PATHROUTES.pymes.compras}>
//               <Button variant="outline">Cancelar</Button>
//             </Link>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Guardando..." : "Guardar Cambios"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, Package, DollarSign, ListOrdered } from "lucide-react";
// import Link from "next/link";
// import { useRouter, useParams } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Select } from "@/components/ui/Select";

// interface Supplier {
//   id: string;
//   name: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// interface OrderProduct {
//   productId: string;
//   quantity: number;
// }

// interface Order {
//   id: string;
//   invoiceNumber: string;
//   date: string;
//   supplierId: string;
//   products: OrderProduct[];
// }

// export default function EditarCompraPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const params = useParams();

//   const compraId = params?.id as string;

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState<string>("");
//   const [selectedProducts, setSelectedProducts] = useState<OrderProduct[]>([]);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [numeroFactura, setNumeroFactura] = useState("");

//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // 🔹 Fetch inicial
//   useEffect(() => {
//     async function fetchData() {
//       if (status !== "authenticated" || !session) {
//         setIsInitialLoading(false);
//         return;
//       }

//       try {
//         setIsInitialLoading(true);
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;

//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${compraId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar proveedores.");
//         if (!prodRes.ok) throw new Error("Error al cargar productos.");
//         if (!orderRes.ok) throw new Error("Error al cargar la compra.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         setNumeroFactura(orderData.invoiceNumber);
//         setFechaFactura(orderData.date.split("T")[0]);
//         setSelectedSupplier(orderData.supplierId);
//         setSelectedProducts(orderData.products);
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//       } finally {
//         setIsInitialLoading(false);
//       }
//     }

//     if (compraId) fetchData();
//   }, [session, status, compraId]);

//   const totalQuantity = selectedProducts.reduce((sum, p) => sum + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce((sum, p) => {
//     const prod = products.find((pr) => pr.id === p.productId);
//     return sum + (prod?.price ?? 0) * p.quantity;
//   }, 0);

//   // 🔹 Guardar cambios
//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (status !== "authenticated" || !session) return;

//     try {
//       setIsSubmitting(true);
//       const companyId = session.user?.companyId;
//       const token = session.accessToken;

//       const payload = {
//         date: fechaFactura + "T10:30:00Z",
//         invoiceNumber: numeroFactura,
//         companyId,
//         supplierId: selectedSupplier,
//         products: selectedProducts, // 🔹 ya vienen cargados, no se pueden borrar
//       };

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${compraId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la compra");
//       }

//       toast.success("Compra actualizada con éxito");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // 🔹 Render
//   if (isInitialLoading) {
//     return (
//       <div className="p-8 text-center">
//         <ListOrdered className="animate-spin h-10 w-10 mx-auto text-primary" />
//         <p className="mt-2 text-foreground/60">Cargando datos...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return <div className="p-8 text-red-500 text-center">Error: {error}</div>;
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex items-center gap-4 mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           <Button variant="outline">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold">Editar Compra</h1>
//       </div>

//       <Card isClickable={false}>
//         <form onSubmit={handleUpdate} className="space-y-6">
//           {/* Factura */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Input
//               id="numeroFactura"
//               label="Número de Factura"
//               value={numeroFactura}
//               onChange={(e) => setNumeroFactura(e.target.value)}
//               required
//             />
//             <Input
//               id="fechaFactura"
//               label="Fecha de Factura"
//               type="date"
//               value={fechaFactura}
//               onChange={(e) => setFechaFactura(e.target.value)}
//               required
//             />
//             <Select
//               id="proveedor"
//               label="Proveedor"
//               value={selectedSupplier}
//               onChange={(e) => setSelectedSupplier(e.target.value)}
//               required
//             >
//               <option value="" disabled>Selecciona un proveedor</option>
//               {suppliers.map((s) => (
//                 <option key={s.id} value={s.id}>{s.name}</option>
//               ))}
//             </Select>
//           </div>

//           {/* Productos - SOLO VISUALIZAR/EDITAR, SIN ELIMINAR */}
//           <div className="space-y-4 border-t pt-4">
//             <h3 className="text-lg font-semibold flex items-center gap-2">
//               <Package className="h-5 w-5 text-primary" /> Productos
//             </h3>

//             {selectedProducts.map((p, index) => {
//               const details = products.find((pr) => pr.id === p.productId);
//               return (
//                 <div
//                   key={index}
//                   className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border rounded-md bg-background/50"
//                 >
//                   {/* Producto en select (bloqueado) */}
//                   <Select
//                     id={`product-${index}`}
//                     label="Producto"
//                     value={p.productId}
//                     onChange={() => {}}
//                     disabled
//                   >
//                     {products.map((pr) => (
//                       <option key={pr.id} value={pr.id}>
//                         {pr.name}
//                       </option>
//                     ))}
//                   </Select>

//                   {/* Cantidad */}
//                   <Input
//                     id={`quantity-${index}`}
//                     label="Cantidad"
//                     type="number"
//                     value={p.quantity.toString()}
//                     onChange={(e) => {
//                       const newQty = Number(e.target.value);
//                       setSelectedProducts((prev) =>
//                         prev.map((sp, i) =>
//                           i === index ? { ...sp, quantity: newQty } : sp
//                         )
//                       );
//                     }}
//                   />

//                   {/* Precio */}
//                   <div className="flex flex-col justify-end">
//                     <p className="text-sm text-foreground/60">Precio Unitario</p>
//                     <p className="font-semibold">
//                       ${details?.price?.toFixed(2) ?? "0.00"}
//                     </p>
//                   </div>
//                 </div>
//               );
//             })}
//           </div>

//           {/* Totales */}
//           <div className="border-t pt-4 space-y-2">
//             <div className="flex justify-between">
//               <span>Total artículos:</span>
//               <span>{totalQuantity}</span>
//             </div>
//             <div className="flex justify-between font-bold text-primary">
//               <span>Total Estimado:</span>
//               <span>${totalPrice.toFixed(2)}</span>
//             </div>
//           </div>

//           {/* Botones */}
//           <div className="flex justify-end gap-4 pt-4">
//             <Link href={PATHROUTES.pymes.compras}>
//               <Button variant="outline">Cancelar</Button>
//             </Link>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Guardando..." : "Guardar Cambios"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Select } from "@/components/ui/Select";

// import { ArrowLeft, ListOrdered, Package, DollarSign, Loader2 } from "lucide-react";

// // Tipos
// interface Supplier {
//   id: string;
//   name: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// interface OrderProduct {
//   productId: string;
//   quantity: number;
// }

// interface Order {
//   id: string;
//   invoiceNumber?: string;
//   date: string;
//   supplierId: string;
//   products: OrderProduct[];
// }

// export default function EditarCompraPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { data: session, status } = useSession();
//   const orderId = params?.id as string;

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState<string>("");
//   const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
//   const [fechaFactura, setFechaFactura] = useState<string>("");
//   const [numeroFactura, setNumeroFactura] = useState<string>("");

//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // Cargar proveedores, productos y la orden
//   useEffect(() => {
//     const fetchData = async () => {
//       if (status !== "authenticated" || !session || !orderId) {
//         setIsInitialLoading(false);
//         return;
//       }

//       setIsInitialLoading(true);
//       setError(null);

//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;

//         if (!companyId || !token) {
//           throw new Error("Faltan datos de sesión (companyId / token).");
//         }

//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar proveedores.");
//         if (!prodRes.ok) throw new Error("Error al cargar productos.");
//         if (!orderRes.ok) throw new Error("Error al cargar la compra.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         setNumeroFactura(orderData.invoiceNumber ?? "");
//         // Si la API devuelve fecha con T, la recortamos a yyyy-mm-dd para el input date
//         setFechaFactura(orderData.date ? orderData.date.split("T")[0] : "");
//         setSelectedSupplier(orderData.supplierId ?? "");
//         // aseguramos el formato
//         setOrderProducts(
//           (orderData.products ?? []).map((p) => ({
//             productId: p.productId,
//             quantity: Number(p.quantity) || 1,
//           }))
//         );
//       } catch (err) {
//         const msg = err instanceof Error ? err.message : "Error desconocido";
//         setError(msg);
//         toast.error(msg);
//       } finally {
//         setIsInitialLoading(false);
//       }
//     };

//     fetchData();
//   }, [session, status, orderId]);

//   // Totales
//   const totalQuantity = orderProducts.reduce((s, p) => s + (p.quantity || 0), 0);
//   const totalPrice = orderProducts.reduce((s, p) => {
//     const prod = products.find((x) => x.id === p.productId);
//     return s + (prod?.price ?? 0) * (p.quantity || 0);
//   }, 0);

//   // Actualizar cantidad (si permites editar cantidades)
//   const handleQuantityChange = (index: number, value: string) => {
//     const qty = Math.max(0, Number(value || 0));
//     setOrderProducts((prev) =>
//       prev.map((op, i) => (i === index ? { ...op, quantity: qty } : op))
//     );
//   };

//   // Guardar cambios (PUT)
//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (status !== "authenticated" || !session) {
//       toast.error("No estás autenticado.");
//       return;
//     }

//     setIsSubmitting(true);
//     try {
//       const companyId = session.user?.companyId;
//       const token = session.accessToken;
//       if (!companyId || !token) throw new Error("Faltan datos de sesión.");

//       const payload = {
//         date: fechaFactura ? fechaFactura + "T10:30:00Z" : undefined,
//         invoiceNumber: numeroFactura || undefined,
//         companyId,
//         supplierId: selectedSupplier,
//         products: orderProducts,
//       };

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json().catch(() => ({}));
//         throw new Error(errData.message || "Error al actualizar la compra.");
//       }

//       toast.success("Compra actualizada con éxito.");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       const msg = err instanceof Error ? err.message : "Error desconocido";
//       toast.error(msg);
//       setError(msg);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isInitialLoading) {
//     return (
//       <div className="p-8 h-full flex flex-col items-center justify-center">
//         <Loader2 className="animate-spin h-10 w-10 text-primary" />
//         <p className="mt-3 text-foreground/70">Cargando compra...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col items-center justify-center">
//         <p className="text-red-500 mb-4">Error: {error}</p>
//         <Link href={PATHROUTES.pymes.compras}>
//           <Button variant="outline">Volver a Compras</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex items-center gap-4 mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           <Button variant="outline" className="px-3">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold">Editar Compra</h1>
//       </div>

//       <Card isClickable={false}>
//         <form onSubmit={handleUpdate} className="space-y-6">
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Input
//               id="numeroFactura"
//               label="Número de Factura"
//               value={numeroFactura}
//               onChange={(e) => setNumeroFactura(e.target.value)}
//             />
//             <Input
//               id="fechaFactura"
//               label="Fecha de Factura"
//               type="date"
//               value={fechaFactura}
//               onChange={(e) => setFechaFactura(e.target.value)}
//             />
//             <Select
//               id="proveedor"
//               label="Proveedor"
//               value={selectedSupplier}
//               onChange={(e) => setSelectedSupplier(e.target.value)}
//             >
//               <option value="" disabled>
//                 Selecciona un proveedor
//               </option>
//               {suppliers.map((s) => (
//                 <option key={s.id} value={s.id}>
//                   {s.name}
//                 </option>
//               ))}
//             </Select>
//           </div>

//           {/* Productos: mostrados en select (disabled) y cantidad editable; sin botón eliminar */}
//           <div className="space-y-4 pt-4 border-t border-border">
//             <h3 className="text-lg font-semibold flex items-center gap-2">
//               <Package className="h-5 w-5 text-primary" /> Productos
//             </h3>

//             {orderProducts.length === 0 ? (
//               <p className="text-sm text-foreground/60">No hay productos en esta compra.</p>
//             ) : (
//               <div className="space-y-4">
//                 {orderProducts.map((op, idx) => {
//                   const details = products.find((p) => p.id === op.productId);
//                   return (
//                     <div
//                       key={op.productId + "-" + idx}
//                       className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-md bg-background/50"
//                     >
//                       <Select
//                         id={`product-${idx}`}
//                         label="Producto"
//                         value={op.productId}
//                         onChange={() => {}}
//                         disabled
//                       >
//                         {products.map((pr) => (
//                           <option key={pr.id} value={pr.id}>
//                             {pr.name}
//                           </option>
//                         ))}
//                       </Select>

//                       <Input
//                         id={`qty-${idx}`}
//                         label="Cantidad"
//                         type="number"
//                         min={0}
//                         value={String(op.quantity)}
//                         onChange={(e) => handleQuantityChange(idx, e.target.value)}
//                       />

//                       <div className="flex flex-col justify-end">
//                         <p className="text-sm text-foreground/60">Precio unitario</p>
//                         <p className="font-semibold">
//                           ${((details?.price ?? 0)).toFixed(2)}
//                         </p>
//                       </div>
//                     </div>
//                   );
//                 })}
//               </div>
//             )}
//           </div>

//           {/* Totales */}
//           <div className="border-t pt-4 mt-2 space-y-2">
//             <div className="flex justify-between">
//               <p className="text-sm font-semibold flex items-center gap-2">
//                 <ListOrdered className="h-4 w-4" /> Cantidad total:
//               </p>
//               <p className="font-semibold">{totalQuantity}</p>
//             </div>
//             <div className="flex justify-between items-center">
//               <p className="text-lg font-bold flex items-center gap-2 text-primary">
//                 <DollarSign className="h-5 w-5" /> Total
//               </p>
//               <p className="text-2xl font-extrabold text-primary">${totalPrice.toFixed(2)}</p>
//             </div>
//           </div>

//           {/* Acciones */}
//           <div className="flex justify-end gap-4 pt-4">
//             <Link href={PATHROUTES.pymes.compras}>
//               <Button variant="outline" type="button">
//                 Cancelar
//               </Button>
//             </Link>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Guardando..." : "Guardar cambios"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, DollarSign, ListOrdered, Package } from "lucide-react";
// import Link from "next/link";
// import { useRouter, useParams } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Select } from "@/components/ui/Select";

// interface Supplier {
//   id: string;
//   name: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// interface Order {
//   id: string;
//   invoiceNumber: string;
//   date: string;
//   supplierId: string;
//   products: { productId: string; quantity: number }[];
// }

// export default function EditarCompraPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const params = useParams();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [order, setOrder] = useState<Order | null>(null);

//   const [numeroFactura, setNumeroFactura] = useState("");
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [selectedSupplier, setSelectedSupplier] = useState("");
//   const [orderProducts, setOrderProducts] = useState<
//     { productId: string; quantity: number }[]
//   >([]);

//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   // 🔹 Cargar datos iniciales (orden + proveedores + productos)
//   useEffect(() => {
//     async function fetchData() {
//       if (status !== "authenticated" || !session) return;

//       const companyId = session.user?.companyId;
//       const token = session.accessToken;
//       const orderId = params?.id as string;

//       if (!companyId || !token || !orderId) return;

//       setIsLoading(true);
//       try {
//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${orderId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar proveedores");
//         if (!prodRes.ok) throw new Error("Error al cargar productos");
//         if (!orderRes.ok) throw new Error("Error al cargar la compra");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);
//         setOrder(orderData);

//         // Rellenar formulario
//         setNumeroFactura(orderData.invoiceNumber);
//         setFechaFactura(orderData.date.split("T")[0]);
//         setSelectedSupplier(orderData.supplierId);
//         setOrderProducts(orderData.products);
//       } catch (err) {
//         toast.error("Error al cargar datos de la compra");
//         console.error(err);
//       } finally {
//         setIsLoading(false);
//       }
//     }

//     fetchData();
//   }, [session, status, params]);

//   // 🔹 Guardar cambios
//   const handleSave = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!order) return;

//     setIsSubmitting(true);
//     try {
//       const companyId = session?.user?.companyId;
//       const token = session?.accessToken;
//       if (!companyId || !token) {
//         toast.error("Faltan datos de sesión.");
//         return;
//       }

//       const payload = {
//         date: fechaFactura + "T10:30:00Z",
//         invoiceNumber: numeroFactura,
//         companyId,
//         supplierId: selectedSupplier,
//         products: orderProducts,
//       };

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/orders/${order.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la compra");
//       }

//       toast.success("¡Compra actualizada con éxito!");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       toast.error(
//         err instanceof Error ? err.message : "Error al actualizar la compra"
//       );
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // 🔹 Calcular totales
//   const totalQuantity = orderProducts.reduce((sum, p) => sum + p.quantity, 0);
//   const totalPrice = orderProducts.reduce((sum, p) => {
//     const product = products.find((pr) => pr.id === p.productId);
//     return sum + (product?.price ?? 0) * p.quantity;
//   }, 0);

//   if (isLoading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <ListOrdered className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando compra...</p>
//       </div>
//     );
//   }

//   if (!order) {
//     return (
//       <div className="p-8 text-center text-red-500">
//         No se encontró la compra solicitada.
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
//         <h1 className="text-3xl font-bold text-foreground">
//           Editar Compra #{order.invoiceNumber}
//         </h1>
//       </div>

//       {/* 🔹 FORMULARIO */}
//       <Card isClickable={false}>
//         <form onSubmit={handleSave} className="space-y-6">
//           {/* Datos principales */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Input
//               id="numeroFactura"
//               label="Número de Factura"
//               value={numeroFactura}
//               onChange={(e) => setNumeroFactura(e.target.value)}
//               required
//             />
//             <Input
//               id="fechaFactura"
//               label="Fecha de Factura"
//               type="date"
//               value={fechaFactura}
//               onChange={(e) => setFechaFactura(e.target.value)}
//               required
//             />
//             <Select
//               id="proveedor"
//               label="Proveedor"
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
//             </Select>
//           </div>

//           {/* Productos */}
//           <div className="space-y-4 pt-4 border-t border-border">
//             <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//               <Package className="h-5 w-5 text-primary" /> Productos
//             </h3>

//             <ul className="space-y-4">
//               {orderProducts.map((op, idx) => {
//                 const details = products.find((pr) => pr.id === op.productId);
//                 const lineTotal = (details?.price ?? 0) * op.quantity;

//                 return (
//                   <li
//                     key={idx}
//                     className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center p-4 border rounded-md bg-muted/20"
//                   >
//                     {/* 🔹 Selector de producto (editable) */}
//                     <Select
//                       id={`product-${idx}`}
//                       label="Producto"
//                       value={op.productId}
//                       onChange={(e) =>
//                         setOrderProducts((prev) =>
//                           prev.map((item, i) =>
//                             i === idx
//                               ? { ...item, productId: e.target.value }
//                               : item
//                           )
//                         )
//                       }
//                     >
//                       {products.map((pr) => (
//                         <option key={pr.id} value={pr.id}>
//                           {pr.name}
//                         </option>
//                       ))}
//                     </Select>

//                     {/* 🔹 Cantidad */}
//                     <Input
//                       id={`quantity-${idx}`}
//                       label="Cantidad"
//                       type="number"
//                       min="1"
//                       value={op.quantity.toString()}
//                       onChange={(e) =>
//                         setOrderProducts((prev) =>
//                           prev.map((item, i) =>
//                             i === idx
//                               ? { ...item, quantity: Number(e.target.value) }
//                               : item
//                           )
//                         )
//                       }
//                     />

//                     {/* 🔹 Total por producto */}
//                     <div className="text-right font-semibold text-foreground">
//                       ${lineTotal.toFixed(2)}
//                     </div>
//                   </li>
//                 );
//               })}
//             </ul>
//           </div>

//           {/* Totales */}
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
//               <p className="text-2xl font-extrabold text-primary">
//                 ${totalPrice.toFixed(2)}
//               </p>
//             </div>
//           </div>

//           {/* Botones */}
//           <div className="flex justify-end gap-4 pt-4">
//             <Link href={PATHROUTES.pymes.compras}>
//               <Button variant="outline" type="button">
//                 Cancelar
//               </Button>
//             </Link>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Guardando..." : "Guardar Cambios"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft, DollarSign, ListOrdered } from "lucide-react";
// import Link from "next/link";
// import { useRouter, useParams } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { Select } from "@/components/ui/Select";

// interface Supplier {
//   id: string;
//   name: string;
// }

// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// interface OrderProduct {
//   productId: string;
//   quantity: number;
// }

// export default function EditarCompraPage() {
//   const { data: session, status } = useSession();
//   const router = useRouter();
//   const params = useParams();
//   const { id } = params as { id: string };

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState<string>("");
//   const [orderProducts, setOrderProducts] = useState<OrderProduct[]>([]);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [numeroFactura, setNumeroFactura] = useState("");

//   const [isInitialLoading, setIsInitialLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   // 🔹 Cargar datos iniciales
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

//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!supRes.ok) throw new Error("Error al cargar los proveedores.");
//         if (!prodRes.ok) throw new Error("Error al cargar los productos.");
//         if (!orderRes.ok) throw new Error("Error al cargar la compra.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData = await orderRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         setSelectedSupplier(orderData.supplierId || "");
//         setFechaFactura(orderData.date?.split("T")[0] || "");
//         setNumeroFactura(orderData.invoiceNumber || "");
//         setOrderProducts(orderData.products || []); // ✅ Siempre array
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//         toast.error("Hubo un error al cargar los datos.");
//       } finally {
//         setIsInitialLoading(false);
//       }
//     }

//     fetchData();
//   }, [session, status, id]);

//   // 🔹 Manejo de cambios en productos
//   const handleProductChange = (
//     index: number,
//     field: "productId" | "quantity",
//     value: string
//   ) => {
//     setOrderProducts((prev) =>
//       prev.map((p, i) =>
//         i === index ? { ...p, [field]: field === "quantity" ? Number(value) : value } : p
//       )
//     );
//   };

//   // 🔹 Calcular totales (protección contra undefined)
//   const totalQuantity = (orderProducts ?? []).reduce(
//     (sum, p) => sum + p.quantity,
//     0
//   );

//   const totalPrice = (orderProducts ?? []).reduce((sum, p) => {
//     const product = products.find((pr) => pr.id === p.productId);
//     return sum + (product?.price ?? 0) * p.quantity;
//   }, 0);

//   // 🔹 Guardar cambios
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

//     if (!selectedSupplier || orderProducts.length === 0 || !numeroFactura) {
//       toast.error("Completa todos los campos obligatorios.");
//       setIsSubmitting(false);
//       return;
//     }

//     const payload = {
//       date: fechaFactura + "T10:30:00Z",
//       invoiceNumber: numeroFactura,
//       companyId,
//       supplierId: selectedSupplier,
//       products: orderProducts.map((p) => ({
//         productId: p.productId,
//         quantity: p.quantity,
//       })),
//     };

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//         method: "PUT",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la compra");
//       }

//       toast.success("¡Compra actualizada con éxito!");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       console.error("Error:", err);
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   // 🔹 UI
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
//         <h1 className="text-3xl font-bold text-foreground">Editar Compra</h1>
//       </div>

//       <Card isClickable={false}>
//         <form onSubmit={handleSave} className="space-y-6">
//           {/* 🔹 Factura y proveedor */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//             <Input
//               id="numeroFactura"
//               label="Número de Factura"
//               value={numeroFactura}
//               onChange={(e) => setNumeroFactura(e.target.value)}
//               required
//             />

//             <Input
//               id="fechaFactura"
//               label="Fecha de Factura"
//               type="date"
//               value={fechaFactura}
//               onChange={(e) => setFechaFactura(e.target.value)}
//               required
//             />

//             <Select
//               id="proveedor"
//               label="Proveedor"
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
//             </Select>
//           </div>

//           {/* 🔹 Productos */}
//           <div className="space-y-4 pt-4 border-t border-border">
//             <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
//               Productos
//             </h3>

//             {orderProducts.map((p, index) => (
//               <div
//                 key={index}
//                 className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 border border-dashed border-border rounded-lg bg-background/50"
//               >
//                 <Select
//                   id={`product-${index}`}
//                   name="productId"
//                   label="Producto"
//                   value={p.productId}
//                   onChange={(e) =>
//                     handleProductChange(index, "productId", e.target.value)
//                   }
//                 >
//                   <option value="" disabled>
//                     Selecciona un producto
//                   </option>
//                   {products.map((prod) => (
//                     <option key={prod.id} value={prod.id}>
//                       {prod.name}
//                     </option>
//                   ))}
//                 </Select>

//                 <Input
//                   id={`quantity-${index}`}
//                   name="quantity"
//                   label="Cantidad"
//                   type="number"
//                   min="1"
//                   value={p.quantity.toString()}
//                   onChange={(e) =>
//                     handleProductChange(index, "quantity", e.target.value)
//                   }
//                 />

//                 <div className="flex items-center text-sm text-foreground/70">
//                   {(() => {
//                     const details = products.find((pr) => pr.id === p.productId);
//                     const lineTotal = (details?.price ?? 0) * p.quantity;
//                     return (
//                       <span>
//                         Precio:{" "}
//                         <span className="font-semibold">
//                           ${lineTotal.toFixed(2)}
//                         </span>
//                       </span>
//                     );
//                   })()}
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* 🔹 Totales */}
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
//               <p className="text-2xl font-extrabold text-primary">
//                 ${totalPrice.toFixed(2)}
//               </p>
//             </div>
//           </div>

//           {/* 🔹 Botones */}
//           <div className="flex justify-end gap-4 pt-4">
//             <Link href={PATHROUTES.pymes.compras}>
//               <Button variant="outline" type="button">
//                 Cancelar
//               </Button>
//             </Link>
//             <Button type="submit" disabled={isSubmitting}>
//               {isSubmitting ? "Guardando..." : "Actualizar Compra"}
//             </Button>
//           </div>
//         </form>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect } from "react";
// import { ArrowLeft } from "lucide-react";
// import Link from "next/link";
// import { useParams, useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import { useSession } from "next-auth/react";
// import { PATHROUTES } from "@/constants/pathroutes";

// // Tipos
// interface Supplier {
//   id: string;
//   name: string;
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
//   invoiceNumber: string;
//   supplierId: string;
//   items: Item[];
// }

// export default function EditarCompraPage() {
//   const { data: session, status } = useSession();
//   const { id } = useParams();
//   const router = useRouter();

//   const [suppliers, setSuppliers] = useState<Supplier[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [selectedSupplier, setSelectedSupplier] = useState("");
//   const [selectedProducts, setSelectedProducts] = useState<Item[]>([]);
//   const [fechaFactura, setFechaFactura] = useState("");
//   const [invoiceNumber, setInvoiceNumber] = useState("");

//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     if (status !== "authenticated" || !session) return;

//     const fetchData = async () => {
//       setIsLoading(true);
//       try {
//         const companyId = session.user?.companyId;
//         const token = session.accessToken;
//         if (!companyId || !token) throw new Error("Faltan datos de sesión.");

//         // Cargar proveedores, productos e información de la orden
//         const [supRes, prodRes, orderRes] = await Promise.all([
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/suppliers`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${companyId}/inventory`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//         if (!supRes.ok) throw new Error("Error cargando proveedores.");
//         if (!prodRes.ok) throw new Error("Error cargando productos.");
//         if (!orderRes.ok) throw new Error("Error cargando orden.");

//         const supData: Supplier[] = await supRes.json();
//         const prodData: Product[] = await prodRes.json();
//         const orderData: Order = await orderRes.json();

//         setSuppliers(supData);
//         setProducts(prodData);

//         // Prellenar datos de la orden
//         setSelectedSupplier(orderData.supplierId);
//         setFechaFactura(orderData.date.split("T")[0]);
//         setInvoiceNumber(orderData.invoiceNumber);

//         // Normalizar items con información del producto
//         setSelectedProducts(
//           (orderData.items || []).map((item) => ({
//             ...item,
//             product: prodData.find((p) => p.id === item.productId),
//           }))
//         );
//       } catch (err) {
//         setError(err instanceof Error ? err.message : "Error desconocido.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchData();
//   }, [session, status, id]);

//   const handleUpdate = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       const token = session?.accessToken;
//       if (!token) throw new Error("No autenticado");

//       const payload = {
//         date: fechaFactura + "T10:30:00Z",
//         invoiceNumber,
//         supplierId: selectedSupplier,
//         products: selectedProducts.map((p) => ({
//           productId: p.productId,
//           quantity: p.quantity,
//         })),
//       };

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
//         method: "PATCH",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify(payload),
//       });

//       if (!res.ok) {
//         const errData = await res.json();
//         throw new Error(errData.message || "Error al actualizar la orden.");
//       }

//       toast.success("Orden actualizada con éxito.");
//       router.push(PATHROUTES.pymes.compras);
//     } catch (err) {
//       toast.error(err instanceof Error ? err.message : "Error desconocido.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   const totalQuantity = selectedProducts.reduce((s, p) => s + p.quantity, 0);
//   const totalPrice = selectedProducts.reduce(
//     (s, p) => s + (p.product?.price ?? 0) * p.quantity,
//     0
//   );

//   if (isLoading) return <p className="p-8">Cargando...</p>;
//   if (error) return <p className="p-8 text-red-500">Error: {error}</p>;

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex items-center mb-8">
//         <Link href={PATHROUTES.pymes.compras}>
//           <button className="mr-2 h-9 w-9 flex items-center justify-center rounded-md border hover:bg-accent">
//             <ArrowLeft className="h-5 w-5" />
//           </button>
//         </Link>
//         <h1 className="text-3xl font-bold">Editar Compra</h1>
//       </div>

//       <div className="rounded-xl border bg-card shadow p-6">
//         <form onSubmit={handleUpdate} className="grid gap-6">
//           {/* Fecha */}
//           <div>
//             <label className="block text-sm font-medium">Fecha de factura</label>
//             <input
//               type="date"
//               value={fechaFactura}
//               onChange={(e) => setFechaFactura(e.target.value)}
//               className="mt-2 w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {/* Número de factura */}
//           <div>
//             <label className="block text-sm font-medium">Número de factura</label>
//             <input
//               type="text"
//               value={invoiceNumber}
//               onChange={(e) => setInvoiceNumber(e.target.value)}
//               className="mt-2 w-full border rounded px-3 py-2"
//               required
//             />
//           </div>

//           {/* Proveedor */}
//           <div>
//             <label className="block text-sm font-medium">Proveedor</label>
//             <select
//               value={selectedSupplier}
//               onChange={(e) => setSelectedSupplier(e.target.value)}
//               className="mt-2 w-full border rounded px-3 py-2"
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

//           {/* Productos */}
//           <div>
//             <h3 className="font-semibold mb-2">Productos</h3>
//             {selectedProducts.length > 0 && (
//               <ul className="space-y-4 mb-6">
//                 {selectedProducts.map((p, index) => (
//                   <li key={p.productId + index} className="flex gap-4 items-center">
//                     <select
//                       value={p.productId}
//                       onChange={(e) => {
//                         const newProducts = [...selectedProducts];
//                         newProducts[index].productId = e.target.value;
//                         newProducts[index].product = products.find(
//                           (prod) => prod.id === e.target.value
//                         );
//                         setSelectedProducts(newProducts);
//                       }}
//                       className="border rounded px-2 py-1"
//                     >
//                       {products.map((prod) => (
//                         <option key={prod.id} value={prod.id}>
//                           {prod.name}
//                         </option>
//                       ))}
//                     </select>
//                     <input
//                       type="number"
//                       value={p.quantity}
//                       min={1}
//                       onChange={(e) => {
//                         const newProducts = [...selectedProducts];
//                         newProducts[index].quantity = Number(e.target.value);
//                         setSelectedProducts(newProducts);
//                       }}
//                       className="w-20 border rounded px-2 py-1"
//                     />
//                     {p.product && (
//                       <span className="ml-auto">
//                         ${(p.product.price * p.quantity).toFixed(2)}
//                       </span>
//                     )}
//                   </li>
//                 ))}
//               </ul>
//             )}
//           </div>

//           {/* Totales */}
//           <div className="border-t pt-4 flex justify-between font-semibold">
//             <span>Total productos: {totalQuantity}</span>
//             <span>Total: ${totalPrice.toFixed(2)}</span>
//           </div>

//           {/* Botones */}
//           <div className="flex justify-end gap-4">
//             <Link href={PATHROUTES.pymes.compras}>
//               <button type="button" className="px-4 py-2 border rounded">
//                 Cancelar
//               </button>
//             </Link>
//             <button
//               type="submit"
//               disabled={isSubmitting}
//               className="px-4 py-2 bg-primary text-white rounded"
//             >
//               {isSubmitting ? "Guardando..." : "Actualizar Compra"}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


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
