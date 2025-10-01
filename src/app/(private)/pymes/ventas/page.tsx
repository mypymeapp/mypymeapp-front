

// 'use client';

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { Button } from '@/components/ui/Button';
// import { Card } from '@/components/ui/Card';
// import { PATHROUTES } from '@/constants/pathroutes';
// import { PlusCircle, List, Search, Loader2, AlertTriangle, ShoppingCart, DollarSign, Clock, CheckCircle } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from 'react-hot-toast';
// import { useSession } from 'next-auth/react';

// // 🔹 Tipo de datos para una Venta/Factura
// interface Venta {
//   id: string;
//   invoiceNumber: string;
//   clientName: string;
//   date: string;
//   total: number;
//   status: 'Pagada' | 'Pendiente';
// }

// type Filter = 'all' | 'paid' | 'pending';

// export default function VentasPage() {
//   const [ventas, setVentas] = useState<Venta[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState<Filter>('all');
//   const { data: session } = useSession();

//   // 🔹 Datos MOCK para simular la carga de ventas
//   const mockVentas: Venta[] = [
//     { id: 'V-001', invoiceNumber: 'FACT-2025-0001', clientName: 'Tecno Soluciones S.L.', date: '2025-09-28', total: 1550.00, status: 'Pagada' },
//     { id: 'V-002', invoiceNumber: 'FACT-2025-0002', clientName: 'Distribuidora Global', date: '2025-09-25', total: 450.75, status: 'Pendiente' },
//     { id: 'V-003', invoiceNumber: 'FACT-2025-0003', clientName: 'El Buen Sabor C.A.', date: '2025-09-20', total: 3200.50, status: 'Pagada' },
//     { id: 'V-004', invoiceNumber: 'FACT-2025-0004', clientName: 'Innovación Web', date: '2025-09-18', total: 180.00, status: 'Pendiente' },
//   ];

//   // 🔹 Fetch de las Ventas de la empresa (Usando MOCK por ahora)
//   const fetchVentas = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) {
//         setVentas(mockVentas); // Usar mock si no hay sesión
//         setLoading(false);
//         return;
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
//       const companyId = session.user.companyId;
//       // 🚨 URL Asumida para obtener listado de ventas/facturas
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/sales/company/${companyId}`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` }
//       });
      
//       if (!res.ok) {
//           // Si falla la API real, usamos los mocks
//           console.warn("Error al cargar ventas de la API. Usando datos mock.");
//           setVentas(mockVentas); 
//           return;
//       }
      
//       const data = await res.json();
//       setVentas(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error al cargar las ventas');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     fetchVentas();
//   }, [fetchVentas]);

//   // 🔹 Filtrado y búsqueda
//   const filteredVentas = useMemo(() => {
//     return ventas
//       .filter(venta => {
//         const matchesSearch = venta.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                               venta.clientName.toLowerCase().includes(searchTerm.toLowerCase());
        
//         if (filter === 'paid') return venta.status === 'Pagada' && matchesSearch;
//         if (filter === 'pending') return venta.status === 'Pendiente' && matchesSearch;
//         return matchesSearch;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); // Ordenar por fecha descendente
//   }, [ventas, searchTerm, filter]);

//   // 🔹 Renderizado del estado de la venta
//   const renderStatus = (status: Venta['status']) => {
//     if (status === 'Pagada') {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
//           <CheckCircle className="w-3 h-3"/> Pagada
//         </span>
//       );
//     }
//     return (
//       <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">
//         <Clock className="w-3 h-3"/> Pendiente
//       </span>
//     );
//   };

//   const paidActive = filter === 'paid';
//   const pendingActive = filter === 'pending';

//   if (loading) {
//     return <div className="p-8 h-full flex justify-center items-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
//   }
//   if (error) {
//     return <div className="p-8 text-center text-red-500 h-full flex flex-col justify-center items-center"><AlertTriangle className="w-12 h-12 mb-4" /><p>{error}</p></div>;
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Ventas y Facturación</h1>
//         <Link href={PATHROUTES.pymes.ventas_nueva}><Button><PlusCircle className="mr-2 h-5 w-5" />Nueva Venta</Button></Link>
//       </div>

//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div className="relative flex-grow max-w-xs">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//             <input
//               type="text"
//               placeholder="Buscar por factura o cliente..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-foreground/50"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <button 
//               onClick={() => setFilter(paidActive ? 'all' : 'paid')}
//               className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${paidActive ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' : 'bg-transparent border border-border hover:bg-border'}`}
//             >
//               <CheckCircle className="mr-2 h-4 w-4"/> Pagadas
//             </button>
//             <button 
//               onClick={() => setFilter(pendingActive ? 'all' : 'pending')}
//               className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${pendingActive ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30' : 'bg-transparent border border-border hover:bg-border'}`}
//             >
//               <Clock className="mr-2 h-4 w-4"/> Pendientes
//             </button>
//           </div>
//         </div>
//       </Card>

