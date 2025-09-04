'use client';

import { BrainCircuit, Paintbrush, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';

const features = [
    {
        icon: BrainCircuit,
        title: "Inteligencia Artificial Avanzada",
        description: "Haz preguntas en lenguaje natural y obtén análisis, proyecciones y resúmenes al instante. Es como tener tu propio analista de datos 24/7.",
        href: PATHROUTES.features.ia,
    },
    {
        icon: Paintbrush,
        title: "Personalización de Marca Completa",
        description: "Adapta la plataforma a tu identidad visual. Sube tu logo y elige tu paleta de colores para una experiencia totalmente integrada y profesional.",
        href: PATHROUTES.features.personalizacion,
    },
    {
        icon: ShieldCheck,
        title: "Roles y Permisos de Equipo",
        description: "Controla quién ve qué. Asigna roles específicos a tus empleados para proteger la información sensible y optimizar los flujos de trabajo.",
        href: PATHROUTES.features.roles,
    }
];

const NeonTitle = ({ text }: { text: string }) => {
    return (
        <>
            {text.split('').map((letter, index) => (
                <span
                    key={index}
                    className="inline-block refined-neon-letter"
                    style={{ animationDelay: `${index * 0.05}s` }}
                >
                    {letter === ' ' ? '\u00A0' : letter}
                </span>
            ))}
        </>
    );
};

export default function PremiumFeatures() {
    return (
        <section className="bg-background py-20">
            <div className="container mx-auto px-6 text-center">
                <h2 
                    className="text-5xl md:text-6xl font-extrabold tracking-widest"
                    aria-label="Disfruta de Ventajas Únicas"
                >
                    <NeonTitle text="Disfruta de Ventajas Únicas" />
                </h2>
                <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/70">
                    Al hacerte premium, desbloqueas herramientas diseñadas para darte una ventaja competitiva decisiva.
                </p>

                <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-16">
                    {features.map((feature) => (
                        <Link href={feature.href} key={feature.title} className="block group">
                            <div className="relative p-1 rounded-2xl animate-neon-pulse transition-transform duration-300 group-hover:-translate-y-2 h-full">
                                <div className="relative overflow-visible bg-card rounded-xl p-8 text-center h-full flex flex-col">
                                    <div className="absolute -top-16 left-1/2 -translate-x-1/2">
                                        <div className="w-24 h-24 rounded-full bg-primary text-button-text flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                                            <feature.icon className="w-12 h-12" />
                                        </div>
                                    </div>
                                    <div className="pt-10 flex-grow flex flex-col">
                                        <h3 className="text-2xl font-bold text-foreground">{feature.title}</h3>
                                        <p className="mt-4 text-foreground/70 flex-grow">{feature.description}</p>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}