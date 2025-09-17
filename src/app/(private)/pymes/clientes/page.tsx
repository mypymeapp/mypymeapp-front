

// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Cliente } from '@/mocks/clientes'; // Usamos tu tipo de dato Cliente

// type ViewMode = 'cards' | 'list';

// export default function ClientesPage() {
//   const { data: session } = useSession();
//   const [clients, setClients] = useState<Cliente[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>('cards');
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchClients = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) return;
//     try {
//       setLoading(true);
//       setError(null);
//       // Simulación de llamada a la API
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/clients`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });
//       if (!res.ok) throw new Error('Error al cargar los clientes.');
//       const clientsData = await res.json();
//       setClients(clientsData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);
  
//   useEffect(() => {
//     if (session?.user?.companyId) {
//       fetchClients();
//     }
//   }, [session, fetchClients]);

//   const filteredClients = useMemo(() => {
//     return clients.filter(c => 
//       c.nombre.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       c.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       c.telefono.toLowerCase().includes(searchTerm.toLowerCase())
//     );
//   }, [clients, searchTerm]);

//   const handleDelete = async (id: string) => {
//     if (!session?.accessToken) return;
//     try {
//       // Simulación de llamada a la API
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/clients/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });
//       if (!res.ok) throw new Error('No se pudo eliminar el cliente.');
//       setClients(prev => prev.filter(c => c.id !== id));
//       toast.success('¡Cliente eliminado con éxito!');
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Error desconocido.');
//     }
//   };
  
//   const confirmDelete = (id: string) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2">
//         <p>¿Seguro que quieres eliminar este cliente?</p>
//         <div className="flex gap-2">
//           <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
//             toast.dismiss(t.id);
//             handleDelete(id);
//           }}>
//             Sí, eliminar
//           </Button>
//           <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     ));
//   };
  
//   if (loading) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <Loader2 className="animate-spin h-12 w-12 text-primary" />
//             <p className="mt-4 text-foreground/70">Cargando clientes...</p>
//         </div>
//     );
//   }

//   if (error) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <AlertTriangle className="h-12 w-12 text-red-500" />
//             <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//             <p className="text-foreground/70">{error}</p>
//         </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
//         <Link href={PATHROUTES.pymes.clientes_nuevo}><Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button></Link>
//       </div>
      
//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//             <div className="relative flex-grow max-w-xs">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//               <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
//               <button onClick={() => setViewMode('cards')} className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}><LayoutGrid className="h-5 w-5"/></button>
//               <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}><List className="h-5 w-5"/></button>
//             </div>
//         </div>
//       </Card>

//       {clients.length === 0 ? (
//           <Card isClickable={false}>
//               <div className="text-center py-12">
//                   <Users className="mx-auto h-12 w-12 text-foreground/30" />
//                   <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
//                   <p className="mt-1 text-sm text-foreground/60">Empieza a añadir clientes para gestionar su información.</p>
//                   <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
//                       <Button>Añadir tu primer cliente</Button>
//                   </Link>
//               </div>
//           </Card>
//       ) : (
//           <>
//               {viewMode === 'cards' ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {filteredClients.map(client => (
//                     <Card key={client.id} className="flex flex-col">
//                       <div className="flex-grow">
//                         <h2 className="font-bold text-lg text-foreground truncate">{client.nombre}</h2>
//                         <p className="text-sm text-primary font-semibold">{client.email || 'Sin email'}</p>
//                         <div className="my-4 text-center">
//                           <p className="text-lg font-bold text-foreground">{client.telefono || 'N/A'}</p>
//                           <p className="text-xs text-foreground/60">Teléfono</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2 mt-4">
//                         <Link href={PATHROUTES.pymes.clientes_editar(client.id)} className="w-full">
//                           <Button variant="outline" className="w-full"><Edit className="mr-2 h-4 w-4"/> Editar</Button>
//                         </Link>
//                         <Button variant="danger" onClick={() => confirmDelete(client.id)}><Trash2 className="h-4 w-4"/></Button>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="bg-card border border-border rounded-lg overflow-hidden">
//                   <table className="w-full text-left">
//                     <thead className="bg-background border-b border-border">
//                       <tr>
//                         <th className="p-4 font-semibold">Nombre</th>
//                         <th className="p-4 font-semibold hidden md:table-cell">Email</th>
//                         <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
//                         <th className="p-4"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredClients.map(client => (
//                         <tr key={client.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                           <td className="p-4 font-medium text-primary">{client.nombre}</td>
//                           <td className="p-4 hidden md:table-cell">{client.email || 'N/A'}</td>
//                           <td className="p-4 hidden lg:table-cell">{client.telefono || 'N/A'}</td>
//                           <td className="p-4 text-right">
//                             <div className="flex justify-end gap-2">
//                               <Link href={PATHROUTES.pymes.clientes_editar(client.id)}>
//                                 <Button variant="outline" className="p-2 h-auto"><Edit className="h-4 w-4" /></Button>
//                               </Link>
//                               <Button variant="danger" onClick={() => confirmDelete(client.id)} className="p-2 h-auto"><Trash2 className="h-4 w-4" /></Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//           </>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';

// // 🔹 Importamos el nuevo tipo Customer, no el mock
// import { Customer } from '@/types/customer'; // Asegúrate de que la ruta sea correcta

// type ViewMode = 'cards' | 'list';

// export default function ClientesPage() {
//   const { data: session } = useSession();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>('cards');
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchCustomers = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) return;
//     try {
//       setLoading(true);
//       setError(null);
      
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/customers`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

      

//       if (!res.ok) throw new Error('Error al cargar los clientes.');
//       const customersData = await res.json();
//       setCustomers(customersData);
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);
  
//   useEffect(() => {
//     if (session?.user?.companyId) {
//       fetchCustomers();
//     }
//   }, [session, fetchCustomers]);

//   const filteredCustomers = useMemo(() => {
//     return customers.filter(c => 
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [customers, searchTerm]);

//   const handleDelete = async (id: string) => {
//     if (!session?.accessToken) return;
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });
      
//       if (!res.ok) throw new Error('No se pudo eliminar el cliente.');
      
//       setCustomers(prev => prev.filter(c => c.id !== id));
//       toast.success('¡Cliente eliminado con éxito!');
      
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Error desconocido.');
//     }
//   };
  
//   const confirmDelete = (id: string) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2">
//         <p>¿Seguro que quieres eliminar este cliente?</p>
//         <div className="flex gap-2">
//           <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
//             toast.dismiss(t.id);
//             handleDelete(id);
//           }}>
//             Sí, eliminar
//           </Button>
//           <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     ));
//   };
  
//   if (loading) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <Loader2 className="animate-spin h-12 w-12 text-primary" />
//             <p className="mt-4 text-foreground/70">Cargando clientes...</p>
//         </div>
//     );
//   }

//   if (error) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <AlertTriangle className="h-12 w-12 text-red-500" />
//             <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//             <p className="text-foreground/70">{error}</p>
//         </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
//         <Link href={PATHROUTES.pymes.clientes_nuevo}><Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button></Link>
//       </div>
      
//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//             <div className="relative flex-grow max-w-xs">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//               <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
//               <button onClick={() => setViewMode('cards')} className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}><LayoutGrid className="h-5 w-5"/></button>
//               <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}><List className="h-5 w-5"/></button>
//             </div>
//         </div>
//       </Card>

