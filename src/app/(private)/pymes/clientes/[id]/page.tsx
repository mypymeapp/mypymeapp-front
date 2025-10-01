
///////////FUNCIONA//ultima actualizacion 17 sept////////////
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Phone, Mail, ArrowLeft, Check, Loader2, StickyNote, Trash2, AlertTriangle } from "lucide-react";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// // Esta función es para tu lógica de negocio, asumimos que está en el archivo utils/fecha.ts
// const calcularAntiguedad = (fecha: string) => {
//     const fechaCliente = new Date(fecha);
//     const ahora = new Date();
//     const diffMeses = (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 + (ahora.getMonth() - fechaCliente.getMonth());
//     if (diffMeses < 12) {
//         return `${diffMeses} mes${diffMeses === 1 ? '' : 'es'}`;
//     }
//     const diffAnios = Math.floor(diffMeses / 12);
//     return `${diffAnios} año${diffAnios === 1 ? '' : 's'}`;
// };

// export default function ClienteDetalle() {
//   const { data: session } = useSession();
//   const params = useParams();
//   const clienteId = params.id as string;

//   const [cliente, setCliente] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [notas, setNotas] = useState("");
//   const [isPublishing, setIsPublishing] = useState(false);

//   // 🟢 CORRECCIÓN CLAVE: Función para obtener los datos de un cliente
//   const fetchCliente = useCallback(async () => {
//     if (!session?.accessToken || !clienteId) {
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         throw new Error("No se pudo cargar la información del cliente.");
//       }
      
//       const clienteData = await res.json();
//       setCliente(clienteData);
//       // setNotas(clienteData.notes || "");
//       setNotas(clienteData.notes);
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session, clienteId]);
  
//   // 🟢 CORRECCIÓN CLAVE: Hook para llamar al fetch cuando el componente se monta
//   useEffect(() => {
//     if (session) {
//       fetchCliente();
//     }
//   }, [session, fetchCliente]);

//   const handleGuardarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${session.accessToken}`,
//         },
//         body: JSON.stringify({ notes: notas }),
//       });

//       if (!res.ok) {
//         throw new Error("No se pudieron guardar las notas.");
//       }

//       toast.success("¡Notas guardadas con éxito!");
      
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Error al guardar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   const handleEliminarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${session.accessToken}`,
//         },
//         body: JSON.stringify({ notes: null }),
//       });

//       if (!res.ok) {
//         throw new Error("No se pudieron eliminar las notas.");
//       }

//       setNotas("");
//       toast.success("¡Notas eliminadas con éxito!");
      
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Error al eliminar las notas.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando cliente...</p>
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
  
//   if (!cliente) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-yellow-500" />
//         <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
//         <p className="text-foreground/70">Parece que este cliente no existe o ya no está disponible.</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4"><Button>Volver a la lista</Button></Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">{cliente.name}</h2>
//           <p className="text-sm text-foreground/70">{cliente.email}</p>
//         </div>
//         <Link href={PATHROUTES.pymes.clientes}>
//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </Link>
//       </div>

//       {/* Grid principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Información de contacto */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <h2 className="text-lg font-semibold">Información de Contacto</h2>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Phone className="w-4 h-4 text-primary" /> {cliente.phone}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Mail className="w-4 h-4 text-primary" /> {cliente.email}
//           </p>
//           <p className="text-sm text-foreground/60">
//             Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()}{" "}
//             <br/>
//             <span className="italic">({calcularAntiguedad(cliente.memberSince)})</span>
//           </p>
//           {/* Aquí puedes añadir lógica para el gasto total si la API la proporciona */}
//           {/* <p className="font-semibold text-foreground/90">💰 Gasto total: €{cliente.gastoTotal.toFixed(2)}</p> */}
//         </Card>

//         {/* Historial de compras (Este componente necesita la data de compras) */}
//         {/* Como la API de customers no la devuelve, esta sección debe cargarse por separado. */}
//         {/* Por ahora, la dejamos con un placeholder */}
//         <Card isClickable={false} className="lg:col-span-2 p-4">
//           <h2 className="text-lg font-semibold mb-4">Historial de compras</h2>
//           <p className="text-foreground/60">El historial de compras se mostrará aquí una vez que la API lo proporcione.</p>
//         </Card>
//       </div>

//       {/* Notas internas */}
//       <Card isClickable={false} className="p-4 space-y-4">
//         <h2 className="text-lg font-semibold">Notas internas</h2>
        
//         <textarea
//           className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
//           rows={4}
//           value={notas}
//           onChange={(e) => setNotas(e.target.value)}
//           placeholder="Añade notas importantes sobre este cliente..."
//         />

//         <div className="flex justify-end gap-2">
//           <Button onClick={handleGuardarNotas} disabled={isPublishing || !notas.trim()} >
//             {isPublishing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
//               </>
//             ) : (
//               <>
//                 <Check className="mr-2 h-4 w-4" /> Guardar
//               </>
//             )}
//           </Button>
//           <Button onClick={handleEliminarNotas} variant="danger"  disabled={!notas}>
//             <Trash2 className="h-4 w-4" /> Eliminar
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Phone, Mail, ArrowLeft, Check, Loader2, StickyNote, Trash2, AlertTriangle } from "lucide-react";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// // Esta función es para tu lógica de negocio, asumimos que está en el archivo utils/fecha.ts
// const calcularAntiguedad = (fecha: string) => {
//     const fechaCliente = new Date(fecha);
//     const ahora = new Date();
//     const diffMeses = (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 + (ahora.getMonth() - fechaCliente.getMonth());
//     if (diffMeses < 12) {
//         return `${diffMeses} mes${diffMeses === 1 ? '' : 'es'}`;
//     }
//     const diffAnios = Math.floor(diffMeses / 12);
//     return `${diffAnios} año${diffAnios === 1 ? '' : 's'}`;
// };

// export default function ClienteDetalle() {
//   const { data: session } = useSession();
//   const params = useParams();
//   const clienteId = params.id as string;

//   const [cliente, setCliente] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [notasTemp, setNotasTemp] = useState(""); 
//   const [isSaving, setIsSaving] = useState(false);

//   const fetchCliente = useCallback(async () => {
//     if (!session?.accessToken || !clienteId) {
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         throw new Error("No se pudo cargar la información del cliente.");
//       }
      
//       const clienteData = await res.json();
//       setCliente(clienteData);
//       setNotasTemp(clienteData.notes || "");
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session, clienteId]);
  
//   useEffect(() => {
//     if (session) {
//       fetchCliente();
//     }
//   }, [session, fetchCliente]);

//   const handleGuardarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsSaving(true);

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${session.accessToken}`,
//         },
//         body: JSON.stringify({ notes: notasTemp }),
//       });

//       if (!res.ok) {
//         throw new Error("No se pudieron guardar las notas.");
//       }

