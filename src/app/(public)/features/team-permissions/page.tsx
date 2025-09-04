import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { ShieldCheck, ArrowLeft } from "lucide-react";
import { PremiumCard } from "@/components/ui/PremiumCard";
import Link from "next/link";
import { PATHROUTES } from "@/constants/pathroutes";
import { Button } from "@/components/ui/Button";

export default function TeamPermissionsPage() {
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
                        <ShieldCheck className="w-16 h-16 text-primary mx-auto mb-4" />
                        <h1 className="text-4xl md:text-5xl font-extrabold text-foreground">Control Total sobre tu Equipo</h1>
                        <p className="mt-4 text-lg text-foreground/70">Define quién puede ver y hacer qué, con total granularidad.</p>
                    </div>
                    <PremiumCard>
                        <p className="text-lg text-foreground/80 leading-relaxed">
                            A medida que tu equipo crece, la seguridad y la organización se vuelven cruciales. Nuestro sistema de roles y permisos te permite crear perfiles personalizados. ¿Quieres que un vendedor solo vea clientes y ventas, pero no los costos de los proveedores? Hecho. ¿Necesitas que un gestor de almacén solo pueda modificar el inventario? Fácil. 
                            Tú tienes el control total para asegurar que cada miembro del equipo tenga acceso únicamente a la información que necesita para hacer su trabajo, protegiendo tus datos más sensibles.
                        </p>
                    </PremiumCard>
                </div>
            </main>
            <Footer />
        </div>
    );
}