//       {customers.length === 0 ? (
//           <Card isClickable={false}>
//               <div className="text-center py-12">
//                   <Users className="mx-auto h-12 w-12 text-foreground/30" />
//                   <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
//                   <p className="mt-1 text-sm text-foreground/60">Empieza a añadir clientes para gestionar su información.</p>
//                   <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
//                       <Button>Añadir tu primer cliente</Button>
//                   </Link>
//               </div>
//           </Card>
//       ) : (
//           <>
//               {viewMode === 'cards' ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {filteredCustomers.map(customer => (
//                     <Card key={customer.id} className="flex flex-col">
//                       <div className="flex-grow">
//                         <h2 className="font-bold text-lg text-foreground truncate">{customer.name}</h2>
//                         <p className="text-sm text-primary font-semibold">{customer.email || 'Sin email'}</p>
//                         <div className="my-4 text-center">
//                           <p className="text-lg font-bold text-foreground">{customer.phone || 'N/A'}</p>
//                           <p className="text-xs text-foreground/60">Teléfono</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2 mt-4">
//                         <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} className="w-full">
//                           <Button variant="outline" className="w-full"><Edit className="mr-2 h-4 w-4"/> Editar</Button>
//                         </Link>
//                         <Button variant="danger" onClick={() => confirmDelete(customer.id)}><Trash2 className="h-4 w-4"/></Button>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="bg-card border border-border rounded-lg overflow-hidden">
//                   <table className="w-full text-left">
//                     <thead className="bg-background border-b border-border">
//                       <tr>
//                         <th className="p-4 font-semibold">Nombre</th>
//                         <th className="p-4 font-semibold hidden md:table-cell">Email</th>
//                         <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
//                         <th className="p-4"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredCustomers.map(customer => (
//                         <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                           <td className="p-4 font-medium text-primary">{customer.name}</td>
//                           <td className="p-4 hidden md:table-cell">{customer.email || 'N/A'}</td>
//                           <td className="p-4 hidden lg:table-cell">{customer.phone || 'N/A'}</td>
//                           <td className="p-4 text-right">
//                             <div className="flex justify-end gap-2">
//                               <Link href={PATHROUTES.pymes.clientes_editar(customer.id)}>
//                                 <Button variant="outline" className="p-2 h-auto"><Edit className="h-4 w-4" /></Button>
//                               </Link>
//                               <Button variant="danger" onClick={() => confirmDelete(customer.id)} className="p-2 h-auto"><Trash2 className="h-4 w-4" /></Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//           </>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// type ViewMode = 'cards' | 'list';

// export default function ClientesPage() {
//   const { data: session } = useSession();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>('cards');
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchCustomers = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) return;
//     try {
//       setLoading(true);
//       setError(null);
      
//       // 🔹 CAMBIO CLAVE: Se usa la URL que ya funciona para el inventario
//       // Esto asegura que la API reciba el ID de la compañía en la ruta
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) throw new Error('Error al cargar los clientes.');
//       const customersData = await res.json();
//       setCustomers(customersData);
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);
  
//   useEffect(() => {
//     if (session?.user?.companyId) {
//       fetchCustomers();
//     }
//   }, [session, fetchCustomers]);

//   const filteredCustomers = useMemo(() => {
//     return customers.filter(c => 
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [customers, searchTerm]);

//   const handleDelete = async (id: string) => {
//     if (!session?.accessToken) return;
//     try {
//       // 🔹 Se mantiene la URL para eliminar, ya que no requiere el companyId
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });
      
//       if (!res.ok) throw new Error('No se pudo eliminar el cliente.');
      
//       setCustomers(prev => prev.filter(c => c.id !== id));
//       toast.success('¡Cliente eliminado con éxito!');
      
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Error desconocido.');
//     }
//   };
  
//   const confirmDelete = (id: string) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2">
//         <p>¿Seguro que quieres eliminar este cliente?</p>
//         <div className="flex gap-2">
//           <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
//             toast.dismiss(t.id);
//             handleDelete(id);
//           }}>
//             Sí, eliminar
//           </Button>
//           <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     ));
//   };
  
//   if (loading) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <Loader2 className="animate-spin h-12 w-12 text-primary" />
//             <p className="mt-4 text-foreground/70">Cargando clientes...</p>
//         </div>
//     );
//   }

//   if (error) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <AlertTriangle className="h-12 w-12 text-red-500" />
//             <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//             <p className="text-foreground/70">{error}</p>
//         </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
//         <Link href={PATHROUTES.pymes.clientes_nuevo}><Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button></Link>
//       </div>
      
//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//             <div className="relative flex-grow max-w-xs">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//               <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
//               <button onClick={() => setViewMode('cards')} className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}><LayoutGrid className="h-5 w-5"/></button>
//               <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}><List className="h-5 w-5"/></button>
//             </div>
//         </div>
//       </Card>

//       {customers.length === 0 ? (
//           <Card isClickable={false}>
//               <div className="text-center py-12">
//                   <Users className="mx-auto h-12 w-12 text-foreground/30" />
//                   <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
//                   <p className="mt-1 text-sm text-foreground/60">Empieza a añadir clientes para gestionar su información.</p>
//                   <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
//                       <Button>Añadir tu primer cliente</Button>
//                   </Link>
//               </div>
//           </Card>
//       ) : (
//           <>
//               {viewMode === 'cards' ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {filteredCustomers.map(customer => (
//                     <Card key={customer.id} className="flex flex-col">
//                       <div className="flex-grow">
//                         <h2 className="font-bold text-lg text-foreground truncate">{customer.name}</h2>
//                         <p className="text-sm text-primary font-semibold">{customer.email || 'Sin email'}</p>
//                         <div className="my-4 text-center">
//                           <p className="text-lg font-bold text-foreground">{customer.phone || 'N/A'}</p>
//                           <p className="text-xs text-foreground/60">Teléfono</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2 mt-4">
//                         <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} className="w-full">
//                           <Button variant="outline" className="w-full"><Edit className="mr-2 h-4 w-4"/> Editar</Button>
//                         </Link>
//                         <Button variant="danger" onClick={() => confirmDelete(customer.id)}><Trash2 className="h-4 w-4"/></Button>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="bg-card border border-border rounded-lg overflow-hidden">
//                   <table className="w-full text-left">
//                     <thead className="bg-background border-b border-border">
//                       <tr>
//                         <th className="p-4 font-semibold">Nombre</th>
//                         <th className="p-4 font-semibold hidden md:table-cell">Email</th>
//                         <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
//                         <th className="p-4"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredCustomers.map(customer => (
//                         <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                           <td className="p-4 font-medium text-primary">{customer.name}</td>
//                           <td className="p-4 hidden md:table-cell">{customer.email || 'N/A'}</td>
//                           <td className="p-4 hidden lg:table-cell">{customer.phone || 'N/A'}</td>
//                           <td className="p-4 text-right">
//                             <div className="flex justify-end gap-2">
//                               <Link href={PATHROUTES.pymes.clientes_editar(customer.id)}>
//                                 <Button variant="outline" className="p-2 h-auto"><Edit className="h-4 w-4" /></Button>
//                               </Link>
//                               <Button variant="danger" onClick={() => confirmDelete(customer.id)} className="p-2 h-auto"><Trash2 className="h-4 w-4" /></Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//           </>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// type ViewMode = 'cards' | 'list';

