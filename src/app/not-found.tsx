import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { PATHROUTES } from "@/constants/pathroutes";
import { Compass, ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="bg-background">
        <Navbar />
        <main className="min-h-screen flex items-center justify-center text-center px-6">
            <div>
                <Compass className="w-24 h-24 text-primary/30 mx-auto mb-8 animate-pulse" />
                <h1 className="text-6xl md:text-8xl font-extrabold text-foreground">404</h1>
                <h2 className="mt-4 text-2xl md:text-3xl font-bold text-foreground/80">Página no Encontrada</h2>
                <p className="mt-4 max-w-md mx-auto text-lg text-foreground/60">
                    Parece que te has desviado del camino. Volvamos a un lugar seguro.
                </p>
                <div className="mt-10">
                    <Link href={PATHROUTES.home}>
                        <Button>
                            <ArrowLeft className="mr-2 h-5 w-5" />
                            Volver a Inicio
                        </Button>
                    </Link>
                </div>
            </div>
        </main>
        <Footer />
    </div>
  );
}