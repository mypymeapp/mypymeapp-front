

// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { toast } from "react-hot-toast";
// import {
//   ListOrdered, // Loader
//   AlertTriangle,
//   LayoutGrid,
//   List,
//   Search,
//   DollarSign,
//   Package,
// } from "lucide-react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";


// // Tipos
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
// interface Supplier {
//   id: string;
//   name: string;
// }
// interface Invoice {
//   id: string;
//   number?: string;
//   issuedAt: string;
//   customer?: { name: string };
//   total?: number;
//   status: string;
// }
// interface Order {
//   id: string;
//   number?: string;
//   invoiceNumber?: string;
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }

// type ViewMode = "cards" | "list";
// type Tab = "invoices" | "orders";

// export default function ModuloVentas() {


  
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>("cards");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState<Tab>("invoices");

//   // Paginación
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const fetchProducts = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return [];
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );
//       if (!res.ok) throw new Error("Error al cargar inventario");
//       const data: Product[] = await res.json();
//       return data;
//     } catch (err) {
//       toast.error("Error cargando productos");
//       return [];
//     }
//   }, [session]);

//   const fetchData = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return;

//     try {
//       setIsLoading(true);
//       setError(null);
//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       const [inventoryProducts, invoicesRes, ordersRes] = await Promise.all([
//         fetchProducts(),
//         fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         ),
//         fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         ),
//       ]);

//       setProducts(inventoryProducts);

//       const invoicesData: Invoice[] = invoicesRes.ok
//         ? await invoicesRes.json()
//         : [];
//       const ordersData: Order[] = ordersRes.ok ? await ordersRes.json() : [];

//       // Enriquecer pedidos con productos y total
//       const enrichedOrders = ordersData.map((order) => {
//         const itemsWithProduct = order.items.map((item) => ({
//           ...item,
//           product: inventoryProducts.find((p) => p.id === item.productId),
//         }));
//         const total = itemsWithProduct.reduce(
//           (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
//           0
//         );
//         return {
//           ...order,
//           items: itemsWithProduct,
//           total,
//           invoiceNumber: order.invoiceNumber,
//         };
//       });

//       setInvoices(invoicesData);
//       setOrders(enrichedOrders);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Error cargando datos");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [session, fetchProducts]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // Helpers
//   const getItemList = (items: Item[]) =>
//     items
//       .map((i) => `${i.product?.name || "Producto"} (${i.quantity})`)
//       .join(", ");

//   const filteredRecords = useMemo(() => {
//     let data: any[] = [];
//     if (activeTab === "invoices") data = invoices;
//     if (activeTab === "orders") data = orders;

//     return data.filter(
//       (r) =>
//         ((r.customer?.name ?? r.supplier?.name ?? "") as string)
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [activeTab, invoices, orders, searchTerm]);

//   const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
//   const visibleRecords = filteredRecords.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );


//   if (isLoading) {
//   return (
//     <div className="p-8 h-full flex flex-col justify-center items-center">
//       <ListOrdered className="animate-spin h-12 w-12 text-primary" /> {/* 👈 aquí lo cambié */}
//       <p className="mt-4 text-foreground/70">Cargando compras...</p>
//     </div>
//   );
// }

//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">

//     {/* Loader Overlay
//       {isLoading && <LoaderOverlay text="Cargando datos..." bgOpacity={30} />} */}

//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-4">
//         <Button
//           variant={activeTab === "invoices" ? "primary" : "outline"}
//           onClick={() => setActiveTab("invoices")}
//         >
//           Facturas
//         </Button>
//         <Button
//           variant={activeTab === "orders" ? "primary" : "outline"}
//           onClick={() => setActiveTab("orders")}
//         >
//           Pedidos
//         </Button>
//       </div>

//       {/* Buscador + view mode */}
//       <Card
//         isClickable={false}
//         className="mb-8 flex flex-wrap justify-between items-center gap-4"
//       >
//         <div className="relative flex-grow max-w-xs">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//           <input
//             type="text"
//             placeholder="Buscar por cliente, proveedor o número..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//         </div>
//         <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border ml-auto">
//           <button
//             onClick={() => setViewMode("cards")}
//             className={`p-2 rounded ${
//               viewMode === "cards" ? "bg-primary text-button-text" : ""
//             }`}
//           >
//             <LayoutGrid className="h-5 w-5" />
//           </button>
//           <button
//             onClick={() => setViewMode("list")}
//             className={`p-2 rounded ${
//               viewMode === "list" ? "bg-primary text-button-text" : ""
//             }`}
//           >
//             <List className="h-5 w-5" />
//           </button>
//         </div>
//       </Card>