//       {ventas.length === 0 ? (
//         <Card isClickable={false}>
//             <div className="text-center py-12">
//                 <ShoppingCart className="mx-auto h-12 w-12 text-foreground/30" />
//                 <h3 className="mt-2 text-xl font-semibold">Aún no hay ventas registradas</h3>
//                 <p className="mt-1 text-sm text-foreground/60">Crea tu primera factura para empezar a gestionar tus ingresos.</p>
//                 <Link href={PATHROUTES.pymes.ventas_nueva} className="mt-6 inline-block"><Button>Registrar Nueva Venta</Button></Link>
//             </div>
//         </Card>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Factura</th>
//                 <th className="p-4 font-semibold hidden md:table-cell">Cliente</th>
//                 <th className="p-4 font-semibold hidden lg:table-cell">Fecha</th>
//                 <th className="p-4 font-semibold text-center">Estado</th>
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 <th className="p-4"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredVentas.map(v => (
//                 <tr key={v.id} className="border-b border-border last:border-b-0 hover:bg-background/50">
//                   <td className="p-4 font-medium">
//                       <Link href={PATHROUTES.pymes.ventas_detalle(v.id)} className="text-primary hover:underline">{v.invoiceNumber}</Link>
//                   </td>
//                   <td className="p-4 hidden md:table-cell text-sm">{v.clientName}</td>
//                   <td className="p-4 hidden lg:table-cell text-sm">{v.date}</td>
//                   <td className="p-4 text-center">{renderStatus(v.status)}</td>
//                   <td className="p-4 text-right font-bold text-sm text-foreground">
//                       {new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'USD' }).format(v.total)}
//                   </td>
//                   <td className="p-4 text-right">
//                     <Link href={PATHROUTES.pymes.ventas_editar(v.id)}>
//                         <Button variant="outline" className="px-3 py-1 text-xs h-auto">Editar</Button>
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { Button } from '@/components/ui/Button';
// import { Card } from '@/components/ui/Card';
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Search, Loader2, AlertTriangle, User, ShoppingBag } from 'lucide-react';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';

// interface Cliente {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
//   totalPurchases: number;
//   lastPurchase: string;
// }

// export default function ClientesPage() {
//   const [clientes, setClientes] = useState<Cliente[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const { data: session } = useSession();

//   // 🔹 Fetch clientes desde la API
//   const fetchClientes = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) {
//       setError("No se encontró sesión o credenciales");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/company/${companyId}`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`Error en la API: ${res.status}`);
//       }

//       const data = await res.json();
//       setClientes(data);
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : 'Ocurrió un error al cargar los clientes'
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     fetchClientes();
//   }, [fetchClientes]);

//   // 🔹 Filtrar clientes
//   const filteredClientes = useMemo(() => {
//     return clientes.filter(
//       (c) =>
//         c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         c.email.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [clientes, searchTerm]);

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         <Loader2 className="animate-spin h-8 w-8 text-primary" />
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className="p-8 text-center text-red-500 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4" />
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
//         <Link href={PATHROUTES.pymes.clientes_nuevo}>
//           <Button>
//             <User className="mr-2 h-5 w-5" />
//             Nuevo Cliente
//           </Button>
//         </Link>
//       </div>

//       <Card isClickable={false} className="mb-8">
//         <div className="relative flex-grow max-w-xs">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//           <input
//             type="text"
//             placeholder="Buscar cliente..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-foreground/50"
//           />
//         </div>
//       </Card>

//       {clientes.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <ShoppingBag className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No hay clientes registrados</h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Agrega clientes para comenzar a gestionar sus compras e historiales.
//             </p>
//             <Link
//               href={PATHROUTES.pymes.clientes_nuevo}
//               className="mt-6 inline-block"
//             >
//               <Button>Registrar Nuevo Cliente</Button>
//             </Link>
//           </div>
//         </Card>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Nombre</th>
//                 <th className="p-4 font-semibold hidden md:table-cell">Email</th>
//                 <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
//                 <th className="p-4 font-semibold text-right">Compras Totales</th>
//                 <th className="p-4 font-semibold hidden md:table-cell">
//                   Última Compra
//                 </th>
//                 <th className="p-4"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredClientes.map((c) => (
//                 <tr
//                   key={c.id}
//                   className="border-b border-border last:border-b-0 hover:bg-background/50"
//                 >
//                   <td className="p-4 font-medium">
//                     <Link
//                       href={PATHROUTES.pymes.clientes_detalle(c.id)}
//                       className="text-primary hover:underline"
//                     >
//                       {c.name}
//                     </Link>
//                   </td>
//                   <td className="p-4 hidden md:table-cell text-sm">{c.email}</td>
//                   <td className="p-4 hidden lg:table-cell text-sm">{c.phone}</td>
//                   <td className="p-4 text-right font-bold text-sm text-foreground">
//                     {new Intl.NumberFormat('es-ES', {
//                       style: 'currency',
//                       currency: 'USD',
//                     }).format(c.totalPurchases)}
//                   </td>
//                   <td className="p-4 hidden md:table-cell text-sm">
//                     {c.lastPurchase}
//                   </td>
//                   <td className="p-4 text-right">
//                     <Link href={PATHROUTES.pymes.clientes_editar(c.id)}>
//                       <Button
//                         variant="outline"
//                         className="px-3 py-1 text-xs h-auto"
//                       >
//                         Editar
//                       </Button>
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { Button } from '@/components/ui/Button';
// import { Card } from '@/components/ui/Card';
// import { PATHROUTES } from '@/constants/pathroutes';
// import { PlusCircle, Search, Loader2, AlertTriangle, ShoppingCart, DollarSign, Clock, CheckCircle } from 'lucide-react';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';

// interface Order {
//   id: string;
//   orderNumber: string;
//   customerName: string;
//   date: string;
//   total: number;
//   status: 'Pagada' | 'Pendiente';
// }

// type Filter = 'all' | 'paid' | 'pending';

// export default function VentasPage() {
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState<Filter>('all');
//   const { data: session } = useSession();

//   // 🔹 Fetch de las órdenes de la empresa
//   const fetchOrders = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) {
//       setError('No se encontró sesión o credenciales');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`Error en la API: ${res.status}`);
//       }

//       const data = await res.json();
//       setOrders(data);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error al cargar las ventas');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     fetchOrders();
//   }, [fetchOrders]);

//   // 🔹 Filtrado y búsqueda
//   const filteredOrders = useMemo(() => {
//     return orders
//       .filter((o) => {
//         const matchesSearch =
//           o.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           o.customerName.toLowerCase().includes(searchTerm.toLowerCase());

//         if (filter === 'paid') return o.status === 'Pagada' && matchesSearch;
//         if (filter === 'pending') return o.status === 'Pendiente' && matchesSearch;
//         return matchesSearch;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   }, [orders, searchTerm, filter]);

//   // 🔹 Renderizado del estado de la orden
//   const renderStatus = (status: Order['status']) => {
//     if (status === 'Pagada') {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
//           <CheckCircle className="w-3 h-3" /> Pagada
//         </span>
//       );
//     }
//     return (
//       <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">
//         <Clock className="w-3 h-3" /> Pendiente
//       </span>
//     );
//   };

//   const paidActive = filter === 'paid';
//   const pendingActive = filter === 'pending';

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         <Loader2 className="animate-spin h-8 w-8 text-primary" />
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className="p-8 text-center text-red-500 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4" />
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
//         <Link href={PATHROUTES.pymes.ventas_nueva}>
//           <Button>
//             <PlusCircle className="mr-2 h-5 w-5" />Nueva Orden
//           </Button>
//         </Link>
//       </div>

//       <Card isClickable={false} className="mb-8">
//         <div className="relative flex-grow max-w-xs">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//           <input
//             type="text"
//             placeholder="Buscar por orden o cliente..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-foreground/50"
//           />
//         </div>
//         <div className="flex items-center gap-2 mt-4 md:mt-0">
//           <button
//             onClick={() => setFilter(paidActive ? 'all' : 'paid')}
//             className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${
//               paidActive
//                 ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
//                 : 'bg-transparent border border-border hover:bg-border'
//             }`}
//           >
//             <CheckCircle className="mr-2 h-4 w-4" /> Pagadas
//           </button>
//           <button
//             onClick={() => setFilter(pendingActive ? 'all' : 'pending')}
//             className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${
//               pendingActive
//                 ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30'
//                 : 'bg-transparent border border-border hover:bg-border'
//             }`}
//           >
//             <Clock className="mr-2 h-4 w-4" /> Pendientes
//           </button>
//         </div>
//       </Card>

//       {orders.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <ShoppingCart className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">
//               Aún no hay ventas registradas
//             </h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Crea tu primera orden para empezar a gestionar tus ventas.
//             </p>
//             <Link
//               href={PATHROUTES.pymes.ventas_nueva}
//               className="mt-6 inline-block"
//             >
//               <Button>Registrar Nueva Orden</Button>
//             </Link>
//           </div>
//         </Card>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Orden</th>
//                 <th className="p-4 font-semibold hidden md:table-cell">Cliente</th>
//                 <th className="p-4 font-semibold hidden lg:table-cell">Fecha</th>
//                 <th className="p-4 font-semibold text-center">Estado</th>
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 <th className="p-4"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredOrders.map((o) => (
//                 <tr
//                   key={o.id}
//                   className="border-b border-border last:border-b-0 hover:bg-background/50"
//                 >
//                   <td className="p-4 font-medium">
//                     <Link
//                       href={PATHROUTES.pymes.ventas_detalle(o.id)}
//                       className="text-primary hover:underline"
//                     >
//                       {o.orderNumber}
//                     </Link>
//                   </td>
//                   <td className="p-4 hidden md:table-cell text-sm">{o.customerName}</td>
//                   <td className="p-4 hidden lg:table-cell text-sm">{o.date}</td>
//                   <td className="p-4 text-center">{renderStatus(o.status)}</td>
//                   <td className="p-4 text-right font-bold text-sm text-foreground">
//                     {new Intl.NumberFormat('es-ES', {
//                       style: 'currency',
//                       currency: 'USD',
//                     }).format(o.total)}
//                   </td>
//                   <td className="p-4 text-right">
//                     <Link href={PATHROUTES.pymes.ventas_editar(o.id)}>
//                       <Button variant="outline" className="px-3 py-1 text-xs h-auto">
//                         Editar
//                       </Button>
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { Button } from '@/components/ui/Button';
// import { Card } from '@/components/ui/Card';
// import { PATHROUTES } from '@/constants/pathroutes';
// import { PlusCircle, List, Search, Loader2, AlertTriangle, ShoppingCart, DollarSign, Clock, CheckCircle } from 'lucide-react';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';

// // 🔹 Tipo de datos para una Orden/Venta
// interface Venta {
//   id: string;
//   orderNumber: string;
//   clientName: string;
//   date: string;
//   total: number;
//   status: 'Pagada' | 'Pendiente';
// }

// type Filter = 'all' | 'paid' | 'pending';

// export default function VentasPage() {
//   const [ventas, setVentas] = useState<Venta[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState<Filter>('all');
//   const { data: session } = useSession();

//   // 🔹 Fetch de las Ventas desde la API
//   const fetchVentas = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) {
//       setError('No hay sesión activa o falta el companyId');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${session.accessToken}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`Error al cargar ventas: ${res.status}`);
//       }

//       const data = await res.json();

//       // 🔹 Mapear la respuesta del backend a nuestro tipo Venta
//       const mappedVentas: Venta[] = data.map((order: any) => ({
//         id: order.id,
//         orderNumber: order.orderNumber ?? order.id, // usar orderNumber si existe
//         clientName: order.clientName ?? 'Cliente desconocido',
//         date: order.date ?? new Date().toISOString(),
//         total: order.total ?? 0,
//         status: order.status === 'paid' ? 'Pagada' : 'Pendiente',
//       }));

//       setVentas(mappedVentas);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error al cargar las ventas');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     fetchVentas();
//   }, [fetchVentas]);

//   // 🔹 Filtrado y búsqueda
//   const filteredVentas = useMemo(() => {
//     return ventas
//       .filter(venta => {
//         const matchesSearch =
//           venta.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           venta.clientName.toLowerCase().includes(searchTerm.toLowerCase());

//         if (filter === 'paid') return venta.status === 'Pagada' && matchesSearch;
//         if (filter === 'pending') return venta.status === 'Pendiente' && matchesSearch;
//         return matchesSearch;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   }, [ventas, searchTerm, filter]);

//   // 🔹 Renderizado del estado
//   const renderStatus = (status: Venta['status']) => {
//     if (status === 'Pagada') {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
//           <CheckCircle className="w-3 h-3" /> Pagada
//         </span>
//       );
//     }
//     return (
//       <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">
//         <Clock className="w-3 h-3" /> Pendiente
//       </span>
//     );
//   };

//   const paidActive = filter === 'paid';
//   const pendingActive = filter === 'pending';

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         <Loader2 className="animate-spin h-8 w-8 text-primary" />
//       </div>
//     );
//   }
//   if (error) {
//     return (
//       <div className="p-8 text-center text-red-500 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4" />
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Ventas y Facturación</h1>
//         <Link href={PATHROUTES.pymes.ventas_nueva}>
//           <Button>
//             <PlusCircle className="mr-2 h-5 w-5" />
//             Nueva Venta
//           </Button>
//         </Link>
//       </div>

//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div className="relative flex-grow max-w-xs">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//             <input
//               type="text"
//               placeholder="Buscar por número de orden o cliente..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-foreground/50"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setFilter(paidActive ? 'all' : 'paid')}
//               className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${
//                 paidActive
//                   ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
//                   : 'bg-transparent border border-border hover:bg-border'
//               }`}
//             >
//               <CheckCircle className="mr-2 h-4 w-4" /> Pagadas
//             </button>
//             <button
//               onClick={() => setFilter(pendingActive ? 'all' : 'pending')}
//               className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${
//                 pendingActive
//                   ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30'
//                   : 'bg-transparent border border-border hover:bg-border'
//               }`}
//             >
//               <Clock className="mr-2 h-4 w-4" /> Pendientes
//             </button>
//           </div>
//         </div>
//       </Card>

//       {ventas.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <ShoppingCart className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">Aún no hay ventas registradas</h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Crea tu primera orden para empezar a gestionar tus ingresos.
//             </p>
//             <Link href={PATHROUTES.pymes.ventas_nueva} className="mt-6 inline-block">
//               <Button>Registrar Nueva Venta</Button>
//             </Link>
//           </div>
//         </Card>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Orden</th>
//                 <th className="p-4 font-semibold hidden md:table-cell">Cliente</th>
//                 <th className="p-4 font-semibold hidden lg:table-cell">Fecha</th>
//                 <th className="p-4 font-semibold text-center">Estado</th>
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 <th className="p-4"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredVentas.map((v) => (
//                 <tr
//                   key={v.id}
//                   className="border-b border-border last:border-b-0 hover:bg-background/50"
//                 >
//                   <td className="p-4 font-medium">
//                     <Link
//                       href={PATHROUTES.pymes.ventas_detalle(v.id)}
//                       className="text-primary hover:underline"
//                     >
//                       {v.orderNumber}
//                     </Link>
//                   </td>
//                   <td className="p-4 hidden md:table-cell text-sm">{v.clientName}</td>
//                   <td className="p-4 hidden lg:table-cell text-sm">{v.date}</td>
//                   <td className="p-4 text-center">{renderStatus(v.status)}</td>
//                   <td className="p-4 text-right font-bold text-sm text-foreground">
//                     {new Intl.NumberFormat('es-ES', {
//                       style: 'currency',
//                       currency: 'USD',
//                     }).format(v.total)}
//                   </td>
//                   <td className="p-4 text-right">
//                     <Link href={PATHROUTES.pymes.ventas_editar(v.id)}>
//                       <Button variant="outline" className="px-3 py-1 text-xs h-auto">
//                         Editar
//                       </Button>
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { Button } from '@/components/ui/Button';
// import { Card } from '@/components/ui/Card';
// import { PATHROUTES } from '@/constants/pathroutes';
// import { PlusCircle, Search, Loader2, AlertTriangle, ShoppingCart, Clock, CheckCircle } from 'lucide-react';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';

// // 🔹 Tipo de datos para una factura
// interface Invoice {
//   id: string;
//   invoiceNumber: string;
//   clientName: string;
//   date: string;
//   total: number;
//   status: 'Pagada' | 'Pendiente';
// }

// type Filter = 'all' | 'paid' | 'pending';

// export default function VentasPage() {
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState<Filter>('all');
//   const { data: session } = useSession();

//   // 🔹 Fetch de las facturas desde la API
//   const fetchInvoices = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) {
//       setError('No hay sesión activa o falta el companyId');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${session.accessToken}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`Error al cargar facturas: ${res.status}`);
//       }

//       const data = await res.json();

//       // 🔹 Mapear la respuesta del backend a nuestro tipo Invoice
//       const mappedInvoices: Invoice[] = data.map((inv: any) => ({
//         id: inv.id,
//         invoiceNumber: inv.invoiceNumber ?? inv.id,
//         clientName: inv.clientName ?? 'Cliente desconocido',
//         date: inv.date ?? new Date().toISOString(),
//         total: inv.total ?? 0,
//         status: inv.status === 'paid' ? 'Pagada' : 'Pendiente',
//       }));

//       setInvoices(mappedInvoices);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error al cargar las facturas');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     fetchInvoices();
//   }, [fetchInvoices]);

//   // 🔹 Filtrado y búsqueda
//   const filteredInvoices = useMemo(() => {
//     return invoices
//       .filter(inv => {
//         const matchesSearch =
//           inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());

//         if (filter === 'paid') return inv.status === 'Pagada' && matchesSearch;
//         if (filter === 'pending') return inv.status === 'Pendiente' && matchesSearch;
//         return matchesSearch;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   }, [invoices, searchTerm, filter]);

//   const renderStatus = (status: Invoice['status']) => {
//     if (status === 'Pagada') {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
//           <CheckCircle className="w-3 h-3" /> Pagada
//         </span>
//       );
//     }
//     return (
//       <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">
//         <Clock className="w-3 h-3" /> Pendiente
//       </span>
//     );
//   };

//   const paidActive = filter === 'paid';
//   const pendingActive = filter === 'pending';

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         <Loader2 className="animate-spin h-8 w-8 text-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 text-center text-red-500 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4" />
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Historial de Facturas</h1>
//         <Link href={PATHROUTES.pymes.ventas_nueva}>
//           <Button>
//             <PlusCircle className="mr-2 h-5 w-5" />
//             Nueva Factura
//           </Button>
//         </Link>
//       </div>

//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div className="relative flex-grow max-w-xs">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//             <input
//               type="text"
//               placeholder="Buscar por número de factura o cliente..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-foreground/50"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setFilter(paidActive ? 'all' : 'paid')}
//               className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${
//                 paidActive
//                   ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
//                   : 'bg-transparent border border-border hover:bg-border'
//               }`}
//             >
//               <CheckCircle className="mr-2 h-4 w-4" /> Pagadas
//             </button>
//             <button
//               onClick={() => setFilter(pendingActive ? 'all' : 'pending')}
//               className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${
//                 pendingActive
//                   ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30'
//                   : 'bg-transparent border border-border hover:bg-border'
//               }`}
//             >
//               <Clock className="mr-2 h-4 w-4" /> Pendientes
//             </button>
//           </div>
//         </div>
//       </Card>

//       {invoices.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <ShoppingCart className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No hay facturas registradas</h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Crea tu primera factura para empezar a llevar el historial.
//             </p>
//             <Link href={PATHROUTES.pymes.ventas_nueva} className="mt-6 inline-block">
//               <Button>Registrar Nueva Factura</Button>
//             </Link>
//           </div>
//         </Card>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Factura</th>
//                 <th className="p-4 font-semibold hidden md:table-cell">Cliente</th>
//                 <th className="p-4 font-semibold hidden lg:table-cell">Fecha</th>
//                 <th className="p-4 font-semibold text-center">Estado</th>
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 <th className="p-4"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredInvoices.map((inv) => (
//                 <tr
//                   key={inv.id}
//                   className="border-b border-border last:border-b-0 hover:bg-background/50"
//                 >
//                   <td className="p-4 font-medium">
//                     <Link
//                       href={PATHROUTES.pymes.ventas_detalle(inv.id)}
//                       className="text-primary hover:underline"
//                     >
//                       {inv.invoiceNumber}
//                     </Link>
//                   </td>
//                   <td className="p-4 hidden md:table-cell text-sm">{inv.clientName}</td>
//                   <td className="p-4 hidden lg:table-cell text-sm">{inv.date}</td>
//                   <td className="p-4 text-center">{renderStatus(inv.status)}</td>
//                   <td className="p-4 text-right font-bold text-sm text-foreground">
//                     {new Intl.NumberFormat('es-ES', {
//                       style: 'currency',
//                       currency: 'USD',
//                     }).format(inv.total)}
//                   </td>
//                   <td className="p-4 text-right">
//                     <Link href={PATHROUTES.pymes.ventas_editar(inv.id)}>
//                       <Button variant="outline" className="px-3 py-1 text-xs h-auto">
//                         Editar
//                       </Button>
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { Button } from '@/components/ui/Button';
// import { Card } from '@/components/ui/Card';
// import { PATHROUTES } from '@/constants/pathroutes';
// import { PlusCircle, Search, Loader2, AlertTriangle, ShoppingCart, Clock, CheckCircle } from 'lucide-react';
// import Link from 'next/link';
// import { useSession } from 'next-auth/react';

// interface Invoice {
//   id: string;
//   invoiceNumber: string;
//   clientName: string;
//   date: string;
//   total: number;
//   status: 'Pagada' | 'Pendiente';
// }

// type Filter = 'all' | 'paid' | 'pending';

// export default function VentasPage() {
//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [filter, setFilter] = useState<Filter>('all');
//   const { data: session } = useSession();

//   const fetchInvoices = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) {
//       setError('No hay sesión activa o falta el companyId');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`,
//         {
//           headers: {
//             Authorization: `Bearer ${session.accessToken}`,
//             'Content-Type': 'application/json',
//           },
//         }
//       );

//       if (!res.ok) {
//         throw new Error(`Error al cargar facturas: ${res.status}`);
//       }

//       const data = await res.json();

//       const mappedInvoices: Invoice[] = data.map((inv: any) => ({
//         id: inv.id,
//         invoiceNumber: inv.number ?? inv.id,
//         clientName: inv.customer?.name ?? 'Cliente desconocido',
//         date: inv.issuedAt ?? new Date().toISOString(),
//         total: inv.total ?? 0,
//         status: inv.status?.toLowerCase() === 'paid' ? 'Pagada' : 'Pendiente',
//       }));

//       setInvoices(mappedInvoices);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error al cargar las facturas');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     fetchInvoices();
//   }, [fetchInvoices]);

//   const filteredInvoices = useMemo(() => {
//     return invoices
//       .filter(inv => {
//         const matchesSearch =
//           inv.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
//           inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());

//         if (filter === 'paid') return inv.status === 'Pagada' && matchesSearch;
//         if (filter === 'pending') return inv.status === 'Pendiente' && matchesSearch;
//         return matchesSearch;
//       })
//       .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
//   }, [invoices, searchTerm, filter]);

//   const renderStatus = (status: Invoice['status']) => {
//     if (status === 'Pagada') {
//       return (
//         <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300">
//           <CheckCircle className="w-3 h-3" /> Pagada
//         </span>
//       );
//     }
//     return (
//       <span className="inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 dark:bg-yellow-900/50 dark:text-yellow-300">
//         <Clock className="w-3 h-3" /> Pendiente
//       </span>
//     );
//   };

//   const paidActive = filter === 'paid';
//   const pendingActive = filter === 'pending';

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         <Loader2 className="animate-spin h-8 w-8 text-primary" />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 text-center text-red-500 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4" />
//         <p>{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Historial de Facturas</h1>
//         <Link href={PATHROUTES.pymes.ventas_nueva}>
//           <Button>
//             <PlusCircle className="mr-2 h-5 w-5" />
//             Nueva Factura
//           </Button>
//         </Link>
//       </div>

//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap items-center justify-between gap-4">
//           <div className="relative flex-grow max-w-xs">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//             <input
//               type="text"
//               placeholder="Buscar por número de factura o cliente..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-foreground/50"
//             />
//           </div>
//           <div className="flex items-center gap-2">
//             <button
//               onClick={() => setFilter(paidActive ? 'all' : 'paid')}
//               className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${
//                 paidActive
//                   ? 'bg-green-600 text-white shadow-lg shadow-green-600/30'
//                   : 'bg-transparent border border-border hover:bg-border'
//               }`}
//             >
//               <CheckCircle className="mr-2 h-4 w-4" /> Pagadas
//             </button>
//             <button
//               onClick={() => setFilter(pendingActive ? 'all' : 'pending')}
//               className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${
//                 pendingActive
//                   ? 'bg-yellow-400 text-gray-900 shadow-lg shadow-yellow-400/30'
//                   : 'bg-transparent border border-border hover:bg-border'
//               }`}
//             >
//               <Clock className="mr-2 h-4 w-4" /> Pendientes
//             </button>
//           </div>
//         </div>
//       </Card>

//       {invoices.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <ShoppingCart className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No hay facturas registradas</h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Crea tu primera factura para empezar a llevar el historial.
//             </p>
//             <Link href={PATHROUTES.pymes.ventas_nueva} className="mt-6 inline-block">
//               <Button>Registrar Nueva Factura</Button>
//             </Link>
//           </div>
//         </Card>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Factura</th>
//                 <th className="p-4 font-semibold hidden md:table-cell">Cliente</th>
//                 <th className="p-4 font-semibold hidden lg:table-cell">Fecha</th>
//                 <th className="p-4 font-semibold text-center">Estado</th>
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 <th className="p-4"></th>
//               </tr>
//             </thead>
//             <tbody>
//               {filteredInvoices.map((inv) => (
//                 <tr
//                   key={inv.id}
//                   className="border-b border-border last:border-b-0 hover:bg-background/50"
//                 >
//                   <td className="p-4 font-medium">
//                     <Link
//                       href={PATHROUTES.pymes.ventas_detalle(inv.id)}
//                       className="text-primary hover:underline"
//                     >
//                       {inv.invoiceNumber}
//                     </Link>
//                   </td>
//                   <td className="p-4 hidden md:table-cell text-sm">{inv.clientName}</td>
//                   <td className="p-4 hidden lg:table-cell text-sm">{new Date(inv.date).toLocaleDateString()}</td>
//                   <td className="p-4 text-center">{renderStatus(inv.status)}</td>
//                   <td className="p-4 text-right font-bold text-sm text-foreground">
//                     {new Intl.NumberFormat('es-ES', {
//                       style: 'currency',
//                       currency: 'USD',
//                     }).format(inv.total)}
//                   </td>
//                   <td className="p-4 text-right">
//                     <Link href={PATHROUTES.pymes.ventas_editar(inv.id)}>
//                       <Button variant="outline" className="px-3 py-1 text-xs h-auto">
//                         Editar
//                       </Button>
//                     </Link>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useSession } from 'next-auth/react';
// import { Card } from '@/components/ui/Card';
// import { Loader2, AlertCircle } from 'lucide-react';
// import { toast } from 'react-hot-toast';

// interface InvoiceAPI {
//   id: string;
//   number: string;
//   issuedAt: string;
//   customer?: {
//     name: string;
//   };
//   total: number;
//   status: string;
// }

// interface InvoiceUI {
//   id: string;
//   number: string;
//   fecha: Date;
//   customerName: string;
//   total: number;
//   status: string;
// }

// export default function ModuloVentas() {
//   const { data: session } = useSession();
//   const [invoices, setInvoices] = useState<InvoiceUI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const fetchInvoices = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${session.user.companyId}`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );

//       if (!res.ok) throw new Error(`Error al cargar facturas: ${res.status}`);

//       const invoicesAPI: InvoiceAPI[] = await res.json();
//       setInvoices(
//         invoicesAPI.map((f) => ({
//           id: f.id,
//           number: f.number,
//           fecha: new Date(f.issuedAt),
//           customerName: f.customer?.name || 'Cliente Desconocido',
//           total: f.total,
//           status: f.status,
//         }))
//       );
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error inesperado.';
//       setError(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session) fetchInvoices();
//   }, [session, fetchInvoices]);

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando historial de facturas...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertCircle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al cargar historial</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-6">
//       <h1 className="text-3xl font-bold text-foreground mb-4">Historial de Facturas</h1>
//       {invoices.length === 0 ? (
//         <p className="text-foreground/60 text-center py-8">No hay facturas emitidas todavía.</p>
//       ) : (
//         <div className="space-y-3">
//           {invoices
//             .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
//             .map((invoice) => (
//               <Card key={invoice.id} className="p-4 border border-border bg-background/50 hover:bg-background/80 transition-colors">
//                 <div className="flex flex-wrap justify-between items-center gap-2">
//                   <div>
//                     <h3 className="font-semibold text-primary">{invoice.number}</h3>
//                     <p className="text-sm text-foreground">{invoice.customerName}</p>
//                     <p className="text-xs text-foreground/60">{invoice.fecha.toLocaleDateString()}</p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-bold text-lg text-foreground">${invoice.total.toFixed(2)}</p>
//                   </div>
//                 </div>
//               </Card>
//             ))}
//         </div>
//       )}
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useSession } from 'next-auth/react';

// import { Loader2, AlertCircle, History, FileText, ShoppingCart } from 'lucide-react';
// import { toast } from 'react-hot-toast';
// import { Card } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';

// interface InvoiceAPI {
//   id: string;
//   number: string;
//   issuedAt: string;
//   customer?: { name: string };
//   total: number;
//   status: string;
// }

// interface OrderAPI {
//   id: string;
//   number: string;
//   createdAt: string;
//   customer?: { name: string };
//   total: number;
//   status: string;
// }

// interface RecordUI {
//   id: string;
//   number: string;
//   fecha: Date;
//   customerName: string;
//   total: number;
//   status: string;
// }

// export default function ModuloVentas() {
//   const { data: session } = useSession();
//   const [invoices, setInvoices] = useState<RecordUI[]>([]);
//   const [orders, setOrders] = useState<RecordUI[]>([]);
//   const [loadingInvoices, setLoadingInvoices] = useState(true);
//   const [loadingOrders, setLoadingOrders] = useState(true);
//   const [errorInvoices, setErrorInvoices] = useState<string | null>(null);
//   const [errorOrders, setErrorOrders] = useState<string | null>(null);
//   const [view, setView] = useState<'invoices' | 'orders'>('invoices');

//   // 🔹 Fetch Facturas
//   const fetchInvoices = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setLoadingInvoices(false);
//       return;
//     }

//     try {
//       setLoadingInvoices(true);
//       setErrorInvoices(null);

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${session.user.companyId}`, {
//         headers: { Authorization: `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) throw new Error(`Error al cargar facturas: ${res.status}`);

//       const data: InvoiceAPI[] = await res.json();
//       setInvoices(
//         data.map((f) => ({
//           id: f.id,
//           number: f.number,
//           fecha: new Date(f.issuedAt),
//           customerName: f.customer?.name || 'Cliente Desconocido',
//           total: f.total,
//           status: f.status,
//         }))
//       );
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Error inesperado.';
//       setErrorInvoices(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoadingInvoices(false);
//     }
//   }, [session]);

//   // 🔹 Fetch Pedidos
//   const fetchOrders = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setLoadingOrders(false);
//       return;
//     }

//     try {
//       setLoadingOrders(true);
//       setErrorOrders(null);

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${session.user.companyId}`, {
//         headers: { Authorization: `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) throw new Error(`Error al cargar pedidos: ${res.status}`);

//       const data: OrderAPI[] = await res.json();
//       setOrders(
//         data.map((o) => ({
//           id: o.id,
//           number: o.number,
//           fecha: new Date(o.createdAt),
//           customerName: o.customer?.name || 'Cliente Desconocido',
//           total: o.total,
//           status: o.status,
//         }))
//       );
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Error inesperado.';
//       setErrorOrders(errorMessage);
//       toast.error(errorMessage);
//     } finally {
//       setLoadingOrders(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session) {
//       fetchInvoices();
//       fetchOrders();
//     }
//   }, [session, fetchInvoices, fetchOrders]);

//   const renderRecords = (records: RecordUI[], loading: boolean, error: string | null, type: 'Factura' | 'Pedido') => {
//     if (loading)
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//           <Loader2 className="animate-spin h-12 w-12 text-primary" />
//           <p className="mt-4 text-foreground/70">Cargando {type.toLowerCase()}s...</p>
//         </div>
//       );

//     if (error)
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//           <AlertCircle className="h-12 w-12 text-red-500" />
//           <p className="mt-4 font-bold text-lg">Error al cargar {type.toLowerCase()}s</p>
//           <p className="text-foreground/70">{error}</p>
//         </div>
//       );

//     if (records.length === 0)
//       return (
//         <p className="text-foreground/60 text-center py-8">No hay {type.toLowerCase()}s registradas todavía.</p>
//       );

//     return (
//       <div className="space-y-3">
//         {records
//           .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
//           .map((rec) => (
//             <Card key={rec.id} className="p-4 border border-border bg-background/50 hover:bg-background/80 transition-colors">
//               <div className="flex flex-wrap justify-between items-center gap-2">
//                 <div>
//                   <h3 className="font-semibold text-primary">{rec.number}</h3>
//                   <p className="text-sm text-foreground">{rec.customerName}</p>
//                   <p className="text-xs text-foreground/60">{rec.fecha.toLocaleDateString()}</p>
//                 </div>
//                 <div className="text-right">
//                   <p className="font-bold text-lg text-foreground">${rec.total.toFixed(2)}</p>
//                 </div>
//               </div>
//             </Card>
//           ))}
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-6">
//       <h1 className="text-3xl font-bold text-foreground mb-4">Módulo de Ventas</h1>
//       <div className="flex gap-4 mb-6">
//         <Button variant={view === 'invoices' ? 'primary' : 'outline'} onClick={() => setView('invoices')}>
//           <FileText className="mr-2 h-5 w-5" /> Facturas
//         </Button>
//         <Button variant={view === 'orders' ? 'primary' : 'outline'} onClick={() => setView('orders')}>
//           <ShoppingCart className="mr-2 h-5 w-5" /> Pedidos
//         </Button>
//       </div>

//       {view === 'invoices'
//         ? renderRecords(invoices, loadingInvoices, errorInvoices, 'Factura')
//         : renderRecords(orders, loadingOrders, errorOrders, 'Pedido')}
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useSession } from 'next-auth/react';
// import { Card } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Loader2, AlertCircle, History } from 'lucide-react';
// import { PATHROUTES } from '@/constants/pathroutes';

// // 🔹 Tipos de Factura y Pedido
// interface RecordUI {
//   id: string;
//   number: string;
//   fecha: Date;
//   customerName: string;
//   total: number;
//   status: string;
// }

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<RecordUI[]>([]);
//   const [orders, setOrders] = useState<RecordUI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showInvoices, setShowInvoices] = useState(true);

//   const fetchRecords = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setError('No hay sesión activa o falta el companyId');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;

//       // 🔹 Fetch paralelo de facturas y pedidos
//       const [invoicesRes, ordersRes] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }),
//       ]);

//       if (!invoicesRes.ok) throw new Error(`Error al cargar facturas: ${invoicesRes.status}`);
//       if (!ordersRes.ok) throw new Error(`Error al cargar pedidos: ${ordersRes.status}`);

//       const invoicesData = await invoicesRes.json();
//       const ordersData = await ordersRes.json();

//       // 🔹 Mapear datos asegurando que total sea un número
//       setInvoices(
//         invoicesData.map((f: any) => ({
//           id: f.id,
//           number: f.number,
//           fecha: new Date(f.issuedAt),
//           customerName: f.customer?.name || 'Cliente Desconocido',
//           total: typeof f.total === 'number' ? f.total : 0,
//           status: f.status,
//         }))
//       );

//       setOrders(
//         ordersData.map((o: any) => ({
//           id: o.id,
//           number: o.number,
//           fecha: new Date(o.createdAt),
//           customerName: o.customer?.name || 'Cliente Desconocido',
//           total: typeof o.total === 'number' ? o.total : 0,
//           status: o.status,
//         }))
//       );
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error al cargar los registros');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session) fetchRecords();
//   }, [session, fetchRecords]);

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando historial de ventas...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertCircle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al cargar los registros</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   const renderRecords = (records: RecordUI[]) => {
//     if (records.length === 0) {
//       return <p className="text-foreground/60 text-center py-8">No hay registros disponibles.</p>;
//     }

//     return (
//       <div className="space-y-3">
//         {records
//           .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
//           .map((rec) => (
//             <Card
//               key={rec.id}
//               className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors flex justify-between items-center"
//             >
//               <div>
//                 <h3 className="font-semibold text-primary">{rec.number}</h3>
//                 <p className="text-sm text-foreground">{rec.customerName}</p>
//                 <p className="text-xs text-foreground/60">{rec.fecha.toLocaleDateString()}</p>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold text-lg text-foreground">
//                   ${typeof rec.total === 'number' ? rec.total.toFixed(2) : '0.00'}
//                 </p>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   rec.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {rec.status}
//                 </span>
//               </div>
//             </Card>
//           ))}
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-6">
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h1 className="text-3xl font-bold text-foreground">Módulo de Ventas</h1>
//         <div className="flex gap-2">
//           <Button variant={showInvoices ? 'primary' : 'outline'} onClick={() => setShowInvoices(true)}>
//             Facturas
//           </Button>
//           <Button variant={!showInvoices ? 'primary' : 'outline'} onClick={() => setShowInvoices(false)}>
//             Pedidos
//           </Button>
//         </div>
//       </div>

//       {showInvoices ? renderRecords(invoices) : renderRecords(orders)}
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useSession } from 'next-auth/react';
// import { Card } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Loader2, AlertCircle } from 'lucide-react';

// // Tipos generales
// interface RecordUI {
//   id: string;
//   number?: string;
//   fecha: Date;
//   customerOrSupplier: string;
//   total: number;
//   status?: string;
//   type: 'Factura' | 'Pedido' | 'Compra';
// }

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [records, setRecords] = useState<RecordUI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<'Factura' | 'Pedido' | 'Compra'>('Factura');

//   const fetchRecords = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setError('No hay sesión activa o falta el companyId');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       // 🔹 Fetch paralelo de facturas, pedidos y compras
//       const [invoicesRes, ordersRes, purchasesRes] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}?type=purchase`, { headers: { Authorization: `Bearer ${token}` } }),
//       ]);

//       if (!invoicesRes.ok) throw new Error(`Error al cargar facturas: ${invoicesRes.status}`);
//       if (!ordersRes.ok) throw new Error(`Error al cargar pedidos: ${ordersRes.status}`);
//       if (!purchasesRes.ok) throw new Error(`Error al cargar compras: ${purchasesRes.status}`);

//       const invoicesData = await invoicesRes.json();
//       const ordersData = await ordersRes.json();
//       const purchasesData = await purchasesRes.json();

//       const mappedRecords: RecordUI[] = [
//         ...invoicesData.map((f: any) => ({
//           id: f.id,
//           type: 'Factura',
//           number: f.number,
//           customerOrSupplier: f.customer?.name || 'Cliente Desconocido',
//           fecha: new Date(f.issuedAt),
//           total: typeof f.total === 'number' ? f.total : 0,
//           status: f.status,
//         })),
//         ...ordersData.map((o: any) => ({
//           id: o.id,
//           type: 'Pedido',
//           number: o.number,
//           customerOrSupplier: o.customer?.name || 'Cliente Desconocido',
//           fecha: new Date(o.createdAt),
//           total: typeof o.total === 'number' ? o.total : 0,
//           status: o.status,
//         })),
//         ...purchasesData.map((p: any) => ({
//           id: p.id,
//           type: 'Compra',
//           number: p.number || undefined,
//           customerOrSupplier: p.supplier?.name || 'Proveedor Desconocido',
//           fecha: new Date(p.createdAt),
//           total: typeof p.total === 'number' ? p.total : 0,
//         })),
//       ];

//       // Orden descendente por fecha
//       mappedRecords.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
//       setRecords(mappedRecords);
//     } catch (err) {
//       const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error al cargar los registros';
//       setError(errorMessage);
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session) fetchRecords();
//   }, [session, fetchRecords]);

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando historial...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertCircle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al cargar los registros</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   const renderRecords = (type: 'Factura' | 'Pedido' | 'Compra') => {
//     const filtered = records.filter(r => r.type === type);
//     if (filtered.length === 0) {
//       return <p className="text-foreground/60 text-center py-8">No hay {type.toLowerCase()}s disponibles.</p>;
//     }

//     return (
//       <div className="space-y-3">
//         {filtered.map(rec => (
//           <Card
//             key={rec.id}
//             className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors flex justify-between items-center"
//           >
//             <div>
//               {rec.number && <h3 className="font-semibold text-primary">{rec.number}</h3>}
//               <p className="text-sm text-foreground">{rec.customerOrSupplier}</p>
//               <p className="text-xs text-foreground/60">{rec.fecha.toLocaleDateString()}</p>
//             </div>
//             <div className="text-right">
//               <p className="font-bold text-lg text-foreground">${rec.total.toFixed(2)}</p>
//               {rec.status && (
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   rec.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {rec.status}
//                 </span>
//               )}
//             </div>
//           </Card>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-6">
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h1 className="text-3xl font-bold text-foreground">Módulo de Ventas</h1>
//         <div className="flex gap-2">
//           {(['Factura', 'Pedido', 'Compra'] as const).map(tab => (
//             <Button
//               key={tab}
//               variant={activeTab === tab ? 'primary' : 'outline'}
//               onClick={() => setActiveTab(tab)}
//             >
//               {tab}s
//             </Button>
//           ))}
//         </div>
//       </div>

//       {renderRecords(activeTab)}
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useMemo, useCallback } from 'react';
// import { useSession } from 'next-auth/react';
// import { Card } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Loader2, AlertCircle } from 'lucide-react';

// // Tipos
// interface RecordUI {
//   id: string;
//   number?: string;
//   fecha: Date;
//   customerName: string;
//   total: number;
//   status?: string;
//   type: 'Factura' | 'Pedido';
// }

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [records, setRecords] = useState<RecordUI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<'Factura' | 'Pedido'>('Factura');

//   // 🔹 Cargar facturas y pedidos
//   const fetchRecords = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setError('No hay sesión activa o falta el companyId');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       // 🔹 Fetch paralelo de facturas y pedidos
//       const [invoicesRes, ordersRes] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (!invoicesRes.ok) throw new Error(`Error al cargar facturas: ${invoicesRes.status}`);
//       if (!ordersRes.ok) throw new Error(`Error al cargar pedidos: ${ordersRes.status}`);

//       const invoicesData = await invoicesRes.json();
//       const ordersData = await ordersRes.json();

//       // 🔹 Mapear datos y asegurar que total sea un número
//       const mappedRecords: RecordUI[] = [
//         ...invoicesData.map((f: any) => ({
//           id: f.id,
//           type: 'Factura',
//           number: f.number,
//           customerName: f.customer?.name || 'Cliente Desconocido',
//           fecha: new Date(f.issuedAt),
//           total: typeof f.total === 'number' ? f.total : 0,
//           status: f.status,
//         })),
//         ...ordersData.map((o: any) => ({
//           id: o.id,
//           type: 'Pedido',
//           number: o.number,
//           customerName: o.customer?.name || 'Cliente Desconocido',
//           fecha: new Date(o.createdAt),
//           total: typeof o.total === 'number' ? o.total : 0,
//           status: o.status,
//         })),
//       ];

//       // 🔹 Ordenar por fecha descendente
//       mappedRecords.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

//       setRecords(mappedRecords);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Error al cargar registros');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session) fetchRecords();
//   }, [session, fetchRecords]);

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando historial de ventas...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertCircle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al cargar los registros</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   const renderRecords = (type: 'Factura' | 'Pedido') => {
//     const filtered = records.filter(r => r.type === type);

//     if (filtered.length === 0) {
//       return <p className="text-foreground/60 text-center py-8">No hay {type.toLowerCase()}s disponibles.</p>;
//     }

//     return (
//       <div className="space-y-3">
//         {filtered.map(rec => (
//           <Card
//             key={rec.id}
//             className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors flex justify-between items-center"
//           >
//             <div>
//               {rec.number && <h3 className="font-semibold text-primary">{rec.number}</h3>}
//               <p className="text-sm text-foreground">{rec.customerName}</p>
//               <p className="text-xs text-foreground/60">{rec.fecha.toLocaleDateString()}</p>
//             </div>
//             <div className="text-right">
//               <p className="font-bold text-lg text-foreground">${rec.total.toFixed(2)}</p>
//               {rec.status && (
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${
//                   rec.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
//                 }`}>
//                   {rec.status}
//                 </span>
//               )}
//             </div>
//           </Card>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-6">
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h1 className="text-3xl font-bold text-foreground">Módulo de Ventas</h1>
//         <div className="flex gap-2">
//           <Button variant={activeTab === 'Factura' ? 'primary' : 'outline'} onClick={() => setActiveTab('Factura')}>
//             Facturas
//           </Button>
//           <Button variant={activeTab === 'Pedido' ? 'primary' : 'outline'} onClick={() => setActiveTab('Pedido')}>
//             Pedidos
//           </Button>
//         </div>
//       </div>

//       {renderRecords(activeTab)}
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useSession } from 'next-auth/react';
// import { Card } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Loader2, AlertCircle } from 'lucide-react';

// interface RecordUI {
//   id: string;
//   number?: string;
//   fecha: Date;
//   customerName: string;
//   total: number;
//   status?: string;
//   type: 'Factura' | 'Pedido';
// }

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [records, setRecords] = useState<RecordUI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<'Factura' | 'Pedido'>('Factura');

//   const fetchRecords = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setError('No hay sesión activa o falta el companyId');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       const [invoicesRes, ordersRes] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (!invoicesRes.ok) throw new Error(`Error al cargar facturas: ${invoicesRes.status}`);
//       if (!ordersRes.ok) throw new Error(`Error al cargar pedidos: ${ordersRes.status}`);

//       const invoicesData = await invoicesRes.json();
//       const ordersData = await ordersRes.json();

//       const mappedRecords: RecordUI[] = [
//         ...invoicesData.map((f: any) => ({
//           id: f.id,
//           type: 'Factura',
//           number: f.number,
//           customerName: f.customer?.name || 'Cliente Desconocido',
//           fecha: new Date(f.issuedAt),
//           total: typeof f.total === 'number' ? f.total : 0,
//           status: f.status,
//         })),
//         ...ordersData.map((o: any) => ({
//           id: o.id,
//           type: 'Pedido',
//           number: o.number,
//           customerName: o.customer?.name || 'Cliente Desconocido', // si tu endpoint orders no tiene customer, reemplazar con supplier?.name
//           fecha: new Date(o.createdAt),
//           total: typeof o.total === 'number' ? o.total : 0,
//           status: o.status,
//         })),
//       ];

//       mappedRecords.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
//       setRecords(mappedRecords);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Error al cargar registros');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session) fetchRecords();
//   }, [session, fetchRecords]);

//   if (loading) return (
//     <div className="p-8 h-full flex flex-col justify-center items-center">
//       <Loader2 className="animate-spin h-12 w-12 text-primary" />
//       <p className="mt-4 text-foreground/70">Cargando historial de ventas...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="p-8 h-full flex flex-col justify-center items-center">
//       <AlertCircle className="h-12 w-12 text-red-500" />
//       <p className="mt-4 font-bold text-lg">Error al cargar los registros</p>
//       <p className="text-foreground/70">{error}</p>
//     </div>
//   );

//   const renderRecords = (type: 'Factura' | 'Pedido') => {
//     const filtered = records.filter(r => r.type === type);
//     if (filtered.length === 0) return <p className="text-foreground/60 text-center py-8">No hay {type.toLowerCase()}s disponibles.</p>;

//     return (
//       <div className="space-y-3">
//         {filtered.map(rec => (
//           <Card key={rec.id} className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors flex justify-between items-center">
//             <div>
//               {rec.number && <h3 className="font-semibold text-primary">{rec.number}</h3>}
//               <p className="text-sm text-foreground">{rec.customerName}</p>
//               <p className="text-xs text-foreground/60">{rec.fecha.toLocaleDateString()}</p>
//             </div>
//             <div className="text-right">
//               <p className="font-bold text-lg text-foreground">${rec.total.toFixed(2)}</p>
//               {rec.status && <span className={`px-2 py-1 rounded-full text-xs font-medium ${rec.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{rec.status}</span>}
//             </div>
//           </Card>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-6">
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h1 className="text-3xl font-bold text-foreground">Módulo de Ventas</h1>
//         <div className="flex gap-2">
//           <Button variant={activeTab === 'Factura' ? 'primary' : 'outline'} onClick={() => setActiveTab('Factura')}>Facturas</Button>
//           <Button variant={activeTab === 'Pedido' ? 'primary' : 'outline'} onClick={() => setActiveTab('Pedido')}>Pedidos</Button>
//         </div>
//       </div>
//       {renderRecords(activeTab)}
//     </div>
//   );
// }


// 'use client';

// import { useState, useEffect, useCallback } from 'react';
// import { useSession } from 'next-auth/react';
// import { Card } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';
// import { Loader2, AlertCircle } from 'lucide-react';

// interface RecordUI {
//   id: string;
//   number?: string;
//   fecha: Date;
//   customerName: string;
//   total: number;
//   status?: string;
//   type: 'Factura' | 'Pedido';
// }

// interface Item {
//   productId: string;
//   quantity: number;
//   price?: number;
// }

// interface OrderAPI {
//   id: string;
//   number: string;
//   createdAt: string;
//   supplier?: { name: string };
//   items: Item[];
//   status?: string;
// }

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [records, setRecords] = useState<RecordUI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<'Factura' | 'Pedido'>('Factura');

//   const fetchRecords = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setError('No hay sesión activa o falta el companyId');
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       // Fetch paralelo de facturas y pedidos
//       const [invoicesRes, ordersRes] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//       ]);

//       if (!invoicesRes.ok) throw new Error(`Error al cargar facturas: ${invoicesRes.status}`);
//       if (!ordersRes.ok) throw new Error(`Error al cargar pedidos: ${ordersRes.status}`);

//       const invoicesData = await invoicesRes.json();
//       const ordersData: OrderAPI[] = await ordersRes.json();

//       const mappedRecords: RecordUI[] = [
//         // Mapear facturas
//         ...invoicesData.map((f: any) => ({
//           id: f.id,
//           type: 'Factura',
//           number: f.number,
//           customerName: f.customer?.name || 'Cliente Desconocido',
//           fecha: new Date(f.issuedAt),
//           total: typeof f.total === 'number' ? f.total : 0,
//           status: f.status,
//         })),
//         // Mapear pedidos
//         ...ordersData.map((o) => ({
//           id: o.id,
//           type: 'Pedido',
//           number: o.number,
//           customerName: o.supplier?.name || 'Cliente Desconocido',
//           fecha: new Date(o.createdAt),
//           total: o.items.reduce((sum, i) => sum + (i.price ?? 0) * i.quantity, 0),
//           status: o.status,
//         })),
//       ];

//       mappedRecords.sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
//       setRecords(mappedRecords);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Error al cargar registros');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session) fetchRecords();
//   }, [session, fetchRecords]);

//   if (loading) return (
//     <div className="p-8 h-full flex flex-col justify-center items-center">
//       <Loader2 className="animate-spin h-12 w-12 text-primary" />
//       <p className="mt-4 text-foreground/70">Cargando historial de ventas...</p>
//     </div>
//   );

//   if (error) return (
//     <div className="p-8 h-full flex flex-col justify-center items-center">
//       <AlertCircle className="h-12 w-12 text-red-500" />
//       <p className="mt-4 font-bold text-lg">Error al cargar los registros</p>
//       <p className="text-foreground/70">{error}</p>
//     </div>
//   );

//   const renderRecords = (type: 'Factura' | 'Pedido') => {
//     const filtered = records.filter(r => r.type === type);
//     if (filtered.length === 0) return <p className="text-foreground/60 text-center py-8">No hay {type.toLowerCase()}s disponibles.</p>;

//     return (
//       <div className="space-y-3">
//         {filtered.map(rec => (
//           <Card key={rec.id} className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors flex justify-between items-center">
//             <div>
//               {rec.number && <h3 className="font-semibold text-primary">{rec.number}</h3>}
//               <p className="text-sm text-foreground">{rec.customerName}</p>
//               <p className="text-xs text-foreground/60">{rec.fecha.toLocaleDateString()}</p>
//             </div>
//             <div className="text-right">
//               <p className="font-bold text-lg text-foreground">${rec.total.toFixed(2)}</p>
//               {rec.status && <span className={`px-2 py-1 rounded-full text-xs font-medium ${rec.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{rec.status}</span>}
//             </div>
//           </Card>
//         ))}
//       </div>
//     );
//   };

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-6">
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h1 className="text-3xl font-bold text-foreground">Módulo de Ventas</h1>
//         <div className="flex gap-2">
//           <Button variant={activeTab === 'Factura' ? 'primary' : 'outline'} onClick={() => setActiveTab('Factura')}>Facturas</Button>
//           <Button variant={activeTab === 'Pedido' ? 'primary' : 'outline'} onClick={() => setActiveTab('Pedido')}>Pedidos</Button>
//         </div>
//       </div>
//       {renderRecords(activeTab)}
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useSession } from "next-auth/react";
// import { Loader2, AlertTriangle, LayoutGrid, List, Search } from "lucide-react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";

// // 🔹 Tipos
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

// interface Order {
//   id: string;
//   number: string;
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }

// interface Invoice {
//   id: string;
//   number: string;
//   issuedAt: string;
//   customer?: { name: string };
//   total?: number;
//   status: string;
// }

// interface RecordUI {
//   id: string;
//   number: string;
//   fecha: Date;
//   customerName: string;
//   total: number;
//   status: string;
// }

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<RecordUI[]>([]);
//   const [orders, setOrders] = useState<RecordUI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [showInvoices, setShowInvoices] = useState(true);
//   const [viewMode, setViewMode] = useState<"cards" | "list">("cards");
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔹 Fetch productos (para calcular totales de pedidos)
//   const fetchProducts = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return [];
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       if (!res.ok) throw new Error("Error al cargar productos del inventario");
//       return await res.json();
//     } catch (err) {
//       console.error(err);
//       return [];
//     }
//   }, [session]);

//   const fetchRecords = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setError("No hay sesión activa o falta companyId");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       // 🔹 Fetch paralelo
//       const [invoicesRes, ordersRes, products] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetchProducts(),
//       ]);

//       if (!invoicesRes.ok) throw new Error("Error al cargar facturas");
//       if (!ordersRes.ok) throw new Error("Error al cargar pedidos");

//       const invoicesData: Invoice[] = await invoicesRes.json();
//       const ordersData: Order[] = await ordersRes.json();

//       // 🔹 Mapear facturas
//       setInvoices(
//         invoicesData.map((f) => ({
//           id: f.id,
//           number: f.number,
//           fecha: new Date(f.issuedAt),
//           customerName: f.customer?.name || "Cliente Desconocido",
//           total: typeof f.total === "number" ? f.total : 0,
//           status: f.status,
//         }))
//       );

//       // 🔹 Mapear pedidos y calcular total cruzando con inventario
//       setOrders(
//         ordersData.map((o) => {
//           const total = o.items.reduce((sum, i) => {
//             const product = products.find((p: Product) => p.id === i.productId);
//             return sum + (product?.price ?? 0) * i.quantity;
//           }, 0);

//           return {
//             id: o.id,
//             number: o.number,
//             fecha: new Date(o.createdAt),
//             customerName: o.supplier?.name || "Cliente Desconocido",
//             total,
//             status: o.status,
//           };
//         })
//       );
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Ocurrió un error al cargar registros");
//     } finally {
//       setLoading(false);
//     }
//   }, [session, fetchProducts]);

//   useEffect(() => {
//     if (session) fetchRecords();
//   }, [session, fetchRecords]);

//   const filteredRecords = useMemo(() => {
//     const data = showInvoices ? invoices : orders;
//     return data.filter(
//       (r) =>
//         r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         r.number.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [showInvoices, invoices, orders, searchTerm]);

//   const renderRecords = (records: RecordUI[]) => {
//     if (records.length === 0)
//       return <p className="text-center py-8 text-foreground/60">No hay registros disponibles.</p>;

//     return (
//       <div className="space-y-3">
//         {records
//           .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
//           .map((rec) => (
//             <Card
//               key={rec.id}
//               className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors flex justify-between items-center"
//             >
//               <div>
//                 <h3 className="font-semibold text-primary">{rec.number}</h3>
//                 <p className="text-sm text-foreground">{rec.customerName}</p>
//                 <p className="text-xs text-foreground/60">{rec.fecha.toLocaleDateString()}</p>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold text-lg text-foreground">${rec.total.toFixed(2)}</p>
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     rec.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   {rec.status}
//                 </span>
//               </div>
//             </Card>
//           ))}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando historial de ventas...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al cargar los registros</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-6">
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h1 className="text-3xl font-bold text-foreground">Módulo de Ventas</h1>
//         <div className="flex gap-2">
//           <Button variant={showInvoices ? "primary" : "outline"} onClick={() => setShowInvoices(true)}>
//             Facturas
//           </Button>
//           <Button variant={!showInvoices ? "primary" : "outline"} onClick={() => setShowInvoices(false)}>
//             Pedidos
//           </Button>
//         </div>
//       </div>

//       {/* Buscador */}
//       <div className="relative max-w-sm mb-4">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//         <input
//           type="text"
//           placeholder="Buscar por cliente o número..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//         />
//       </div>

//       {renderRecords(filteredRecords)}
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useSession } from "next-auth/react";
// import { Loader2, AlertTriangle, Search } from "lucide-react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";

