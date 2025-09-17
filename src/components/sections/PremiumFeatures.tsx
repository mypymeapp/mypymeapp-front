'use client';

import { useState } from 'react';
import { BrainCircuit, Paintbrush, ShieldCheck } from 'lucide-react';
import { PATHROUTES } from '@/constants/pathroutes';
import { NeonSign } from '../ui/NeonSign';
import Link from 'next/link';

const features = [
    {
        icon: BrainCircuit,
        title: "Inteligencia Artificial Avanzada",
        description: "Obtén análisis y proyecciones al instante. Es como tener tu propio analista de datos 24/7.",
        href: PATHROUTES.features.ia,
    },
    {
        icon: Paintbrush,
        title: "Personalización de Marca",
        description: "Adapta la plataforma a tu identidad visual con tu logo y paleta de colores para una experiencia integrada.",
        href: PATHROUTES.features.personalizacion,
    },
    {
        icon: ShieldCheck,
        title: "Roles y Permisos de Equipo",
        description: "Controla quién ve qué. Asigna roles específicos a tus empleados para proteger información sensible.",
        href: PATHROUTES.features.roles,
    }
];

export default function PremiumFeatures() {
    const [activeFeature, setActiveFeature] = useState(0);

    return (
        <section className="py-20 sm:py-32">
            <div className="container mx-auto px-6">
                <div className="bg-card rounded-2xl p-8 md:p-16 text-center">
                    <NeonSign
                        as="h2"
                        text="Disfruta de Ventajas Únicas"
                        className="w-full max-w-5xl mx-auto"
                        textClassName="text-[12vw] sm:text-[10vw] md:text-6xl"
                    />
                    <p className="mt-4 max-w-2xl mx-auto text-lg text-foreground/70">
                        Al hacerte premium, desbloqueas herramientas diseñadas para darte una ventaja competitiva decisiva.
                    </p>

                    <div className="mt-16 max-w-6xl mx-auto">
                        <div className="flex flex-col md:flex-row gap-8 md:gap-12">
                            <div className="flex md:flex-col justify-center gap-4">
                                {features.map((feature, index) => (
                                    <Link
                                        href={feature.href}
                                        key={feature.title}
                                        onMouseEnter={() => setActiveFeature(index)}
                                        className={`p-4 rounded-lg text-left transition-all duration-300 w-full md:w-64 block ${
                                            activeFeature === index
                                                ? 'bg-primary/10 border-l-4 border-primary'
                                                : 'hover:bg-background'
                                        }`}
                                    >
                                        <h3 className="font-bold text-foreground text-lg">{feature.title}</h3>
                                    </Link>
                                ))}
                            </div>

                            <div className="relative w-full h-80 md:h-96 rounded-2xl p-1 bg-rgb-gradient bg-400% animate-animated-gradient">
                                <div className="relative w-full h-full bg-background rounded-[10px] overflow-hidden">
                                    {features.map((feature, index) => (
                                        <div
                                            key={feature.title}
                                            className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center p-8 ${
                                                activeFeature === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                            }`}
                                        >
                                            <div className="text-center">
                                                <feature.icon className="w-24 h-24 text-primary mx-auto" />
                                                <p className="mt-8 text-xl text-foreground/80 font-medium">{feature.description}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}