//       setCliente(prev => prev ? { ...prev, notes: notasTemp } : null);
//       setNotasTemp("");
//       toast.success("¡Notas guardadas con éxito!");
      
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Error al guardar las notas.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   const handleEliminarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsSaving(true);

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${session.accessToken}`,
//         },
//         body: JSON.stringify({ notes: null }),
//       });

//       if (!res.ok) {
//         throw new Error("No se pudieron eliminar las notas.");
//       }

//       setCliente(prev => prev ? { ...prev, notes: "" } : null);
//       setNotasTemp("");
//       toast.success("¡Notas eliminadas con éxito!");
      
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Error al eliminar las notas.");
//     } finally {
//       setIsSaving(false);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando cliente...</p>
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
  
//   if (!cliente) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-yellow-500" />
//         <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
//         <p className="text-foreground/70">Parece que este cliente no existe o ya no está disponible.</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4"><Button>Volver a la lista</Button></Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">{cliente.name}</h2>
//           <p className="text-sm text-foreground/70">{cliente.email}</p>
//         </div>
//         <Link href={PATHROUTES.pymes.clientes}>
//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </Link>
//       </div>

//       {/* Grid principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Información de contacto */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <h2 className="text-lg font-semibold">Información de Contacto</h2>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Phone className="w-4 h-4 text-primary" /> {cliente.phone}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Mail className="w-4 h-4 text-primary" /> {cliente.email}
//           </p>
//           <p className="text-sm text-foreground/60">
//             Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()}{" "}
//             <br/>
//             <span className="italic">({calcularAntiguedad(cliente.memberSince)})</span>
//           </p>
//         </Card>

//         {/* Historial de compras */}
//         <Card isClickable={false} className="lg:col-span-2 p-4">
//           <h2 className="text-lg font-semibold mb-4">Historial de compras</h2>
//           <p className="text-foreground/60">El historial de compras se mostrará aquí una vez que la API lo proporcione.</p>
//         </Card>
//       </div>

//       {/* Notas internas */}
//       <Card isClickable={false} className="p-4 space-y-4">
//         <h2 className="text-lg font-semibold">Notas internas</h2>
        
//         <textarea
//           className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
//           rows={4}
//           value={notasTemp}
//           onChange={(e) => setNotasTemp(e.target.value)}
//           placeholder="Añade notas importantes sobre este cliente..."
//         />

//         <div className="flex justify-end gap-2">
//           <Button onClick={handleGuardarNotas} disabled={isSaving || !notasTemp.trim()}>
//             {isSaving ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
//               </>
//             ) : (
//               <>
//                 <Check className="mr-2 h-4 w-4" /> Guardar
//               </>
//             )}
//           </Button>
//           <Button onClick={handleEliminarNotas} variant="danger" disabled={!cliente?.notes && !notasTemp}>
//             <Trash2 className="h-4 w-4" /> Eliminar
//           </Button>
//         </div>

//         {cliente?.notes && (
//           <div className="border-t border-border pt-4">
//             <h3 className="font-medium flex items-center gap-2 mb-2">
//               <StickyNote className="w-4 h-4 text-primary" /> Nota publicada
//             </h3>
//             <p className="text-sm text-foreground/80 whitespace-pre-wrap">{cliente.notes}</p>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Phone, Mail, ArrowLeft, Check, Loader2, StickyNote, Trash2, AlertTriangle } from "lucide-react";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// // Esta función es para tu lógica de negocio, asumimos que está en el archivo utils/fecha.ts
// const calcularAntiguedad = (fecha: string) => {
//     const fechaCliente = new Date(fecha);
//     const ahora = new Date();
//     const diffMeses = (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 + (ahora.getMonth() - fechaCliente.getMonth());
//     if (diffMeses < 12) {
//         return `${diffMeses} mes${diffMeses === 1 ? '' : 'es'}`;
//     }
//     const diffAnios = Math.floor(diffMeses / 12);
//     return `${diffAnios} año${diffAnios === 1 ? '' : 's'}`;
// };

// export default function ClienteDetalle() {
//   const { data: session } = useSession();
//   const params = useParams();
//   const clienteId = params.id as string;

//   const [cliente, setCliente] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [notas, setNotas] = useState("");
//   const [isPublishing, setIsPublishing] = useState(false);

//   // 🟢 CORRECCIÓN CLAVE: Función para obtener los datos de un cliente
//   const fetchCliente = useCallback(async () => {
//     if (!session?.accessToken || !clienteId) {
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         throw new Error("No se pudo cargar la información del cliente.");
//       }
      
//       const clienteData = await res.json();
//       setCliente(clienteData);
//       // setNotas(clienteData.notes || "");
//       setNotas(clienteData.notes);
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session, clienteId]);
  
//   // 🟢 CORRECCIÓN CLAVE: Hook para llamar al fetch cuando el componente se monta
//   useEffect(() => {
//     if (session) {
//       fetchCliente();
//     }
//   }, [session, fetchCliente]);

// //////////

//   // ... (resto del código)

// const handleGuardarNotas = async () => {
//   if (!cliente || !session?.accessToken) return;
//   setIsPublishing(true);

//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`, {
//       method: 'PUT', // 🟢 Corregido: Usar PUT como indica tu API
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${session.accessToken}`,
//       },
//       // 🟢 Corregido: Enviar todos los datos del cliente, no solo las notas
//       body: JSON.stringify({
//         ...cliente, // Envía una copia de todos los datos del cliente
//         notes: notas, // Y solo actualiza el campo de las notas
//       }),
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.message || "No se pudieron guardar las notas.");
//     }

//     toast.success("¡Notas guardadas con éxito!");
    
//   } catch (error) {
//     toast.error(error instanceof Error ? error.message : "Error al guardar las notas.");
//   } finally {
//     setIsPublishing(false);
//   }
// };

// const handleEliminarNotas = async () => {
//   if (!cliente || !session?.accessToken) return;
//   try {
//     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`, {
//       method: 'PUT', // 🟢 Corregido: Usar PUT
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${session.accessToken}`,
//       },
//       // 🟢 Corregido: Enviar todos los datos del cliente y poner notas como nula/vacía
//       body: JSON.stringify({
//         ...cliente, // Envía una copia de todos los datos del cliente
//         notes: '', // O null, dependiendo de lo que tu API espere para un campo vacío
//       }),
//     });

//     if (!res.ok) {
//       const errorData = await res.json();
//       throw new Error(errorData.message || "No se pudieron eliminar las notas.");
//     }

//     setNotas("");
//     toast.success("¡Notas eliminadas con éxito!");
    
//   } catch (error) {
//     toast.error(error instanceof Error ? error.message : "Error al eliminar las notas.");
//   }
// };

// //////////

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando cliente...</p>
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
  
//   if (!cliente) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-yellow-500" />
//         <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
//         <p className="text-foreground/70">Parece que este cliente no existe o ya no está disponible.</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4"><Button>Volver a la lista</Button></Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">{cliente.name}</h2>
//           <p className="text-sm text-foreground/70">{cliente.email}</p>
//         </div>
//         <Link href={PATHROUTES.pymes.clientes}>
//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </Link>
//       </div>

//       {/* Grid principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Información de contacto */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <h2 className="text-lg font-semibold">Información de Contacto</h2>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Phone className="w-4 h-4 text-primary" /> {cliente.phone}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Mail className="w-4 h-4 text-primary" /> {cliente.email}
//           </p>
//           <p className="text-sm text-foreground/60">
//             Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()}{" "}
//             <br/>
//             <span className="italic">({calcularAntiguedad(cliente.memberSince)})</span>
//           </p>
//           {/* Aquí puedes añadir lógica para el gasto total si la API la proporciona */}
//           {/* <p className="font-semibold text-foreground/90">💰 Gasto total: €{cliente.gastoTotal.toFixed(2)}</p> */}
//         </Card>

//         {/* Historial de compras (Este componente necesita la data de compras) */}
//         {/* Como la API de customers no la devuelve, esta sección debe cargarse por separado. */}
//         {/* Por ahora, la dejamos con un placeholder */}
//         <Card isClickable={false} className="lg:col-span-2 p-4">
//           <h2 className="text-lg font-semibold mb-4">Historial de compras</h2>
//           <p className="text-foreground/60">El historial de compras se mostrará aquí una vez que la API lo proporcione.</p>
//         </Card>
//       </div>

//       {/* Notas internas */}
//       <Card isClickable={false} className="p-4 space-y-4">
//         <h2 className="text-lg font-semibold">Notas internas</h2>
        
//         <textarea
//           className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
//           rows={4}
//           value={notas}
//           onChange={(e) => setNotas(e.target.value)}
//           placeholder="Añade notas importantes sobre este cliente..."
//         />

//         <div className="flex justify-end gap-2">
//           <Button onClick={handleGuardarNotas} disabled={isPublishing || !notas.trim()} >
//             {isPublishing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
//               </>
//             ) : (
//               <>
//                 <Check className="mr-2 h-4 w-4" /> Guardar
//               </>
//             )}
//           </Button>
//           <Button onClick={handleEliminarNotas} variant="danger"  disabled={!notas}>
//             <Trash2 className="h-4 w-4" /> Eliminar
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Phone, Mail, ArrowLeft, Check, Loader2, StickyNote, Trash2, AlertTriangle } from "lucide-react";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// // Esta función es para tu lógica de negocio, asumimos que está en el archivo utils/fecha.ts
// const calcularAntiguedad = (fecha: string) => {
//     const fechaCliente = new Date(fecha);
//     const ahora = new Date();
//     const diffMeses = (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 + (ahora.getMonth() - fechaCliente.getMonth());
//     if (diffMeses < 12) {
//         return `${diffMeses} mes${diffMeses === 1 ? '' : 'es'}`;
//     }
//     const diffAnios = Math.floor(diffMeses / 12);
//     return `${diffAnios} año${diffAnios === 1 ? '' : 's'}`;
// };

// export default function ClienteDetalle() {
//   const { data: session } = useSession();
//   const params = useParams();
//   const clienteId = params.id as string;

//   const [cliente, setCliente] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [notas, setNotas] = useState("");
//   const [isPublishing, setIsPublishing] = useState(false);

//   // 🟢 CORRECCIÓN CLAVE: Función para obtener los datos de un cliente
//   const fetchCliente = useCallback(async () => {
//     if (!session?.accessToken || !clienteId) {
//       setLoading(false);
//       return;
//     }
    
//     try {
//       setLoading(true);
//       setError(null);
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`, {
//         headers: { 'Authorization': `Bearer ${session.accessToken}` },
//       });

//       if (!res.ok) {
//         throw new Error("No se pudo cargar la información del cliente.");
//       }
      
//       const clienteData = await res.json();
//       setCliente(clienteData);
//       setNotas(clienteData.notes || "");
      
//     } catch (err) {
//       setError(err instanceof Error ? err.message : 'Ocurrió un error inesperado.');
//     } finally {
//       setLoading(false);
//     }
//   }, [session, clienteId]);
  
//   // 🟢 CORRECCIÓN CLAVE: Hook para llamar al fetch cuando el componente se monta
//   useEffect(() => {
//     if (session) {
//       fetchCliente();
//     }
//   }, [session, fetchCliente]);

//   const handleGuardarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${session.accessToken}`,
//         },
//         body: JSON.stringify({
//           ...cliente,
//           notes: notas
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "No se pudieron guardar las notas.");
//       }

//       toast.success("¡Notas guardadas con éxito!");
      
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Error al guardar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   const handleEliminarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     try {
//       const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${session.accessToken}`,
//         },
//         body: JSON.stringify({ 
//             ...cliente,
//             notes: "" 
//         }),
//       });

//       if (!res.ok) {
//         const errorData = await res.json();
//         throw new Error(errorData.message || "No se pudieron eliminar las notas.");
//       }

//       setNotas("");
//       toast.success("¡Notas eliminadas con éxito!");
      
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Error al eliminar las notas.");
//     }
//   };

//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando cliente...</p>
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
  
//   if (!cliente) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-yellow-500" />
//         <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
//         <p className="text-foreground/70">Parece que este cliente no existe o ya no está disponible.</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4"><Button>Volver a la lista</Button></Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">{cliente.name}</h2>
//           <p className="text-sm text-foreground/70">{cliente.email}</p>
//         </div>
//         <Link href={PATHROUTES.pymes.clientes}>
//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </Link>
//       </div>

//       {/* Grid principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Información de contacto */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <h2 className="text-lg font-semibold">Información de Contacto</h2>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Phone className="w-4 h-4 text-primary" /> {cliente.phone}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Mail className="w-4 h-4 text-primary" /> {cliente.email}
//           </p>
//           <p className="text-sm text-foreground/60">
//             Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()}{" "}
//             <br/>
//             <span className="italic">({calcularAntiguedad(cliente.memberSince)})</span>
//           </p>
//           {/* Aquí puedes añadir lógica para el gasto total si la API la proporciona */}
//           {/* <p className="font-semibold text-foreground/90">💰 Gasto total: €{cliente.gastoTotal.toFixed(2)}</p> */}
//         </Card>

//         {/* Historial de compras (Este componente necesita la data de compras) */}
//         {/* Como la API de customers no la devuelve, esta sección debe cargarse por separado. */}
//         {/* Por ahora, la dejamos con un placeholder */}
//         <Card isClickable={false} className="lg:col-span-2 p-4">
//           <h2 className="text-lg font-semibold mb-4">Historial de compras</h2>
//           <p className="text-foreground/60">El historial de compras se mostrará aquí una vez que la API lo proporcione.</p>
//         </Card>
//       </div>

//       {/* Notas internas */}
//       <Card isClickable={false} className="p-4 space-y-4">
//         <h2 className="text-lg font-semibold">Notas internas</h2>
        
//         <textarea
//           className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
//           rows={4}
//           value={notas}
//           onChange={(e) => setNotas(e.target.value)}
//           placeholder="Añade notas importantes sobre este cliente..."
//         />

//         <div className="flex justify-end gap-2">
//           <Button onClick={handleGuardarNotas} disabled={isPublishing || !notas.trim()} >
//             {isPublishing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
//               </>
//             ) : (
//               <>
//                 <Check className="mr-2 h-4 w-4" /> Guardar
//               </>
//             )}
//           </Button>
//           <Button onClick={handleEliminarNotas} variant="danger"  disabled={!notas}>
//             <Trash2 className="h-4 w-4" /> Eliminar
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// }
////////////Funciona 17 sept//////////////////
// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import { Phone, Mail, ArrowLeft, Check, Loader2, Trash2, AlertTriangle } from "lucide-react";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from '@/constants/pathroutes';
// import { Customer } from '@/types/customer';

// // 🔹 Calcula antigüedad de cliente
// const calcularAntiguedad = (fecha: string) => {
//   const fechaCliente = new Date(fecha);
//   const ahora = new Date();
//   const diffMeses =
//     (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 +
//     (ahora.getMonth() - fechaCliente.getMonth());
//   if (diffMeses < 12) {
//     return `${diffMeses} mes${diffMeses === 1 ? "" : "es"}`;
//   }
//   const diffAnios = Math.floor(diffMeses / 12);
//   return `${diffAnios} año${diffAnios === 1 ? "" : "s"}`;
// };

// export default function ClienteDetalle() {
//   const { data: session } = useSession();
//   const params = useParams();
//   const clienteId = params.id as string;

//   const [cliente, setCliente] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [notas, setNotas] = useState("");
//   const [isPublishing, setIsPublishing] = useState(false);

//   // 🔹 Fetch cliente
//   const fetchCliente = useCallback(async () => {
//     if (!session?.accessToken || !clienteId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("No se pudo cargar la información del cliente.");
//       }

//       const clienteData = await res.json();
//       setCliente(clienteData);
//       setNotas(clienteData.notes || "");
//     } catch (err) {
//       setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
//     } finally {
//       setLoading(false);
//     }
//   }, [session, clienteId]);

//   useEffect(() => {
//     if (session) {
//       fetchCliente();
//     }
//   }, [session, fetchCliente]);

//   // 🔹 Guardar notas
//   const handleGuardarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = {
//       name: cliente.name,
//       email: cliente.email,
//       phone: cliente.phone,
//       memberSince: cliente.memberSince, // 👈 debe ser string ISO válido
//       notes: notas,
//       companyId: cliente.companyId,
//     };

//     console.log("📤 Payload enviado (guardar notas):", payload);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.message || "No se pudieron guardar las notas.");
//       }

//       toast.success("¡Notas guardadas con éxito!");
//       setCliente({ ...cliente, notes: notas });
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Error al guardar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Eliminar notas
//   const handleEliminarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;

//     const payload = {
//       name: cliente.name,
//       email: cliente.email,
//       phone: cliente.phone,
//       memberSince: cliente.memberSince,
//       notes: "",
//       companyId: cliente.companyId,
//     };

//     console.log("📤 Payload enviado (eliminar notas):", payload);

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) {
//         const errorData = await res.json().catch(() => ({}));
//         throw new Error(errorData.message || "No se pudieron eliminar las notas.");
//       }

//       setNotas("");
//       setCliente({ ...cliente, notes: "" });
//       toast.success("¡Notas eliminadas con éxito!");
//     } catch (error) {
//       toast.error(error instanceof Error ? error.message : "Error al eliminar las notas.");
//     }
//   };

//   // 🔹 Loading
//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando cliente...</p>
//       </div>
//     );
//   }

//   // 🔹 Error
//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   // 🔹 Cliente no encontrado
//   if (!cliente) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-yellow-500" />
//         <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
//         <p className="text-foreground/70">
//           Parece que este cliente no existe o ya no está disponible.
//         </p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4">
//           <Button>Volver a la lista</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">{cliente.name}</h2>
//           <p className="text-sm text-foreground/70">{cliente.email}</p>
//         </div>
//         <Link href={PATHROUTES.pymes.clientes}>
//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </Link>
//       </div>

//       {/* Grid principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Información de contacto */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <h2 className="text-lg font-semibold">Información de Contacto</h2>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Phone className="w-4 h-4 text-primary" /> {cliente.phone}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Mail className="w-4 h-4 text-primary" /> {cliente.email}
//           </p>
//           <p className="text-sm text-foreground/60">
//             Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()} <br />
//             <span className="italic">
//               ({calcularAntiguedad(cliente.memberSince)})
//             </span>
//           </p>
//         </Card>

//         {/* Placeholder historial compras */}
//         <Card isClickable={false} className="lg:col-span-2 p-4">
//           <h2 className="text-lg font-semibold mb-4">Historial de compras</h2>
//           <p className="text-foreground/60">
//             El historial de compras se mostrará aquí una vez que la API lo
//             proporcione.
//           </p>
//         </Card>
//       </div>

//       {/* Notas internas */}
//       <Card isClickable={false} className="p-4 space-y-4">
//         <h2 className="text-lg font-semibold">Notas internas</h2>

//         <textarea
//           className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
//           rows={4}
//           value={notas}
//           onChange={(e) => setNotas(e.target.value)}
//           placeholder="Añade notas importantes sobre este cliente..."
//         />

//         <div className="flex justify-end gap-2">
//           <Button onClick={handleGuardarNotas} disabled={isPublishing || !notas.trim()}>
//             {isPublishing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
//               </>
//             ) : (
//               <>
//                 <Check className="mr-2 h-4 w-4" /> Guardar
//               </>
//             )}
//           </Button>
//           <Button onClick={handleEliminarNotas} variant="danger" disabled={!notas}>
//             <Trash2 className="h-4 w-4" /> Eliminar
//           </Button>
//         </div>
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import {
//   Phone,
//   Mail,
//   ArrowLeft,
//   Check,
//   Loader2,
//   Trash2,
//   AlertTriangle,
//   StickyNote,
//   ShoppingBag,
//   Calendar,
//   DollarSign,
// } from "lucide-react";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from "@/constants/pathroutes";
// import { Customer } from "@/types/customer";

// // Tipos auxiliares
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
//   customerId: string;
//   items: Item[];
// }

// // 🔹 Calcula antigüedad de cliente
// const calcularAntiguedad = (fecha: string) => {
//   const fechaCliente = new Date(fecha);
//   const ahora = new Date();
//   const diffMeses =
//     (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 +
//     (ahora.getMonth() - fechaCliente.getMonth());
//   if (diffMeses < 12) {
//     return `${diffMeses} mes${diffMeses === 1 ? "" : "es"}`;
//   }
//   const diffAnios = Math.floor(diffMeses / 12);
//   return `${diffAnios} año${diffAnios === 1 ? "" : "s"}`;
// };

// export default function ClienteDetalle() {
//   const { data: session } = useSession();
//   const params = useParams();
//   const clienteId = params.id as string;

//   const [cliente, setCliente] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [notas, setNotas] = useState("");
//   const [isPublishing, setIsPublishing] = useState(false);

//   // Historial de compras
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);

//   // 🔹 Fetch cliente
//   const fetchCliente = useCallback(async () => {
//     if (!session?.accessToken || !clienteId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("No se pudo cargar la información del cliente.");
//       }

//       const clienteData = await res.json();
//       setCliente(clienteData);
//       setNotas(clienteData.notes || "");
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Ocurrió un error inesperado."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [session, clienteId]);

//   // 🔹 Fetch historial de compras
//   const fetchHistorial = useCallback(async () => {
//     if (!session?.accessToken || !session.user?.companyId) return;

//     try {
//       // Productos
//       const productsRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       const productsData: Product[] = await productsRes.json();
//       setProducts(productsData);

//       // Órdenes
//       const ordersRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/orders/company/${session.user.companyId}`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       if (!ordersRes.ok) throw new Error("No se pudieron cargar las compras.");
//       const ordersData: Order[] = await ordersRes.json();

//       // Filtrar por cliente
//       const filtered = ordersData.filter((o) => o.customerId === clienteId);

//       // Enriquecer con productos
//       const enriched = filtered.map((order) => ({
//         ...order,
//         items: order.items.map((item) => ({
//           ...item,
//           product: productsData.find((p) => p.id === item.productId),
//         })),
//       }));

//       setOrders(enriched);
//     } catch (err) {
//       toast.error("Error cargando historial de compras.");
//     }
//   }, [session, clienteId]);

//   useEffect(() => {
//     if (session) {
//       fetchCliente();
//       fetchHistorial();
//     }
//   }, [session, fetchCliente, fetchHistorial]);

//   // 🔹 Guardar notas
//   const handleGuardarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = { ...cliente, notes: notas };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("No se pudieron guardar las notas.");

//       let updatedCliente: Customer;
//       try {
//         updatedCliente = await res.json();
//       } catch {
//         updatedCliente = { ...cliente, notes: notas };
//       }

//       setCliente(updatedCliente);
//       setNotas("");
//       toast.success("¡Notas guardadas con éxito!");
//     } catch (error) {
//       toast.error("Error al guardar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Eliminar notas
//   const handleEliminarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = { ...cliente, notes: "" };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("No se pudieron eliminar las notas.");

//       let updatedCliente: Customer;
//       try {
//         updatedCliente = await res.json();
//       } catch {
//         updatedCliente = { ...cliente, notes: "" };
//       }

//       setCliente(updatedCliente);
//       setNotas("");
//       toast.success("¡Notas eliminadas con éxito!");
//     } catch (error) {
//       toast.error("Error al eliminar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Calcular total orden
//   const calculateTotal = (items: Item[]) =>
//     items.reduce(
//       (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
//       0
//     );

//   // 🔹 Loading
//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando cliente...</p>
//       </div>
//     );
//   }

//   // 🔹 Error
//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   if (!cliente) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-yellow-500" />
//         <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4">
//           <Button>Volver a la lista</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <h2 className="text-2xl font-bold text-foreground">{cliente.name}</h2>
//           <p className="text-sm text-foreground/70">{cliente.email}</p>
//         </div>
//         <Link href={PATHROUTES.pymes.clientes}>
//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </Link>
//       </div>

//       {/* Grid principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Información de contacto */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <h2 className="text-lg font-semibold">Información de Contacto</h2>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Phone className="w-4 h-4 text-primary" /> {cliente.phone}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Mail className="w-4 h-4 text-primary" /> {cliente.email}
//           </p>
//           <p className="text-sm text-foreground/60">
//             Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()} <br />
//             <span className="italic">
//               ({calcularAntiguedad(cliente.memberSince)})
//             </span>
//           </p>
//         </Card>

//         {/* Historial compras */}
//         <Card isClickable={false} className="lg:col-span-2 p-4">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <ShoppingBag className="h-5 w-5" /> Historial de compras
//           </h2>
//           {orders.length === 0 ? (
//             <p className="text-foreground/60 text-sm">
//               Este cliente no tiene compras registradas.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead className="bg-background border-b border-border">
//                   <tr>
//                     <th className="p-3">Fecha</th>
//                     <th className="p-3">Productos</th>
//                     <th className="p-3">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => (
//                     <tr key={order.id} className="border-b border-border">
//                       <td className="p-3">
//                         <Calendar className="inline h-4 w-4 mr-1" />
//                         {new Date(order.date).toLocaleDateString()}
//                       </td>
//                       <td className="p-3">
//                         {order.items.length > 0
//                           ? order.items
//                               .map(
//                                 (i) =>
//                                   `${i.product?.name || "Producto"} (${i.quantity})`
//                               )
//                               .join(", ")
//                           : "N/A"}
//                       </td>
//                       <td className="p-3 font-semibold flex items-center gap-1">
//                         <DollarSign className="h-4 w-4" />
//                         ${calculateTotal(order.items).toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card>
//       </div>

//       {/* Notas internas */}
//       <Card isClickable={false} className="p-4 space-y-4">
//         <h2 className="text-lg font-semibold">Notas internas</h2>

//         <textarea
//           className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
//           rows={4}
//           value={notas}
//           onChange={(e) => setNotas(e.target.value)}
//           placeholder="Añade notas importantes sobre este cliente..."
//         />

//         <div className="flex justify-end gap-2">
//           <Button
//             onClick={handleGuardarNotas}
//             disabled={isPublishing || !notas.trim()}
//           >
//             {isPublishing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
//               </>
//             ) : (
//               <>
//                 <Check className="mr-2 h-4 w-4" /> Guardar
//               </>
//             )}
//           </Button>
//           <Button
//             onClick={handleEliminarNotas}
//             variant="danger"
//             disabled={!cliente.notes}
//           >
//             <Trash2 className="h-4 w-4" /> Eliminar
//           </Button>
//         </div>

//         {cliente.notes && (
//           <div className="border-t border-border pt-4">
//             <h3 className="font-medium flex items-center gap-2 mb-2">
//               <StickyNote className="w-4 h-4 text-primary" /> Nota publicada
//             </h3>
//             <p className="text-sm text-foreground/80 whitespace-pre-wrap">
//               {cliente.notes}
//             </p>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import {
//   Phone,
//   Mail,
//   ArrowLeft,
//   Check,
//   Loader2,
//   Trash2,
//   AlertTriangle,
//   StickyNote,
//   ShoppingBag,
//   Calendar,
//   DollarSign,
//   User,
// } from "lucide-react";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from "@/constants/pathroutes";
// import { Customer } from "@/types/customer";

// // Tipos auxiliares
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
//   customerId: string;
//   items: Item[];
// }

// // 🔹 Calcula antigüedad de cliente
// const calcularAntiguedad = (fecha: string) => {
//   const fechaCliente = new Date(fecha);
//   const ahora = new Date();
//   const diffMeses =
//     (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 +
//     (ahora.getMonth() - fechaCliente.getMonth());
//   if (diffMeses < 12) {
//     return `${diffMeses} mes${diffMeses === 1 ? "" : "es"}`;
//   }
//   const diffAnios = Math.floor(diffMeses / 12);
//   return `${diffAnios} año${diffAnios === 1 ? "" : "s"}`;
// };

// export default function ClienteDetalle() {
//   const { data: session } = useSession();
//   const params = useParams();
//   const clienteId = params.id as string;

//   const [cliente, setCliente] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [notas, setNotas] = useState("");
//   const [isPublishing, setIsPublishing] = useState(false);

//   // Historial de compras
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);

//   // 🔹 Fetch cliente
//   const fetchCliente = useCallback(async () => {
//     if (!session?.accessToken || !clienteId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("No se pudo cargar la información del cliente.");
//       }

//       const clienteData = await res.json();
//       setCliente(clienteData);
//       setNotas(clienteData.notes || "");
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Ocurrió un error inesperado."
//       );
//     } finally {
//       setLoading(false);
//     }
//   }, [session, clienteId]);

//   // 🔹 Fetch historial de compras
//   const fetchHistorial = useCallback(async () => {
//     if (!session?.accessToken || !session.user?.companyId) return;

//     try {
//       // Productos
//       const productsRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       const productsData: Product[] = await productsRes.json();
//       setProducts(productsData);

//       // Órdenes
//       const ordersRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/orders/company/${session.user.companyId}`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       if (!ordersRes.ok) throw new Error("No se pudieron cargar las compras.");
//       const ordersData: Order[] = await ordersRes.json();

//       // Filtrar por cliente
//       const filtered = ordersData.filter((o) => o.customerId === clienteId);

//       // Enriquecer con productos
//       const enriched = filtered.map((order) => ({
//         ...order,
//         items: order.items.map((item) => ({
//           ...item,
//           product: productsData.find((p) => p.id === item.productId),
//         })),
//       }));

//       setOrders(enriched);
//     } catch (err) {
//       toast.error("Error cargando historial de compras.");
//     }
//   }, [session, clienteId]);

//   useEffect(() => {
//     if (session) {
//       fetchCliente();
//       fetchHistorial();
//     }
//   }, [session, fetchCliente, fetchHistorial]);

//   // 🔹 Guardar notas
//   const handleGuardarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = { ...cliente, notes: notas };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("No se pudieron guardar las notas.");

//       let updatedCliente: Customer;
//       try {
//         updatedCliente = await res.json();
//       } catch {
//         updatedCliente = { ...cliente, notes: notas };
//       }

//       setCliente(updatedCliente);
//       setNotas("");
//       toast.success("¡Notas guardadas con éxito!");
//     } catch {
//       toast.error("Error al guardar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Eliminar notas
//   const handleEliminarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = { ...cliente, notes: "" };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("No se pudieron eliminar las notas.");

//       let updatedCliente: Customer;
//       try {
//         updatedCliente = await res.json();
//       } catch {
//         updatedCliente = { ...cliente, notes: "" };
//       }

//       setCliente(updatedCliente);
//       setNotas("");
//       toast.success("¡Notas eliminadas con éxito!");
//     } catch {
//       toast.error("Error al eliminar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Calcular total orden
//   const calculateTotal = (items: Item[]) =>
//     items.reduce(
//       (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
//       0
//     );

//   // 🔹 Loading
//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando cliente...</p>
//       </div>
//     );
//   }

//   // 🔹 Error
//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   if (!cliente) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-yellow-500" />
//         <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4">
//           <Button>Volver a la lista</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="bg-primary/10 p-3 rounded-full">
//             <User className="h-6 w-6 text-primary" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-foreground">{cliente.name}</h2>
//             <p className="text-sm text-foreground/70">{cliente.email}</p>
//           </div>
//         </div>
//         <Link href={PATHROUTES.pymes.clientes}>
//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </Link>
//       </div>

//       {/* Grid principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Información de contacto */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <h2 className="text-lg font-semibold">Información de Contacto</h2>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Phone className="w-4 h-4 text-primary" /> {cliente.phone || "N/A"}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Mail className="w-4 h-4 text-primary" /> {cliente.email || "N/A"}
//           </p>
//           <p className="text-sm text-foreground/60">
//             Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()} <br />
//             <span className="italic">
//               ({calcularAntiguedad(cliente.memberSince)})
//             </span>
//           </p>
//         </Card>

//         {/* Historial compras */}
//         <Card isClickable={false} className="lg:col-span-2 p-4">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <ShoppingBag className="h-5 w-5" /> Historial de compras
//           </h2>
//           {orders.length === 0 ? (
//             <p className="text-foreground/60 text-sm">
//               Este cliente no tiene compras registradas.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead className="bg-background border-b border-border">
//                   <tr>
//                     <th className="p-3">Fecha</th>
//                     <th className="p-3">Productos</th>
//                     <th className="p-3">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => (
//                     <tr key={order.id} className="border-b border-border">
//                       <td className="p-3">
//                         <Calendar className="inline h-4 w-4 mr-1" />
//                         {new Date(order.date).toLocaleDateString()}
//                       </td>
//                       <td className="p-3">
//                         {order.items.length > 0
//                           ? order.items
//                               .map(
//                                 (i) =>
//                                   `${i.product?.name || "Producto"} (${i.quantity})`
//                               )
//                               .join(", ")
//                           : "N/A"}
//                       </td>
//                       <td className="p-3 font-semibold flex items-center gap-1">
//                         <DollarSign className="h-4 w-4" />
//                         ${calculateTotal(order.items).toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card>
//       </div>

//       {/* Notas internas */}
//       <Card isClickable={false} className="p-4 space-y-4">
//         <h2 className="text-lg font-semibold">Notas internas</h2>

//         <textarea
//           className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
//           rows={4}
//           value={notas}
//           onChange={(e) => setNotas(e.target.value)}
//           placeholder="Añade notas importantes sobre este cliente..."
//         />

//         <div className="flex justify-end gap-2">
//           <Button
//             onClick={handleGuardarNotas}
//             disabled={isPublishing || !notas.trim()}
//           >
//             {isPublishing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
//               </>
//             ) : (
//               <>
//                 <Check className="mr-2 h-4 w-4" /> Guardar
//               </>
//             )}
//           </Button>
//           <Button
//             onClick={handleEliminarNotas}
//             variant="danger"
//             disabled={!cliente.notes}
//           >
//             <Trash2 className="h-4 w-4" /> Eliminar
//           </Button>
//         </div>

//         {cliente.notes && (
//           <div className="border-t border-border pt-4">
//             <h3 className="font-medium flex items-center gap-2 mb-2">
//               <StickyNote className="w-4 h-4 text-primary" /> Nota publicada
//             </h3>
//             <p className="text-sm text-foreground/80 whitespace-pre-wrap">
//               {cliente.notes}
//             </p>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import {
//   Phone,
//   Mail,
//   ArrowLeft,
//   Check,
//   Loader2,
//   Trash2,
//   AlertTriangle,
//   StickyNote,
//   ShoppingBag,
//   Calendar,
//   DollarSign,
//   User,
// } from "lucide-react";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from "@/constants/pathroutes";
// import { Customer } from "@/types/customer";

// // Tipos auxiliares
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
//   customerId: string; // CLAVE: Identificador del cliente
//   items: Item[];
// }

// // 🔹 Calcula antigüedad de cliente
// const calcularAntiguedad = (fecha: string) => {
//   const fechaCliente = new Date(fecha);
//   const ahora = new Date();
//   const diffMeses =
//     (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 +
//     (ahora.getMonth() - fechaCliente.getMonth());
//   if (diffMeses < 12) {
//     return `${diffMeses} mes${diffMeses === 1 ? "" : "es"}`;
//   }
//   const diffAnios = Math.floor(diffMeses / 12);
//   return `${diffAnios} año${diffAnios === 1 ? "" : "s"}`;
// };

// export default function ClienteDetalle() {
//   const { data: session } = useSession();
//   const params = useParams();
//   const clienteId = params.id as string;

//   const [cliente, setCliente] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [notas, setNotas] = useState("");
//   const [isPublishing, setIsPublishing] = useState(false);

//   // Historial de compras
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);

//   // 🔹 Fetch cliente
//   const fetchCliente = useCallback(async () => {
//     if (!session?.accessToken || !clienteId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("No se pudo cargar la información del cliente.");
//       }

//       const clienteData = await res.json();
//       setCliente(clienteData);
//       setNotas(clienteData.notes || "");
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Ocurrió un error inesperado."
//       );
//     } finally {
//       // Se mantiene loading en true para esperar a fetchHistorial
//     }
//   }, [session, clienteId]);

//   // 🔹 Fetch historial de compras
//   const fetchHistorial = useCallback(async () => {
//     if (!session?.accessToken || !session.user?.companyId) return;

//     try {
//       // 1. Productos
//       const productsRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       const productsData: Product[] = await productsRes.json();
//       setProducts(productsData);

//       // 2. Órdenes (CORREGIDO: Usamos /invoices/company/{companyId} para el historial de ventas)
//       const ordersRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${session.user.companyId}`, // <--- ¡ENDPOINT CORREGIDO!
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       if (!ordersRes.ok) throw new Error("No se pudieron cargar las facturas de venta (historial).");
      
//       const ordersData: Order[] = await ordersRes.json();

//       // 3. Filtrar por cliente
//       // Esto funciona si los objetos Invoice devueltos tienen el campo customerId
//       const filtered = ordersData.filter((o) => o.customerId === clienteId);

//       // 4. Enriquecer con productos
//       const enriched = filtered.map((order) => ({
//         ...order,
//         items: order.items.map((item) => ({
//           ...item,
//           product: productsData.find((p) => p.id === item.productId),
//         })),
//       }));

//       setOrders(enriched);
//     } catch (err) {
//       toast.error("Error cargando historial de compras.");
//     } finally {
//       setLoading(false); // <--- El loading general finaliza aquí
//     }
//   }, [session, clienteId]);

//   useEffect(() => {
//     if (session) {
//       fetchCliente();
//       fetchHistorial();
//     }
//   }, [session, fetchCliente, fetchHistorial]);

//   // 🔹 Guardar notas
//   const handleGuardarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = { ...cliente, notes: notas };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("No se pudieron guardar las notas.");

//       let updatedCliente: Customer;
//       try {
//         updatedCliente = await res.json();
//       } catch {
//         updatedCliente = { ...cliente, notes: notas };
//       }

//       setCliente(updatedCliente);
//       toast.success("¡Notas guardadas con éxito!");
//     } catch {
//       toast.error("Error al guardar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Eliminar notas
//   const handleEliminarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = { ...cliente, notes: "" };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("No se pudieron eliminar las notas.");

//       let updatedCliente: Customer;
//       try {
//         updatedCliente = await res.json();
//       } catch {
//         updatedCliente = { ...cliente, notes: "" };
//       }

//       setCliente(updatedCliente);
//       setNotas("");
//       toast.success("¡Notas eliminadas con éxito!");
//     } catch {
//       toast.error("Error al eliminar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Calcular total orden
//   const calculateTotal = (items: Item[]) =>
//     items.reduce(
//       (sum, i) => sum + (i.product?.price ?? 0) * i.quantity,
//       0
//     );

//   // 🔹 Loading
//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando cliente y historial...</p>
//       </div>
//     );
//   }

//   // 🔹 Error
//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//       </div>
//     );
//   }

//   if (!cliente) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-yellow-500" />
//         <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4">
//           <Button>Volver a la lista</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="bg-primary/10 p-3 rounded-full">
//             <User className="h-6 w-6 text-primary" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-foreground">{cliente.name}</h2>
//             <p className="text-sm text-foreground/70">{cliente.email}</p>
//           </div>
//         </div>
//         <Link href={PATHROUTES.pymes.clientes}>
//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </Link>
//       </div>

//       {/* Grid principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Información de contacto */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <h2 className="text-lg font-semibold">Información de Contacto</h2>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Phone className="w-4 h-4 text-primary" /> {cliente.phone || "N/A"}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Mail className="w-4 h-4 text-primary" /> {cliente.email || "N/A"}
//           </p>
//           <p className="text-sm text-foreground/60">
//             Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()} <br />
//             <span className="italic">
//               ({calcularAntiguedad(cliente.memberSince)})
//             </span>
//           </p>
//         </Card>

//         {/* Historial compras */}
//         <Card isClickable={false} className="lg:col-span-2 p-4">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <ShoppingBag className="h-5 w-5" /> Historial de compras
//           </h2>
//           {orders.length === 0 ? (
//             <p className="text-foreground/60 text-sm">
//               Este cliente no tiene compras registradas.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead className="bg-background border-b border-border">
//                   <tr>
//                     <th className="p-3">Fecha</th>
//                     <th className="p-3">Productos</th>
//                     <th className="p-3">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => (
//                     <tr key={order.id} className="border-b border-border">
//                       <td className="p-3">
//                         <Calendar className="inline h-4 w-4 mr-1" />
//                         {new Date(order.date).toLocaleDateString()}
//                       </td>
//                       <td className="p-3">
//                         {order.items.length > 0
//                           ? order.items
//                               .map(
//                                 (i) =>
//                                   `${i.product?.name || "Producto"} (${i.quantity})`
//                               )
//                               .join(", ")
//                           : "N/A"}
//                       </td>
//                       <td className="p-3 font-semibold flex items-center gap-1">
//                         <DollarSign className="h-4 w-4" />
//                         ${calculateTotal(order.items).toFixed(2)}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card>
//       </div>

//       {/* Notas internas */}
//       <Card isClickable={false} className="p-4 space-y-4">
//         <h2 className="text-lg font-semibold">Notas internas</h2>

//         <textarea
//           className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
//           rows={4}
//           value={notas}
//           onChange={(e) => setNotas(e.target.value)}
//           placeholder="Añade notas importantes sobre este cliente..."
//         />

//         <div className="flex justify-end gap-2">
//           <Button
//             onClick={handleGuardarNotas}
//             disabled={isPublishing || !notas.trim()}
//           >
//             {isPublishing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
//               </>
//             ) : (
//               <>
//                 <Check className="mr-2 h-4 w-4" /> Guardar
//               </>
//             )}
//           </Button>
//           <Button
//             onClick={handleEliminarNotas}
//             variant="danger"
//             disabled={!cliente.notes}
//           >
//             <Trash2 className="h-4 w-4" /> Eliminar
//           </Button>
//         </div>

//         {cliente.notes && (
//           <div className="border-t border-border pt-4">
//             <h3 className="font-medium flex items-center gap-2 mb-2">
//               <StickyNote className="w-4 h-4 text-primary" /> Nota publicada
//             </h3>
//             <p className="text-sm text-foreground/80 whitespace-pre-wrap">
//               {cliente.notes}
//             </p>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }


// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import {
//   Phone,
//   Mail,
//   ArrowLeft,
//   Check,
//   Loader2,
//   Trash2,
//   AlertTriangle,
//   StickyNote,
//   ShoppingBag,
//   Calendar,
//   DollarSign,
//   User,
// } from "lucide-react";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from "@/constants/pathroutes";
// import { Customer } from "@/types/customer";

// // Tipos auxiliares
// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// interface Item {
//   productId: string;
//   quantity: number; // Podría ser undefined o null si el endpoint /invoices tiene una estructura diferente
//   product?: Product;
// }

// interface Order {
//   id: string;
//   issueDate: string; // <-- CAMBIADO DE 'date' a 'issueDate' (nombre común en APIs de facturas)
//   customerId: string;
//   items: Item[];
// }

// // 🔹 Calcula antigüedad de cliente
// const calcularAntiguedad = (fecha: string) => {
//   const fechaCliente = new Date(fecha);
//   const ahora = new Date();
//   const diffMeses =
//     (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 +
//     (ahora.getMonth() - fechaCliente.getMonth());
//   if (diffMeses < 12) {
//     return `${diffMeses} mes${diffMeses === 1 ? "" : "es"}`;
//   }
//   const diffAnios = Math.floor(diffMeses / 12);
//   return `${diffAnios} año${diffAnios === 1 ? "" : "s"}`;
// };

// export default function ClienteDetalle() {
//   const { data: session } = useSession();
//   const params = useParams();
//   const clienteId = params.id as string;

//   const [cliente, setCliente] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [notas, setNotas] = useState("");
//   const [isPublishing, setIsPublishing] = useState(false);

//   // Historial de compras
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);