//       {/* Records */}
//       {visibleRecords.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <Package className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No hay registros</h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Añade registros para gestionar tus ventas.
//             </p>
//           </div>
//         </Card>
//       ) : viewMode === "cards" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {visibleRecords.map((r: any) => (
//             <Card key={r.id} className="flex flex-col">
//               <div className="p-4 flex-grow">
//                 <h2 className="font-bold text-lg text-foreground truncate">
//                   {r.number}
//                   {r.number && r.invoiceNumber ? " - " : ""}
//                   {r.invoiceNumber ? `Factura: ${r.invoiceNumber}` : ""}
//                 </h2>
//                 <p className="text-sm text-foreground/70">
//                   {r.customer?.name ?? r.supplier?.name ?? "Desconocido"}
//                 </p>
//                 <p className="text-xs text-foreground/60">
//                   {new Date(
//                     r.issuedAt ?? r.createdAt ?? ""
//                   ).toLocaleDateString()}
//                 </p>
//                 {activeTab === "orders" && (
//                   <p className="mt-2 text-sm flex items-center gap-1">
//                     <Package className="h-4 w-4 mt-1" />
//                     {getItemList(r.items)}
//                   </p>
//                 )}
//                 <p className="mt-1 flex items-center gap-1 font-semibold">
//                   <DollarSign className="h-4 w-4" />$
//                   {(r.total ?? 0).toFixed(2)}
//                 </p>
//                 {activeTab === "invoices" && (
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       r.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {r.status}
//                   </span>
//                 )}
//               </div>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Pedido / Factura</th>
//                 <th className="p-4 font-semibold">Cliente / Proveedor</th>
//                 <th className="p-4 font-semibold">Fecha</th>
//                 {activeTab === "orders" && (
//                   <th className="p-4 font-semibold">Productos</th>
//                 )}
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 {activeTab === "invoices" && (
//                   <th className="p-4 font-semibold text-center">Estado</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {visibleRecords.map((r: any) => (
//                 <tr
//                   key={r.id}
//                   className="border-b border-border last:border-b-0 hover:bg-background"
//                 >
//                   <td className="p-4">
//                     {r.number}
//                     {r.number && r.invoiceNumber ? `- ` : ""}
//                     {r.invoiceNumber ? `${r.invoiceNumber}` : ""}
//                   </td>
//                   <td className="p-4">
//                     {r.customer?.name ?? r.supplier?.name ?? "Desconocido"}
//                   </td>
//                   <td className="p-4">
//                     {new Date(
//                       r.issuedAt ?? r.createdAt ?? ""
//                     ).toLocaleDateString()}
//                   </td>
//                   {activeTab === "orders" && (
//                     <td className="p-4">{getItemList(r.items)}</td>
//                   )}
//                   <td className="p-4 text-right">
//                     ${(r.total ?? 0).toFixed(2)}
//                   </td>
//                   {activeTab === "invoices" && (
//                     <td className="p-4 text-center">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           r.status === "paid"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {r.status}
//                       </span>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Paginación */}
//       <div className="flex justify-center items-center gap-4 mt-8">
//         <Button
//           onClick={() => setCurrentPage((p) => p - 1)}
//           disabled={currentPage === 1}
//         >
//           Anterior
//         </Button>
//         <span>
//           Página {currentPage} de {totalPages}
//         </span>
//         <Button
//           onClick={() => setCurrentPage((p) => p + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Siguiente
//         </Button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { toast } from "react-hot-toast";
// import {
//   ListOrdered, // Loader
//   AlertTriangle,
//   LayoutGrid,
//   List,
//   Search,
//   DollarSign,
//   Package,
// } from "lucide-react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";


// // Tipos
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
// interface Supplier {
//   id: string;
//   name: string;
// }
// interface Invoice {
//   id: string;
//   number?: string;
//   issuedAt: string;
//   customer?: { name: string };
//   total?: number;
//   status: string;
// }
// interface Order {
//   id: string;
//   number?: string;
//   invoiceNumber?: string;
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }

// type ViewMode = "cards" | "list";
// type Tab = "invoices" | "orders";
// type RecordType = Invoice | Order; // Definimos un tipo union para manejar ambos

// export default function ModuloVentas() {


  
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>("cards");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState<Tab>("invoices");

//   // Paginación
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const fetchProducts = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return [];
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );
//       if (!res.ok) throw new Error("Error al cargar inventario");
//       const data: Product[] = await res.json();
//       return data;
//     } catch (err) {
//       toast.error("Error cargando productos");
//       return [];
//     }
//   }, [session]);

//   const fetchData = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return;

//     try {
//       setIsLoading(true);
//       setError(null);
//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       const [inventoryProducts, invoicesRes, ordersRes] = await Promise.all([
//         fetchProducts(),
//         fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         ),
//         fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         ),
//       ]);

//       setProducts(inventoryProducts);

//       const invoicesData: Invoice[] = invoicesRes.ok
//         ? await invoicesRes.json()
//         : [];
//       const ordersData: Order[] = ordersRes.ok ? await ordersRes.json() : [];

//       // Enriquecer pedidos con productos y total
//       const enrichedOrders = ordersData.map((order) => {
//         const itemsWithProduct = order.items.map((item) => ({
//           ...item,
//           product: inventoryProducts.find((p) => p.id === item.productId),
//         }));
//         const total = itemsWithProduct.reduce(
//           (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
//           0
//         );
//         return {
//           ...order,
//           items: itemsWithProduct,
//           total,
//           invoiceNumber: order.invoiceNumber,
//         };
//       });

//       setInvoices(invoicesData);
//       setOrders(enrichedOrders);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Error cargando datos");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [session, fetchProducts]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // Helpers
//   const getItemList = (items: Item[]) =>
//     items
//       .map((i) => `${i.product?.name || "Producto"} (${i.quantity})`)
//       .join(", ");

//   const filteredRecords = useMemo(() => {
//     let data: RecordType[] = []; // Corregido a RecordType[] para evitar 'any'
//     if (activeTab === "invoices") data = invoices;
//     if (activeTab === "orders") data = orders as RecordType[]; // Cast para asegurar compatibilidad si 'Order' extiende 'Invoice' o se ajusta