// // 🔹 Tipos
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

// interface Order {
//   id: string;
//   number: string;
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }

// interface Invoice {
//   id: string;
//   number: string;
//   issuedAt: string;
//   customer?: { name: string };
//   total?: number;
//   status: string;
// }

// interface Payment {
//   id: string;
//   createdAt: string;
//   customerName?: string;
//   amount?: number;
//   status: string;
// }

// interface RecordUI {
//   id: string;
//   number: string;
//   fecha: Date;
//   customerName: string;
//   total: number;
//   status: string;
// }

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<RecordUI[]>([]);
//   const [orders, setOrders] = useState<RecordUI[]>([]);
//   const [payments, setPayments] = useState<RecordUI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [showInvoices, setShowInvoices] = useState(true);
//   const [showPayments, setShowPayments] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔹 Fetch productos (para calcular totales de pedidos)
//   const fetchProducts = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return [];
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       if (!res.ok) throw new Error("Error al cargar productos del inventario");
//       return await res.json();
//     } catch (err) {
//       console.error(err);
//       return [];
//     }
//   }, [session]);

//   // 🔹 Fetch Facturas, Pedidos y Pagos
//   const fetchRecords = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setError("No hay sesión activa o falta companyId");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       // 🔹 Fetch paralelo
//       const [invoicesRes, ordersRes, paymentsRes, products] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${session.user.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetchProducts(),
//       ]);