//   // 🔹 Fetch cliente
//   const fetchCliente = useCallback(async () => {
//     if (!session?.accessToken || !clienteId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("No se pudo cargar la información del cliente.");
//       }

//       const clienteData = await res.json();
//       setCliente(clienteData);
//       setNotas(clienteData.notes || "");
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Ocurrió un error inesperado."
//       );
//     } 
//     // NOTA: Se ha quitado el setLoading(false) de aquí para que se ejecute una vez cargue el historial también.
//   }, [session, clienteId]);

//   // 🔹 Fetch historial de compras (CORREGIDO el ENDPOINT)
//   const fetchHistorial = useCallback(async () => {
//     if (!session?.accessToken || !session.user?.companyId) return;

//     try {
//       // Productos
//       const productsRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       const productsData: Product[] = await productsRes.json();
//       setProducts(productsData);

//       // Órdenes (Ahora Facturas/Ventas)
//       const ordersRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${session.user.companyId}`, // <--- ¡ENDPOINT CORREGIDO!
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       if (!ordersRes.ok) throw new Error("No se pudieron cargar las facturas de venta (historial).");
//       const ordersData: Order[] = await ordersRes.json();

//       // Filtrar por cliente
//       const filtered = ordersData.filter((o) => o.customerId === clienteId);

