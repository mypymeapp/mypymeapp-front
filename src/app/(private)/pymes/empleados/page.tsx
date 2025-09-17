'use client'
import { useState, useMemo } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PATHROUTES } from "@/constants/pathroutes";
import { PlusCircle, Search, UserCheck, UserX, LayoutGrid, List, Mail, Phone } from "lucide-react";
type ViewMode = 'cards' | 'list';
import Link from "next/link";
import { mockEmpleados } from "@/mocks/data";
import { useRouter } from "next/navigation";

const puestos = Array.from(new Set(mockEmpleados.map(e => e.rol)));


function EmpleadosPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [filtroActivo, setFiltroActivo] = useState<"all" | "activos" | "inactivos">("all");
  const [filtroPuesto, setFiltroPuesto] = useState<string>("all");
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const empleadosFiltrados = useMemo(() => {
    return mockEmpleados
      .filter(e => {
        const matchesSearch = (
          e.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          e.apellido.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesActivo =
          filtroActivo === "all" ||
          (filtroActivo === "activos" && e.activo) ||
          (filtroActivo === "inactivos" && !e.activo);
        const matchesPuesto = filtroPuesto === "all" || e.rol === filtroPuesto;
        return matchesSearch && matchesActivo && matchesPuesto;
      })
      .sort((a, b) => a.nombre.localeCompare(b.nombre));
  }, [searchTerm, filtroActivo, filtroPuesto]);

  return (
    <div className="p-4 md:p-8">
      <div className="flex flex-wrap justify-between items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-foreground">Empleados</h1>
        <Link href={PATHROUTES.pymes.empleados_nuevo}>
          <Button><PlusCircle className="mr-2 h-5 w-5" />Nuevo Empleado</Button>
        </Link>
      </div>

      <Card isClickable={false} className="mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="relative flex-grow max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
            <input
              type="text"
              placeholder="Buscar por nombre o apellido..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-foreground/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setFiltroActivo(filtroActivo === "activos" ? "all" : "activos")}
              className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${filtroActivo === "activos" ? 'bg-green-600 text-white shadow-lg shadow-green-600/30' : 'bg-transparent border border-border hover:bg-border'}`}
            >
              <UserCheck className="mr-2 h-4 w-4" /> Activos
            </button>
            <button
              onClick={() => setFiltroActivo(filtroActivo === "inactivos" ? "all" : "inactivos")}
              className={`inline-flex items-center justify-center px-4 py-2 font-bold rounded-lg transition-all duration-200 text-sm ${filtroActivo === "inactivos" ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : 'bg-transparent border border-border hover:bg-border'}`}
            >
              <UserX className="mr-2 h-4 w-4" /> Inactivos
            </button>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={filtroPuesto}
              onChange={e => setFiltroPuesto(e.target.value)}
              className="px-4 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="all">Todos los roles</option>
              {puestos.map(p => (
                <option key={p} value={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border">
            <button onClick={() => setViewMode('cards')} className={`p-2 rounded ${viewMode === 'cards' ? 'bg-primary text-button-text' : ''}`}>
              <LayoutGrid className="h-5 w-5"/>
            </button>
            <button onClick={() => setViewMode('list')} className={`p-2 rounded ${viewMode === 'list' ? 'bg-primary text-button-text' : ''}`}>
              <List className="h-5 w-5"/>
            </button>
          </div>
        </div>
      </Card>

      {viewMode === 'cards' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {empleadosFiltrados.map(e => (
            <Card key={e.id} className="flex flex-col cursor-pointer hover:shadow-lg transition-shadow duration-200" onClick={() => router.push(`/pymes/empleados/${e.id}`)}>
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full flex items-center justify-center w-12 h-12">
                    <span className="font-bold text-primary text-4xl">{e.nombre.charAt(0)}</span>
                  </div>
                  <div>
                    <h2 className="font-bold text-lg text-foreground">{e.nombre} {e.apellido}</h2>
                    <p className="text-sm text-foreground/60">{e.rol}</p>
                  </div>
                </div>
              </div>
              <div className="flex-grow space-y-2 text-sm text-foreground/80 mb-6">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-primary/70" /> {e.email}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-primary/70" /> {e.telefono}</p>
                <p className="flex items-center gap-2">
                  <UserCheck className={`w-4 h-4 ${e.activo ? 'text-green-700' : 'text-red-700'}`} />
                  <span className={e.activo ? 'text-green-700 font-bold' : 'text-red-700 font-bold'}>
                    {e.activo ? 'Activo' : 'Inactivo'}
                  </span>
                </p>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-background border-b border-border">
              <tr>
                <th className="p-4 font-semibold">Nombre</th>
                <th className="p-4 font-semibold">Apellido</th>
                <th className="p-4 font-semibold">Rol</th>
                <th className="p-4 font-semibold">Email</th>
                <th className="p-4 font-semibold text-center">Activo</th>
              </tr>
            </thead>
            <tbody>
              {empleadosFiltrados.map(e => (
                <tr key={e.id} className="border-b border-border last:border-b-0 hover:bg-background">
                  <td className="p-4 font-medium">{e.nombre}</td>
                  <td className="p-4">{e.apellido}</td>
                  <td className="p-4">{e.rol}</td>
                  <td className="p-4">{e.email}</td>
                  <td className="p-4 text-center">{e.activo ? <span className="text-green-700 font-bold">Sí</span> : <span className="text-red-700 font-bold">No</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default EmpleadosPage;