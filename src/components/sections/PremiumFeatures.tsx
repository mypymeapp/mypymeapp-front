'use client';

import { useState } from 'react';
import { BrainCircuit, Paintbrush, ShieldCheck } from 'lucide-react';
import { PATHROUTES } from '@/constants/pathroutes';
import { NeonSign } from '../ui/NeonSign';
import  NeonBorder  from '../ui/NeonBorder';
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
        <section className="py-20 sm:py-32 relative z-10">
            <div className="container mx-auto px-4 sm:px-6">
                <NeonBorder rx={0}>
                    <div className="p-6 md:p-12 lg:p-16 text-center">
                        
                    
                        <NeonSign
                            as="h2"
                            text="Disfruta de Ventajas Únicas"
                            className="w-full max-w-5xl mx-auto"
                            textClassName="text-4xl sm:text-5xl md:text-6xl lg:text-6xl"
                        />
                        
                      
                        <p className="mt-4 max-w-2xl mx-auto text-base sm:text-lg text-foreground/70">
                            Al hacerte premium, desbloqueas herramientas diseñadas para darte una ventaja competitiva decisiva.
                        </p>

                        
                        <div className="mt-12 lg:mt-16 max-w-6xl mx-auto">
                            <div className="flex flex-col lg:flex-row gap-6 md:gap-8 lg:gap-12">
                                
                                
                               <div className="flex flex-row gap-4 overflow-x-auto pb-4 lg:flex-col lg:overflow-visible lg:justify-center lg:gap-4 lg:pb-0 scrollbar-hide">
                                    {features.map((feature, index) => (
                                        <Link
                                            href={feature.href}
                                            key={feature.title}
                                            onMouseEnter={() => setActiveFeature(index)}
                                            className={`p-4 text-left transition-all duration-300 min-w-[250px] lg:w-full block  ${
                                                activeFeature === index
                                                    ? 'bg-primary/10 border-b-4 border-primary lg:border-l-4 lg:border-b-0'
                                                    : 'hover:bg-background/50'
                                            }`}
                                        >
                                            <h3 className="font-bold text-foreground text-base sm:text-lg">
                                                {feature.title}
                                            </h3>
                                        </Link>
                                    ))} 
                                </div>

                                
                                <div className="relative w-full h-60 sm:h-80 md:h-96 lg:flex-1 border">
                                    <div className="relative w-full h-full bg-background overflow-hidden">
                                        {features.map((feature, index) => (
                                            <div
                                                key={feature.title}
                                                className={`absolute inset-0 transition-opacity duration-500 flex items-center justify-center p-4 sm:p-6 md:p-8 ${
                                                    activeFeature === index ? 'opacity-100' : 'opacity-0 pointer-events-none'
                                                }`}
                                            >
                                                <div className="text-center">
                                                    <feature.icon className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 text-primary mx-auto" />
                                                    <p className="mt-4 sm:mt-6 md:mt-8 text-sm sm:text-base md:text-lg text-foreground/80 font-medium">
                                                        {feature.description}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </NeonBorder>
            </div>
        </section>
    );
    }