// export default function ClientesPage() {
//   const { data: session } = useSession();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>('cards');
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchCustomers = useCallback(async () => {
//     // 🔹 REPLICANDO LA LÓGICA DE INVENTARIO:
//     // Solo se ejecuta si el ID de la compañía y el token están disponibles
//     if (!session?.user?.companyId || !session?.accessToken) {
//         setLoading(false);
//         return;
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       // 🟢 CAMBIO CLAVE: Se usa la misma URL de inventario, pero para clientes
//       // Esto filtra los clientes por el ID de la compañía
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/customers`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         throw new Error('Error al cargar los clientes.');
//       }
      
//       const customersData = await res.json();
//       setCustomers(customersData);
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);
  
//   // 🔹 REPLICANDO LA LÓGICA DE INVENTARIO:
//   // Se llama a la función de fetch cuando la sesión se actualiza
//   useEffect(() => {
//     if (session?.user?.companyId) {
//       fetchCustomers();
//     }
//   }, [session, fetchCustomers]);

//   const filteredCustomers = useMemo(() => {
//     return customers.filter(c => 
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [customers, searchTerm]);

//   const handleDelete = async (id: string) => {
//     if (!session?.accessToken) return;
//     try {
//       // Esta URL para eliminar está correcta, ya que el ID del cliente es suficiente.
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });
      
//       if (!res.ok) {
//         throw new Error('No se pudo eliminar el cliente.');
//       }
      
//       setCustomers(prev => prev.filter(c => c.id !== id));
//       toast.success('¡Cliente eliminado con éxito!');
      
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Error desconocido.');
//     }
//   };
  
//   const confirmDelete = (id: string) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2">
//         <p>¿Seguro que quieres eliminar este cliente?</p>
//         <div className="flex gap-2">
//           <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
//             toast.dismiss(t.id);
//             handleDelete(id);
//           }}>
//             Sí, eliminar
//           </Button>
//           <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     ));
//   };
  
//   if (loading) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <Loader2 className="animate-spin h-12 w-12 text-primary" />
//             <p className="mt-4 text-foreground/70">Cargando clientes...</p>
//         </div>
//     );
//   }

//   if (error) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <AlertTriangle className="h-12 w-12 text-red-500" />
//             <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//             <p className="text-foreground/70">{error}</p>
//         </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
//         <Link href={PATHROUTES.pymes.clientes_nuevo}><Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button></Link>
//       </div>
      
//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//             <div className="relative flex-grow max-w-xs">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//               <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
//               <button onClick={() => setViewMode('cards')} className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}><LayoutGrid className="h-5 w-5"/></button>
//               <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}><List className="h-5 w-5"/></button>
//             </div>
//         </div>
//       </Card>

//       {customers.length === 0 ? (
//           <Card isClickable={false}>
//               <div className="text-center py-12">
//                   <Users className="mx-auto h-12 w-12 text-foreground/30" />
//                   <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
//                   <p className="mt-1 text-sm text-foreground/60">Empieza a añadir clientes para gestionar su información.</p>
//                   <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
//                       <Button>Añadir tu primer cliente</Button>
//                   </Link>
//               </div>
//           </Card>
//       ) : (
//           <>
//               {viewMode === 'cards' ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {filteredCustomers.map(customer => (
//                     <Card key={customer.id} className="flex flex-col">
//                       <div className="flex-grow">
//                         <h2 className="font-bold text-lg text-foreground truncate">{customer.name}</h2>
//                         <p className="text-sm text-primary font-semibold">{customer.email || 'Sin email'}</p>
//                         <div className="my-4 text-center">
//                           <p className="text-lg font-bold text-foreground">{customer.phone || 'N/A'}</p>
//                           <p className="text-xs text-foreground/60">Teléfono</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2 mt-4">
//                         <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} className="w-full">
//                           <Button variant="outline" className="w-full"><Edit className="mr-2 h-4 w-4"/> Editar</Button>
//                         </Link>
//                         <Button variant="danger" onClick={() => confirmDelete(customer.id)}><Trash2 className="h-4 w-4"/></Button>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="bg-card border border-border rounded-lg overflow-hidden">
//                   <table className="w-full text-left">
//                     <thead className="bg-background border-b border-border">
//                       <tr>
//                         <th className="p-4 font-semibold">Nombre</th>
//                         <th className="p-4 font-semibold hidden md:table-cell">Email</th>
//                         <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
//                         <th className="p-4"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredCustomers.map(customer => (
//                         <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                           <td className="p-4 font-medium text-primary">{customer.name}</td>
//                           <td className="p-4 hidden md:table-cell">{customer.email || 'N/A'}</td>
//                           <td className="p-4 hidden lg:table-cell">{customer.phone || 'N/A'}</td>
//                           <td className="p-4 text-right">
//                             <div className="flex justify-end gap-2">
//                               <Link href={PATHROUTES.pymes.clientes_editar(customer.id)}>
//                                 <Button variant="outline" className="p-2 h-auto"><Edit className="h-4 w-4" /></Button>
//                               </Link>
//                               <Button variant="danger" onClick={() => confirmDelete(customer.id)} className="p-2 h-auto"><Trash2 className="h-4 w-4" /></Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//           </>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// type ViewMode = 'cards' | 'list';

// export default function ClientesPage() {
//   const { data: session } = useSession();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>('cards');
//   const [searchTerm, setSearchTerm] = useState('');

//   // 🟢 FUNCIÓN MEJORADA: Ahora maneja errores de forma más detallada
//   const fetchCustomers = useCallback(async () => {
//     // Si la sesión no tiene un ID de compañía o un token, detenemos la carga.
//     if (!session?.user?.companyId || !session?.accessToken) {
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       // La URL de la API se construye con el ID de la compañía para filtrar los clientes.
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/customers`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       // Si la respuesta no es exitosa, intentamos leer el mensaje de error de la API.
//       if (!res.ok) {
//         let errorMessage = 'Error al cargar los clientes.';
//         try {
//           const errorData = await res.json();
//           if (errorData.message) {
//             errorMessage = errorData.message;
//           } else {
//             errorMessage += ` Código: ${res.status}`;
//           }
//         } catch (e) {
//           errorMessage += ` Código: ${res.status} ${res.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }
      
//       const customersData = await res.json();
//       setCustomers(customersData);
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);
  
//   useEffect(() => {
//     // Llamamos a la función de fetch solo si la sesión está disponible.
//     if (session?.user?.companyId) {
//       fetchCustomers();
//     }
//   }, [session, fetchCustomers]);

//   const filteredCustomers = useMemo(() => {
//     return customers.filter(c => 
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [customers, searchTerm]);

//   const handleDelete = async (id: string) => {
//     if (!session?.accessToken) return;
//     try {
//       // La URL para eliminar un cliente por su ID es correcta.
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });
      
//       if (!res.ok) {
//         throw new Error('No se pudo eliminar el cliente.');
//       }
      
//       setCustomers(prev => prev.filter(c => c.id !== id));
//       toast.success('¡Cliente eliminado con éxito!');
      
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Error desconocido.');
//     }
//   };
  
//   const confirmDelete = (id: string) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2">
//         <p>¿Seguro que quieres eliminar este cliente?</p>
//         <div className="flex gap-2">
//           <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
//             toast.dismiss(t.id);
//             handleDelete(id);
//           }}>
//             Sí, eliminar
//           </Button>
//           <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     ));
//   };
  
//   if (loading) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <Loader2 className="animate-spin h-12 w-12 text-primary" />
//             <p className="mt-4 text-foreground/70">Cargando clientes...</p>
//         </div>
//     );
//   }

//   if (error) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <AlertTriangle className="h-12 w-12 text-red-500" />
//             <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//             <p className="text-foreground/70">{error}</p>
//         </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
//         <Link href={PATHROUTES.pymes.clientes_nuevo}><Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button></Link>
//       </div>
      
//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//             <div className="relative flex-grow max-w-xs">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//               <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
//               <button onClick={() => setViewMode('cards')} className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}><LayoutGrid className="h-5 w-5"/></button>
//               <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}><List className="h-5 w-5"/></button>
//             </div>
//         </div>
//       </Card>

//       {customers.length === 0 ? (
//           <Card isClickable={false}>
//               <div className="text-center py-12">
//                   <Users className="mx-auto h-12 w-12 text-foreground/30" />
//                   <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
//                   <p className="mt-1 text-sm text-foreground/60">Empieza a añadir clientes para gestionar su información.</p>
//                   <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
//                       <Button>Añadir tu primer cliente</Button>
//                   </Link>
//               </div>
//           </Card>
//       ) : (
//           <>
//               {viewMode === 'cards' ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {filteredCustomers.map(customer => (
//                     <Card key={customer.id} className="flex flex-col">
//                       <div className="flex-grow">
//                         <h2 className="font-bold text-lg text-foreground truncate">{customer.name}</h2>
//                         <p className="text-sm text-primary font-semibold">{customer.email || 'Sin email'}</p>
//                         <div className="my-4 text-center">
//                           <p className="text-lg font-bold text-foreground">{customer.phone || 'N/A'}</p>
//                           <p className="text-xs text-foreground/60">Teléfono</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2 mt-4">
//                         <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} className="w-full">
//                           <Button variant="outline" className="w-full"><Edit className="mr-2 h-4 w-4"/> Editar</Button>
//                         </Link>
//                         <Button variant="danger" onClick={() => confirmDelete(customer.id)}><Trash2 className="h-4 w-4"/></Button>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="bg-card border border-border rounded-lg overflow-hidden">
//                   <table className="w-full text-left">
//                     <thead className="bg-background border-b border-border">
//                       <tr>
//                         <th className="p-4 font-semibold">Nombre</th>
//                         <th className="p-4 font-semibold hidden md:table-cell">Email</th>
//                         <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
//                         <th className="p-4"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredCustomers.map(customer => (
//                         <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                           <td className="p-4 font-medium text-primary">{customer.name}</td>
//                           <td className="p-4 hidden md:table-cell">{customer.email || 'N/A'}</td>
//                           <td className="p-4 hidden lg:table-cell">{customer.phone || 'N/A'}</td>
//                           <td className="p-4 text-right">
//                             <div className="flex justify-end gap-2">
//                               <Link href={PATHROUTES.pymes.clientes_editar(customer.id)}>
//                                 <Button variant="outline" className="p-2 h-auto"><Edit className="h-4 w-4" /></Button>
//                               </Link>
//                               <Button variant="danger" onClick={() => confirmDelete(customer.id)} className="p-2 h-auto"><Trash2 className="h-4 w-4" /></Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//           </>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// type ViewMode = 'cards' | 'list';

// export default function ClientesPage() {
//   const { data: session } = useSession();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>('cards');
//   const [searchTerm, setSearchTerm] = useState('');

