import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
// Iconos disponibles para uso futuro si se necesitan
// import { Mail, MessageSquare, User, Building, Phone } from "lucide-react";

export default function ContactoPage() {
  return (
    <div className="bg-background">
      <Navbar />
      <main className="container mx-auto px-6 py-24 md:py-32">
        <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary">Hablemos</h1>
            <p className="mt-4 text-lg text-foreground/70">
                ¿Tienes una pregunta o necesitas ayuda? Rellena el formulario y nuestro equipo se pondrá en contacto contigo.
            </p>
        </div>

        <div className="mt-12 max-w-xl mx-auto">
            <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input id="nombre" label="Tu Nombre" type="text" required />
                    <Input id="empresa" label="Nombre de tu Empresa" type="text" />
                </div>
                <Input id="email" label="Tu Correo Electrónico" type="email" required />
                <div>
                    <label htmlFor="mensaje" className="block text-sm font-medium text-foreground/80 mb-2">Tu Mensaje</label>
                    <textarea 
                        id="mensaje" 
                        rows={5}
                        className="block w-full px-4 py-3 text-foreground bg-card border border-border rounded-lg placeholder-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary"
                        required
                    />
                </div>
                <Button type="submit" className="w-full">Enviar Mensaje</Button>
            </form>

             
            <div className="mt-8 text-center p-6 border-2 border-dashed border-primary/50 rounded-lg">
                <h3 className="font-bold text-primary">¿Eres usuario Premium?</h3>
                <p className="text-foreground/70 mt-2">Accede a nuestro soporte prioritario por WhatsApp.</p>
                <Button className="mt-4 opacity-50 cursor-not-allowed">
                    Contactar por WhatsApp
                    <span className="text-xs ml-2">(Próximamente)</span>
                </Button>
                 
            </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}