//       // Enriquecer con productos
//       const enriched = filtered.map((order) => ({
//         ...order,
//         items: order.items.map((item) => ({
//           ...item,
//           product: productsData.find((p) => p.id === item.productId),
//         })),
//       }));

//       setOrders(enriched);
//     } catch (err) {
//       toast.error("Error cargando historial de compras.");
//     } finally {
//       setLoading(false); // <--- El loading general finaliza aquí (después de ambos fetches)
//     }
//   }, [session, clienteId]);

//   useEffect(() => {
//     if (session) {
//       // Se llama a fetchCliente primero, pero setLoading(false) se ejecuta en fetchHistorial.
//       fetchCliente(); 
//       fetchHistorial();
//     }
//   }, [session, fetchCliente, fetchHistorial]);

//   // 🔹 Guardar notas
//   const handleGuardarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = { ...cliente, notes: notas };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("No se pudieron guardar las notas.");

//       let updatedCliente: Customer;
//       try {
//         updatedCliente = await res.json();
//       } catch {
//         updatedCliente = { ...cliente, notes: notas };
//       }

//       setCliente(updatedCliente);
//       toast.success("¡Notas guardadas con éxito!");
//     } catch {
//       toast.error("Error al guardar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Eliminar notas
//   const handleEliminarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = { ...cliente, notes: "" };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("No se pudieron eliminar las notas.");