//   // 🟢 FUNCIÓN MEJORADA: Ahora maneja errores de forma más detallada
//   const fetchCustomers = useCallback(async () => {
//     // Si la sesión no tiene un ID de compañía o un token, detenemos la carga.
//     if (!session?.user?.companyId || !session?.accessToken) {
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       // La URL de la API se construye con el ID de la compañía para filtrar los clientes.
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/customers`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       // Si la respuesta no es exitosa, intentamos leer el mensaje de error de la API.
//       if (!res.ok) {
//         let errorMessage = 'Error al cargar los clientes.';
//         try {
//           const errorData = await res.json();
//           if (errorData.message) {
//             errorMessage = errorData.message;
//           } else {
//             errorMessage += ` Código: ${res.status}`;
//           }
//         } catch (e) {
//           errorMessage += ` Código: ${res.status} ${res.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }
      
//       const customersData = await res.json();
//       setCustomers(customersData);
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);
  
//   useEffect(() => {
//     // Llamamos a la función de fetch solo si la sesión está disponible.
//     if (session?.user?.companyId) {
//       fetchCustomers();
//     }
//   }, [session, fetchCustomers]);

//   const filteredCustomers = useMemo(() => {
//     return customers.filter(c => 
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [customers, searchTerm]);

//   const handleDelete = async (id: string) => {
//     if (!session?.accessToken) return;
//     try {
//       // La URL para eliminar un cliente por su ID es correcta.
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });
      
//       if (!res.ok) {
//         throw new Error('No se pudo eliminar el cliente.');
//       }
      
//       setCustomers(prev => prev.filter(c => c.id !== id));
//       toast.success('¡Cliente eliminado con éxito!');
      
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Error desconocido.');
//     }
//   };
  
//   const confirmDelete = (id: string) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2">
//         <p>¿Seguro que quieres eliminar este cliente?</p>
//         <div className="flex gap-2">
//           <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
//             toast.dismiss(t.id);
//             handleDelete(id);
//           }}>
//             Sí, eliminar
//           </Button>
//           <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     ));
//   };
  
//   if (loading) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <Loader2 className="animate-spin h-12 w-12 text-primary" />
//             <p className="mt-4 text-foreground/70">Cargando clientes...</p>
//         </div>
//     );
//   }

//   if (error) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <AlertTriangle className="h-12 w-12 text-red-500" />
//             <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//             <p className="text-foreground/70">{error}</p>
//         </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
//         <Link href={PATHROUTES.pymes.clientes_nuevo}><Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button></Link>
//       </div>
      
//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//             <div className="relative flex-grow max-w-xs">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//               <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
//               <button onClick={() => setViewMode('cards')} className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}><LayoutGrid className="h-5 w-5"/></button>
//               <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}><List className="h-5 w-5"/></button>
//             </div>
//         </div>
//       </Card>

//       {customers.length === 0 ? (
//           <Card isClickable={false}>
//               <div className="text-center py-12">
//                   <Users className="mx-auto h-12 w-12 text-foreground/30" />
//                   <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
//                   <p className="mt-1 text-sm text-foreground/60">Empieza a añadir clientes para gestionar su información.</p>
//                   <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
//                       <Button>Añadir tu primer cliente</Button>
//                   </Link>
//               </div>
//           </Card>
//       ) : (
//           <>
//               {viewMode === 'cards' ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {filteredCustomers.map(customer => (
//                     <Card key={customer.id} className="flex flex-col">
//                       <div className="flex-grow">
//                         <h2 className="font-bold text-lg text-foreground truncate">{customer.name}</h2>
//                         <p className="text-sm text-primary font-semibold">{customer.email || 'Sin email'}</p>
//                         <div className="my-4 text-center">
//                           <p className="text-lg font-bold text-foreground">{customer.phone || 'N/A'}</p>
//                           <p className="text-xs text-foreground/60">Teléfono</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2 mt-4">
//                         <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} className="w-full">
//                           <Button variant="outline" className="w-full"><Edit className="mr-2 h-4 w-4"/> Editar</Button>
//                         </Link>
//                         <Button variant="danger" onClick={() => confirmDelete(customer.id)}><Trash2 className="h-4 w-4"/></Button>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="bg-card border border-border rounded-lg overflow-hidden">
//                   <table className="w-full text-left">
//                     <thead className="bg-background border-b border-border">
//                       <tr>
//                         <th className="p-4 font-semibold">Nombre</th>
//                         <th className="p-4 font-semibold hidden md:table-cell">Email</th>
//                         <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
//                         <th className="p-4"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredCustomers.map(customer => (
//                         <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                           <td className="p-4 font-medium text-primary">{customer.name}</td>
//                           <td className="p-4 hidden md:table-cell">{customer.email || 'N/A'}</td>
//                           <td className="p-4 hidden lg:table-cell">{customer.phone || 'N/A'}</td>
//                           <td className="p-4 text-right">
//                             <div className="flex justify-end gap-2">
//                               <Link href={PATHROUTES.pymes.clientes_editar(customer.id)}>
//                                 <Button variant="outline" className="p-2 h-auto"><Edit className="h-4 w-4" /></Button>
//                               </Link>
//                               <Button variant="danger" onClick={() => confirmDelete(customer.id)} className="p-2 h-auto"><Trash2 className="h-4 w-4" /></Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//           </>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Input } from "@/components/ui/Input";
// import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// type ViewMode = 'cards' | 'list';

// export default function ClientesPage() {
//   const { data: session } = useSession();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>('cards');
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchCustomers = useCallback(async () => {
//     // Verificamos si la sesión tiene el ID de la compañía y el token de acceso.
//     if (!session?.user?.companyId || !session?.accessToken) {
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
      
//       // 🟢 CORRECCIÓN CLAVE: La URL ahora incluye el companyId para filtrar los clientes.
//       // Esto asegura que la API devuelva solo los clientes de la empresa del usuario.

//       // const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/customers`, {
//       //   headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       // });

//       const res = await fetch(
//   `${process.env.NEXT_PUBLIC_API_URL}/customers?companyId=${session.user.companyId}`,
//   {
//     headers: { 'Authorization': `Bearer ${session.accessToken}` },
//   }
// );


//       if (!res.ok) {
//         let errorMessage = 'Error al cargar los clientes.';
//         try {
//           // Intentamos leer un mensaje de error detallado del cuerpo de la respuesta.
//           const errorData = await res.json();
//           if (errorData.message) {
//             errorMessage = errorData.message;
//           } else {
//             errorMessage += ` Código: ${res.status}`;
//           }
//         } catch (e) {
//           // Si el cuerpo no es un JSON, mostramos el estado HTTP.
//           errorMessage += ` Código: ${res.status} ${res.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }
      
//       const customersData = await res.json();
//       setCustomers(customersData);
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);
  
//   // Llamamos a la función de fetch cuando la sesión está lista.
//   useEffect(() => {
//     if (session?.user?.companyId) {
//       fetchCustomers();
//     }
//   }, [session, fetchCustomers]);

//   const filteredCustomers = useMemo(() => {
//     return customers.filter(c => 
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
//       (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [customers, searchTerm]);

//   const handleDelete = async (id: string) => {
//     if (!session?.accessToken) return;
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });
      
//       if (!res.ok) {
//         throw new Error('No se pudo eliminar el cliente.');
//       }
      
//       setCustomers(prev => prev.filter(c => c.id !== id));
//       toast.success('¡Cliente eliminado con éxito!');
      
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Error desconocido.');
//     }
//   };
  
//   const confirmDelete = (id: string) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2">
//         <p>¿Seguro que quieres eliminar este cliente?</p>
//         <div className="flex gap-2">
//           <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
//             toast.dismiss(t.id);
//             handleDelete(id);
//           }}>
//             Sí, eliminar
//           </Button>
//           <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     ));
//   };
  
//   if (loading) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <Loader2 className="animate-spin h-12 w-12 text-primary" />
//             <p className="mt-4 text-foreground/70">Cargando clientes...</p>
//         </div>
//     );
//   }

//   if (error) {
//       return (
//         <div className="p-8 h-full flex flex-col justify-center items-center">
//             <AlertTriangle className="h-12 w-12 text-red-500" />
//             <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//             <p className="text-foreground/70">{error}</p>
//         </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
//         <Link href={PATHROUTES.pymes.clientes_nuevo}><Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button></Link>
//       </div>
      