//     return data.filter(
//       (r) =>
//         ((r as any).customer?.name ?? (r as any).supplier?.name ?? "") // Usamos (r as any) para acceder a propiedades que solo tiene Invoice o Order
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [activeTab, invoices, orders, searchTerm]); // Fin de la corrección de tipado

//   const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
//   const visibleRecords = filteredRecords.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );


//   if (isLoading) {
//   return (
//     <div className="p-8 h-full flex flex-col justify-center items-center">
//       <ListOrdered className="animate-spin h-12 w-12 text-primary" /> {/* 👈 aquí lo cambié */}
//       <p className="mt-4 text-foreground/70">Cargando compras...</p>
//     </div>
//   );
// }

//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">

//     {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-4">
//         <Button
//           variant={activeTab === "invoices" ? "primary" : "outline"}
//           onClick={() => setActiveTab("invoices")}
//         >
//           Facturas
//         </Button>
//         <Button
//           variant={activeTab === "orders" ? "primary" : "outline"}
//           onClick={() => setActiveTab("orders")}
//         >
//           Pedidos
//         </Button>
//       </div>

//       {/* Buscador + view mode */}
//       <Card
//         isClickable={false}
//         className="mb-8 flex flex-wrap justify-between items-center gap-4"
//       >
//         <div className="relative flex-grow max-w-xs">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//           <input
//             type="text"
//             placeholder="Buscar por cliente, proveedor o número..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//         </div>
//         <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border ml-auto">
//           <button
//             onClick={() => setViewMode("cards")}
//             className={`p-2 rounded ${
//               viewMode === "cards" ? "bg-primary text-button-text" : ""
//             }`}
//           >
//             <LayoutGrid className="h-5 w-5" />
//           </button>
//           <button
//             onClick={() => setViewMode("list")}
//             className={`p-2 rounded ${
//               viewMode === "list" ? "bg-primary text-button-text" : ""
//             }`}
//           >
//             <List className="h-5 w-5" />
//           </button>
//         </div>
//       </Card>

//       {/* Records */}
//       {visibleRecords.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <Package className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No hay registros</h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Añade registros para gestionar tus ventas.
//             </p>
//           </div>
//         </Card>
//       ) : viewMode === "cards" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {visibleRecords.map((r: RecordType) => ( // Usamos RecordType
//             <Card key={r.id} className="flex flex-col">
//               <div className="p-4 flex-grow">
//                 <h2 className="font-bold text-lg text-foreground truncate">
//                   {r.number}
//                   {r.number && (r as Invoice).invoiceNumber ? " - " : ""}
//                   {(r as Invoice).invoiceNumber ? `Factura: ${(r as Invoice).invoiceNumber}` : ""}
//                 </h2>
//                 <p className="text-sm text-foreground/70">
//                   {(r as Invoice).customer?.name ?? (r as Order).supplier?.name ?? "Desconocido"}
//                 </p>
//                 <p className="text-xs text-foreground/60">
//                   {new Date(
//                     r.issuedAt ?? (r as Order).createdAt ?? ""
//                   ).toLocaleDateString()}
//                 </p>
//                 {activeTab === "orders" && (
//                   <p className="mt-2 text-sm flex items-center gap-1">
//                     <Package className="h-4 w-4 mt-1" />
//                     {getItemList((r as Order).items)}
//                   </p>
//                 )}
//                 <p className="mt-1 flex items-center gap-1 font-semibold">
//                   <DollarSign className="h-4 w-4" />$
//                   {(r.total ?? 0).toFixed(2)}
//                 </p>
//                 {activeTab === "invoices" && (
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       r.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {r.status}
//                   </span>
//                 )}
//               </div>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Pedido / Factura</th>
//                 <th className="p-4 font-semibold">Cliente / Proveedor</th>
//                 <th className="p-4 font-semibold">Fecha</th>
//                 {activeTab === "orders" && (
//                   <th className="p-4 font-semibold">Productos</th>
//                 )}
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 {activeTab === "invoices" && (
//                   <th className="p-4 font-semibold text-center">Estado</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {visibleRecords.map((r: RecordType) => ( // Usamos RecordType
//                 <tr
//                   key={r.id}
//                   className="border-b border-border last:border-b-0 hover:bg-background"
//                 >
//                   <td className="p-4">
//                     {r.number}
//                     {r.number && (r as Invoice).invoiceNumber ? `- ` : ""}
//                     {(r as Invoice).invoiceNumber ? `${(r as Invoice).invoiceNumber}` : ""}
//                   </td>
//                   <td className="p-4">
//                     {(r as Invoice).customer?.name ?? (r as Order).supplier?.name ?? "Desconocido"}
//                   </td>
//                   <td className="p-4">
//                     {new Date(
//                       r.issuedAt ?? (r as Order).createdAt ?? ""
//                     ).toLocaleDateString()}
//                   </td>
//                   {activeTab === "orders" && (
//                     <td className="p-4">{getItemList((r as Order).items)}</td>
//                   )}
//                   <td className="p-4 text-right">
//                     ${(r.total ?? 0).toFixed(2)}
//                   </td>
//                   {activeTab === "invoices" && (
//                     <td className="p-4 text-center">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           r.status === "paid"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {r.status}
//                       </span>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Paginación */}
//       <div className="flex justify-center items-center gap-4 mt-8">
//         <Button
//           onClick={() => setCurrentPage((p) => p - 1)}
//           disabled={currentPage === 1}
//         >
//           Anterior
//         </Button>
//         <span>
//           Página {currentPage} de {totalPages}
//         </span>
//         <Button
//           onClick={() => setCurrentPage((p) => p + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Siguiente
//         </Button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { toast } from "react-hot-toast";
// import {
//   ListOrdered, // Loader
//   AlertTriangle,
//   LayoutGrid,
//   List,
//   Search,
//   DollarSign,
//   Package,
// } from "lucide-react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";


// // Tipos
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
// interface Supplier {
//   id: string;
//   name: string;
// }
// interface Invoice {
//   id: string;
//   number?: string;
//   issuedAt: string;
//   customer?: { name: string };
//   total?: number;
//   status: string;
// }
// interface Order {
//   id: string;
//   number?: string;
//   invoiceNumber?: string;
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }

// type ViewMode = "cards" | "list";
// type Tab = "invoices" | "orders";
// // Definición del tipo union para manejar Facturas y Pedidos
// type RecordType = Invoice | Order;

// export default function ModuloVentas() {


  
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>("cards");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState<Tab>("invoices");

//   // Paginación
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const fetchProducts = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return [];
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );
//       if (!res.ok) throw new Error("Error al cargar inventario");
//       const data: Product[] = await res.json();
//       return data;
//     } catch (err) {
//       toast.error("Error cargando productos");
//       return [];
//     }
//   }, [session]);