//       let updatedCliente: Customer;
//       try {
//         updatedCliente = await res.json();
//       } catch {
//         updatedCliente = { ...cliente, notes: "" };
//       }

//       setCliente(updatedCliente);
//       setNotas("");
//       toast.success("¡Notas eliminadas con éxito!");
//     } catch {
//       toast.error("Error al eliminar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Calcular total orden (Añadida seguridad para cantidad)
//   const calculateTotal = (items: Item[]) =>
//     items.reduce(
//       (sum, i) => sum + (i.product?.price ?? 0) * (i.quantity ?? 0), // Usa 0 si quantity es null/undefined
//       0
//     );

//   // 🔹 Loading
//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando cliente y historial...</p>
//       </div>
//     );
//   }

//   // 🔹 Error
//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4">
//           <Button>Volver a la lista</Button>
//         </Link>
//       </div>
//     );
//   }

//   if (!cliente) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-yellow-500" />
//         <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4">
//           <Button>Volver a la lista</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="bg-primary/10 p-3 rounded-full">
//             <User className="h-6 w-6 text-primary" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-foreground">{cliente.name}</h2>
//             <p className="text-sm text-foreground/70">{cliente.email}</p>
//           </div>
//         </div>
//         <Link href={PATHROUTES.pymes.clientes}>
//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </Link>
//       </div>

//       {/* Grid principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Información de contacto */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <h2 className="text-lg font-semibold">Información de Contacto</h2>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Phone className="w-4 h-4 text-primary" /> {cliente.phone || "N/A"}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Mail className="w-4 h-4 text-primary" /> {cliente.email || "N/A"}
//           </p>
//           <p className="text-sm text-foreground/60">
//             Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()} <br />
//             <span className="italic">
//               ({calcularAntiguedad(cliente.memberSince)})
//             </span>
//           </p>
//         </Card>

//         {/* Historial compras */}
//         <Card isClickable={false} className="lg:col-span-2 p-4">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <ShoppingBag className="h-5 w-5" /> Historial de compras
//           </h2>
//           {orders.length === 0 ? (
//             <p className="text-foreground/60 text-sm">
//               Este cliente no tiene compras registradas.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead className="bg-background border-b border-border">
//                   <tr>
//                     <th className="p-3">Fecha</th>
//                     <th className="p-3">Productos</th>
//                     <th className="p-3">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => {
//                     // Usamos order.issueDate
//                     const orderDate = new Date(order.issueDate); 
//                     const isValidDate = order.issueDate && !isNaN(orderDate.getTime());
                    