//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//             <div className="relative flex-grow max-w-xs">
//               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//               <input type="text" placeholder="Buscar cliente..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//               />
//             </div>
//             <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
//               <button onClick={() => setViewMode('cards')} className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}><LayoutGrid className="h-5 w-5"/></button>
//               <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}><List className="h-5 w-5"/></button>
//             </div>
//         </div>
//       </Card>

//       {customers.length === 0 ? (
//           <Card isClickable={false}>
//               <div className="text-center py-12">
//                   <Users className="mx-auto h-12 w-12 text-foreground/30" />
//                   <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
//                   <p className="mt-1 text-sm text-foreground/60">Empieza a añadir clientes para gestionar su información.</p>
//                   <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
//                       <Button>Añadir tu primer cliente</Button>
//                   </Link>
//               </div>
//           </Card>
//       ) : (
//           <>
//               {viewMode === 'cards' ? (
//                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                   {filteredCustomers.map(customer => (
//                     <Card key={customer.id} className="flex flex-col">
//                       <div className="flex-grow">
//                         <h2 className="font-bold text-lg text-foreground truncate">{customer.name}</h2>
//                         <p className="text-sm text-primary font-semibold">{customer.email || 'Sin email'}</p>
//                         <div className="my-4 text-center">
//                           <p className="text-lg font-bold text-foreground">{customer.phone || 'N/A'}</p>
//                           <p className="text-xs text-foreground/60">Teléfono</p>
//                         </div>
//                       </div>
//                       <div className="flex gap-2 mt-4">
//                         <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} className="w-full">
//                           <Button variant="outline" className="w-full"><Edit className="mr-2 h-4 w-4"/> Editar</Button>
//                         </Link>
//                         <Button variant="danger" onClick={() => confirmDelete(customer.id)}><Trash2 className="h-4 w-4"/></Button>
//                       </div>
//                     </Card>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="bg-card border border-border rounded-lg overflow-hidden">
//                   <table className="w-full text-left">
//                     <thead className="bg-background border-b border-border">
//                       <tr>
//                         <th className="p-4 font-semibold">Nombre</th>
//                         <th className="p-4 font-semibold hidden md:table-cell">Email</th>
//                         <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
//                         <th className="p-4"></th>
//                       </tr>
//                     </thead>
//                     <tbody>
//                       {filteredCustomers.map(customer => (
//                         <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                           <td className="p-4 font-medium text-primary">{customer.name}</td>
//                           <td className="p-4 hidden md:table-cell">{customer.email || 'N/A'}</td>
//                           <td className="p-4 hidden lg:table-cell">{customer.phone || 'N/A'}</td>
//                           <td className="p-4 text-right">
//                             <div className="flex justify-end gap-2">
//                               <Link href={PATHROUTES.pymes.clientes_editar(customer.id)}>
//                                 <Button variant="outline" className="p-2 h-auto"><Edit className="h-4 w-4" /></Button>
//                               </Link>
//                               <Button variant="danger" onClick={() => confirmDelete(customer.id)} className="p-2 h-auto"><Trash2 className="h-4 w-4" /></Button>
//                             </div>
//                           </td>
//                         </tr>
//                       ))}
//                     </tbody>
//                   </table>
//                 </div>
//               )}
//           </>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';
// import { useRouter } from "next/navigation";
// type ViewMode = 'cards' | 'list';

// export default function ClientesPage() {
//   const { data: session } = useSession();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>('cards');
//   const [searchTerm, setSearchTerm] = useState('');

//   const router = useRouter();

//   const fetchCustomers = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         let errorMessage = 'Error al cargar los clientes.';
//         try {
//           const errorData = await res.json();
//           if (errorData.message) {
//             errorMessage = errorData.message;
//           } else {
//             errorMessage += ` Código: ${res.status}`;
//           }
//         } catch (e) {
//           errorMessage += ` Código: ${res.status} ${res.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }

//       const customersData: Customer[] = await res.json();

//       // 🟢 Filtro por companyId en frontend
//       const filteredData = customersData.filter(
//         (c) => c.companyId === session.user.companyId
//       );

//       setCustomers(filteredData);

//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session?.user?.companyId) {
//       fetchCustomers();
//     }
//   }, [session, fetchCustomers]);

//   const filteredCustomers = useMemo(() => {
//     return customers.filter(c =>
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [customers, searchTerm]);

//   const handleDelete = async (id: string) => {
//     if (!session?.accessToken) return;
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         throw new Error('No se pudo eliminar el cliente.');
//       }

//       // Actualizamos el listado tras eliminar
//       setCustomers(prev => prev.filter(c => c.id !== id));
//       toast.success('¡Cliente eliminado con éxito!');
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Error desconocido.');
//     }
//   };

//   const confirmDelete = (id: string) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2">
//         <p>¿Seguro que quieres eliminar este cliente?</p>
//         <div className="flex gap-2">
//           <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
//             toast.dismiss(t.id);
//             handleDelete(id);
//           }}>
//             Sí, eliminar
//           </Button>
//           <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     ));
//   };

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando clientes...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
//         <Link href={PATHROUTES.pymes.clientes_nuevo}>
//           <Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button>
//         </Link>
//       </div>

//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//           <div className="relative flex-grow max-w-xs">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//             <input
//               type="text"
//               placeholder="Buscar cliente..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>
//           <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
//             <button
//               onClick={() => setViewMode('cards')}
//               className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}
//             >
//               <LayoutGrid className="h-5 w-5" />
//             </button>
//             <button
//               onClick={() => setViewMode('list')}
//               className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}
//             >
//               <List className="h-5 w-5" />
//             </button>
//           </div>
//         </div>
//       </Card>

//       {customers.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <Users className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Empieza a añadir clientes para gestionar su información.
//             </p>
//             <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
//               <Button>Añadir tu primer cliente</Button>
//             </Link>
//           </div>
//         </Card>
//       ) : (
//         <>
//           {viewMode === 'cards' ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {filteredCustomers.map(customer => (
//                 <Card key={customer.id} className="flex flex-col"
//                 // isClickable
//                 //     onClick={() => router.push(PATHROUTES.pymes.clientes_detalle(customer.id))}
//                 >
               
//                   {/* <div 
//                   className="flex-grow"
//                    onClick={() => router.push(PATHROUTES.pymes.clientes_detalle(customer.id))}
//                    > */}

//                       <div
//                           className="flex-grow cursor-pointer"
//                           onClick={() => router.push(PATHROUTES.pymes.clientes_detalle(customer.id))}
//                         >
                  
//                     <h2 className="font-bold text-lg text-foreground truncate">{customer.name}</h2>
//                     <p className="text-sm text-primary font-semibold">{customer.email || 'Sin email'}</p>
//                     <div className="my-4 text-center">
//                       <p className="text-lg font-bold text-foreground">{customer.phone || 'N/A'}</p>
//                       <p className="text-xs text-foreground/60">Teléfono</p>
//                     </div>

//                     <div className="my-2">
//                       <p className="text-sm text-foreground">{customer.notes || 'Sin notas'}</p>
//                       <p className="text-xs text-foreground/60">Notas</p>
//                     </div>


                    
//                   </div>


                  

//                   <div className="flex gap-2 mt-4">
//                     <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} className="w-full"
//                       onClick={(e) => e.stopPropagation()} // 👈 evita que el Card dispare el push
//                     >
//                       <Button variant="outline" className="w-full">
//                         <Edit className="mr-2 h-4 w-4" /> Editar
//                       </Button>
//                     </Link>
//                     {/* <Button variant="danger" onClick={() => confirmDelete(customer.id)}>
//                       <Trash2 className="h-4 w-4" />
//                     </Button> */}
//                     <Button
//                       variant="danger"
//                       onClick={(e) => {
//                         e.preventDefault(); // evita navegación
//                          e.stopPropagation(); // 👈 lo mismo aquí
//                         handleDelete(customer.id);
//                       }}
//                     >
//                       <Trash2 className="h-4 w-4" /> Eliminar
//                     </Button>
//                   </div>

            

//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <div className="bg-card border border-border rounded-lg overflow-hidden">
//               <table className="w-full text-left">
//                 <thead className="bg-background border-b border-border">
//                   <tr>
//                     <th className="p-4 font-semibold">Nombre</th>
//                     <th className="p-4 font-semibold hidden md:table-cell">Email</th>
//                     <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
//                     <th className="p-4"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCustomers.map(customer => (
//                     <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                       <td className="p-4 font-medium text-primary">{customer.name}</td>
//                       <td className="p-4 hidden md:table-cell">{customer.email || 'N/A'}</td>
//                       <td className="p-4 hidden lg:table-cell">{customer.phone || 'N/A'}</td>
//                       <td className="p-4 hidden lg:table-cell">{customer.notes || 'N/A'}</td>
//                       <td className="p-4 text-right">
//                         <div className="flex justify-end gap-2">
//                           <Link href={PATHROUTES.pymes.clientes_editar(customer.id)}>
//                             <Button variant="outline" className="p-2 h-auto">
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                           </Link>
//                           <Button
//                             variant="danger"
//                             onClick={() => confirmDelete(customer.id)}
//                             className="p-2 h-auto"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// type ViewMode = 'cards' | 'list';