//   const fetchData = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return;

//     try {
//       setIsLoading(true);
//       setError(null);
//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       const [inventoryProducts, invoicesRes, ordersRes] = await Promise.all([
//         fetchProducts(),
//         fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         ),
//         fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         ),
//       ]);

//       setProducts(inventoryProducts);

//       const invoicesData: Invoice[] = invoicesRes.ok
//         ? await invoicesRes.json()
//         : [];
//       const ordersData: Order[] = ordersRes.ok ? await ordersRes.json() : [];

//       // Enriquecer pedidos con productos y total
//       const enrichedOrders = ordersData.map((order) => {
//         const itemsWithProduct = order.items.map((item) => ({
//           ...item,
//           product: inventoryProducts.find((p) => p.id === item.productId),
//         }));
//         const total = itemsWithProduct.reduce(
//           (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
//           0
//         );
//         return {
//           ...order,
//           items: itemsWithProduct,
//           total,
//           invoiceNumber: order.invoiceNumber,
//         };
//       });

//       setInvoices(invoicesData);
//       setOrders(enrichedOrders);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Error cargando datos");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [session, fetchProducts]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // Helpers
//   const getItemList = (items: Item[]) =>
//     items
//       .map((i) => `${i.product?.name || "Producto"} (${i.quantity})`)
//       .join(", ");

//   const filteredRecords = useMemo(() => {
//     // CAMBIO 1: Reemplazar 'any[]' por 'RecordType[]'
//     let data: RecordType[] = [];
//     if (activeTab === "invoices") data = invoices;
//     if (activeTab === "orders") data = orders;

//     return data.filter(
//       // Usamos type assertion `as any` solo en la propiedad de filtrado para evitar errores complejos de tipado en esta línea
//       (r) =>
//         (((r as any).customer?.name ?? (r as any).supplier?.name ?? "") as string)
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [activeTab, invoices, orders, searchTerm]);

//   const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
//   const visibleRecords = filteredRecords.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );


//   if (isLoading) {
//   return (
//     <div className="p-8 h-full flex flex-col justify-center items-center">
//       <ListOrdered className="animate-spin h-12 w-12 text-primary" /> {/* 👈 aquí lo cambié */}
//       <p className="mt-4 text-foreground/70">Cargando compras...</p>
//     </div>
//   );
// }

//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">

//     {/* Loader Overlay
//       {isLoading && <LoaderOverlay text="Cargando datos..." bgOpacity={30} />} */}

//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-4">
//         <Button
//           variant={activeTab === "invoices" ? "primary" : "outline"}
//           onClick={() => setActiveTab("invoices")}
//         >
//           Facturas
//         </Button>
//         <Button
//           variant={activeTab === "orders" ? "primary" : "outline"}
//           onClick={() => setActiveTab("orders")}
//         >
//           Pedidos
//         </Button>
//       </div>

//       {/* Buscador + view mode */}
//       <Card
//         isClickable={false}
//         className="mb-8 flex flex-wrap justify-between items-center gap-4"
//       >
//         <div className="relative flex-grow max-w-xs">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//           <input
//             type="text"
//             placeholder="Buscar por cliente, proveedor o número..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//         </div>
//         <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border ml-auto">
//           <button
//             onClick={() => setViewMode("cards")}
//             className={`p-2 rounded ${
//               viewMode === "cards" ? "bg-primary text-button-text" : ""
//             }`}
//           >
//             <LayoutGrid className="h-5 w-5" />
//           </button>
//           <button
//             onClick={() => setViewMode("list")}
//             className={`p-2 rounded ${
//               viewMode === "list" ? "bg-list" : ""
//             }`}
//           >
//             <List className="h-5 w-5" />
//           </button>
//         </div>
//       </Card>