//                     return (
//                       <tr key={order.id} className="border-b border-border">
//                         <td className="p-3">
//                           <Calendar className="inline h-4 w-4 mr-1" />
//                           {/* Muestra la fecha o un mensaje si es inválida */}
//                           {isValidDate ? orderDate.toLocaleDateString() : "Fecha no válida"}
//                         </td>
//                         <td className="p-3">
//                           {order.items.length > 0
//                             ? order.items
//                                 .map(
//                                   (i) =>
//                                     // Protección de quantity agregada para evitar '(undefined)'
//                                     `${i.product?.name || "Producto desconocido"} (${i.quantity ?? 0})` 
//                                 )
//                                 .join(", ")
//                             : "N/A"}
//                         </td>
//                         <td className="p-3 font-semibold flex items-center gap-1">
//                           <DollarSign className="h-4 w-4" />
//                           ${calculateTotal(order.items).toFixed(2)}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card>
//       </div>

//       {/* Notas internas */}
//       <Card isClickable={false} className="p-4 space-y-4">
//         <h2 className="text-lg font-semibold">Notas internas</h2>

//         <textarea
//           className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
//           rows={4}
//           value={notas}
//           onChange={(e) => setNotas(e.target.value)}
//           placeholder="Añade notas importantes sobre este cliente..."
//         />

//         <div className="flex justify-end gap-2">
//           <Button
//             onClick={handleGuardarNotas}
//             disabled={isPublishing || !notas.trim()}
//           >
//             {isPublishing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
//               </>
//             ) : (
//               <>
//                 <Check className="mr-2 h-4 w-4" /> Guardar
//               </>
//             )}
//           </Button>
//           <Button
//             onClick={handleEliminarNotas}
//             variant="danger"
//             disabled={!cliente.notes}
//           >
//             <Trash2 className="h-4 w-4" /> Eliminar
//           </Button>
//         </div>

//         {cliente.notes && (
//           <div className="border-t border-border pt-4">
//             <h3 className="font-medium flex items-center gap-2 mb-2">
//               <StickyNote className="w-4 h-4 text-primary" /> Nota publicada
//             </h3>
//             <p className="text-sm text-foreground/80 whitespace-pre-wrap">
//               {cliente.notes}
//             </p>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }

// "use client";

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import {
//   Phone,
//   Mail,
//   ArrowLeft,
//   Check,
//   Loader2,
//   Trash2,
//   AlertTriangle,
//   StickyNote,
//   ShoppingBag,
//   Calendar,
//   DollarSign,
//   User,
// } from "lucide-react";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from "@/constants/pathroutes";
// import { Customer } from "@/types/customer";

// // Tipos auxiliares
// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// interface Item {
//   productId: string;
//   qty: number; // <-- CORREGIDO: Usar 'qty' según el API de facturas
//   product?: Product;
// }

// interface Order {
//   id: string;
//   issuedAt: string; // <-- CORREGIDO: Usar 'issuedAt' en lugar de 'date' o 'issueDate'
//   customerId: string;
//   items: Item[];
// }

// // 🔹 Calcula antigüedad de cliente
// const calcularAntiguedad = (fecha: string) => {
//   const fechaCliente = new Date(fecha);
//   const ahora = new Date();
//   const diffMeses =
//     (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 +
//     (ahora.getMonth() - fechaCliente.getMonth());
//   if (diffMeses < 12) {
//     return `${diffMeses} mes${diffMeses === 1 ? "" : "es"}`;
//   }
//   const diffAnios = Math.floor(diffMeses / 12);
//   return `${diffAnios} año${diffAnios === 1 ? "" : "s"}`;
// };

// export default function ClienteDetalle() {
//   const { data: session } = useSession();
//   const params = useParams();
//   const clienteId = params.id as string;

//   const [cliente, setCliente] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [notas, setNotas] = useState("");
//   const [isPublishing, setIsPublishing] = useState(false);

//   // Historial de compras
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);

//   // 🔹 Fetch cliente
//   const fetchCliente = useCallback(async () => {
//     if (!session?.accessToken || !clienteId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("No se pudo cargar la información del cliente.");
//       }

//       const clienteData = await res.json();
//       setCliente(clienteData);
//       setNotas(clienteData.notes || "");
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Ocurrió un error inesperado."
//       );
//     } 
//     // NOTA: Se ha quitado el setLoading(false) de aquí para que se ejecute una vez cargue el historial también.
//   }, [session, clienteId]);

//   // 🔹 Fetch historial de compras (CORREGIDO el ENDPOINT)
//   const fetchHistorial = useCallback(async () => {
//     if (!session?.accessToken || !session.user?.companyId) return;

//     try {
//       // Productos
//       const productsRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       const productsData: Product[] = await productsRes.json();
//       setProducts(productsData);

//       // Órdenes (Ahora Facturas/Ventas)
//       const ordersRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${session.user.companyId}`, // <--- ¡ENDPOINT CORREGIDO!
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       if (!ordersRes.ok) throw new Error("No se pudieron cargar las facturas de venta (historial).");
//       const ordersData: Order[] = await ordersRes.json();

//       // Filtrar por cliente
//       const filtered = ordersData.filter((o) => o.customerId === clienteId);

//       // Enriquecer con productos
//       const enriched = filtered.map((order) => ({
//         ...order,
//         items: order.items.map((item) => ({
//           ...item,
//           product: productsData.find((p) => p.id === item.productId),
//         })),
//       }));

//       setOrders(enriched);
//     } catch (err) {
//       toast.error("Error cargando historial de compras.");
//     } finally {
//       setLoading(false); // <--- El loading general finaliza aquí (después de ambos fetches)
//     }
//   }, [session, clienteId]);

//   useEffect(() => {
//     if (session) {
//       // Se llama a fetchCliente primero, pero setLoading(false) se ejecuta en fetchHistorial.
//       fetchCliente(); 
//       fetchHistorial();
//     }
//   }, [session, fetchCliente, fetchHistorial]);

//   // 🔹 Guardar notas
//   const handleGuardarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = { ...cliente, notes: notas };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("No se pudieron guardar las notas.");

//       let updatedCliente: Customer;
//       try {
//         updatedCliente = await res.json();
//       } catch {
//         updatedCliente = { ...cliente, notes: notas };
//       }

//       setCliente(updatedCliente);
//       toast.success("¡Notas guardadas con éxito!");
//     } catch {
//       toast.error("Error al guardar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Eliminar notas
//   const handleEliminarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = { ...cliente, notes: "" };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("No se pudieron eliminar las notas.");

//       let updatedCliente: Customer;
//       try {
//         updatedCliente = await res.json();
//       } catch {
//         updatedCliente = { ...cliente, notes: "" };
//       }

//       setCliente(updatedCliente);
//       setNotas("");
//       toast.success("¡Notas eliminadas con éxito!");
//     } catch {
//       toast.error("Error al eliminar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Calcular total orden (Usando 'qty')
//   const calculateTotal = (items: Item[]) =>
//     items.reduce(
//       // Usamos i.qty en lugar de i.quantity
//       (sum, i) => sum + (i.product?.price ?? 0) * (i.qty ?? 0), 
//       0
//     );

//   // 🔹 Loading
//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando cliente y historial...</p>
//       </div>
//     );
//   }

//   // 🔹 Error
//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4">
//           <Button>Volver a la lista</Button>
//         </Link>
//       </div>
//     );
//   }

//   if (!cliente) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-yellow-500" />
//         <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4">
//           <Button>Volver a la lista</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           <div className="bg-primary/10 p-3 rounded-full">
//             <User className="h-6 w-6 text-primary" />
//           </div>
//           <div>
//             <h2 className="text-2xl font-bold text-foreground">{cliente.name}</h2>
//             <p className="text-sm text-foreground/70">{cliente.email}</p>
//           </div>
//         </div>
//         <Link href={PATHROUTES.pymes.clientes}>
//           <Button variant="outline" className="gap-2">
//             <ArrowLeft className="h-4 w-4" />
//             Volver
//           </Button>
//         </Link>
//       </div>

//       {/* Grid principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Información de contacto */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <h2 className="text-lg font-semibold">Información de Contacto</h2>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Phone className="w-4 h-4 text-primary" /> {cliente.phone || "N/A"}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Mail className="w-4 h-4 text-primary" /> {cliente.email || "N/A"}
//           </p>
//           <p className="text-sm text-foreground/60">
//             Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()} <br />
//             <span className="italic">
//               ({calcularAntiguedad(cliente.memberSince)})
//             </span>
//           </p>
//         </Card>

//         {/* Historial compras */}
//         <Card isClickable={false} className="lg:col-span-2 p-4">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <ShoppingBag className="h-5 w-5" /> Historial de compras
//           </h2>
//           {orders.length === 0 ? (
//             <p className="text-foreground/60 text-sm">
//               Este cliente no tiene compras registradas.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead className="bg-background border-b border-border">
//                   <tr>
//                     <th className="p-3">Fecha</th>
//                     <th className="p-3">Productos</th>
//                     <th className="p-3">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => {
//                     // Usamos order.issuedAt para la fecha
//                     const orderDate = new Date(order.issuedAt); 
//                     const isValidDate = order.issuedAt && !isNaN(orderDate.getTime());
                    
//                     return (
//                       <tr key={order.id} className="border-b border-border">
//                         <td className="p-3">
//                           <Calendar className="inline h-4 w-4 mr-1" />
//                           {/* Muestra la fecha o un mensaje si es inválida */}
//                           {isValidDate ? orderDate.toLocaleDateString() : "Fecha no válida"}
//                         </td>
//                         <td className="p-3">
//                           {order.items.length > 0
//                             ? order.items
//                                 .map(
//                                   // Usamos i.qty para la cantidad
//                                   (i) =>
//                                     `${i.product?.name || "Producto desconocido"} (${i.qty ?? 0})` 
//                                 )
//                                 .join(", ")
//                             : "N/A"}
//                         </td>
//                         <td className="p-3 font-semibold flex items-center gap-1">
//                           <DollarSign className="h-4 w-4" />
//                           ${calculateTotal(order.items).toFixed(2)}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card>
//       </div>

//       {/* Notas internas */}
//       <Card isClickable={false} className="p-4 space-y-4">
//         <h2 className="text-lg font-semibold">Observaciones internas</h2>

//         <textarea
//           className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
//           rows={4}
//           value={notas}
//           onChange={(e) => setNotas(e.target.value)}
//           placeholder="Añade notas importantes sobre este cliente..."
//         />

//         <div className="flex justify-end gap-2">
//           <Button
//             onClick={handleGuardarNotas}
//             disabled={isPublishing || !notas.trim()}
//           >
//             {isPublishing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
//               </>
//             ) : (
//               <>
//                 <Check className="mr-2 h-4 w-4" /> Guardar
//               </>
//             )}
//           </Button>
//           <Button
//             onClick={handleEliminarNotas}
//             variant="danger"
//             disabled={!cliente.notes}
//           >
//             <Trash2 className="h-4 w-4" /> Eliminar
//           </Button>
//         </div>

//         {cliente.notes && (
//           <div className="border-t border-border pt-4">
//             <h3 className="font-medium flex items-center gap-2 mb-2">
//               <StickyNote className="w-4 h-4 text-primary" /> Observaciones publicada
//             </h3>
//             <p className="text-sm text-foreground/80 whitespace-pre-wrap">
//               {cliente.notes}
//             </p>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }

// 'use client';