// export default function ClientesPage() {
//   const { data: session } = useSession();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>('cards');
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchCustomers = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         let errorMessage = 'Error al cargar los clientes.';
//         try {
//           const errorData = await res.json();
//           if (errorData.message) {
//             errorMessage = errorData.message;
//           } else {
//             errorMessage += ` Código: ${res.status}`;
//           }
//         } catch (e) {
//           errorMessage += ` Código: ${res.status} ${res.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }

//       const customersData: Customer[] = await res.json();
//       const filteredData = customersData.filter(
//         (c) => c.companyId === session.user.companyId
//       );

//       setCustomers(filteredData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session?.user?.companyId) {
//       fetchCustomers();
//     }
//   }, [session, fetchCustomers]);

//   const filteredCustomers = useMemo(() => {
//     return customers.filter(c =>
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [customers, searchTerm]);

//   const handleDelete = async (id: string) => {
//     if (!session?.accessToken) return;
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         throw new Error('No se pudo eliminar el cliente.');
//       }

//       setCustomers(prev => prev.filter(c => c.id !== id));
//       toast.success('¡Cliente eliminado con éxito!');
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Error desconocido.');
//     }
//   };

//   const confirmDelete = (id: string) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2">
//         <p>¿Seguro que quieres eliminar este cliente?</p>
//         <div className="flex gap-2">
//           <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
//             toast.dismiss(t.id);
//             handleDelete(id);
//           }}>
//             Sí, eliminar
//           </Button>
//           <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     ));
//   };

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando clientes...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
//         <Link href={PATHROUTES.pymes.clientes_nuevo}>
//           <Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button>
//         </Link>
//       </div>

//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//           <div className="relative flex-grow max-w-xs">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//             <input
//               type="text"
//               placeholder="Buscar cliente..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>
//           <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
//             <button
//               onClick={() => setViewMode('cards')}
//               className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}
//             >
//               <LayoutGrid className="h-5 w-5" />
//             </button>
//             <button
//               onClick={() => setViewMode('list')}
//               className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}
//             >
//               <List className="h-5 w-5" />
//             </button>
//           </div>
//         </div>
//       </Card>

//       {customers.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <Users className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Empieza a añadir clientes para gestionar su información.
//             </p>
//             <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
//               <Button>Añadir tu primer cliente</Button>
//             </Link>
//           </div>
//         </Card>
//       ) : (
//         <>
//           {viewMode === 'cards' ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {filteredCustomers.map(customer => (
//                 <Card key={customer.id} className="flex flex-col">
//                   {/* 🟢 El Link ahora envuelve el contenido principal */}
//                   <Link href={PATHROUTES.pymes.clientes_detalle(customer.id)} className="flex-grow cursor-pointer p-4">
//                     <h2 className="font-bold text-lg text-foreground truncate">{customer.name}</h2>
//                     <p className="text-sm text-primary font-semibold">{customer.email || 'Sin email'}</p>
//                     <div className="my-4 text-center">
//                       <p className="text-lg font-bold text-foreground">{customer.phone || 'N/A'}</p>
//                       <p className="text-xs text-foreground/60">Teléfono</p>
//                     </div>
//                   </Link>
//                   {/* Los botones de acción deben estar fuera del Link */}
//                   <div className="flex gap-2 mt-auto p-4 border-t border-border">
//                     <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} className="w-full"
//                       onClick={(e) => e.stopPropagation()} // 👈 Evita que el Link se active
//                     >
//                       <Button variant="outline" className="w-full">
//                         <Edit className="mr-2 h-4 w-4" /> Editar
//                       </Button>
//                     </Link>
//                     <Button
//                       variant="danger"
//                       onClick={(e) => {
//                         e.stopPropagation(); // 👈 Evita que el Link se active
//                         confirmDelete(customer.id);
//                       }}
//                     >
//                       <Trash2 className="h-4 w-4" />
//                     </Button>
//                   </div>
//                 </Card>
//               ))}
//             </div>
//           ) : (
//             <div className="bg-card border border-border rounded-lg overflow-hidden">
//               <table className="w-full text-left">
//                 <thead className="bg-background border-b border-border">
//                   <tr>
//                     <th className="p-4 font-semibold">Nombre</th>
//                     <th className="p-4 font-semibold hidden md:table-cell">Email</th>
//                     <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
//                     <th className="p-4"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCustomers.map(customer => (
//                     <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                       {/* 🟢 Link en la fila de la tabla */}
//                       <td className="p-4 font-medium text-primary">
//                         <Link href={PATHROUTES.pymes.clientes_detalle(customer.id)} className="hover:underline">
//                           {customer.name}
//                         </Link>
//                       </td>
//                       <td className="p-4 hidden md:table-cell">{customer.email || 'N/A'}</td>
//                       <td className="p-4 hidden lg:table-cell">{customer.phone || 'N/A'}</td>
//                       <td className="p-4 text-right">
//                         <div className="flex justify-end gap-2">
//                           <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} onClick={(e) => e.stopPropagation()}>
//                             <Button variant="outline" className="p-2 h-auto">
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                           </Link>
//                           <Button
//                             variant="danger"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               confirmDelete(customer.id);
//                             }}
//                             className="p-2 h-auto"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// type ViewMode = 'cards' | 'list';

// export default function ClientesPage() {
//   const { data: session } = useSession();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>('cards');
//   const [searchTerm, setSearchTerm] = useState('');

//   const fetchCustomers = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       // Esta ruta es la correcta para obtener clientes
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         let errorMessage = 'Error al cargar los clientes.';
//         try {
//           const errorData = await res.json();
//           if (errorData.message) {
//             errorMessage = errorData.message;
//           } else {
//             errorMessage += ` Código: ${res.status}`;
//           }
//         } catch (e) {
//           errorMessage += ` Código: ${res.status} ${res.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }

//       const customersData: Customer[] = await res.json();
      
//       // Filtramos en el frontend, ya que la ruta del backend no permite filtrar por companyId
//       const filteredData = customersData.filter(
//         (c) => c.companyId === session.user.companyId
//       );

//       setCustomers(filteredData);
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session?.user?.companyId) {
//       fetchCustomers();
//     }
//   }, [session, fetchCustomers]);

//   const filteredCustomers = useMemo(() => {
//     return customers.filter(c =>
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [customers, searchTerm]);

//   const handleDelete = async (id: string) => {
//     if (!session?.accessToken) return;
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         throw new Error('No se pudo eliminar el cliente.');
//       }

//       setCustomers(prev => prev.filter(c => c.id !== id));
//       toast.success('¡Cliente eliminado con éxito!');
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Error desconocido.');
//     }
//   };

//   const confirmDelete = (id: string) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2">
//         <p>¿Seguro que quieres eliminar este cliente?</p>
//         <div className="flex gap-2">
//           <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
//             toast.dismiss(t.id);
//             handleDelete(id);
//           }}>
//             Sí, eliminar
//           </Button>
//           <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     ));
//   };

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando clientes...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
//         <Link href={PATHROUTES.pymes.clientes_nuevo}>
//           <Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button>
//         </Link>
//       </div>

//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//           <div className="relative flex-grow max-w-xs">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//             <input
//               type="text"
//               placeholder="Buscar cliente..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>
//           <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
//             <button
//               onClick={() => setViewMode('cards')}
//               className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}
//             >
//               <LayoutGrid className="h-5 w-5" />
//             </button>
//             <button
//               onClick={() => setViewMode('list')}
//               className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}
//             >
//               <List className="h-5 w-5" />
//             </button>
//           </div>
//         </div>
//       </Card>