//       {/* Records */}
//       {visibleRecords.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <Package className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No hay registros</h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Añade registros para gestionar tus ventas.
//             </p>
//           </div>
//         </Card>
//       ) : viewMode === "cards" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {visibleRecords.map((r: RecordType) => ( // CAMBIO 2: Reemplazar 'any' por 'RecordType'
//             <Card key={r.id} className="flex flex-col">
//               <div className="p-4 flex-grow">
//                 <h2 className="font-bold text-lg text-foreground truncate">
//                   {r.number}
//                   {r.number && (r as Invoice).invoiceNumber ? " - " : ""}
//                   {(r as Invoice).invoiceNumber ? `Factura: ${(r as Invoice).invoiceNumber}` : ""}
//                 </h2>
//                 <p className="text-sm text-foreground/70">
//                   {(r as Invoice).customer?.name ?? (r as Order).supplier?.name ?? "Desconocido"}
//                 </p>
//                 <p className="text-xs text-foreground/60">
//                   {new Date(
//                     r.issuedAt ?? (r as Order).createdAt ?? ""
//                   ).toLocaleDateString()}
//                 </p>
//                 {activeTab === "orders" && (
//                   <p className="mt-2 text-sm flex items-center gap-1">
//                     <Package className="h-4 w-4 mt-1" />
//                     {getItemList((r as Order).items)}
//                   </p>
//                 )}
//                 <p className="mt-1 flex items-center gap-1 font-semibold">
//                   <DollarSign className="h-4 w-4" />$
//                   {(r.total ?? 0).toFixed(2)}
//                 </p>
//                 {activeTab === "invoices" && (
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       r.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {r.status}
//                   </span>
//                 )}
//               </div>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Pedido / Factura</th>
//                 <th className="p-4 font-semibold">Cliente / Proveedor</th>
//                 <th className="p-4 font-semibold">Fecha</th>
//                 {activeTab === "orders" && (
//                   <th className="p-4 font-semibold">Productos</th>
//                 )}
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 {activeTab === "invoices" && (
//                   <th className="p-4 font-semibold text-center">Estado</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {visibleRecords.map((r: RecordType) => ( // CAMBIO 2: Reemplazar 'any' por 'RecordType'
//                 <tr
//                   key={r.id}
//                   className="border-b border-border last:border-b-0 hover:bg-background"
//                 >
//                   <td className="p-4">
//                     {r.number}
//                     {r.number && (r as Invoice).invoiceNumber ? `- ` : ""}
//                     {(r as Invoice).invoiceNumber ? `${(r as Invoice).invoiceNumber}` : ""}
//                   </td>
//                   <td className="p-4">
//                     {(r as Invoice).customer?.name ?? (r as Order).supplier?.name ?? "Desconocido"}
//                   </td>
//                   <td className="p-4">
//                     {new Date(
//                       r.issuedAt ?? (r as Order).createdAt ?? ""
//                     ).toLocaleDateString()}
//                   </td>
//                   {activeTab === "orders" && (
//                     <td className="p-4">{getItemList((r as Order).items)}</td>
//                   )}
//                   <td className="p-4 text-right">
//                     ${(r.total ?? 0).toFixed(2)}
//                   </td>
//                   {activeTab === "invoices" && (
//                     <td className="p-4 text-center">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           r.status === "paid"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {r.status}
//                       </span>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Paginación */}
//       <div className="flex justify-center items-center gap-4 mt-8">
//         <Button
//           onClick={() => setCurrentPage((p) => p - 1)}
//           disabled={currentPage === 1}
//         >
//           Anterior
//         </Button>
//         <span>
//           Página {currentPage} de {totalPages}
//         </span>
//         <Button
//           onClick={() => setCurrentPage((p) => p + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Siguiente
//         </Button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { toast } from "react-hot-toast";
// import {
//   ListOrdered, // Loader
//   AlertTriangle,
//   LayoutGrid,
//   List,
//   Search,
//   DollarSign,
//   Package,
// } from "lucide-react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";


// // Tipos
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
// interface Supplier {
//   id: string;
//   name: string;
// }
// interface Invoice {
//   id: string;
//   number?: string;
//   issuedAt: string;
//   customer?: { name: string };
//   total?: number;
//   status: string;
// }
// interface Order {
//   id: string;
//   number?: string;
//   invoiceNumber?: string;
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }

// type ViewMode = "cards" | "list";
// type Tab = "invoices" | "orders";
// // Tipo union para Factura o Pedido
// type RecordType = Invoice | Order;

// export default function ModuloVentas() {


  
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>("cards");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [activeTab, setActiveTab] = useState<Tab>("invoices");

//   // Paginación
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const fetchProducts = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return [];
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );
//       if (!res.ok) throw new Error("Error al cargar inventario");
//       const data: Product[] = await res.json();
//       return data;
//     } catch (err) {
//       toast.error("Error cargando productos");
//       return [];
//     }
//   }, [session]);

//   const fetchData = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return;

//     try {
//       setIsLoading(true);
//       setError(null);
//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       const [inventoryProducts, invoicesRes, ordersRes] = await Promise.all([
//         fetchProducts(),
//         fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         ),
//         fetch(
//           `${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`,
//           { headers: { Authorization: `Bearer ${token}` } }
//         ),
//       ]);

//       setProducts(inventoryProducts);

//       const invoicesData: Invoice[] = invoicesRes.ok
//         ? await invoicesRes.json()
//         : [];
//       const ordersData: Order[] = ordersRes.ok ? await ordersRes.json() : [];

//       // Enriquecer pedidos con productos y total
//       const enrichedOrders = ordersData.map((order) => {
//         const itemsWithProduct = order.items.map((item) => ({
//           ...item,
//           product: inventoryProducts.find((p) => p.id === item.productId),
//         }));
//         const total = itemsWithProduct.reduce(
//           (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
//           0
//         );
//         return {
//           ...order,
//           items: itemsWithProduct,
//           total,
//           invoiceNumber: order.invoiceNumber,
//         };
//       });