// import { useState, useEffect, useCallback } from "react";
// import { useParams } from "next/navigation";
// import { useSession } from "next-auth/react";
// import { Card } from "@/components/ui/Card";
// import { Button } from "@/components/ui/Button";
// import {
//   Phone,
//   Mail,
//   ArrowLeft,
//   Check,
//   Loader2,
//   Trash2,
//   AlertTriangle,
//   StickyNote,
//   ShoppingBag,
//   Calendar,
//   DollarSign,
//   User,
// } from "lucide-react";
// import Link from "next/link";
// import { toast } from "react-hot-toast";
// import { PATHROUTES } from "@/constants/pathroutes";
// import { Customer } from "@/types/customer";

// // Tipos auxiliares
// interface Product {
//   id: string;
//   name: string;
//   price: number;
// }

// interface Item {
//   productId: string;
//   qty: number; // <-- CORREGIDO: Usar 'qty' según el API de facturas
//   product?: Product;
// }

// interface Order {
//   id: string;
//   issuedAt: string; // <-- CORREGIDO: Usar 'issuedAt' en lugar de 'date' o 'issueDate'
//   customerId: string;
//   items: Item[];
// }

// // 🔹 Calcula antigüedad de cliente
// const calcularAntiguedad = (fecha: string) => {
//   const fechaCliente = new Date(fecha);
//   const ahora = new Date();
//   const diffMeses =
//     (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 +
//     (ahora.getMonth() - fechaCliente.getMonth());
//   if (diffMeses < 12) {
//     return `${diffMeses} mes${diffMeses === 1 ? "" : "es"}`;
//   }
//   const diffAnios = Math.floor(diffMeses / 12);
//   return `${diffAnios} año${diffAnios === 1 ? "" : "s"}`;
// };

// export default function ClienteDetalle() {
//   const { data: session } = useSession();
//   const params = useParams();
//   const clienteId = params.id as string;

//   const [cliente, setCliente] = useState<Customer | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [notas, setNotas] = useState("");
//   const [isPublishing, setIsPublishing] = useState(false);

//   // Historial de compras
//   const [orders, setOrders] = useState<Order[]>([]);
//   const [products, setProducts] = useState<Product[]>([]);

//   // 🔹 Fetch cliente
//   const fetchCliente = useCallback(async () => {
//     if (!session?.accessToken || !clienteId) {
//       setLoading(false);
//       return;
//     }

//     try {
//       setLoading(true);
//       setError(null);

//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`,
//         {
//           headers: { Authorization: `Bearer ${session.accessToken}` },
//         }
//       );

//       if (!res.ok) {
//         throw new Error("No se pudo cargar la información del cliente.");
//       }

//       const clienteData = await res.json();
//       setCliente(clienteData);
//       setNotas(clienteData.notes || "");
//     } catch (err) {
//       setError(
//         err instanceof Error ? err.message : "Ocurrió un error inesperado."
//       );
//     } 
//     // NOTA: Se ha quitado el setLoading(false) de aquí para que se ejecute una vez cargue el historial también.
//   }, [session, clienteId]);

//   // 🔹 Fetch historial de compras (CORREGIDO el ENDPOINT)
//   const fetchHistorial = useCallback(async () => {
//     if (!session?.accessToken || !session.user?.companyId) return;

//     try {
//       // Productos
//       const productsRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       const productsData: Product[] = await productsRes.json();
//       setProducts(productsData);

//       // Órdenes (Ahora Facturas/Ventas)
//       const ordersRes = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${session.user.companyId}`, // <--- ¡ENDPOINT CORREGIDO!
//         { headers: { Authorization: `Bearer ${session.accessToken}` } }
//       );
//       if (!ordersRes.ok) throw new Error("No se pudieron cargar las facturas de venta (historial).");
//       const ordersData: Order[] = await ordersRes.json();

//       // Filtrar por cliente
//       const filtered = ordersData.filter((o) => o.customerId === clienteId);

//       // Enriquecer con productos
//       const enriched = filtered.map((order) => ({
//         ...order,
//         items: order.items.map((item) => ({
//           ...item,
//           product: productsData.find((p) => p.id === item.productId),
//         })),
//       }));

//       setOrders(enriched);
//     } catch (err) {
//       toast.error("Error cargando historial de compras.");
//     } finally {
//       setLoading(false); // <--- El loading general finaliza aquí (después de ambos fetches)
//     }
//   }, [session, clienteId]);

//   useEffect(() => {
//     if (session) {
//       // Se llama a fetchCliente primero, pero setLoading(false) se ejecuta en fetchHistorial.
//       fetchCliente(); 
//       fetchHistorial();
//     }
//   }, [session, fetchCliente, fetchHistorial]);

//   // 🔹 Guardar notas
//   const handleGuardarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = { ...cliente, notes: notas };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("No se pudieron guardar las notas.");

//       let updatedCliente: Customer;
//       try {
//         updatedCliente = await res.json();
//       } catch {
//         updatedCliente = { ...cliente, notes: notas };
//       }

//       setCliente(updatedCliente);
//       toast.success("¡Notas guardadas con éxito!");
//     } catch {
//       toast.error("Error al guardar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Eliminar notas
//   const handleEliminarNotas = async () => {
//     if (!cliente || !session?.accessToken) return;
//     setIsPublishing(true);

//     const payload = { ...cliente, notes: "" };

//     try {
//       const res = await fetch(
//         `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
//         {
//           method: "PUT",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${session.accessToken}`,
//           },
//           body: JSON.stringify(payload),
//         }
//       );

//       if (!res.ok) throw new Error("No se pudieron eliminar las notas.");

//       let updatedCliente: Customer;
//       try {
//         updatedCliente = await res.json();
//       } catch {
//         updatedCliente = { ...cliente, notes: "" };
//       }

//       setCliente(updatedCliente);
//       setNotas("");
//       toast.success("¡Notas eliminadas con éxito!");
//     } catch {
//       toast.error("Error al eliminar las notas.");
//     } finally {
//       setIsPublishing(false);
//     }
//   };

//   // 🔹 Calcular total orden (Usando 'qty')
//   const calculateTotal = (items: Item[]) =>
//     items.reduce(
//       // Usamos i.qty en lugar de i.quantity
//       (sum, i) => sum + (i.product?.price ?? 0) * (i.qty ?? 0), 
//       0
//     );

//   // 🔹 Loading
//   if (loading) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <Loader2 className="animate-spin h-12 w-12 text-primary" />
//         <p className="mt-4 text-foreground/70">Cargando cliente y historial...</p>
//       </div>
//     );
//   }

//   // 🔹 Error
//   if (error) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-red-500" />
//         <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
//         <p className="text-foreground/70">{error}</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4">
//           <Button>Volver a la lista</Button>
//         </Link>
//       </div>
//     );
//   }

//   if (!cliente) {
//     return (
//       <div className="p-8 h-full flex flex-col justify-center items-center">
//         <AlertTriangle className="h-12 w-12 text-yellow-500" />
//         <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
//         <Link href={PATHROUTES.pymes.clientes} className="mt-4">
//           <Button>Volver a la lista</Button>
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="flex-1 p-6 space-y-6 bg-background">
//       {/* 🟢 Header MODIFICADO: Botón a la izquierda y título de página */}
//       <div className="flex items-center gap-4 mb-8">
//         <Link href={PATHROUTES.pymes.clientes}>
//           <Button variant="outline" className="px-3">
//             <ArrowLeft className="h-5 w-5" />
//           </Button>
//         </Link>
//         <h1 className="text-3xl font-bold text-foreground">Detalles de Cliente</h1>
//       </div>

//       {/* Grid principal */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//         {/* Información de contacto - 🟢 Ahora incluye el nombre y email del cliente */}
//         <Card isClickable={false} className="p-4 space-y-3">
//           <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
//             <div className="bg-primary/10 p-2 rounded-full flex items-center justify-center w-10 h-10 shrink-0">
//                 <User className="w-6 h-6 text-primary" /> {/* Icono de Cliente */}
//             </div>
//             <div>
//               <h2 className="text-xl font-semibold text-foreground truncate">{cliente.name}</h2>
//               <p className="text-sm text-foreground/70">{cliente.email}</p>
//             </div>
//           </div>

//           <h3 className="text-lg font-semibold">Datos de Contacto</h3>
          
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Phone className="w-4 h-4 text-primary" /> {cliente.phone || "N/A"}
//           </p>
//           <p className="flex items-center gap-2 text-sm text-foreground/80">
//             <Mail className="w-4 h-4 text-primary" /> {cliente.email || "N/A"}
//           </p>
//           <p className="text-sm text-foreground/60 pt-2 border-t border-border mt-3">
//             Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()} <br />
//             <span className="italic">
//               ({calcularAntiguedad(cliente.memberSince)})
//             </span>
//           </p>
//         </Card>

//         {/* Historial compras */}
//         <Card isClickable={false} className="lg:col-span-2 p-4">
//           <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
//             <ShoppingBag className="h-5 w-5" /> Historial de compras
//           </h2>
//           {orders.length === 0 ? (
//             <p className="text-foreground/60 text-sm">
//               Este cliente no tiene compras registradas.
//             </p>
//           ) : (
//             <div className="overflow-x-auto">
//               <table className="w-full text-left text-sm">
//                 <thead className="bg-background border-b border-border">
//                   <tr>
//                     <th className="p-3">Fecha</th>
//                     <th className="p-3">Productos</th>
//                     <th className="p-3">Total</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {orders.map((order) => {
//                     // Usamos order.issuedAt para la fecha
//                     const orderDate = new Date(order.issuedAt); 
//                     const isValidDate = order.issuedAt && !isNaN(orderDate.getTime());
                    
//                     return (
//                       <tr key={order.id} className="border-b border-border">
//                         <td className="p-3">
//                           <Calendar className="inline h-4 w-4 mr-1 text-primary/70" />
//                           {/* Muestra la fecha o un mensaje si es inválida */}
//                           {isValidDate ? orderDate.toLocaleDateString() : "Fecha no válida"}
//                         </td>
//                         <td className="p-3">
//                           {order.items.length > 0
//                             ? order.items
//                                 .map(
//                                   // Usamos i.qty para la cantidad
//                                   (i) =>
//                                     `${i.product?.name || "Producto desconocido"} (${i.qty ?? 0})` 
//                                 )
//                                 .join(", ")
//                             : "N/A"}
//                         </td>
//                         <td className="p-3 font-semibold flex items-center gap-1 text-green-600">
//                           <DollarSign className="h-4 w-4" />
//                           ${calculateTotal(order.items).toFixed(2)}
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </Card>
//       </div>

//       {/* Notas internas */}
//       <Card isClickable={false} className="p-4 space-y-4">
//         <h2 className="text-lg font-semibold">Observaciones internas</h2>

//         <textarea
//           className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
//           rows={4}
//           value={notas}
//           onChange={(e) => setNotas(e.target.value)}
//           placeholder="Añade notas importantes sobre este cliente..."
//         />

//         <div className="flex justify-end gap-2">
//           <Button
//             onClick={handleGuardarNotas}
//             disabled={isPublishing || !notas.trim()}
//           >
//             {isPublishing ? (
//               <>
//                 <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
//               </>
//             ) : (
//               <>
//                 <Check className="mr-2 h-4 w-4" /> Guardar
//               </>
//             )}
//           </Button>
//           <Button
//             onClick={handleEliminarNotas}
//             variant="danger"
//             disabled={!cliente.notes}
//           >
//             <Trash2 className="h-4 w-4" /> Eliminar
//           </Button>
//         </div>