//       if (!invoicesRes.ok) throw new Error("Error al cargar facturas");
//       if (!ordersRes.ok) throw new Error("Error al cargar pedidos");
//       if (!paymentsRes.ok) throw new Error("Error al cargar pagos");

//       const invoicesData: Invoice[] = await invoicesRes.json();
//       const ordersData: Order[] = await ordersRes.json();
//       const paymentsData: Payment[] = await paymentsRes.json();

//       // 🔹 Mapear facturas
//       setInvoices(
//         invoicesData.map((f) => ({
//           id: f.id,
//           number: f.number,
//           fecha: new Date(f.issuedAt),
//           customerName: f.customer?.name || "Cliente Desconocido",
//           total: typeof f.total === "number" ? f.total : 0,
//           status: f.status,
//         }))
//       );

//       // 🔹 Mapear pedidos
//       setOrders(
//         ordersData.map((o) => {
//           const total = o.items.reduce((sum, i) => {
//             const product = products.find((p: Product) => p.id === i.productId);
//             return sum + (product?.price ?? 0) * i.quantity;
//           }, 0);

//           return {
//             id: o.id,
//             number: o.number,
//             fecha: new Date(o.createdAt),
//             customerName: o.supplier?.name || "Cliente Desconocido",
//             total,
//             status: o.status,
//           };
//         })
//       );

