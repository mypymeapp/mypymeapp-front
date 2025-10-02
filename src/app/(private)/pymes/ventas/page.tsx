
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { toast } from "react-hot-toast";
import {
  AlertTriangle,
  LayoutGrid,
  List,
  DollarSign,
  FileText, 
  Search,
} from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

// Tipos relevantes (solo Factura)
interface Product {
  id: string;
  name: string;
  price: number;
}

interface Invoice {
  id: string;
  number?: string;
  issuedAt: string;
  customer?: { name: string };
  total?: number;
  status: string; // 'paid', 'pending', etc.
}

// El registro de ventas ahora es simplemente una Factura
type SalesRecord = Invoice;

type ViewMode = "cards" | "list";

// La función auxiliar ya no se usa para valores iniciales, pero se mantiene si es necesaria
// Función auxiliar para convertir fecha de ISO a formato YYYY-MM-DD
const dateToInputFormat = (date: Date) => {
    // Asegura que la fecha se formatee en base a la zona horaria local
    const offset = date.getTimezoneOffset() * 60000;
    const localDate = new Date(date.getTime() - offset);
    return localDate.toISOString().split('T')[0];
};

export default function ModuloVentas() {
  const { data: session } = useSession();

  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>("cards");
  
  // Filtros - Inicializados como null para que el usuario elija
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

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

      const [inventoryProducts, invoicesRes] = await Promise.all([
        fetchProducts(),
        fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${companyId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        ),
      ]);

      setProducts(inventoryProducts);

      const invoicesData: Invoice[] = invoicesRes.ok
        ? await invoicesRes.json()
        : [];

      setInvoices(invoicesData);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error cargando datos");
    } finally {
      setIsLoading(false);
    }
  }, [session, fetchProducts]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const filteredRecords = useMemo(() => {
    // CORRECCIÓN: 'let data' cambiado a 'const data'
    const data: SalesRecord[] = invoices;

    // --- FILTRADO 1: POR FECHA ---
    // Solo creamos objetos Date si las cadenas no son nulas o vacías
    const startFilterDate = startDate ? new Date(startDate) : null;
    const endFilterDate = endDate ? new Date(endDate) : null;
    
    // Función de ajuste para incluir el día completo (hasta 23:59:59.999)
    const getAdjustedEndDate = (date: Date) => {
        const d = new Date(date);
        // Movemos al siguiente día
        d.setDate(d.getDate() + 1);
        // Retrocedemos 1 milisegundo
        d.setMilliseconds(d.getMilliseconds() - 1);
        return d;
    }

    const dateFilteredData = data.filter((r) => {
        // Usamos la fecha de emisión de la factura
        const invoiceDate = new Date(r.issuedAt);
        const invoiceTimestamp = invoiceDate.getTime();

        let passesFilter = true;

        // 1. FILTRAR POR FECHA DE INICIO (DESDE)
        if (startFilterDate && !isNaN(startFilterDate.getTime())) {
            // Comparamos el timestamp de la factura con el timestamp de inicio (medianoche del día)
            if (invoiceTimestamp < startFilterDate.getTime()) {
                passesFilter = false;
            }
        }

        // 2. FILTRAR POR FECHA DE FIN (HASTA)
        if (endFilterDate && !isNaN(endFilterDate.getTime())) {
            const adjustedEndDate = getAdjustedEndDate(endFilterDate);
            // Comparamos el timestamp de la factura con el timestamp ajustado (final del día)
            if (invoiceTimestamp > adjustedEndDate.getTime()) {
                passesFilter = false;
            }
        }

        return passesFilter;
    });

    // --- FILTRADO 2: POR TEXTO (NÚMERO DE FACTURA) ---
    const lowerCaseSearchTerm = searchTerm.toLowerCase().trim();

    if (!lowerCaseSearchTerm) {
        return dateFilteredData; // Si no hay término de búsqueda, devuelve solo el filtro de fecha
    }

    // Filtra los resultados previamente filtrados por fecha usando el número de factura
    return dateFilteredData.filter(
        (r) => (r.number ?? "").toLowerCase().includes(lowerCaseSearchTerm)
    );

  }, [invoices, startDate, endDate, searchTerm]); // Dependencia de todos los filtros

  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const visibleRecords = filteredRecords.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Reiniciar la página al cambiar filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [startDate, endDate, searchTerm]);


  if (isLoading) {
    return (
      <div className="p-8 h-full flex flex-col justify-center items-center">
        <FileText className="animate-spin h-12 w-12 text-primary" />
        <p className="mt-4 text-foreground/70">Cargando facturas de ventas...</p>
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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-foreground">Facturación de Ventas</h1>
      </div>

      <Card
        isClickable={false}
        className="mb-8 flex flex-wrap justify-start items-center gap-4"
      >
        {/* Campo de búsqueda por número de factura */}
        <div className="relative flex-grow max-w-xs min-w-[200px] order-1 md:order-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-foreground/50" />
          <input
            type="text"
            placeholder="Buscar por número de factura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Campo Fecha Desde */}
        <div className="flex items-center gap-2 order-2 md:order-2">
            <label htmlFor="startDateInput" className="text-sm font-medium whitespace-nowrap text-foreground/80">Desde:</label>
            <div className="relative max-w-[170px]">
                <input
                    id="startDateInput"
                    type="date"
                    value={startDate ?? ''} // Usa cadena vacía si es null
                    onChange={(e) => setStartDate(e.target.value || null)} // Guarda null si el campo se borra
                    className="w-full pl-3 pr-2 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none text-sm"
                    aria-label="Fecha Desde"
                    title="Fecha Desde"
                />
            </div>
        </div>

        {/* Campo Fecha Hasta */}
        <div className="flex items-center gap-2 order-3 md:order-3">
            <label htmlFor="endDateInput" className="text-sm font-medium whitespace-nowrap text-foreground/80">Hasta:</label>
            <div className="relative max-w-[170px]">
                <input
                    id="endDateInput"
                    type="date"
                    value={endDate ?? ''} // Usa cadena vacía si es null
                    onChange={(e) => setEndDate(e.target.value || null)} // Guarda null si el campo se borra
                    className="w-full pl-3 pr-2 py-2 bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary appearance-none text-sm"
                    aria-label="Fecha Hasta"
                    title="Fecha Hasta"
                />
            </div>
        </div>
        
        {/* Botones de Vista (se mueven al final) */}
        <div className="flex items-center gap-2 p-1 bg-background rounded-lg border border-border ml-auto order-4 md:order-4">
          <button
            onClick={() => setViewMode("cards")}
            className={`p-2 rounded ${
              viewMode === "cards" ? "bg-primary text-button-text" : ""
            }`}
            aria-label="Vista de Tarjetas"
          >
            <LayoutGrid className="h-5 w-5" />
          </button>
          <button
            onClick={() => setViewMode("list")}
            className={`p-2 rounded ${
              viewMode === "list" ? "bg-primary text-button-text" : ""
            }`}
            aria-label="Vista de Lista"
          >
            <List className="h-5 w-5" />
          </button>
        </div>
      </Card>

      {visibleRecords.length === 0 ? (
        <Card isClickable={false}>
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-foreground/30" />
            <h3 className="mt-2 text-xl font-semibold">No hay facturas registradas</h3>
            <p className="mt-1 text-sm text-foreground/60">
              Ajusta el rango de fechas o el número de factura para encontrar registros.
            </p>
          </div>
        </Card>
      ) : viewMode === "cards" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleRecords.map((r: SalesRecord) => (
            <Card key={r.id} className="flex flex-col">
              <div className="p-4 flex-grow">
                <h2 className="font-bold text-lg text-foreground truncate">
                  {r.number}
                </h2>
                <p className="text-sm text-foreground/70">
                  {r.customer?.name ?? "Cliente Desconocido"}
                </p>
                <p className="text-xs text-foreground/60">
                  {new Date(r.issuedAt).toLocaleDateString()}
                </p>
                
                {/* Solo mostramos el total, la información de estado se quita de la tarjeta */}
                <p className="mt-2 flex items-center gap-1 font-semibold">
                  <DollarSign className="h-4 w-4" />$
                  {(r.total ?? 0).toFixed(2)}
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
                <th className="p-4 font-semibold">Número Factura</th>
                <th className="p-4 font-semibold">Cliente</th>
                <th className="p-4 font-semibold">Fecha</th>
                <th className="p-4 font-semibold text-right">Total</th>
                {/* Columna 'Estado' Eliminada */}
              </tr>
            </thead>
            <tbody>
              {visibleRecords.map((r: SalesRecord) => (
                <tr
                  key={r.id}
                  className="border-b border-border last:border-b-0 hover:bg-background"
                >
                  <td className="p-4">
                    {r.number}
                  </td>
                  <td className="p-4">
                    {r.customer?.name ?? "Cliente Desconocido"}
                  </td>
                  <td className="p-4">
                    {new Date(r.issuedAt).toLocaleDateString()}
                  </td>
                  <td className="p-4 text-right">
                    ${(r.total ?? 0).toFixed(2)}
                  </td>
                  {/* Celda 'Estado' Eliminada */}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

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