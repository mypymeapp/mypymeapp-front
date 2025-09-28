'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { FiPlus } from 'react-icons/fi';
import { Edit2, Eye, Trash2 } from 'lucide-react';

// Tipos para las columnas de la tabla
export interface Column<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  searchable?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
}

// Tipos para las acciones CRUD
export interface CrudActions<T> {
  onCreate?: () => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  onView?: (item: T) => void;
}

// Props del componente DataTable
export interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  actions?: CrudActions<T>;
  title?: string;
  searchPlaceholder?: string;
  itemsPerPage?: number;
  loading?: boolean;
  emptyMessage?: string;
  showSearch?: boolean;
  showPagination?: boolean;
  showCreateButton?: boolean;
  createButtonText?: string;
  className?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function DataTable<T extends Record<string, any>>({
  data,
  columns,
  actions,
  title,
  // Configuraciones de la tabla por defecto //
  searchPlaceholder = "Buscar...",
  itemsPerPage = 10,
  loading = false,
  emptyMessage = "No hay datos disponibles",
  showSearch = false,
  showPagination = true,
  showCreateButton = false,
  createButtonText = "Crear nuevo",
  className = ""
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);

  // Filtrar datos basado en búsqueda
  const filteredData = useMemo(() => {
    if (!searchTerm) return data;
    
    return data.filter(item => {
      return columns.some(column => {
        if (column.searchable === false) return false;
        
        const value = item[column.key as keyof T];
        if (value == null) return false;
        
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      });
    });
  }, [data, searchTerm, columns]);

  // Ordenar datos
  const sortedData = useMemo(() => {
    if (!sortColumn) return filteredData;
    
    return [...filteredData].sort((a, b) => {
      let aValue = a[sortColumn];
      let bValue = b[sortColumn];
      
      // Manejar objetos anidados (como company.name)
      if (typeof aValue === 'object' && aValue !== null) {
        aValue = JSON.stringify(aValue);
      }
      if (typeof bValue === 'object' && bValue !== null) {
        bValue = JSON.stringify(bValue);
      }
      
      if (aValue == null && bValue == null) return 0;
      if (aValue == null) return 1;
      if (bValue == null) return -1;
      
      // Convertir a string para comparación consistente
      const aStr = String(aValue).toLowerCase();
      const bStr = String(bValue).toLowerCase();
      
      let comparison = 0;
      if (aStr < bStr) comparison = -1;
      if (aStr > bStr) comparison = 1;
      
      return sortDirection === 'desc' ? -comparison : comparison;
    });
  }, [filteredData, sortColumn, sortDirection]);

  // Paginación
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [sortedData, currentPage, itemsPerPage]);

  // Manejar ordenamiento
  const handleSort = (columnKey: string) => {
    const column = columns.find(col => col.key === columnKey);
    if (!column?.sortable) return;
    
    if (sortColumn === columnKey) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };

  // Obtener valor de celda
  const getCellValue = (item: T, column: Column<T>): React.ReactNode => {
    const value = item[column.key as keyof T];
    return column.render ? column.render(value, item) : String(value ?? '');
  };

  // Generar páginas para paginación
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  if (loading) {
    return (
      <div className={`bg-card border border-primary rounded-lg overflow-hidden ${className}`}>
        {/* Header Skeleton */}
        <div className="p-6 border-b border-primary">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex flex-col w-full">
              <div className="animate-pulse">
                <div className="h-6 bg-muted rounded w-48 mb-2"></div>
                <div className="h-4 bg-muted rounded w-32"></div>
              </div>
            </div>
            <div className="flex flex-col justify-between sm:flex-row gap-3 w-full">
              <div className="animate-pulse">
                <div className="h-10 bg-muted rounded w-64"></div>
              </div>
              <div className="animate-pulse">
                <div className="h-10 bg-muted rounded w-32"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Skeleton */}
        <div className="overflow-x-auto">
          <table className="w-full">
            {/* Header Skeleton */}
            <thead className="bg-muted/50">
              <tr>
                {columns.map((_, index) => (
                  <th key={index} className="px-6 py-3 text-left">
                    <div className="animate-pulse">
                      <div className="h-4 bg-muted rounded w-20"></div>
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-left">
                  <div className="animate-pulse">
                    <div className="h-4 bg-muted rounded w-16"></div>
                  </div>
                </th>
              </tr>
            </thead>
            {/* Body Skeleton */}
            <tbody className="divide-y divide-border">
              {[...Array(itemsPerPage)].map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                  {columns.map((_, colIndex) => (
                    <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 bg-muted rounded w-full max-w-[120px]"></div>
                    </td>
                  ))}
                  {/* Actions column skeleton */}
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 bg-muted rounded border-2"></div>
                      <div className="h-8 w-8 bg-muted rounded border-2"></div>
                      <div className="h-8 w-8 bg-muted rounded border-2"></div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination Skeleton */}
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="animate-pulse">
              <div className="h-4 bg-muted rounded w-48"></div>
            </div>
            <div className="flex items-center gap-2">
              <div className="animate-pulse flex gap-2">
                <div className="h-8 w-16 bg-muted rounded"></div>
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="h-8 w-8 bg-muted rounded"></div>
                <div className="h-8 w-16 bg-muted rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-card border border-primary rounded-lg overflow-hidden ${className}`}>
      {/* Header */}
      <div className="p-6 border-b border-primary">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex flex-col w-full">
            {title && <h2 className="text-xl font-semibold text-foreground">{title}</h2>}
            <p className="text-sm text-foreground/60 mt-1">
              {filteredData.length} {filteredData.length === 1 ? 'elemento' : 'elementos'}
            </p>
          </div>
          
          <div className="flex flex-col justify-between sm:flex-row gap-3 w-full">
            {showSearch && (
              <div className="relative">
                <Input
                  id="search"
                  label={searchPlaceholder}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-auto"
                />
              </div>
            )}
            
            {showCreateButton && actions?.onCreate && (
              <Button onClick={actions.onCreate} className="whitespace-nowrap">
                <FiPlus className="mr-1" /> {createButtonText}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-muted/70 select-none' : ''
                  }`}
                  style={{ width: column.width }}
                  onClick={() => handleSort(String(column.key))}
                >
                  <div className="flex items-center gap-2">
                    {column.header}
                    {column.sortable && (
                      <div className="flex flex-col">
                        <svg
                          className={`w-3 h-3 ${
                            sortColumn === column.key && sortDirection === 'asc'
                              ? 'text-primary'
                              : 'text-foreground/30'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                        </svg>
                        <svg
                          className={`w-3 h-3 -mt-1 ${
                            sortColumn === column.key && sortDirection === 'desc'
                              ? 'text-primary'
                              : 'text-foreground/30'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                  </div>
                </th>
              ))}
              {(actions?.onEdit || actions?.onDelete || actions?.onView) && (
                <th className="px-6 py-3 text-left text-xs font-medium text-foreground/70 uppercase tracking-wider">
                  Acciones
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + (actions ? 1 : 0)}
                  className="px-6 py-12 text-center text-foreground/60"
                >
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              paginatedData.map((item, index) => (
                <tr key={index} className="hover:bg-muted/30 transition-colors">
                  {columns.map((column) => (
                    <td key={String(column.key)} className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      {getCellValue(item, column)}
                    </td>
                  ))}
                  {(actions?.onEdit || actions?.onDelete || actions?.onView) && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex items-center gap-2">
                        {actions?.onView && (
                          <button
                            onClick={() => actions.onView!(item)}
                            title="Ver"
                            className="text-blue-600 hover:text-white transition-colors hover:bg-blue-600 border-2 border-blue-600 rounded-md p-2"
                          >
                            <Eye className="size-4" />
                          </button>
                        )}
                        {actions?.onEdit && (
                          <button
                            onClick={() => actions.onEdit!(item)}
                            title="Editar"
                            className="text-yellow-600 hover:text-white transition-colors hover:bg-yellow-600 border-2 border-yellow-600 rounded-md p-2"
                          >
                            <Edit2 className="size-4" />
                          </button>
                        )}
                        {actions?.onDelete && (
                          <button
                            onClick={() => actions.onDelete!(item)}
                            title="Eliminar"
                            className="text-red-600 hover:text-white hover:bg-red-600 transition-colors border-2 border-red-600 rounded-md p-2"
                          >
                            <Trash2 className="size-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {showPagination && totalPages > 1 && (
        <div className="px-6 py-4 border-t border-border">
          <div className="flex items-center justify-between">
            <div className="text-sm text-foreground/60">
              Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, sortedData.length)} de {sortedData.length} resultados
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Anterior
              </button>
              
              {getPageNumbers().map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm border rounded-md transition-colors ${
                    currentPage === page
                      ? 'bg-primary text-button-text border-primary'
                      : 'border-border hover:bg-muted/50'
                  }`}
                >
                  {page}
                </button>
              ))}
              
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm border border-border rounded-md hover:bg-muted/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Siguiente
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
