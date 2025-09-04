import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Paintbrush, ArrowLeft } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import Link from "next/link";
import { PATHROUTES } from "@/constants/pathroutes";
import { Button } from "@/components/ui/Button";

export default function BrandCustomizationPage() {
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
                        <Paintbrush className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Tu Marca, Tu Plataforma</h1>
                        <p className="mt-4 text-lg text-foreground/70">Una experiencia cohesiva que refuerza tu identidad.</p>
                    </div>
                    <PremiumCard>
                        <p className="text-lg text-foreground/80 leading-relaxed">
                            Tu negocio tiene una identidad única, y tu software de gestión debería reflejarla. Con la personalización de marca, puedes reemplazar nuestro logo por el tuyo y ajustar la paleta de colores completa de la aplicación para que coincida con tu identidad corporativa. 
                            Esto no es solo un cambio estético; es una forma de hacer que tu equipo se sienta completamente en casa y de presentar una imagen unificada y profesional en cada interacción.
                        </p>
                    </PremiumCard>
                </div>
            </main>
            <Footer />
        </div>
    );
}