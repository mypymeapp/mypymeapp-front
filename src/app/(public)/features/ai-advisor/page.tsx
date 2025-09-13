import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BrainCircuit, ArrowLeft } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import Link from "next/link";
import { PATHROUTES } from "@/constants/pathroutes";
import { Button } from "@/components/ui/Button";

export default function AiAdvisorPage() {
    return(
        <div className="bg-background">
            <Navbar />
            <main className="container mx-auto px-6 py-24 md:py-32">
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8">
                        <Link href={PATHROUTES.home}>
                            <Button variant="outline">
                                <ArrowLeft className="mr-2 h-4 w-4" />
                                Volver a Inicio
                            </Button>
                        </Link>
                    </div>
                    <div className="text-center mb-12">
                        <BrainCircuit className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Tu Asesor de Negocios Virtual</h1>
                        <p className="mt-4 text-lg text-foreground/70">La Inteligencia Artificial de Gemini, integrada en tu flujo de trabajo.</p>
                    </div>
                    <PremiumCard>
                        
                        <p className="text-lg text-foreground/80 leading-relaxed">
                            Imagina poder preguntar ¿Cuál fue mi producto más vendido en el último trimestre? o Proyecta mis ventas para los próximos 6 meses si la tendencia actual continúa y recibir una respuesta clara y concisa en segundos. 
                            Nuestra integración con la IA te permite conversar con tus datos. Identifica patrones, descubre oportunidades de venta cruzada y toma decisiones basadas en análisis profundos, todo sin escribir una sola fórmula.
                        </p>
                    </PremiumCard>
                </div>
            </main>
            <Footer />
        </div>
    );
}