//       // 🔹 Mapear pagos
//       setPayments(
//         paymentsData.map((p) => ({
//           id: p.id,
//           number: p.id, // o algún identificador
//           fecha: new Date(p.createdAt),
//           customerName: p.customerName || "Cliente Desconocido",
//           total: typeof p.amount === "number" ? p.amount : 0,
//           status: p.status,
//         }))
//       );

//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Ocurrió un error al cargar registros");
//     } finally {
//       setLoading(false);
//     }
//   }, [session, fetchProducts]);

//   useEffect(() => {
//     if (session) fetchRecords();
//   }, [session, fetchRecords]);

//   // 🔹 Filtrado por búsqueda y pestaña
//   const filteredRecords = useMemo(() => {
//     const data = showInvoices ? invoices : showPayments ? payments : orders;
//     return data.filter(
//       (r) =>
//         r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         r.number.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [showInvoices, showPayments, invoices, orders, payments, searchTerm]);

//   // 🔹 Render de registros
//   const renderRecords = (records: RecordUI[]) => {
//     if (records.length === 0)
//       return <p className="text-center py-8 text-foreground/60">No hay registros disponibles.</p>;

//     return (
//       <div className="space-y-3">
//         {records
//           .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
//           .map((rec) => (
//             <Card
//               key={rec.id}
//               className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors flex justify-between items-center"
//             >
//               <div>
//                 <h3 className="font-semibold text-primary">{rec.number}</h3>
//                 <p className="text-sm text-foreground">{rec.customerName}</p>
//                 <p className="text-xs text-foreground/60">{rec.fecha.toLocaleDateString()}</p>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold text-lg text-foreground">${rec.total.toFixed(2)}</p>
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     rec.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   {rec.status}
//                 </span>
//               </div>
//             </Card>
//           ))}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando historial de ventas...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al cargar los registros</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-6">
//       {/* Header */}
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h1 className="text-3xl font-bold text-foreground">Módulo de Ventas</h1>
//         <div className="flex gap-2">
//           <Button variant={showInvoices ? "primary" : "outline"} onClick={() => { setShowInvoices(true); setShowPayments(false); }}>
//             Facturas
//           </Button>
//           <Button variant={!showInvoices && !showPayments ? "primary" : "outline"} onClick={() => { setShowInvoices(false); setShowPayments(false); }}>
//             Pedidos
//           </Button>
//           <Button variant={showPayments ? "primary" : "outline"} onClick={() => { setShowInvoices(false); setShowPayments(true); }}>
//             Pagos
//           </Button>
//         </div>
//       </div>

//       {/* Buscador */}
//       <div className="relative max-w-sm mb-4">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//         <input
//           type="text"
//           placeholder="Buscar por cliente o número..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//         />
//       </div>

//       {renderRecords(filteredRecords)}
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useSession } from "next-auth/react";
// import { Loader2, AlertTriangle, Search } from "lucide-react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";

// // 🔹 Tipos
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

// interface Order {
//   id: string;
//   number: string;
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }

// interface Invoice {
//   id: string;
//   number: string;
//   issuedAt: string;
//   customer?: { name: string };
//   total?: number;
//   status: string;
// }

// interface Payment {
//   id: string;
//   createdAt: string;
//   customerName?: string;
//   amount?: number;
//   status: string;
// }

// interface RecordUI {
//   id: string;
//   number: string;
//   fecha: Date;
//   customerName: string;
//   total: number;
//   status: string;
// }

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<RecordUI[]>([]);
//   const [orders, setOrders] = useState<RecordUI[]>([]);
//   const [payments, setPayments] = useState<RecordUI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [showInvoices, setShowInvoices] = useState(true);
//   const [showPayments, setShowPayments] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔹 Fetch productos (para calcular totales de pedidos)
//   const fetchProducts = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return [];
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       if (!res.ok) throw new Error("Error al cargar productos del inventario");
//       return await res.json();
//     } catch (err) {
//       console.error(err);
//       return [];
//     }
//   }, [session]);

//   // 🔹 Fetch Facturas, Pedidos y Pagos
//   const fetchRecords = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setError("No hay sesión activa o falta companyId");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       // 🔹 Fetch paralelo
//       const [invoicesRes, ordersRes, paymentsRes, products] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${session.user.id}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetchProducts(),
//       ]);

//       if (!invoicesRes.ok) throw new Error("Error al cargar facturas");
//       if (!ordersRes.ok) throw new Error("Error al cargar pedidos");
//       if (!paymentsRes.ok) throw new Error("Error al cargar pagos");

//       const invoicesData: Invoice[] = await invoicesRes.json();
//       const ordersData: Order[] = await ordersRes.json();
//       const paymentsData: Payment[] = await paymentsRes.json();

//       // 🔹 Mapear facturas
//       setInvoices(
//         invoicesData.map((f) => ({
//           id: f.id,
//           number: f.number,
//           fecha: new Date(f.issuedAt),
//           customerName: f.customer?.name || "Cliente Desconocido",
//           total: typeof f.total === "number" ? f.total : 0,
//           status: f.status,
//         }))
//       );

//       // 🔹 Mapear pedidos
//       setOrders(
//         ordersData.map((o) => {
//           const total = o.items.reduce((sum, i) => {
//             const product = products.find((p: Product) => p.id === i.productId);
//             return sum + (product?.price ?? 0) * i.quantity;
//           }, 0);

//           return {
//             id: o.id,
//             number: o.number,
//             fecha: new Date(o.createdAt),
//             customerName: o.supplier?.name || "Cliente Desconocido",
//             total,
//             status: o.status,
//           };
//         })
//       );

//       // 🔹 Mapear pagos
//       setPayments(
//         paymentsData.map((p) => ({
//           id: p.id,
//           number: p.id, // o algún identificador
//           fecha: new Date(p.createdAt),
//           customerName: p.customerName || "Cliente Desconocido",
//           total: typeof p.amount === "number" ? p.amount : 0,
//           status: p.status,
//         }))
//       );

//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Ocurrió un error al cargar registros");
//     } finally {
//       setLoading(false);
//     }
//   }, [session, fetchProducts]);

//   useEffect(() => {
//     if (session) fetchRecords();
//   }, [session, fetchRecords]);

//   // 🔹 Filtrado por búsqueda y pestaña
//   const filteredRecords = useMemo(() => {
//     const data = showInvoices ? invoices : showPayments ? payments : orders;
//     return data.filter(
//       (r) =>
//         r.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
//         r.number.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [showInvoices, showPayments, invoices, orders, payments, searchTerm]);

//   // 🔹 Render de registros
//   const renderRecords = (records: RecordUI[]) => {
//     if (records.length === 0)
//       return <p className="text-center py-8 text-foreground/60">No hay registros disponibles.</p>;

//     return (
//       <div className="space-y-3">
//         {records
//           .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
//           .map((rec) => (
//             <Card
//               key={rec.id}
//               className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors flex justify-between items-center"
//             >
//               <div>
//                 <h3 className="font-semibold text-primary">{rec.number}</h3>
//                 <p className="text-sm text-foreground">{rec.customerName}</p>
//                 <p className="text-xs text-foreground/60">{rec.fecha.toLocaleDateString()}</p>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold text-lg text-foreground">${rec.total.toFixed(2)}</p>
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     rec.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   {rec.status}
//                 </span>
//               </div>
//             </Card>
//           ))}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando historial de ventas...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al cargar los registros</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-6">
//       {/* Header */}
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h1 className="text-3xl font-bold text-foreground">Módulo de Ventas</h1>
//         <div className="flex gap-2">
//           <Button variant={showInvoices ? "primary" : "outline"} onClick={() => { setShowInvoices(true); setShowPayments(false); }}>
//             Facturas
//           </Button>
//           <Button variant={!showInvoices && !showPayments ? "primary" : "outline"} onClick={() => { setShowInvoices(false); setShowPayments(false); }}>
//             Pedidos
//           </Button>
//           <Button variant={showPayments ? "primary" : "outline"} onClick={() => { setShowInvoices(false); setShowPayments(true); }}>
//             Pagos
//           </Button>
//         </div>
//       </div>

//       {/* Buscador */}
//       <div className="relative max-w-sm mb-4">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//         <input
//           type="text"
//           placeholder="Buscar por cliente o número..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//         />
//       </div>

//       {renderRecords(filteredRecords)}
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useCallback, useMemo } from "react";
// import { useSession } from "next-auth/react";
// import { Loader2, AlertTriangle, Search } from "lucide-react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";

// // 🔹 Tipos
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

// interface Order {
//   id: string;
//   number?: string;
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }

// interface Invoice {
//   id: string;
//   number?: string;
//   issuedAt: string;
//   customer?: { name: string };
//   total?: number;
//   status: string;
// }

// interface Payment {
//   id: string;
//   number?: string;
//   amount?: number;
//   date: string;
//   customer?: { name: string };
//   status: string;
// }

// interface RecordUI {
//   id: string;
//   number: string;
//   fecha: Date;
//   customerName: string;
//   total: number;
//   status: string;
// }

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<RecordUI[]>([]);
//   const [orders, setOrders] = useState<RecordUI[]>([]);
//   const [payments, setPayments] = useState<RecordUI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<"invoices" | "orders" | "payments">("invoices");
//   const [searchTerm, setSearchTerm] = useState("");

//   // 🔹 Fetch productos (para calcular totales de pedidos)
//   const fetchProducts = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return [];
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       if (!res.ok) throw new Error("Error al cargar productos del inventario");
//       return await res.json();
//     } catch (err) {
//       console.error(err);
//       return [];
//     }
//   }, [session]);

//   // 🔹 Fetch registros
//   const fetchRecords = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setError("No hay sesión activa o falta companyId");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       const [invoicesRes, ordersRes, paymentsRes, products] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${companyId}`, {
//           headers: { Authorization: `Bearer ${token}` },
//         }),
//         fetchProducts(),
//       ]);

//       if (!invoicesRes.ok) throw new Error("Error al cargar facturas");
//       if (!ordersRes.ok) throw new Error("Error al cargar pedidos");
//       if (!paymentsRes.ok) throw new Error("Error al cargar pagos");

//       const invoicesData: Invoice[] = await invoicesRes.json();
//       const ordersData: Order[] = await ordersRes.json();
//       const paymentsData: Payment[] = await paymentsRes.json();

//       // 🔹 Mapear facturas
//       setInvoices(
//         invoicesData.map((f) => ({
//           id: f.id,
//           number: f.number ?? "N/A",
//           fecha: new Date(f.issuedAt),
//           customerName: f.customer?.name ?? "Cliente Desconocido",
//           total: f.total ?? 0,
//           status: f.status,
//         }))
//       );

//       // 🔹 Mapear pedidos
//       setOrders(
//         ordersData.map((o) => {
//           const total = o.items.reduce((sum, i) => {
//             const product = products.find((p: Product) => p.id === i.productId);
//             return sum + (product?.price ?? 0) * i.quantity;
//           }, 0);

//           return {
//             id: o.id,
//             number: o.number ?? "N/A",
//             fecha: new Date(o.createdAt),
//             customerName: o.supplier?.name ?? "Proveedor Desconocido",
//             total,
//             status: o.status,
//           };
//         })
//       );

//       // 🔹 Mapear pagos
//       setPayments(
//         paymentsData.map((p) => ({
//           id: p.id,
//           number: p.number ?? "N/A",
//           fecha: new Date(p.date),
//           customerName: p.customer?.name ?? "Cliente Desconocido",
//           total: p.amount ?? 0,
//           status: p.status,
//         }))
//       );
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Ocurrió un error al cargar registros");
//     } finally {
//       setLoading(false);
//     }
//   }, [session, fetchProducts]);

//   useEffect(() => {
//     if (session) fetchRecords();
//   }, [session, fetchRecords]);

//   const filteredRecords = useMemo(() => {
//     let data: RecordUI[] = [];
//     if (activeTab === "invoices") data = invoices;
//     else if (activeTab === "orders") data = orders;
//     else if (activeTab === "payments") data = payments;

//     return data.filter(
//       (r) =>
//         (r.customerName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [activeTab, invoices, orders, payments, searchTerm]);

//   const renderRecords = (records: RecordUI[]) => {
//     if (records.length === 0)
//       return <p className="text-center py-8 text-foreground/60">No hay registros disponibles.</p>;

//     return (
//       <div className="space-y-3">
//         {records
//           .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
//           .map((rec) => (
//             <Card
//               key={rec.id}
//               className="border border-border rounded-lg p-4 bg-background/50 hover:bg-background/80 transition-colors flex justify-between items-center"
//             >
//               <div>
//                 <h3 className="font-semibold text-primary">{rec.number}</h3>
//                 <p className="text-sm text-foreground">{rec.customerName}</p>
//                 <p className="text-xs text-foreground/60">{rec.fecha.toLocaleDateString()}</p>
//               </div>
//               <div className="text-right">
//                 <p className="font-bold text-lg text-foreground">${rec.total.toFixed(2)}</p>
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     rec.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   {rec.status}
//                 </span>
//               </div>
//             </Card>
//           ))}
//       </div>
//     );
//   };

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando historial de ventas...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al cargar los registros</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-6">
//       {/* Header y pestañas */}
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h1 className="text-3xl font-bold text-foreground">Módulo de Ventas</h1>
//         <div className="flex gap-2">
//           <Button
//             variant={activeTab === "invoices" ? "primary" : "outline"}
//             onClick={() => setActiveTab("invoices")}
//           >
//             Facturas
//           </Button>
//           <Button
//             variant={activeTab === "orders" ? "primary" : "outline"}
//             onClick={() => setActiveTab("orders")}
//           >
//             Pedidos
//           </Button>
//           <Button
//             variant={activeTab === "payments" ? "primary" : "outline"}
//             onClick={() => setActiveTab("payments")}
//           >
//             Pagos
//           </Button>
//         </div>
//       </div>