//         {cliente.notes && (
//           <div className="border-t border-border pt-4">
//             <h3 className="font-medium flex items-center gap-2 mb-2">
//               <StickyNote className="w-4 h-4 text-primary" /> Observaciones publicada
//             </h3>
//             <p className="text-sm text-foreground/80 whitespace-pre-wrap">
//               {cliente.notes}
//             </p>
//           </div>
//         )}
//       </Card>
//     </div>
//   );
// }


'use client';

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  Phone,
  Mail,
  ArrowLeft,
  Check,
  Loader2,
  Trash2,
  AlertTriangle,
  StickyNote,
  ShoppingBag,
  Calendar,
  DollarSign,
  User,
  ListOrdered,
} from "lucide-react";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { PATHROUTES } from "@/constants/pathroutes";
import { Customer } from "@/types/customer";

// Tipos auxiliares
interface Product {
  id: string;
  name: string;
  price: number;
}

interface Item {
  productId: string;
  qty: number; // <-- CORREGIDO: Usar 'qty' según el API de facturas
  product?: Product;
}

interface Order {
  id: string;
  issuedAt: string; // <-- CORREGIDO: Usar 'issuedAt' en lugar de 'date' o 'issueDate'
  customerId: string;
  items: Item[];
}

// 🔹 Calcula antigüedad de cliente
const calcularAntiguedad = (fecha: string) => {
  const fechaCliente = new Date(fecha);
  const ahora = new Date();
  const diffMeses =
    (ahora.getFullYear() - fechaCliente.getFullYear()) * 12 +
    (ahora.getMonth() - fechaCliente.getMonth());
  if (diffMeses < 12) {
    return `${diffMeses} mes${diffMeses === 1 ? "" : "es"}`;
  }
  const diffAnios = Math.floor(diffMeses / 12);
  return `${diffAnios} año${diffAnios === 1 ? "" : "s"}`;
};

export default function ClienteDetalle() {
  const { data: session } = useSession();
  const params = useParams();
  const clienteId = params.id as string;

  const [cliente, setCliente] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [notas, setNotas] = useState("");
  const [isPublishing, setIsPublishing] = useState(false);

  // Historial de compras
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);

  // 🔹 Fetch cliente
  const fetchCliente = useCallback(async () => {
    if (!session?.accessToken || !clienteId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/${clienteId}`,
        {
          headers: { Authorization: `Bearer ${session.accessToken}` },
        }
      );

      if (!res.ok) {
        throw new Error("No se pudo cargar la información del cliente.");
      }

      const clienteData = await res.json();
      setCliente(clienteData);
      setNotas(clienteData.notes || "");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Ocurrió un error inesperado."
      );
    } 
    // NOTA: Se ha quitado el setLoading(false) de aquí para que se ejecute una vez cargue el historial también.
  }, [session, clienteId]);

  // 🔹 Fetch historial de compras (CORREGIDO el ENDPOINT)
  const fetchHistorial = useCallback(async () => {
    if (!session?.accessToken || !session.user?.companyId) return;

    try {
      // Productos
      const productsRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`,
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
      const productsData: Product[] = await productsRes.json();
      setProducts(productsData);

      // Órdenes (Ahora Facturas/Ventas)
      const ordersRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${session.user.companyId}`, // <--- ¡ENDPOINT CORREGIDO!
        { headers: { Authorization: `Bearer ${session.accessToken}` } }
      );
      if (!ordersRes.ok) throw new Error("No se pudieron cargar las facturas de venta (historial).");
      const ordersData: Order[] = await ordersRes.json();

      // Filtrar por cliente
      const filtered = ordersData.filter((o) => o.customerId === clienteId);

      // Enriquecer con productos
      const enriched = filtered.map((order) => ({
        ...order,
        items: order.items.map((item) => ({
          ...item,
          product: productsData.find((p) => p.id === item.productId),
        })),
      }));

      setOrders(enriched);
    } catch (err) {
      toast.error("Error cargando historial de compras.");
    } finally {
      setLoading(false); // <--- El loading general finaliza aquí (después de ambos fetches)
    }
  }, [session, clienteId]);

  useEffect(() => {
    if (session) {
      // Se llama a fetchCliente primero, pero setLoading(false) se ejecuta en fetchHistorial.
      fetchCliente(); 
      fetchHistorial();
    }
  }, [session, fetchCliente, fetchHistorial]);

  // 🔹 Guardar notas
  const handleGuardarNotas = async () => {
    if (!cliente || !session?.accessToken) return;
    setIsPublishing(true);

    const payload = { ...cliente, notes: notas };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("No se pudieron guardar las notas.");

      let updatedCliente: Customer;
      try {
        updatedCliente = await res.json();
      } catch {
        updatedCliente = { ...cliente, notes: notas };
      }

      setCliente(updatedCliente);
      toast.success("¡Notas guardadas con éxito!");
    } catch {
      toast.error("Error al guardar las notas.");
    } finally {
      setIsPublishing(false);
    }
  };

  // 🔹 Eliminar notas
  const handleEliminarNotas = async () => {
    if (!cliente || !session?.accessToken) return;
    setIsPublishing(true);

    const payload = { ...cliente, notes: "" };

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/customers/${cliente.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error("No se pudieron eliminar las notas.");

      let updatedCliente: Customer;
      try {
        updatedCliente = await res.json();
      } catch {
        updatedCliente = { ...cliente, notes: "" };
      }

      setCliente(updatedCliente);
      setNotas("");
      toast.success("¡Notas eliminadas con éxito!");
    } catch {
      toast.error("Error al eliminar las notas.");
    } finally {
      setIsPublishing(false);
    }
  };

  // 🔹 Calcular total orden (Usando 'qty')
  const calculateTotal = (items: Item[]) =>
    items.reduce(
      // Usamos i.qty en lugar de i.quantity
      (sum, i) => sum + (i.product?.price ?? 0) * (i.qty ?? 0), 
      0
    );

  // 🔹 Loading
  if (loading) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
         <ListOrdered className="animate-spin h-12 w-12 text-primary" />
        <p className="mt-4 text-foreground/70">Cargando cliente y historial...</p>
      </div>
    );
  }

  // 🔹 Error
  if (error) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <AlertTriangle className="h-12 w-12 text-red-500" />
        <p className="mt-4 font-bold text-lg">Error al Cargar Datos</p>
        <p className="text-foreground/70">{error}</p>
        <Link href={PATHROUTES.pymes.clientes} className="mt-4">
          <Button>Volver a la lista</Button>
        </Link>
      </div>
    );
  }

  if (!cliente) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <AlertTriangle className="h-12 w-12 text-yellow-500" />
        <p className="mt-4 font-bold text-lg">Cliente no encontrado</p>
        <Link href={PATHROUTES.pymes.clientes} className="mt-4">
          <Button>Volver a la lista</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 space-y-6 bg-background">
      {/* Header MODIFICADO: Botón a la izquierda y título de página */}
      <div className="flex items-center gap-4 mb-8">
        <Link href={PATHROUTES.pymes.clientes}>
          <Button variant="outline" className="px-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Detalles de Cliente</h1>
      </div>

      {/* Grid principal */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Información de contacto - Ahora con el nombre, sin correo repetido */}
        <Card isClickable={false} className="p-4 space-y-3">
          <div className="flex items-center gap-3 mb-4 border-b border-border pb-3">
            <div className="bg-primary/10 p-2 rounded-full flex items-center justify-center w-10 h-10 shrink-0">
                <User className="w-6 h-6 text-primary" /> {/* Icono de Cliente */}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground truncate">{cliente.name}</h2>
              {/* ❌ Línea de correo eliminada para evitar redundancia: <p className="text-sm text-foreground/70">{cliente.email}</p> */}
            </div>
          </div>

          <h3 className="text-lg font-semibold">Datos de Contacto</h3>
          
          <p className="flex items-center gap-2 text-sm text-foreground/80">
            <Phone className="w-4 h-4 text-primary" /> {cliente.phone || "N/A"}
          </p>
          {/* ✅ Se mantiene aquí, es su lugar principal */}
          <p className="flex items-center gap-2 text-sm text-foreground/80">
            <Mail className="w-4 h-4 text-primary" /> {cliente.email || "N/A"}
          </p>
          <p className="text-sm text-foreground/60 pt-2 border-t border-border mt-3">
            Miembro desde: {new Date(cliente.memberSince).toLocaleDateString()} <br />
            <span className="italic">
              ({calcularAntiguedad(cliente.memberSince)})
            </span>
          </p>
        </Card>

        {/* Historial compras */}
        <Card isClickable={false} className="lg:col-span-2 p-4">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <ShoppingBag className="h-5 w-5" /> Historial de compras
          </h2>
          {orders.length === 0 ? (
            <p className="text-foreground/60 text-sm">
              Este cliente no tiene compras registradas.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-background border-b border-border">
                  <tr>
                    <th className="p-3">Fecha</th>
                    <th className="p-3">Productos</th>
                    <th className="p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => {
                    // Usamos order.issuedAt para la fecha
                    const orderDate = new Date(order.issuedAt); 
                    const isValidDate = order.issuedAt && !isNaN(orderDate.getTime());
                    
                    return (
                      <tr key={order.id} className="border-b border-border">
                        <td className="p-3">
                          <Calendar className="inline h-4 w-4 mr-1 text-primary/70" />
                          {/* Muestra la fecha o un mensaje si es inválida */}
                          {isValidDate ? orderDate.toLocaleDateString() : "Fecha no válida"}
                        </td>
                        <td className="p-3">
                          {order.items.length > 0
                            ? order.items
                                .map(
                                  // Usamos i.qty para la cantidad
                                  (i) =>
                                    `${i.product?.name || "Producto desconocido"} (${i.qty ?? 0})` 
                                )
                                .join(", ")
                            : "N/A"}
                        </td>
                        <td className="p-3 font-semibold flex items-center gap-1 text-green-600">
                          <DollarSign className="h-4 w-4" />
                          ${calculateTotal(order.items).toFixed(2)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      {/* Notas internas */}
      <Card isClickable={false} className="p-4 space-y-4">
        <h2 className="text-lg font-semibold">Observaciones internas</h2>

        <textarea
          className="w-full border rounded-lg p-3 text-sm bg-background/50 text-foreground/80 placeholder:text-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
          rows={4}
          value={notas}
          onChange={(e) => setNotas(e.target.value)}
          placeholder="Añade notas importantes sobre este cliente..."
        />

        <div className="flex justify-end gap-2">
          <Button
            onClick={handleGuardarNotas}
            disabled={isPublishing || !notas.trim()}
          >
            {isPublishing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...
              </>
            ) : (
              <>
                <Check className="mr-2 h-4 w-4" /> Guardar
              </>
            )}
          </Button>
          <Button
            onClick={handleEliminarNotas}
            variant="danger"
            disabled={!cliente.notes}
          >
            <Trash2 className="h-4 w-4" /> Eliminar
          </Button>
        </div>

        {cliente.notes && (
          <div className="border-t border-border pt-4">
            <h3 className="font-medium flex items-center gap-2 mb-2">
              <StickyNote className="w-4 h-4 text-primary" /> Observaciones publicada
            </h3>
            <p className="text-sm text-foreground/80 whitespace-pre-wrap">
              {cliente.notes}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}