//       setInvoices(invoicesData);
//       setOrders(enrichedOrders);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Error cargando datos");
//     } finally {
//       setIsLoading(false);
//     }
//   }, [session, fetchProducts]);

//   useEffect(() => {
//     fetchData();
//   }, [fetchData]);

//   // Helpers
//   const getItemList = (items: Item[]) =>
//     items
//       .map((i) => `${i.product?.name || "Producto"} (${i.quantity})`)
//       .join(", ");

//   const filteredRecords = useMemo(() => {
//     let data: RecordType[] = [];
//     if (activeTab === "invoices") data = invoices;
//     if (activeTab === "orders") data = orders;

//     return data.filter(
//       (r) =>
//         (activeTab === "invoices"
//           ? (r as Invoice).customer?.name
//           : (r as Order).supplier?.name ?? "" // Accedemos al cliente/proveedor correcto
//         )
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [activeTab, invoices, orders, searchTerm]);

//   const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
//   const visibleRecords = filteredRecords.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );


//   if (isLoading) {
//   return (
//     <div className="p-8 h-full flex flex-col justify-center items-center">
//       <ListOrdered className="animate-spin h-12 w-12 text-primary" /> {/* 👈 aquí lo cambié */}
//       <p className="mt-4 text-foreground/70">Cargando compras...</p>
//     </div>
//   );
// }

//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">

//     {/* Loader Overlay
//       {isLoading && <LoaderOverlay text="Cargando datos..." bgOpacity={30} />} */}

//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-4">
//         <Button
//           variant={activeTab === "invoices" ? "primary" : "outline"}
//           onClick={() => setActiveTab("invoices")}
//         >
//           Facturas
//         </Button>
//         <Button
//           variant={activeTab === "orders" ? "primary" : "outline"}
//           onClick={() => setActiveTab("orders")}
//         >
//           Pedidos
//         </Button>
//       </div>

//       {/* Buscador + view mode */}
//       <Card
//         isClickable={false}
//         className="mb-8 flex flex-wrap justify-between items-center gap-4"
//       >
//         <div className="relative flex-grow max-w-xs">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//           <input
//             type="text"
//             placeholder="Buscar por cliente, proveedor o número..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//           />
//         </div>
//         <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border ml-auto">
//           <button
//             onClick={() => setViewMode("cards")}
//             className={`p-2 rounded ${
//               viewMode === "cards" ? "bg-primary text-button-text" : ""
//             }`}
//           >
//             <LayoutGrid className="h-5 w-5" />
//           </button>
//           <button
//             onClick={() => setViewMode("list")}
//             className={`p-2 rounded ${
//               viewMode === "list" ? "bg-primary text-button-text" : ""
//             }`}
//           >
//             <List className="h-5 w-5" />
//           </button>
//         </div>
//       </Card>