//       {/* Buscador */}
//       <div className="relative max-w-sm mb-4">
//         <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//         <input
//           type="text"
//           placeholder="Buscar por cliente o número..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//         />
//       </div>

//       {/* Renderizado */}
//       {renderRecords(filteredRecords)}
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { Loader2, AlertTriangle, Search, LayoutGrid, List } from "lucide-react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";

// // 🔹 Tipos
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

// interface Order {
//   id: string;
//   number?: string;
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }

// interface Invoice {
//   id: string;
//   number?: string;
//   issuedAt: string;
//   customer?: { name: string };
//   total?: number;
//   status: string;
// }

// interface Payment {
//   id: string;
//   number?: string;
//   amount?: number;
//   date: string;
//   customer?: { name: string };
//   status: string;
// }

// interface RecordUI {
//   id: string;
//   number: string;
//   fecha: Date;
//   customerName: string;
//   total: number;
//   status: string;
// }

// type ViewMode = "cards" | "list";

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<RecordUI[]>([]);
//   const [orders, setOrders] = useState<RecordUI[]>([]);
//   const [payments, setPayments] = useState<RecordUI[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [activeTab, setActiveTab] = useState<"invoices" | "orders" | "payments">("invoices");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [viewMode, setViewMode] = useState<ViewMode>("cards");

//   const fetchProducts = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) return [];
//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       if (!res.ok) throw new Error("Error al cargar productos del inventario");
//       return await res.json();
//     } catch (err) {
//       console.error(err);
//       return [];
//     }
//   }, [session]);

//   const fetchRecords = useCallback(async () => {
//     if (!session?.user?.companyId || !session.accessToken) {
//       setError("No hay sesión activa o falta companyId");
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);
//       const companyId = session.user.companyId;
//       const token = session.accessToken;

//       const [invoicesRes, ordersRes, paymentsRes, products] = await Promise.all([
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetchProducts(),
//       ]);

//       if (!invoicesRes.ok) throw new Error("Error al cargar facturas");
//       if (!ordersRes.ok) throw new Error("Error al cargar pedidos");
//       if (!paymentsRes.ok) throw new Error("Error al cargar pagos");

//       const invoicesData: Invoice[] = await invoicesRes.json();
//       const ordersData: Order[] = await ordersRes.json();
//       const paymentsData: Payment[] = await paymentsRes.json();

//       setInvoices(
//         invoicesData.map(f => ({
//           id: f.id,
//           number: f.number ?? "N/A",
//           fecha: new Date(f.issuedAt),
//           customerName: f.customer?.name ?? "Cliente Desconocido",
//           total: f.total ?? 0,
//           status: f.status,
//         }))
//       );

//       setOrders(
//         ordersData.map(o => {
//           const total = o.items.reduce((sum, i) => {
//             const product = products.find((p: Product) => p.id === i.productId);
//             return sum + (product?.price ?? 0) * i.quantity;
//           }, 0);

//           return {
//             id: o.id,
//             number: o.number ?? "N/A",
//             fecha: new Date(o.createdAt),
//             customerName: o.supplier?.name ?? "Proveedor Desconocido",
//             total,
//             status: o.status,
//           };
//         })
//       );

//       setPayments(
//         paymentsData.map(p => ({
//           id: p.id,
//           number: p.number ?? "N/A",
//           fecha: new Date(p.date),
//           customerName: p.customer?.name ?? "Cliente Desconocido",
//           total: p.amount ?? 0,
//           status: p.status,
//         }))
//       );
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Ocurrió un error al cargar registros");
//     } finally {
//       setLoading(false);
//     }
//   }, [session, fetchProducts]);

//   useEffect(() => {
//     if (session) fetchRecords();
//   }, [session, fetchRecords]);

//   const filteredRecords = useMemo(() => {
//     let data: RecordUI[] = [];
//     if (activeTab === "invoices") data = invoices;
//     if (activeTab === "orders") data = orders;
//     if (activeTab === "payments") data = payments;

//     return data
//       .filter(r =>
//         (r.customerName ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
//         (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase())
//       )
//       .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());
//   }, [activeTab, invoices, orders, payments, searchTerm]);

//   const renderRecords = (records: RecordUI[]) => {
//     if (records.length === 0) return <p className="text-center py-8 text-foreground/60">No hay registros disponibles.</p>;

//     if (viewMode === "cards") {
//       return (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//           {records.map(rec => (
//             <Card key={rec.id} className="flex flex-col">
//               <div className="flex justify-between items-start mb-4">
//                 <div>
//                   <h2 className="font-bold text-lg text-foreground">{rec.number}</h2>
//                   <p className="text-sm text-foreground/70">{rec.customerName}</p>
//                   <p className="text-xs text-foreground/60">{rec.fecha.toLocaleDateString()}</p>
//                 </div>
//               </div>
//               <div className="text-right mt-auto">
//                 <p className="font-bold text-lg text-foreground">${rec.total.toFixed(2)}</p>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${rec.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
//                   {rec.status}
//                 </span>
//               </div>
//             </Card>
//           ))}
//         </div>
//       );
//     } else {
//       return (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Número</th>
//                 <th className="p-4 font-semibold">Cliente / Proveedor</th>
//                 <th className="p-4 font-semibold">Fecha</th>
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 <th className="p-4 font-semibold text-center">Estado</th>
//               </tr>
//             </thead>
//             <tbody>
//               {records.map(rec => (
//                 <tr key={rec.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                   <td className="p-4 font-medium">{rec.number}</td>
//                   <td className="p-4">{rec.customerName}</td>
//                   <td className="p-4">{rec.fecha.toLocaleDateString()}</td>
//                   <td className="p-4 text-right">${rec.total.toFixed(2)}</td>
//                   <td className="p-4 text-center">{rec.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       );
//     }
//   };

//   if (loading) return <div className="p-8 h-full flex justify-center items-center"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>;
//   if (error) return <div className="p-8 h-full flex flex-col justify-center items-center text-center"><AlertTriangle className="w-12 h-12 mb-4 text-red-500"/><p>{error}</p></div>;

//   return (
//     <div className="container mx-auto p-4 md:p-8 space-y-6">
//       <div className="flex flex-wrap justify-between items-center gap-4">
//         <h1 className="text-3xl font-bold text-foreground">Módulo de Ventas</h1>
//         <div className="flex gap-2">
//           <Button variant={activeTab === "invoices" ? "primary" : "outline"} onClick={() => setActiveTab("invoices")}>Facturas</Button>
//           <Button variant={activeTab === "orders" ? "primary" : "outline"} onClick={() => setActiveTab("orders")}>Pedidos</Button>
//           <Button variant={activeTab === "payments" ? "primary" : "outline"} onClick={() => setActiveTab("payments")}>Pagos</Button>
//         </div>
//       </div>

//       <Card isClickable={false} className="mb-4">
//         <div className="relative flex-grow max-w-sm">
//           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//           <input
//             type="text"
//             placeholder="Buscar por cliente o número..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-foreground/50"
//           />
//         </div>
//         <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border ml-auto">
//           <button onClick={() => setViewMode("cards")} className={`p-2 rounded ${viewMode === "cards" ? "bg-primary text-button-text" : ""}`}><LayoutGrid className="h-5 w-5"/></button>
//           <button onClick={() => setViewMode("list")} className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-button-text" : ""}`}><List className="h-5 w-5"/></button>
//         </div>
//       </Card>

//       {renderRecords(filteredRecords)}
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { toast } from "react-hot-toast";
// import { Loader2, AlertTriangle, LayoutGrid, List, Search, DollarSign, Package } from "lucide-react";
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
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }
// interface Payment {
//   id: string;
//   number?: string;
//   date: string;
//   customer?: { name: string };
//   amount?: number;
//   status: string;
// }

// type ViewMode = "cards" | "list";
// type Tab = "invoices" | "orders" | "payments";

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [payments, setPayments] = useState<Payment[]>([]);
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
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`, {
//         headers: { Authorization: `Bearer ${session.accessToken}` },
//       });
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

//       const [inventoryProducts, invoicesRes, ordersRes, paymentsRes] = await Promise.all([
//         fetchProducts(),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//       ]);

//       setProducts(inventoryProducts);

//       const invoicesData: Invoice[] = invoicesRes.ok ? await invoicesRes.json() : [];
//       const ordersData: Order[] = ordersRes.ok ? await ordersRes.json() : [];
//       const paymentsData: Payment[] = paymentsRes.ok ? await paymentsRes.json() : [];

//       setInvoices(invoicesData);
//       setOrders(
//         ordersData.map(order => ({
//           ...order,
//           items: order.items.map(item => ({
//             ...item,
//             product: inventoryProducts.find(p => p.id === item.productId),
//           })),
//         }))
//       );
//       setPayments(paymentsData);
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
//   const calculateTotal = (items: Item[]) => items.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0);
//   const getItemList = (items: Item[]) => items.map(i => `${i.product?.name || "Producto"} (${i.quantity})`).join(", ");

//   const filteredRecords = useMemo(() => {
//     let data: any[] = [];
//     if (activeTab === "invoices") data = invoices;
//     if (activeTab === "orders") data = orders;
//     if (activeTab === "payments") data = payments;

//     return data.filter(r =>
//       ((r.customer?.name ?? r.supplier?.name ?? "") as string)
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [activeTab, invoices, orders, payments, searchTerm]);

//   const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
//   const visibleRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   if (isLoading) return <div className="p-8 h-full flex justify-center items-center"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>;
//   if (error) return <div className="p-8 h-full flex flex-col justify-center items-center"><AlertTriangle className="w-12 h-12 mb-4 text-red-500"/><p>{error}</p></div>;

//   return (
//     <div className="p-4 md:p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-4">
//         <Button variant={activeTab === "invoices" ? "primary" : "outline"} onClick={() => setActiveTab("invoices")}>Facturas</Button>
//         <Button variant={activeTab === "orders" ? "primary" : "outline"} onClick={() => setActiveTab("orders")}>Pedidos</Button>
//         <Button variant={activeTab === "payments" ? "primary" : "outline"} onClick={() => setActiveTab("payments")}>Pagos</Button>
//       </div>

//       {/* Buscador + view mode */}
//       <Card isClickable={false} className="mb-8 flex flex-wrap justify-between items-center gap-4">
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
//           <button onClick={() => setViewMode("cards")} className={`p-2 rounded ${viewMode === "cards" ? "bg-primary text-button-text" : ""}`}><LayoutGrid className="h-5 w-5" /></button>
//           <button onClick={() => setViewMode("list")} className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-button-text" : ""}`}><List className="h-5 w-5" /></button>
//         </div>
//       </Card>

//       {/* Records */}
//       {visibleRecords.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <Package className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No hay registros</h3>
//             <p className="mt-1 text-sm text-foreground/60">Añade registros para gestionar tus ventas.</p>
//           </div>
//         </Card>
//       ) : viewMode === "cards" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {visibleRecords.map((r: any) => (
//             <Card key={r.id} className="flex flex-col">
//               <div className="p-4 flex-grow">
//                 <h2 className="font-bold text-lg text-foreground truncate">{r.number ?? "N/A"}</h2>
//                 <p className="text-sm text-foreground/70">{r.customer?.name ?? r.supplier?.name ?? "Desconocido"}</p>
//                 <p className="text-xs text-foreground/60">{new Date(r.issuedAt ?? r.createdAt ?? r.date).toLocaleDateString()}</p>
//                 {activeTab === "orders" && <p className="mt-2 text-sm flex items-center gap-1"><Package className="h-4 w-4 mt-1" />{getItemList(r.items)}</p>}
//                 <p className="mt-1 flex items-center gap-1 font-semibold"><DollarSign className="h-4 w-4" />${(r.total ?? r.amount ?? 0).toFixed(2)}</p>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{r.status}</span>
//               </div>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Número</th>
//                 <th className="p-4 font-semibold">Cliente / Proveedor</th>
//                 <th className="p-4 font-semibold">Fecha</th>
//                 {activeTab === "orders" && <th className="p-4 font-semibold">Productos</th>}
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 <th className="p-4 font-semibold text-center">Estado</th>
//               </tr>
//             </thead>
//             <tbody>
//               {visibleRecords.map((r: any) => (
//                 <tr key={r.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                   <td className="p-4">{r.number ?? "N/A"}</td>
//                   <td className="p-4">{r.customer?.name ?? r.supplier?.name ?? "Desconocido"}</td>
//                   <td className="p-4">{new Date(r.issuedAt ?? r.createdAt ?? r.date).toLocaleDateString()}</td>
//                   {activeTab === "orders" && <td className="p-4">{getItemList(r.items)}</td>}
//                   <td className="p-4 text-right">${(r.total ?? r.amount ?? 0).toFixed(2)}</td>
//                   <td className="p-4 text-center">{r.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Paginación */}
//       <div className="flex justify-center items-center gap-4 mt-8">
//         <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Anterior</Button>
//         <span>Página {currentPage} de {totalPages}</span>
//         <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Siguiente</Button>
//       </div>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { toast } from "react-hot-toast";
// import { Loader2, AlertTriangle, LayoutGrid, List, Search, DollarSign, Package } from "lucide-react";
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
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }
// interface Payment {
//   id: string;
//   number?: string;
//   date: string;
//   customer?: { name: string };
//   amount?: number;
//   status: string;
// }

// type ViewMode = "cards" | "list";
// type Tab = "invoices" | "orders" | "payments";

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [payments, setPayments] = useState<Payment[]>([]);
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
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`, {
//         headers: { Authorization: `Bearer ${session.accessToken}` },
//       });
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

//       const [inventoryProducts, invoicesRes, ordersRes, paymentsRes] = await Promise.all([
//         fetchProducts(),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//       ]);

//       setProducts(inventoryProducts);

//       const invoicesData: Invoice[] = invoicesRes.ok ? await invoicesRes.json() : [];
//       const ordersData: Order[] = ordersRes.ok ? await ordersRes.json() : [];
//       const paymentsData: Payment[] = paymentsRes.ok ? await paymentsRes.json() : [];

//       // Enriquecer pedidos con productos y calcular total
//       const enrichedOrders = ordersData.map(order => {
//         const itemsWithProduct = order.items.map(item => ({
//           ...item,
//           product: inventoryProducts.find(p => p.id === item.productId),
//         }));
//         const total = itemsWithProduct.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0);
//         return { ...order, items: itemsWithProduct, total };
//       });

//       setInvoices(invoicesData);
//       setOrders(enrichedOrders);
//       setPayments(paymentsData);
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
//   const getItemList = (items: Item[]) => items.map(i => `${i.product?.name || "Producto"} (${i.quantity})`).join(", ");

//   const filteredRecords = useMemo(() => {
//     let data: any[] = [];
//     if (activeTab === "invoices") data = invoices;
//     if (activeTab === "orders") data = orders;
//     if (activeTab === "payments") data = payments;

//     return data.filter(r =>
//       ((r.customer?.name ?? r.supplier?.name ?? "") as string)
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [activeTab, invoices, orders, payments, searchTerm]);

//   const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
//   const visibleRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   if (isLoading) return <div className="p-8 h-full flex justify-center items-center"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>;
//   if (error) return <div className="p-8 h-full flex flex-col justify-center items-center"><AlertTriangle className="w-12 h-12 mb-4 text-red-500"/><p>{error}</p></div>;

//   return (
//     <div className="p-4 md:p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-4">
//         <Button variant={activeTab === "invoices" ? "primary" : "outline"} onClick={() => setActiveTab("invoices")}>Facturas</Button>
//         <Button variant={activeTab === "orders" ? "primary" : "outline"} onClick={() => setActiveTab("orders")}>Pedidos</Button>
//         <Button variant={activeTab === "payments" ? "primary" : "outline"} onClick={() => setActiveTab("payments")}>Pagos</Button>
//       </div>

//       {/* Buscador + view mode */}
//       <Card isClickable={false} className="mb-8 flex flex-wrap justify-between items-center gap-4">
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
//           <button onClick={() => setViewMode("cards")} className={`p-2 rounded ${viewMode === "cards" ? "bg-primary text-button-text" : ""}`}><LayoutGrid className="h-5 w-5" /></button>
//           <button onClick={() => setViewMode("list")} className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-button-text" : ""}`}><List className="h-5 w-5" /></button>
//         </div>
//       </Card>

