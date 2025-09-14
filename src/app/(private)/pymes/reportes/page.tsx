
import { Card } from "@/components/ui/Card";
import { BarChart3 } from "lucide-react";

export default function ReportesPage() {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Centro de Reportes</h1>

            
            <Card>
                <div className="flex flex-col items-center justify-center text-center p-12">
                    <BarChart3 className="w-16 h-16 text-primary/50 mb-4" />
                    <h2 className="text-xl font-semibold text-foreground">Reportes Avanzados Próximamente</h2>
                    <p className="text-foreground/60 mt-2 max-w-md">
                        Estamos trabajando para traerte análisis detallados y gráficos interactivos sobre tus ventas, compras y rendimiento financiero.
                    </p>
                </div>
            </Card>
            
        </div>
    )
}