//       {customers.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <Users className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Empieza a añadir clientes para gestionar su información.
//             </p>
//             <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
//               <Button>Añadir tu primer cliente</Button>
//             </Link>
//           </div>
//         </Card>
//       ) : (
//         <>
//           {viewMode === 'cards' ? (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//               {filteredCustomers.map(customer => (
//                 <Link
//                   key={customer.id}
//                   href={PATHROUTES.pymes.clientes_detalle(customer.id)}
//                   className="block"
//                 >
//                   <Card className="flex flex-col h-full cursor-pointer hover:bg-muted/50 transition-colors">
//                     <div className="flex-grow p-4">
//                       <h2 className="font-bold text-lg text-foreground truncate">{customer.name}</h2>
//                       <p className="text-sm text-primary font-semibold">{customer.email || 'Sin email'}</p>
//                       <div className="my-4 text-center">
//                         <p className="text-lg font-bold text-foreground">{customer.phone || 'N/A'}</p>
//                         <p className="text-xs text-foreground/60">Teléfono</p>
                         
//                       </div>

//                   {/* 🟢 Nuevo bloque para mostrar las notas */}
//                     {/* <div className="my-2 text-center">
//                       <p className="text-sm text-foreground">{customer.notes || ''}</p>
//                       <p className="text-xs text-foreground/60">Notas</p>
//                     </div> */}

                  
//                       {customer.notes && (
//                         <div className="my-2 text-center">
//                           <p className="text-sm text-foreground">{customer.notes}</p>
//                           <p className="text-xs text-foreground/60">Notas</p>
//                         </div>
//                       )}

//                     </div>
//                     <div className="flex gap-2 mt-auto p-4 border-t border-border">
//                       <Link
//                         href={PATHROUTES.pymes.clientes_editar(customer.id)}
//                         className="w-full"
//                         onClick={(e) => e.stopPropagation()}
//                       >
//                         <Button variant="outline" className="w-full">
//                           <Edit className="mr-2 h-4 w-4" /> Editar
//                         </Button>
//                       </Link>
//                       <Button
//                         variant="danger"
//                         onClick={(e) => {
//                           e.stopPropagation();
//                           confirmDelete(customer.id);
//                         }}
//                       >
//                         <Trash2 className="h-4 w-4" />
//                       </Button>
//                     </div>
//                   </Card>
//                 </Link>
//               ))}
//             </div>
//           ) : (
//             <div className="bg-card border border-border rounded-lg overflow-hidden">
//               <table className="w-full text-left">
//                 <thead className="bg-background border-b border-border">
//                   <tr>
//                     <th className="p-4 font-semibold">Nombre</th>
//                     <th className="p-4 font-semibold hidden md:table-cell">Email</th>
//                     <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
//                     <th className="p-4"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCustomers.map(customer => (
//                     <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                       <td className="p-4 font-medium text-primary">
//                         <Link href={PATHROUTES.pymes.clientes_detalle(customer.id)} className="hover:underline">
//                           {customer.name}
//                         </Link>
//                       </td>
//                       <td className="p-4 hidden md:table-cell">{customer.email || 'N/A'}</td>
//                       <td className="p-4 hidden lg:table-cell">{customer.phone || 'N/A'}</td>
//                       <td className="p-4 text-right">
//                         <div className="flex justify-end gap-2">
//                           <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} onClick={(e) => e.stopPropagation()}>
//                             <Button variant="outline" className="p-2 h-auto">
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                           </Link>
//                           <Button
//                             variant="danger"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               confirmDelete(customer.id);
//                             }}
//                             className="p-2 h-auto"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users } from 'lucide-react';
// import Link from 'next/link';
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// type ViewMode = 'cards' | 'list';

// export default function ClientesPage() {
//   const { data: session } = useSession();
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [viewMode, setViewMode] = useState<ViewMode>('cards');
//   const [searchTerm, setSearchTerm] = useState('');

//   // 🟢 Nuevo estado para la paginación
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 6;

//   const fetchCustomers = useCallback(async () => {
//     if (!session?.user?.companyId || !session?.accessToken) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         let errorMessage = 'Error al cargar los clientes.';
//         try {
//           const errorData = await res.json();
//           if (errorData.message) {
//             errorMessage = errorData.message;
//           } else {
//             errorMessage += ` Código: ${res.status}`;
//           }
//         } catch (e) {
//           errorMessage += ` Código: ${res.status} ${res.statusText}`;
//         }
//         throw new Error(errorMessage);
//       }

//       const customersData: Customer[] = await res.json();
      
//       const filteredData = customersData.filter(
//         (c) => c.companyId === session.user.companyId
//       );

//       setCustomers(filteredData);
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session]);

//   useEffect(() => {
//     if (session?.user?.companyId) {
//       fetchCustomers();
//     }
//   }, [session, fetchCustomers]);

//   const filteredCustomers = useMemo(() => {
//     return customers.filter(c =>
//       c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
//       (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
//     );
//   }, [customers, searchTerm]);

//   // 🟢 Lógica de paginación
//   const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
//   const startIndex = (currentPage - 1) * itemsPerPage;
//   const endIndex = startIndex + itemsPerPage;
//   const visibleCustomers = filteredCustomers.slice(startIndex, endIndex);

//   const handleDelete = async (id: string) => {
//     if (!session?.accessToken) return;
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
//         method: 'DELETE',
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         throw new Error('No se pudo eliminar el cliente.');
//       }

//       setCustomers(prev => prev.filter(c => c.id !== id));
//       toast.success('¡Cliente eliminado con éxito!');
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : 'Error desconocido.');
//     }
//   };

//   const confirmDelete = (id: string) => {
//     toast((t) => (
//       <div className="flex flex-col gap-2">
//         <p>¿Seguro que quieres eliminar este cliente?</p>
//         <div className="flex gap-2">
//           <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
//             toast.dismiss(t.id);
//             handleDelete(id);
//           }}>
//             Sí, eliminar
//           </Button>
//           <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
//             Cancelar
//           </Button>
//         </div>
//       </div>
//     ));
//   };

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando clientes...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-4 md:p-8">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
//         <Link href={PATHROUTES.pymes.clientes_nuevo}>
//           <Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button>
//         </Link>
//       </div>

//       <Card isClickable={false} className="mb-8">
//         <div className="flex flex-wrap justify-between items-center gap-4">
//           <div className="relative flex-grow max-w-xs">
//             <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
//             <input
//               type="text"
//               placeholder="Buscar cliente..."
//               value={searchTerm}
//               onChange={e => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
//             />
//           </div>
//           <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
//             <button
//               onClick={() => setViewMode('cards')}
//               className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}
//             >
//               <LayoutGrid className="h-5 w-5" />
//             </button>
//             <button
//               onClick={() => setViewMode('list')}
//               className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}
//             >
//               <List className="h-5 w-5" />
//             </button>
//           </div>
//         </div>
//       </Card>