//       {/* Records */}
//       {visibleRecords.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <Package className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No hay registros</h3>
//             <p className="mt-1 text-sm text-foreground/60">Añade registros para gestionar tus ventas.</p>
//           </div>
//         </Card>
//       ) : viewMode === "cards" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {visibleRecords.map((r: any) => (
//             <Card key={r.id} className="flex flex-col">
//               <div className="p-4 flex-grow">
//                 <h2 className="font-bold text-lg text-foreground truncate">{r.number ?? "N/A"}</h2>
//                 <p className="text-sm text-foreground/70">{r.customer?.name ?? r.supplier?.name ?? "Desconocido"}</p>
//                 <p className="text-xs text-foreground/60">{new Date(r.issuedAt ?? r.createdAt ?? r.date).toLocaleDateString()}</p>
//                 {activeTab === "orders" && <p className="mt-2 text-sm flex items-center gap-1"><Package className="h-4 w-4 mt-1" />{getItemList(r.items)}</p>}
//                 {activeTab === "orders" && <p className="mt-1 flex items-center gap-1 font-semibold"><DollarSign className="h-4 w-4" />${(r.total ?? 0).toFixed(2)}</p>}
//                 {activeTab !== "orders" && <p className="mt-1 flex items-center gap-1 font-semibold"><DollarSign className="h-4 w-4" />${(r.total ?? r.amount ?? 0).toFixed(2)}</p>}
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{r.status}</span>
//               </div>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Número</th>
//                 <th className="p-4 font-semibold">Cliente / Proveedor</th>
//                 <th className="p-4 font-semibold">Fecha</th>
//                 {activeTab === "orders" && <th className="p-4 font-semibold">Productos</th>}
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 <th className="p-4 font-semibold text-center">Estado</th>
//               </tr>
//             </thead>
//             <tbody>
//               {visibleRecords.map((r: any) => (
//                 <tr key={r.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                   <td className="p-4">{r.number ?? "N/A"}</td>
//                   <td className="p-4">{r.customer?.name ?? r.supplier?.name ?? "Desconocido"}</td>
//                   <td className="p-4">{new Date(r.issuedAt ?? r.createdAt ?? r.date).toLocaleDateString()}</td>
//                   {activeTab === "orders" && <td className="p-4">{getItemList(r.items)}</td>}
//                   <td className="p-4 text-right">${(r.total ?? r.amount ?? 0).toFixed(2)}</td>
//                   <td className="p-4 text-center">{r.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Paginación */}
//       <div className="flex justify-center items-center gap-4 mt-8">
//         <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Anterior</Button>
//         <span>Página {currentPage} de {totalPages}</span>
//         <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Siguiente</Button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { toast } from "react-hot-toast";
// import { Loader2, AlertTriangle, LayoutGrid, List, Search, DollarSign, Package } from "lucide-react";
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
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }
// interface Payment {
//   id: string;
//   number?: string;
//   date: string;
//   customer?: { name: string };
//   amount?: number;
//   status: string;
// }

// type ViewMode = "cards" | "list";
// type Tab = "invoices" | "orders" | "payments";

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [payments, setPayments] = useState<Payment[]>([]);
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
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`, {
//         headers: { Authorization: `Bearer ${session.accessToken}` },
//       });
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

//       const [inventoryProducts, invoicesRes, ordersRes, paymentsRes] = await Promise.all([
//         fetchProducts(),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//       ]);

//       setProducts(inventoryProducts);

//       const invoicesData: Invoice[] = invoicesRes.ok ? await invoicesRes.json() : [];
//       const ordersData: Order[] = ordersRes.ok ? await ordersRes.json() : [];
//       const paymentsData: Payment[] = paymentsRes.ok ? await paymentsRes.json() : [];

//       // Enriquecer pedidos con productos y calcular total
//       const enrichedOrders = ordersData.map(order => {
//         const itemsWithProduct = order.items.map(item => ({
//           ...item,
//           product: inventoryProducts.find(p => p.id === item.productId),
//         }));
//         const total = itemsWithProduct.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0);
//         return { ...order, items: itemsWithProduct, total };
//       });

//       setInvoices(invoicesData);
//       setOrders(enrichedOrders);
//       setPayments(paymentsData);
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
//   const getItemList = (items: Item[]) => items.map(i => `${i.product?.name || "Producto"} (${i.quantity})`).join(", ");

//   const filteredRecords = useMemo(() => {
//     let data: any[] = [];
//     if (activeTab === "invoices") data = invoices;
//     if (activeTab === "orders") data = orders;
//     if (activeTab === "payments") data = payments;

//     return data.filter(r =>
//       ((r.customer?.name ?? r.supplier?.name ?? "") as string)
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [activeTab, invoices, orders, payments, searchTerm]);

//   const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
//   const visibleRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   if (isLoading) return <div className="p-8 h-full flex justify-center items-center"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>;
//   if (error) return <div className="p-8 h-full flex flex-col justify-center items-center"><AlertTriangle className="w-12 h-12 mb-4 text-red-500"/><p>{error}</p></div>;

//   return (
//     <div className="p-4 md:p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-4">
//         <Button variant={activeTab === "invoices" ? "primary" : "outline"} onClick={() => setActiveTab("invoices")}>Facturas</Button>
//         <Button variant={activeTab === "orders" ? "primary" : "outline"} onClick={() => setActiveTab("orders")}>Pedidos</Button>
//         <Button variant={activeTab === "payments" ? "primary" : "outline"} onClick={() => setActiveTab("payments")}>Pagos</Button>
//       </div>

//       {/* Buscador + view mode */}
//       <Card isClickable={false} className="mb-8 flex flex-wrap justify-between items-center gap-4">
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
//           <button onClick={() => setViewMode("cards")} className={`p-2 rounded ${viewMode === "cards" ? "bg-primary text-button-text" : ""}`}><LayoutGrid className="h-5 w-5" /></button>
//           <button onClick={() => setViewMode("list")} className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-button-text" : ""}`}><List className="h-5 w-5" /></button>
//         </div>
//       </Card>

//       {/* Records */}
//       {visibleRecords.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <Package className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No hay registros</h3>
//             <p className="mt-1 text-sm text-foreground/60">Añade registros para gestionar tus ventas.</p>
//           </div>
//         </Card>
//       ) : viewMode === "cards" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {visibleRecords.map((r: any) => (
//             <Card key={r.id} className="flex flex-col">
//               <div className="p-4 flex-grow">
//                 <h2 className="font-bold text-lg text-foreground truncate">{r.number ?? "N/A"}</h2>
//                 <p className="text-sm text-foreground/70">{r.customer?.name ?? r.supplier?.name ?? "Desconocido"}</p>
//                 <p className="text-xs text-foreground/60">{new Date(r.issuedAt ?? r.createdAt ?? r.date).toLocaleDateString()}</p>
//                 {activeTab === "orders" && <p className="mt-2 text-sm flex items-center gap-1"><Package className="h-4 w-4 mt-1" />{getItemList(r.items)}</p>}
//                 {activeTab === "orders" && <p className="mt-1 flex items-center gap-1 font-semibold"><DollarSign className="h-4 w-4" />${(r.total ?? 0).toFixed(2)}</p>}
//                 {activeTab !== "orders" && <p className="mt-1 flex items-center gap-1 font-semibold"><DollarSign className="h-4 w-4" />${(r.total ?? r.amount ?? 0).toFixed(2)}</p>}
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{r.status}</span>
//               </div>
//             </Card>
//           ))}
//         </div>
//       ) : (
//         <div className="bg-card border border-border rounded-lg overflow-hidden">
//           <table className="w-full text-left">
//             <thead className="bg-background border-b border-border">
//               <tr>
//                 <th className="p-4 font-semibold">Número</th>
//                 <th className="p-4 font-semibold">Cliente / Proveedor</th>
//                 <th className="p-4 font-semibold">Fecha</th>
//                 {activeTab === "orders" && <th className="p-4 font-semibold">Productos</th>}
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 <th className="p-4 font-semibold text-center">Estado</th>
//               </tr>
//             </thead>
//             <tbody>
//               {visibleRecords.map((r: any) => (
//                 <tr key={r.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                   <td className="p-4">{r.number ?? "N/A"}</td>
//                   <td className="p-4">{r.customer?.name ?? r.supplier?.name ?? "Desconocido"}</td>
//                   <td className="p-4">{new Date(r.issuedAt ?? r.createdAt ?? r.date).toLocaleDateString()}</td>
//                   {activeTab === "orders" && <td className="p-4">{getItemList(r.items)}</td>}
//                   <td className="p-4 text-right">${(r.total ?? r.amount ?? 0).toFixed(2)}</td>
//                   <td className="p-4 text-center">{r.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Paginación */}
//       <div className="flex justify-center items-center gap-4 mt-8">
//         <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Anterior</Button>
//         <span>Página {currentPage} de {totalPages}</span>
//         <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Siguiente</Button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { toast } from "react-hot-toast";
// import { Loader2, AlertTriangle, LayoutGrid, List, Search, DollarSign, Package } from "lucide-react";
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
//   invoiceNumber?: string; // <-- nuevo campo para la factura
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }
// interface Payment {
//   id: string;
//   number?: string;
//   date: string;
//   customer?: { name: string };
//   amount?: number;
//   status: string;
// }

// type ViewMode = "cards" | "list";
// type Tab = "invoices" | "orders" | "payments";

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [payments, setPayments] = useState<Payment[]>([]);
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
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`, {
//         headers: { Authorization: `Bearer ${session.accessToken}` },
//       });
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

//       const [inventoryProducts, invoicesRes, ordersRes, paymentsRes] = await Promise.all([
//         fetchProducts(),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//         fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${companyId}`, { headers: { Authorization: `Bearer ${token}` } }),
//       ]);

//       setProducts(inventoryProducts);

//       const invoicesData: Invoice[] = invoicesRes.ok ? await invoicesRes.json() : [];
//       const ordersData: Order[] = ordersRes.ok ? await ordersRes.json() : [];
//       const paymentsData: Payment[] = paymentsRes.ok ? await paymentsRes.json() : [];

//       // Enriquecer pedidos con productos y total
//       const enrichedOrders = ordersData.map(order => {
//         const itemsWithProduct = order.items.map(item => ({
//           ...item,
//           product: inventoryProducts.find(p => p.id === item.productId),
//         }));
//         const total = itemsWithProduct.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0);
//         return {
//           ...order,
//           items: itemsWithProduct,
//           total,
//           invoiceNumber: order.invoiceNumber, // <-- agregar número de factura
//         };
//       });

//       setInvoices(invoicesData);
//       setOrders(enrichedOrders);
//       setPayments(paymentsData);
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
//   const calculateTotal = (items: Item[]) => items.reduce((sum, i) => sum + (i.product?.price ?? 0) * i.quantity, 0);
//   const getItemList = (items: Item[]) => items.map(i => `${i.product?.name || "Producto"} (${i.quantity})`).join(", ");

//   const filteredRecords = useMemo(() => {
//     let data: any[] = [];
//     if (activeTab === "invoices") data = invoices;
//     if (activeTab === "orders") data = orders;
//     if (activeTab === "payments") data = payments;

//     return data.filter(r =>
//       ((r.customer?.name ?? r.supplier?.name ?? "") as string)
//         .toLowerCase()
//         .includes(searchTerm.toLowerCase()) ||
//       (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [activeTab, invoices, orders, payments, searchTerm]);

//   const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
//   const visibleRecords = filteredRecords.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

//   if (isLoading) return <div className="p-8 h-full flex justify-center items-center"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>;
//   if (error) return <div className="p-8 h-full flex flex-col justify-center items-center"><AlertTriangle className="w-12 h-12 mb-4 text-red-500"/><p>{error}</p></div>;

//   return (
//     <div className="p-4 md:p-8">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Ventas</h1>
//       </div>

//       {/* Tabs */}
//       <div className="flex gap-2 mb-4">
//         <Button variant={activeTab === "invoices" ? "primary" : "outline"} onClick={() => setActiveTab("invoices")}>Facturas</Button>
//         <Button variant={activeTab === "orders" ? "primary" : "outline"} onClick={() => setActiveTab("orders")}>Pedidos</Button>
//         <Button variant={activeTab === "payments" ? "primary" : "outline"} onClick={() => setActiveTab("payments")}>Pagos</Button>
//       </div>

//       {/* Buscador + view mode */}
//       <Card isClickable={false} className="mb-8 flex flex-wrap justify-between items-center gap-4">
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
//           <button onClick={() => setViewMode("cards")} className={`p-2 rounded ${viewMode === "cards" ? "bg-primary text-button-text" : ""}`}><LayoutGrid className="h-5 w-5" /></button>
//           <button onClick={() => setViewMode("list")} className={`p-2 rounded ${viewMode === "list" ? "bg-primary text-button-text" : ""}`}><List className="h-5 w-5" /></button>
//         </div>
//       </Card>

//       {/* Records */}
//       {visibleRecords.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <Package className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No hay registros</h3>
//             <p className="mt-1 text-sm text-foreground/60">Añade registros para gestionar tus ventas.</p>
//           </div>
//         </Card>
//       ) : viewMode === "cards" ? (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {visibleRecords.map((r: any) => (
//             <Card key={r.id} className="flex flex-col">
//               <div className="p-4 flex-grow">
//                 <h2 className="font-bold text-lg text-foreground truncate">
//                   {r.number ?? "N/A"} 
//                   {r.invoiceNumber ? `- Factura: ${r.invoiceNumber}` : ""}
//                 </h2>
//                 <p className="text-sm text-foreground/70">{r.customer?.name ?? r.supplier?.name ?? "Desconocido"}</p>
//                 <p className="text-xs text-foreground/60">{new Date(r.issuedAt ?? r.createdAt ?? r.date).toLocaleDateString()}</p>
//                 {activeTab === "orders" && <p className="mt-2 text-sm flex items-center gap-1"><Package className="h-4 w-4 mt-1" />{getItemList(r.items)}</p>}
//                 <p className="mt-1 flex items-center gap-1 font-semibold"><DollarSign className="h-4 w-4" />${(r.total ?? r.amount ?? 0).toFixed(2)}</p>
//                 <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.status === "paid" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>{r.status}</span>
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
//                 {activeTab === "orders" && <th className="p-4 font-semibold">Productos</th>}
//                 <th className="p-4 font-semibold text-right">Total</th>
//                 <th className="p-4 font-semibold text-center">Estado</th>
//               </tr>
//             </thead>
//             <tbody>
//               {visibleRecords.map((r: any) => (
//                 <tr key={r.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                   <td className="p-4">{r.number ?? "N/A"} {r.invoiceNumber ? `- ${r.invoiceNumber}` : ""}</td>
//                   <td className="p-4">{r.customer?.name ?? r.supplier?.name ?? "Desconocido"}</td>
//                   <td className="p-4">{new Date(r.issuedAt ?? r.createdAt ?? r.date).toLocaleDateString()}</td>
//                   {activeTab === "orders" && <td className="p-4">{getItemList(r.items)}</td>}
//                   <td className="p-4 text-right">${(r.total ?? r.amount ?? 0).toFixed(2)}</td>
//                   <td className="p-4 text-center">{r.status}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Paginación */}
//       <div className="flex justify-center items-center gap-4 mt-8">
//         <Button onClick={() => setCurrentPage(p => p - 1)} disabled={currentPage === 1}>Anterior</Button>
//         <span>Página {currentPage} de {totalPages}</span>
//         <Button onClick={() => setCurrentPage(p => p + 1)} disabled={currentPage === totalPages}>Siguiente</Button>
//       </div>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { toast } from "react-hot-toast";
// import {
//   Loader2,
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
//   invoiceNumber?: string; // <-- nuevo campo para la factura
//   createdAt: string;
//   supplier?: Supplier;
//   items: Item[];
//   status: string;
// }
// interface Payment {
//   id: string;
//   number?: string;
//   date: string;
//   customer?: { name: string };
//   amount?: number;
//   status: string;
// }

