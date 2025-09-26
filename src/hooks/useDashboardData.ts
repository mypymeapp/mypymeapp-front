// src/hooks/useDashboardData.ts
import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';


interface InvoiceAPI {
  id: string;
  issuedAt: string;
  customer?: { name: string };
  total: number;
  items: { productId: string; qty: number; price: number; product?: { name: string } }[];
}

interface Product {
  id: string;
  name: string;
}


export interface SalesByMonth {
  month: string;
  total: number;
}

export interface TopProduct {
  name: string;
  total: number;
}

export interface TopCustomer {
  name: string;
  total: number;
}


interface DashboardData {
  salesByMonth: SalesByMonth[];
  topProducts: TopProduct[];
  topCustomers: TopCustomer[];
  totalRevenue: number;
  totalInvoices: number;
}

export const useDashboardData = () => {
  const { data: session } = useSession();
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const processData = (invoices: InvoiceAPI[], products: Product[]): DashboardData => {
    const salesByMonthMap = new Map<string, number>();
    const topProductsMap = new Map<string, number>();
    const topCustomersMap = new Map<string, number>();
    let totalRevenue = 0;

    invoices.forEach(invoice => {
      // 1. Total de Facturación y Ventas por Mes
      totalRevenue += invoice.total;
      const month = new Date(invoice.issuedAt).toLocaleString('es-ES', { month: 'short', year: 'numeric' });
      salesByMonthMap.set(month, (salesByMonthMap.get(month) || 0) + invoice.total);

      // 2. Ventas por Cliente
      const customerName = invoice.customer?.name || 'Cliente Desconocido';
      topCustomersMap.set(customerName, (topCustomersMap.get(customerName) || 0) + invoice.total);

      // 3. Ventas por Producto
      invoice.items.forEach(item => {
        const productName = products.find(p => p.id === item.productId)?.name || 'Producto Desconocido';
        const itemTotal = item.qty * item.price;
        topProductsMap.set(productName, (topProductsMap.get(productName) || 0) + itemTotal);
      });
    });

    const salesByMonth = Array.from(salesByMonthMap.entries()).map(([month, total]) => ({ month, total }));
    const topProducts = Array.from(topProductsMap.entries()).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total).slice(0, 5);
    const topCustomers = Array.from(topCustomersMap.entries()).map(([name, total]) => ({ name, total })).sort((a, b) => b.total - a.total).slice(0, 5);

    return { salesByMonth, topProducts, topCustomers, totalRevenue, totalInvoices: invoices.length };
  };

  const fetchData = useCallback(async () => {
    if (!session?.user?.companyId || !session.accessToken) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const [invoicesRes, productsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/invoices/company/${session.user.companyId}`, {
          headers: { 'Authorization': `Bearer ${session.accessToken}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies/${session.user.companyId}/inventory`, {
          headers: { 'Authorization': `Bearer ${session.accessToken}` },
        })
      ]);

      if (!invoicesRes.ok || !productsRes.ok) throw new Error('No se pudieron cargar los datos del dashboard.');

      const invoicesData: InvoiceAPI[] = await invoicesRes.json();
      const productsData: Product[] = await productsRes.json();
      
      const processed = processData(invoicesData, productsData);
      setData(processed);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ocurrió un error.');
    } finally {
      setIsLoading(false);
    }
  }, [session]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, isLoading, error };
};