//       {/* Records */}
//       {visibleRecords.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <Package className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No hay registros</h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Añade registros para gestionar tus ventas.
//             </p>
//           </div>
//         </Card>
//       ) : viewMode === "cards" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {visibleRecords.map((r: RecordType) => (
//             <Card key={r.id} className="flex flex-col">
//               <div className="p-4 flex-grow">
//                 <h2 className="font-bold text-lg text-foreground truncate">
//                   {r.number}
//                   {/* CORRECCIÓN 1: 'invoiceNumber' solo existe en Order */}
//                   {r.number && (r as Order).invoiceNumber ? " - " : ""}
//                   {(r as Order).invoiceNumber ? `Factura: ${(r as Order).invoiceNumber}` : ""}
//                 </h2>
//                 <p className="text-sm text-foreground/70">
//                   {/* CORRECCIÓN 2: Cliente solo en Invoice, Proveedor solo en Order */}
//                   {activeTab === "invoices" ? (r as Invoice).customer?.name : (r as Order).supplier?.name ?? "Desconocido"}
//                 </p>
//                 <p className="text-xs text-foreground/60">
//                   {/* CORRECCIÓN 3: 'issuedAt' solo en Invoice, 'createdAt' solo en Order */}
//                   {new Date(
//                     (r as Invoice).issuedAt ?? (r as Order).createdAt ?? ""
//                   ).toLocaleDateString()}
//                 </p>
//                 {activeTab === "orders" && (
//                   <p className="mt-2 text-sm flex items-center gap-1">
//                     <Package className="h-4 w-4 mt-1" />
//                     {/* CORRECCIÓN 4: 'items' solo existe en Order */}
//                     {getItemList((r as Order).items)}
//                   </p>
//                 )}
//                 <p className="mt-1 flex items-center gap-1 font-semibold">
//                   <DollarSign className="h-4 w-4" />$
//                   {/* CORRECCIÓN 5: 'total' solo existe en Invoice. Lo forzamos a existir aquí. */}
//                   {(r.total ?? (r as Order).total ?? 0).toFixed(2)}
//                 </p>
//                 {activeTab === "invoices" && (
//                   <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                       r.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                   >
//                     {r.status}
//                   </span>
//                 )}
//               </div>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Pedido / Factura</th>
//                 <th className="p-4 font-semibold">Cliente / Proveedor</th>
//                 <th className="p-4 font-semibold">Fecha</th>
//                 {activeTab === "orders" && (
//                   <th className="p-4 font-semibold">Productos</th>
//                 )}
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 {activeTab === "invoices" && (
//                   <th className="p-4 font-semibold text-center">Estado</th>
//                 )}
//               </tr>
//             </thead>
//             <tbody>
//               {visibleRecords.map((r: RecordType) => (
//                 <tr
//                   key={r.id}
//                   className="border-b border-border last:border-b-0 hover:bg-background"
//                 >
//                   <td className="p-4">
//                     {r.number}
//                     {/* CORRECCIÓN 1 */}
//                     {r.number && (r as Order).invoiceNumber ? `- ` : ""}
//                     {(r as Order).invoiceNumber ? `${(r as Order).invoiceNumber}` : ""}
//                   </td>
//                   <td className="p-4">
//                     {/* CORRECCIÓN 2 */}
//                     {activeTab === "invoices" ? (r as Invoice).customer?.name : (r as Order).supplier?.name ?? "Desconocido"}
//                   </td>
//                   <td className="p-4">
//                     {/* CORRECCIÓN 3 */}
//                     {new Date(
//                       (r as Invoice).issuedAt ?? (r as Order).createdAt ?? ""
//                     ).toLocaleDateString()}
//                   </td>
//                   {activeTab === "orders" && (
//                     <td className="p-4">
//                       {/* CORRECCIÓN 4 */}
//                       {getItemList((r as Order).items)}
//                     </td>
//                   )}
//                   <td className="p-4 text-right">
//                     {/* CORRECCIÓN 5 */}
//                     ${(r.total ?? (r as Order).total ?? 0).toFixed(2)}
//                   </td>
//                   {activeTab === "invoices" && (
//                     <td className="p-4 text-center">
//                       <span
//                         className={`px-2 py-1 rounded-full text-xs font-medium ${
//                           r.status === "paid"
//                             ? "bg-green-100 text-green-800"
//                             : "bg-yellow-100 text-yellow-800"
//                         }`}
//                       >
//                         {r.status}
//                       </span>
//                     </td>
//                   )}
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Paginación */}
//       <div className="flex justify-center items-center gap-4 mt-8">
//         <Button
//           onClick={() => setCurrentPage((p) => p - 1)}
//           disabled={currentPage === 1}
//         >
//           Anterior
//         </Button>
//         <span>
//           Página {currentPage} de {totalPages}
//         </span>
//         <Button
//           onClick={() => setCurrentPage((p) => p + 1)}
//           disabled={currentPage === totalPages}
//         >
//           Siguiente
//         </Button>
//       </div>
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import {
  ListOrdered, // Loader
  AlertTriangle,
  LayoutGrid,
  List,
  Search,
  DollarSign,
  Package,
} from "lucide-react";
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
interface Invoice {
  id: string;
  number?: string;
  issuedAt: string;
  customer?: { name: string };
  total?: number;
  status: string;
}
// CORRECCIÓN 1: Añadimos 'total' a Order porque lo calculamos en fetchData
interface Order {
  id: string;
  number?: string;
  invoiceNumber?: string;
  createdAt: string;
  supplier?: Supplier;
  items: Item[];
  status: string;
  total?: number; // <--- AGREGADO
}

type ViewMode = "cards" | "list";
type Tab = "invoices" | "orders";
// Tipo union para Factura o Pedido
type RecordType = Invoice | Order;

export default function ModuloVentas() {


  
  const { data: session } = useSession();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("invoices");

  // Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchProducts = useCallback(async () => {
    if (!session?.user?.companyId || !session.accessToken) return [];
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );
      if (!res.ok) throw new Error("Error al cargar inventario");
      const data: Product[] = await res.json();
      return data;
    } catch (err) {
      toast.error("Error cargando productos");
      return [];
    }
  }, [session]);

  const fetchData = useCallback(async () => {
    if (!session?.user?.companyId || !session.accessToken) return;

    try {
      setIsLoading(true);
      setError(null);
      const companyId = session.user.companyId;
      const token = session.accessToken;

      const [inventoryProducts, invoicesRes, ordersRes] = await Promise.all([
        fetchProducts(),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      setProducts(inventoryProducts);

      const invoicesData: Invoice[] = invoicesRes.ok
        ? await invoicesRes.json()
        : [];
      const ordersData: Order[] = ordersRes.ok ? await ordersRes.json() : [];

      // Enriquecer pedidos con productos y total
      const enrichedOrders = ordersData.map((order) => {
        const itemsWithProduct = order.items.map((item) => ({
          ...item,
          product: inventoryProducts.find((p) => p.id === item.productId),
        }));
        const total = itemsWithProduct.reduce(
          (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
          0
        );
        return {
          ...order,
          items: itemsWithProduct,
          total, // <--- Propiedad 'total' agregada al objeto Order aquí
          invoiceNumber: order.invoiceNumber,
        };
      });

      setInvoices(invoicesData);
      setOrders(enrichedOrders);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando datos");
    } finally {
      setIsLoading(false);
    }
  }, [session, fetchProducts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Helpers
  const getItemList = (items: Item[]) =>
    items
      .map((i) => `${i.product?.name || "Producto"} (${i.quantity})`)
      .join(", ");

  const filteredRecords = useMemo(() => {
    let data: RecordType[] = [];
    if (activeTab === "invoices") data = invoices;
    if (activeTab === "orders") data = orders;

    return data.filter(
      (r) => {
        // CORRECCIÓN 2: Lógica de filtrado más clara para evitar 'undefined'
        const nameToSearch = activeTab === "invoices"
          ? (r as Invoice).customer?.name ?? "" // Usa customer para facturas
          : (r as Order).supplier?.name ?? ""; // Usa supplier para pedidos

        return nameToSearch.toLowerCase().includes(searchTerm.toLowerCase()) ||
               (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase());
      }
    );
  }, [activeTab, invoices, orders, searchTerm]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const visibleRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );


  if (isLoading) {
  return (
    <div className="p-8 h-full flex flex-col justify-center items-center">
      <ListOrdered className="animate-spin h-12 w-12 text-primary" /> {/* 👈 aquí lo cambié */}
      <p className="mt-4 text-foreground/70">Cargando compras...</p>
    </div>
  );
}

  if (error)
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
        <p>{error}</p>
      </div>
    );

  return (
    <div className="p-4 md:p-8">

    {/* Loader Overlay
      {isLoading && <LoaderOverlay text="Cargando datos..." bgOpacity={30} />} */}

      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        <Button
          variant={activeTab === "invoices" ? "primary" : "outline"}
          onClick={() => setActiveTab("invoices")}
        >
          Facturas
        </Button>
        <Button
          variant={activeTab === "orders" ? "primary" : "outline"}
          onClick={() => setActiveTab("orders")}
        >
          Pedidos
        </Button>
      </div>

      {/* Buscador + view mode */}
      <Card
        isClickable={false}
        className="mb-8 flex flex-wrap justify-between items-center gap-4"
      >
        <div className="relative flex-grow max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
          <input
            type="text"
            placeholder="Buscar por cliente, proveedor o número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
        <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border ml-auto">
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
      </Card>

      {/* Records */}
      {visibleRecords.length === 0 ? (
        <Card isClickable={false}>
          <div className="text-center py-12">
            <Package className="mx-auto h-12 w-12 text-foreground/30" />
            <h3 className="mt-2 text-xl font-semibold">No hay registros</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Añade registros para gestionar tus ventas.
            </p>
          </div>
        </Card>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleRecords.map((r: RecordType) => (
            <Card key={r.id} className="flex flex-col">
              <div className="p-4 flex-grow">
                <h2 className="font-bold text-lg text-foreground truncate">
                  {r.number}
                  {/* invoiceNumber solo existe en Order */}
                  {r.number && (r as Order).invoiceNumber ? " - " : ""}
                  {(r as Order).invoiceNumber ? `Factura: ${(r as Order).invoiceNumber}` : ""}
                </h2>
                <p className="text-sm text-foreground/70">
                  {/* Cliente/Proveedor basado en la pestaña activa */}
                  {activeTab === "invoices" ? (r as Invoice).customer?.name : (r as Order).supplier?.name ?? "Desconocido"}
                </p>
                <p className="text-xs text-foreground/60">
                  {/* issuedAt/createdAt basado en la pestaña activa */}
                  {new Date(
                    activeTab === "invoices" ? (r as Invoice).issuedAt : (r as Order).createdAt
                  ).toLocaleDateString()}
                </p>
                {activeTab === "orders" && (
                  <p className="mt-2 text-sm flex items-center gap-1">
                    <Package className="h-4 w-4 mt-1" />
                    {/* items solo existe en Order */}
                    {getItemList((r as Order).items)}
                  </p>
                )}
                <p className="mt-1 flex items-center gap-1 font-semibold">
                  <DollarSign className="h-4 w-4" />$
                  {/* Total es una propiedad común (ahora que la añadimos a Order) */}
                  {(r.total ?? 0).toFixed(2)}
                </p>
                {activeTab === "invoices" && (
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      r.status === "paid"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {r.status}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Pedido / Factura</th>
                <th className="p-4 font-semibold">Cliente / Proveedor</th>
                <th className="p-4 font-semibold">Fecha</th>
                {activeTab === "orders" && (
                  <th className="p-4 font-semibold">Productos</th>
                )}
                <th className="p-4 font-semibold text-right">Total</th>
                {activeTab === "invoices" && (
                  <th className="p-4 font-semibold text-center">Estado</th>
                )}
              </tr>
            </thead>
            <tbody>
              {visibleRecords.map((r: RecordType) => (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-b-0 hover:bg-background"
                >
                  <td className="p-4">
                    {r.number}
                    {/* invoiceNumber solo existe en Order */}
                    {r.number && (r as Order).invoiceNumber ? `- ` : ""}
                    {(r as Order).invoiceNumber ? `${(r as Order).invoiceNumber}` : ""}
                  </td>
                  <td className="p-4">
                    {/* Cliente/Proveedor basado en la pestaña activa */}
                    {activeTab === "invoices" ? (r as Invoice).customer?.name : (r as Order).supplier?.name ?? "Desconocido"}
                  </td>
                  <td className="p-4">
                    {/* issuedAt/createdAt basado en la pestaña activa */}
                    {new Date(
                      activeTab === "invoices" ? (r as Invoice).issuedAt : (r as Order).createdAt
                    ).toLocaleDateString()}
                  </td>
                  {activeTab === "orders" && (
                    <td className="p-4">
                      {/* items solo existe en Order */}
                      {getItemList((r as Order).items)}
                    </td>
                  )}
                  <td className="p-4 text-right">
                    {/* Total es una propiedad común */}
                    ${(r.total ?? 0).toFixed(2)}
                  </td>
                  {activeTab === "invoices" && (
                    <td className="p-4 text-center">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${
                          r.status === "paid"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Paginación */}
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
    </div>
  );
}