// type ViewMode = "cards" | "list";
// type Tab = "invoices" | "orders" | "payments";

// export default function ModuloVentas() {
//   const { data: session } = useSession();

//   const [invoices, setInvoices] = useState<Invoice[]>([]);
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [payments, setPayments] = useState<Payment[]>([]);
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

//       const [inventoryProducts, invoicesRes, ordersRes, paymentsRes] =
//         await Promise.all([
//           fetchProducts(),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(
//             `${process.env.NEXT_PUBLIC_API_URL}/orders/company/${companyId}`,
//             { headers: { Authorization: `Bearer ${token}` } }
//           ),
//           fetch(`${process.env.NEXT_PUBLIC_API_URL}/payments/${companyId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           }),
//         ]);

//       setProducts(inventoryProducts);

//       const invoicesData: Invoice[] = invoicesRes.ok
//         ? await invoicesRes.json()
//         : [];
//       const ordersData: Order[] = ordersRes.ok ? await ordersRes.json() : [];
//       const paymentsData: Payment[] = paymentsRes.ok
//         ? await paymentsRes.json()
//         : [];

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
//           invoiceNumber: order.invoiceNumber, // <-- agregar número de factura
//         };
//       });

//       setInvoices(invoicesData);
//       setOrders(enrichedOrders);
//       setPayments(paymentsData);
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
//     if (activeTab === "payments") data = payments;

//     return data.filter(
//       (r) =>
//         ((r.customer?.name ?? r.supplier?.name ?? "") as string)
//           .toLowerCase()
//           .includes(searchTerm.toLowerCase()) ||
//         (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [activeTab, invoices, orders, payments, searchTerm]);

//   const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
//   const visibleRecords = filteredRecords.slice(
//     (currentPage - 1) * itemsPerPage,
//     currentPage * itemsPerPage
//   );

//   if (isLoading)
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//       </div>
//     );
//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">
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
//         <Button
//           variant={activeTab === "payments" ? "primary" : "outline"}
//           onClick={() => setActiveTab("payments")}
//         >
//           Pagos
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
//                   {r.number ?? "N/A"}
//                   {r.invoiceNumber ? ` - Factura: ${r.invoiceNumber}` : ""}
//                 </h2>
//                 <p className="text-sm text-foreground/70">
//                   {r.customer?.name ?? r.supplier?.name ?? "Desconocido"}
//                 </p>
//                 <p className="text-xs text-foreground/60">
//                   {new Date(
//                     r.issuedAt ?? r.createdAt ?? r.date
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
//                   {(r.total ?? r.amount ?? 0).toFixed(2)}
//                 </p>
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     r.status === "paid"
//                       ? "bg-green-100 text-green-800"
//                       : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   {r.status}
//                 </span>
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
//                 {/* Ocultar Estado en pedidos */}
//                 {activeTab !== "orders" && (
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
//                     {r.number ?? "N/A"}{" "}
//                     {r.invoiceNumber ? `- ${r.invoiceNumber}` : ""}
//                   </td>
//                   <td className="p-4">
//                     {r.customer?.name ?? r.supplier?.name ?? "Desconocido"}
//                   </td>
//                   <td className="p-4">
//                     {new Date(
//                       r.issuedAt ?? r.createdAt ?? r.date
//                     ).toLocaleDateString()}
//                   </td>
//                   {activeTab === "orders" && (
//                     <td className="p-4">{getItemList(r.items)}</td>
//                   )}
//                   <td className="p-4 text-right">
//                     ${(r.total ?? r.amount ?? 0).toFixed(2)}
//                   </td>
//                   {/* Ocultar Estado en pedidos */}
//                   {activeTab !== "orders" && (
//                     <td className="p-4 text-center">{r.status}</td>
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
//   Loader2,
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
// type Tab = "invoices" | "orders"; // 👈 Eliminado "payments"

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

//   if (isLoading)
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//       </div>
//     );
//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">
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
//                   {r.number ?? "N/A"}
//                   {r.invoiceNumber ? ` - Factura: ${r.invoiceNumber}` : ""}
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
//                 <span
//                   className={`px-2 py-1 rounded-full text-xs font-medium ${
//                     r.status === "paid"
//                       ? "bg-green-100 text-green-800"
//                       : "bg-yellow-100 text-yellow-800"
//                   }`}
//                 >
//                   {r.status}
//                 </span>
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
//                 {activeTab !== "orders" && (
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
//                     {r.number ?? "N/A"}{" "}
//                     {r.invoiceNumber ? `- ${r.invoiceNumber}` : ""}
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
//                   {activeTab !== "orders" && (
//                     <td className="p-4 text-center">{r.status}</td>
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
//   Loader2,
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
// type Tab = "invoices" | "orders"; // 👈 Eliminado "payments"

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

//   if (isLoading)
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//       </div>
//     );
//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">
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
//                   {r.number ?? "N/A"}
//                   {r.invoiceNumber ? ` - Factura: ${r.invoiceNumber}` : ""}
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
//                 {/* 💡 CAMBIO AQUÍ: Ocultamos el badge de estado si estamos en la pestaña de Pedidos */}
//                 {activeTab === "invoices" && (
//                     <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         r.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                     >
//                     {r.status}
//                     </span>
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
//                 {activeTab === "invoices" && ( // 💡 CAMBIO AQUÍ: Solo mostramos la columna de estado para Facturas
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
//                     {r.number ?? "N/A"}{" "}
//                     {r.invoiceNumber ? `- ${r.invoiceNumber}` : ""}
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
//                   {activeTab === "invoices" && ( // 💡 CAMBIO AQUÍ: Solo mostramos el estado si es Factura
//                     <td className="p-4 text-center">
//                         <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 r.status === "paid"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                             }`}
//                             >
//                             {r.status}
//                         </span>
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
//   Loader2,
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
// type Tab = "invoices" | "orders"; // 👈 Eliminado "payments"

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

//   if (isLoading)
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//       </div>
//     );
//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">
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
//                   {/* 🟢 Eliminado "N/A" */}
//                   {r.number}
//                   {r.invoiceNumber ? ` - Factura: ${r.invoiceNumber}` : ""}
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
//                 {/* Ocultamos el badge de estado si estamos en la pestaña de Pedidos */}
//                 {activeTab === "invoices" && (
//                     <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         r.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                     >
//                     {r.status}
//                     </span>
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
//                 {activeTab === "invoices" && ( // Solo mostramos la columna de estado para Facturas
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
//                     {/* 🟢 Eliminado "N/A" */}
//                     {r.number}{" "}
//                     {r.invoiceNumber ? `- ${r.invoiceNumber}` : ""}
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
//                   {activeTab === "invoices" && ( // Solo mostramos el estado si es Factura
//                     <td className="p-4 text-center">
//                         <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 r.status === "paid"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                             }`}
//                             >
//                             {r.status}
//                         </span>
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
//   Loader2,
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
// type Tab = "invoices" | "orders"; // 👈 Eliminado "payments"

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

//   if (isLoading)
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//       </div>
//     );
//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">
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
//                   {/* 🟢 MODIFICADO: Solo añade " - Factura: " si r.number existe Y r.invoiceNumber existe */}
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
//                 {/* Ocultamos el badge de estado si estamos en la pestaña de Pedidos */}
//                 {activeTab === "invoices" && (
//                     <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         r.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                     >
//                     {r.status}
//                     </span>
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
//                 {activeTab === "invoices" && ( // Solo mostramos la columna de estado para Facturas
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
//                     {r.number}{" "}
//                     {/* 🟢 MODIFICADO: Solo añade " - " si r.number existe Y r.invoiceNumber existe */}
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
//                   {activeTab === "invoices" && ( // Solo mostramos el estado si es Factura
//                     <td className="p-4 text-center">
//                         <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 r.status === "paid"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                             }`}
//                             >
//                             {r.status}
//                         </span>
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
//   Loader2, // 🟢 CARGADOR ESTANDARIZADO
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

//   if (isLoading)
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         {/* 🟢 CARGADOR ESTANDARIZADO */}
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos...</p>
//       </div>
//     );
//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">
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
//                   {/* MODIFICADO: Solo añade " - Factura: " si r.number existe Y r.invoiceNumber existe */}
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
//                 {/* Ocultamos el badge de estado si estamos en la pestaña de Pedidos */}
//                 {activeTab === "invoices" && (
//                     <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         r.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                     >
//                     {r.status}
//                     </span>
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
//                 {activeTab === "invoices" && ( // Solo mostramos la columna de estado para Facturas
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
//                     {r.number}{" "}
//                     {/* MODIFICADO: Solo añade " - " si r.number existe Y r.invoiceNumber existe */}
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
//                   {activeTab === "invoices" && ( // Solo mostramos el estado si es Factura
//                     <td className="p-4 text-center">
//                         <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 r.status === "paid"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                             }`}
//                             >
//                             {r.status}
//                         </span>
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
//   ListOrdered, // 🟢 CARGADOR REQUERIDO: Reemplaza a Loader2
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

//   if (isLoading)
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         {/* 🟢 CARGADOR REQUERIDO POR EL USUARIO */}
//         <ListOrdered className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos...</p>
//       </div>
//     );
//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">
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
//                   {/* MODIFICADO: Solo añade " - Factura: " si r.number existe Y r.invoiceNumber existe */}
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
//                 {/* Ocultamos el badge de estado si estamos en la pestaña de Pedidos */}
//                 {activeTab === "invoices" && (
//                     <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         r.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                     >
//                     {r.status}
//                     </span>
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
//                 {activeTab === "invoices" && ( // Solo mostramos la columna de estado para Facturas
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
//                     {r.number}{" "}
//                     {/* MODIFICADO: Solo añade " - " si r.number existe Y r.invoiceNumber existe */}
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
//                   {activeTab === "invoices" && ( // Solo mostramos el estado si es Factura
//                     <td className="p-4 text-center">
//                         <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 r.status === "paid"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                             }`}
//                             >
//                             {r.status}
//                         </span>
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
//   ListOrdered, // Ícono de carga preferido
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

//   if (isLoading)
//     return (
//       <div className="p-8 h-full flex justify-center items-center">
//         {/* Usando el ícono ListOrdered como cargador */}
//         <ListOrdered className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos...</p>
//       </div>
//     );
//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">
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
//                   {/* MODIFICADO: Solo añade " - Factura: " si r.number existe Y r.invoiceNumber existe */}
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
//                 {/* Ocultamos el badge de estado si estamos en la pestaña de Pedidos */}
//                 {activeTab === "invoices" && (
//                     <span
//                     className={`px-2 py-1 rounded-full text-xs font-medium ${
//                         r.status === "paid"
//                         ? "bg-green-100 text-green-800"
//                         : "bg-yellow-100 text-yellow-800"
//                     }`}
//                     >
//                     {r.status}
//                     </span>
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
//                 {activeTab === "invoices" && ( // Solo mostramos la columna de estado para Facturas
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
//                     {r.number}{" "}
//                     {/* MODIFICADO: Solo añade " - " si r.number existe Y r.invoiceNumber existe */}
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
//                   {activeTab === "invoices" && ( // Solo mostramos el estado si es Factura
//                     <td className="p-4 text-center">
//                         <span
//                             className={`px-2 py-1 rounded-full text-xs font-medium ${
//                                 r.status === "paid"
//                                 ? "bg-green-100 text-green-800"
//                                 : "bg-yellow-100 text-yellow-800"
//                             }`}
//                             >
//                             {r.status}
//                         </span>
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
//   ListOrdered, // Loader unificado
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

//   // 🔹 Loader unificado
//   if (isLoading)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <ListOrdered className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando datos...</p>
//       </div>
//     );

//   if (error)
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="w-12 h-12 mb-4 text-red-500" />
//         <p>{error}</p>
//       </div>
//     );

//   return (
//     <div className="p-4 md:p-8">
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
interface Order {
  id: string;
  number?: string;
  invoiceNumber?: string;
  createdAt: string;
  supplier?: Supplier;
  items: Item[];
  status: string;
}

type ViewMode = "cards" | "list";
type Tab = "invoices" | "orders";

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
          total,
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
    let data: any[] = [];
    if (activeTab === "invoices") data = invoices;
    if (activeTab === "orders") data = orders;

    return data.filter(
      (r) =>
        ((r.customer?.name ?? r.supplier?.name ?? "") as string)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        (r.number ?? "").toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [activeTab, invoices, orders, searchTerm]);

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const visibleRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ✅ Nuevo Loader (único)
  // if (isLoading)
  //   return (
  //     <div className="p-8 h-full flex flex-col justify-center items-center">
  //       <ListOrdered className="animate-spin h-12 w-12 text-primary" />
  //       <p className="mt-4 text-foreground/70">Cargando datos...</p>
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
          {visibleRecords.map((r: any) => (
            <Card key={r.id} className="flex flex-col">
              <div className="p-4 flex-grow">
                <h2 className="font-bold text-lg text-foreground truncate">
                  {r.number}
                  {r.number && r.invoiceNumber ? " - " : ""}
                  {r.invoiceNumber ? `Factura: ${r.invoiceNumber}` : ""}
                </h2>
                <p className="text-sm text-foreground/70">
                  {r.customer?.name ?? r.supplier?.name ?? "Desconocido"}
                </p>
                <p className="text-xs text-foreground/60">
                  {new Date(
                    r.issuedAt ?? r.createdAt ?? ""
                  ).toLocaleDateString()}
                </p>
                {activeTab === "orders" && (
                  <p className="mt-2 text-sm flex items-center gap-1">
                    <Package className="h-4 w-4 mt-1" />
                    {getItemList(r.items)}
                  </p>
                )}
                <p className="mt-1 flex items-center gap-1 font-semibold">
                  <DollarSign className="h-4 w-4" />$
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
              {visibleRecords.map((r: any) => (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-b-0 hover:bg-background"
                >
                  <td className="p-4">
                    {r.number}
                    {r.number && r.invoiceNumber ? `- ` : ""}
                    {r.invoiceNumber ? `${r.invoiceNumber}` : ""}
                  </td>
                  <td className="p-4">
                    {r.customer?.name ?? r.supplier?.name ?? "Desconocido"}
                  </td>
                  <td className="p-4">
                    {new Date(
                      r.issuedAt ?? r.createdAt ?? ""
                    ).toLocaleDateString()}
                  </td>
                  {activeTab === "orders" && (
                    <td className="p-4">{getItemList(r.items)}</td>
                  )}
                  <td className="p-4 text-right">
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