//       {customers.length === 0 ? (
//         <Card isClickable={false}>
//           <div className="text-center py-12">
//             <Users className="mx-auto h-12 w-12 text-foreground/30" />
//             <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
//             <p className="mt-1 text-sm text-foreground/60">
//               Empieza a añadir clientes para gestionar su información.
//             </p>
//             <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
//               <Button>Añadir tu primer cliente</Button>
//             </Link>
//           </div>
//         </Card>
//       ) : (
//         <>
//           {viewMode === 'cards' ? (
//             <>
//               {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"> */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {visibleCustomers.map(customer => (
//                   <Link
//                     key={customer.id}
//                     href={PATHROUTES.pymes.clientes_detalle(customer.id)}
//                     className="block"
//                   >
//                     <Card className="flex flex-col h-full cursor-pointer hover:bg-muted/50 transition-colors">
//                       <div className="flex-grow p-4 text-center">
//                         <h2 className="font-bold text-lg text-foreground truncate">{customer.name}</h2>
//                         <p className="text-sm text-primary font-semibold">{customer.email || 'Sin email'}</p>
//                         <div className="my-4 text-center">
//                           <p className="text-lg font-bold text-foreground">{customer.phone || 'N/A'}</p>
//                           <p className="text-xs text-foreground/60">Teléfono</p>
//                         </div>
//                         {customer.notes && (
//                           <div className="my-2 text-center">
//                             <p className="text-sm text-foreground">{customer.notes}</p>
//                             <p className="text-xs text-foreground/60">Notas</p>
//                           </div>
//                         )}
//                       </div>
//                       <div className="flex gap-2 mt-auto p-4 border-t border-border">
//                         <Link
//                           href={PATHROUTES.pymes.clientes_editar(customer.id)}
//                           className="w-full"
//                           onClick={(e) => e.stopPropagation()}
//                         >
//                           <Button variant="outline" className="w-full">
//                             <Edit className="mr-2 h-4 w-4" /> Editar
//                           </Button>
//                         </Link>
//                         <Button
//                           variant="danger"
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             confirmDelete(customer.id);
//                           }}
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </Card>
//                   </Link>
//                 ))}
//               </div>
//               {/* 🟢 Navegación de paginación */}
//               <div className="flex justify-center items-center gap-4 mt-8">
//                 <Button
//                   onClick={() => setCurrentPage(prev => prev - 1)}
//                   disabled={currentPage === 1}
//                 >
//                   Anterior
//                 </Button>
//                 <span>Página {currentPage} de {totalPages}</span>
//                 <Button
//                   onClick={() => setCurrentPage(prev => prev + 1)}
//                   disabled={currentPage === totalPages}
//                 >
//                   Siguiente
//                 </Button>
//               </div>
//             </>
//           ) : (
//             <div className="bg-card border border-border rounded-lg overflow-hidden">
//               <table className="w-full text-left">
//                 <thead className="bg-background border-b border-border">
//                   <tr>
//                     <th className="p-4 font-semibold">Nombre</th>
//                     <th className="p-4 font-semibold hidden md:table-cell">Email</th>
//                     <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
//                     <th className="p-4"></th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {filteredCustomers.map(customer => (
//                     <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-background">
//                       <td className="p-4 font-medium text-primary">
//                         <Link href={PATHROUTES.pymes.clientes_detalle(customer.id)} className="hover:underline">
//                           {customer.name}
//                         </Link>
//                       </td>
//                       <td className="p-4 hidden md:table-cell">{customer.email || 'N/A'}</td>
//                       <td className="p-4 hidden lg:table-cell">{customer.phone || 'N/A'}</td>
//                       <td className="p-4 text-right">
//                         <div className="flex justify-end gap-2">
//                           <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} onClick={(e) => e.stopPropagation()}>
//                             <Button variant="outline" className="p-2 h-auto">
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                           </Link>
//                           <Button
//                             variant="danger"
//                             onClick={(e) => {
//                               e.stopPropagation();
//                               confirmDelete(customer.id);
//                             }}
//                             className="p-2 h-auto"
//                           >
//                             <Trash2 className="h-4 w-4" />
//                           </Button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </>
//       )}
//     </div>
//   );
// }

"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { PlusCircle, Loader2, AlertTriangle, Edit, Trash2, LayoutGrid, List, Search, Users } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { PATHROUTES } from '@/constants/pathroutes';
import { Customer } from '@/types/customer';

type ViewMode = 'cards' | 'list';

export default function ClientesPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [searchTerm, setSearchTerm] = useState('');

  // 🟢 Paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  const fetchCustomers = useCallback(async () => {
    if (!session?.user?.companyId || !session?.accessToken) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers`, {
        headers: { 'Authorization': `Bearer ${session.accessToken}` },
      });

      if (!res.ok) {
        throw new Error(`Error al cargar clientes. Código: ${res.status}`);
      }

      const customersData: Customer[] = await res.json();
      const filteredData = customersData.filter(
        (c) => c.companyId === session.user.companyId
      );

      setCustomers(filteredData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error.');
    } finally {
      setLoading(false);
    }
  }, [session]);

  useEffect(() => {
    if (session?.user?.companyId) {
      fetchCustomers();
    }
  }, [session, fetchCustomers]);

  const filteredCustomers = useMemo(() => {
    return customers.filter(c =>
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (c.email?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (c.phone?.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [customers, searchTerm]);

  // 🟢 Paginación
  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const visibleCustomers = filteredCustomers.slice(startIndex, endIndex);

  const handleDelete = async (id: string) => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${session.accessToken}` },
      });

      if (!res.ok) {
        throw new Error('No se pudo eliminar el cliente.');
      }

      setCustomers(prev => prev.filter(c => c.id !== id));
      toast.success('¡Cliente eliminado con éxito!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Error desconocido.');
    }
  };

  const confirmDelete = (id: string) => {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>¿Seguro que quieres eliminar este cliente?</p>
        <div className="flex gap-2">
          <Button variant="danger" className="px-3 py-1 text-sm h-auto" onClick={() => {
            toast.dismiss(t.id);
            handleDelete(id);
          }}>
            Sí, eliminar
          </Button>
          <Button variant="outline" className="px-3 py-1 text-sm h-auto" onClick={() => toast.dismiss(t.id)}>
            Cancelar
          </Button>
        </div>
      </div>
    ));
  };

  if (loading) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <Loader2 className="animate-spin h-12 w-12 text-primary" />
        <p className="mt-4 text-foreground/70">Cargando clientes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
        <p className="text-foreground/70">{error}</p>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Clientes</h1>
        <Link href={PATHROUTES.pymes.clientes_nuevo}>
          <Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Cliente</Button>
        </Link>
      </div>

      <Card isClickable={false} className="mb-8">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Buscar cliente..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
            <button
              onClick={() => setViewMode('cards')}
              className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}
            >
              <LayoutGrid className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </Card>

      {customers.length === 0 ? (
        <Card isClickable={false}>
          <div className="text-center py-12">
            <Users className="mx-auto h-12 w-12 text-foreground/30" />
            <h3 className="mt-2 text-xl font-semibold">No tienes clientes registrados</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Empieza a añadir clientes para gestionar su información.
            </p>
            <Link href={PATHROUTES.pymes.clientes_nuevo} className="mt-6 inline-block">
              <Button>Añadir tu primer cliente</Button>
            </Link>
          </div>
        </Card>
      ) : (
        <>
          {viewMode === 'cards' ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {visibleCustomers.map(customer => (
                  <div
                    key={customer.id}
                    onClick={() => router.push(PATHROUTES.pymes.clientes_detalle(customer.id))}
                    className="cursor-pointer"
                  >
                    <Card className="flex flex-col h-full hover:bg-muted/50 transition-colors">
                      <div className="flex-grow p-4 text-center">
                        <h2 className="font-bold text-lg text-foreground truncate">{customer.name}</h2>
                        <p className="text-sm text-primary font-semibold">{customer.email || 'Sin email'}</p>
                        <div className="my-4 text-center">
                          <p className="text-lg font-bold text-foreground">{customer.phone || 'N/A'}</p>
                          <p className="text-xs text-foreground/60">Teléfono</p>
                        </div>
                        {customer.notes && (
                          <div className="my-2 text-center">
                            <p className="text-sm text-foreground">{customer.notes}</p>
                            <p className="text-xs text-foreground/60">Notas</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 mt-auto p-4 border-t border-border">
                        <Link
                          href={PATHROUTES.pymes.clientes_editar(customer.id)}
                          className="w-full"
                          onClick={(e) => e.stopPropagation()} // ✅ evita que dispare el click del div padre
                        >
                          <Button variant="outline" className="w-full">
                            <Edit className="mr-2 h-4 w-4" /> Editar
                          </Button>
                        </Link>
                        <Button
                          variant="danger"
                          onClick={(e) => {
                            e.stopPropagation(); // ✅ evita que dispare el click del div padre
                            confirmDelete(customer.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>

              {/* Navegación de paginación */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button
                  onClick={() => setCurrentPage(prev => prev - 1)}
                  disabled={currentPage === 1}
                >
                  Anterior
                </Button>
                <span>Página {currentPage} de {totalPages}</span>
                <Button
                  onClick={() => setCurrentPage(prev => prev + 1)}
                  disabled={currentPage === totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </>
          ) : (
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="p-4 font-semibold">Nombre</th>
                    <th className="p-4 font-semibold hidden md:table-cell">Email</th>
                    <th className="p-4 font-semibold hidden lg:table-cell">Teléfono</th>
                    <th className="p-4"></th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map(customer => (
                    <tr key={customer.id} className="border-b border-border last:border-b-0 hover:bg-background">
                      <td className="p-4 font-medium text-primary">
                        <Link href={PATHROUTES.pymes.clientes_detalle(customer.id)} className="hover:underline">
                          {customer.name}
                        </Link>
                      </td>
                      <td className="p-4 hidden md:table-cell">{customer.email || 'N/A'}</td>
                      <td className="p-4 hidden lg:table-cell">{customer.phone || 'N/A'}</td>
                      <td className="p-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={PATHROUTES.pymes.clientes_editar(customer.id)} onClick={(e) => e.stopPropagation()}>
                            <Button variant="outline" className="p-2 h-auto">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            variant="danger"
                            onClick={(e) => {
                              e.stopPropagation();
                              confirmDelete(customer.id);
                            }}
                            className="p-2 h-auto"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
}
