import { Card } from "@/components/ui/Card";
import { PremiumCard } from "@/components/ui/PremiumCard";
import { mockCompras, mockFacturas } from "@/mocks/data";
import { ArrowDownRight, ArrowUpRight, DollarSign, Package, AlertTriangle } from "lucide-react";
import { formatCurrency } from "@/utils/formatters";

const calcularMetricas = () => {
    const totalCompras = mockCompras.reduce((sum, compra) => sum + compra.monto, 0);
    const totalRecibido = mockCompras.filter(c => c.estadoEntrega === 'Recibido').reduce((sum, c) => sum + c.monto, 0);
    const facturasVencidas = mockFacturas.filter(f => f.estado === 'Vencida');
    const deudaTotal = facturasVencidas.reduce((sum, f) => sum + f.monto, 0);

    return { totalCompras, totalRecibido, facturasVencidas, deudaTotal };
}

export default function ReportesPage() {
    const { totalCompras, totalRecibido, facturasVencidas, deudaTotal } = calcularMetricas();

    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Centro de Reportes</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <PremiumCard>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-foreground/70">Total en Compras</h3>
                        <Package className="w-5 h-5 text-foreground/50" />
                    </div>
                    <p className="text-3xl font-bold text-primary">{formatCurrency(totalCompras, 'USD')}</p>
                    <p className="text-xs text-foreground/60 mt-1">Este mes (en USD)</p>
                </PremiumCard>
                <PremiumCard>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-foreground/70">Mercancía Recibida</h3>
                        <ArrowDownRight className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{formatCurrency(totalRecibido, 'USD')}</p>
                    <p className="text-xs text-foreground/60 mt-1">Valorizado (en USD)</p>
                </PremiumCard>
                <PremiumCard>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-foreground/70">Facturas Vencidas</h3>
                        <AlertTriangle className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-3xl font-bold text-foreground">{facturasVencidas.length}</p>
                    <p className="text-xs text-foreground/60 mt-1">Requieren acción inmediata</p>
                </PremiumCard>
                <PremiumCard>
                    <div className="flex justify-between items-center mb-2">
                        <h3 className="text-sm font-semibold text-foreground/70">Deuda con Proveedores</h3>
                        <DollarSign className="w-5 h-5 text-foreground/50" />
                    </div>
                    <p className="text-3xl font-bold text-red-500">{formatCurrency(deudaTotal, 'USD')}</p>
                    <p className="text-xs text-foreground/60 mt-1">Total vencido (en USD)</p>
                </PremiumCard>
            </div>

            <Card isClickable={false}>
                 <h2 className="text-xl font-bold mb-4">Análisis Detallado</h2>
                 <p className="text-foreground/70">
                    Próximamente: Gráficos interactivos de compras por proveedor, evolución de deudas y más.
                 </p>
            </Card>
        </div>
    )
}