'use client';

import React from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowLeft, ArrowRight, Rocket } from 'lucide-react';
import { Button } from '../ui/Button';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';

const slides = [
    {
        title: "Control Total, Complejidad Cero.",
        description: "Olvídate de las fórmulas confusas. Nuestra interfaz está diseñada para que cualquier persona en tu equipo pueda usarla desde el primer día, sin necesidad de ser un experto."
    },
    {
        title: "Tu Asesor de Negocios Virtual.",
        description: "Integramos la potencia de la IA para darte recomendaciones claras y accionables. Descubre oportunidades que tus hojas de cálculo nunca te mostrarán."
    },
    {
        title: "Crece sin Miedo, Crece sin Límites.",
        description: "Nuestra plataforma escala contigo, manejando miles de transacciones con la misma facilidad que las primeras diez. Tu Excel no puede decir lo mismo."
    },
    {
        title: "Tus Datos, Tu Fortaleza. Protegida.",
        description: "Protegemos tu activo más valioso con seguridad de nivel bancario, control de acceso y copias de seguridad automáticas. Duerme tranquilo."
    },
    {
        title: "Tu Marca, Tu Plataforma.",
        description: "Con nuestros planes premium, puedes personalizar la aplicación con tu propio logo y colores. Haz que tu equipo se sienta en casa."
    }
];

export const Hero = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });

  const scrollPrev = () => emblaApi && emblaApi.scrollPrev();
  const scrollNext = () => emblaApi && emblaApi.scrollNext();

  return (
    <section className="relative container mx-auto px-6 pt-32 pb-16 text-center bg-card rounded-b-3xl">
      <h2 className="text-3xl font-bold text-foreground/80 mb-8">¿Por qué My PYME App?</h2>
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div className="flex-[0_0_100%] min-w-0 px-4" key={index}>
              <h1 className="text-4xl md:text-6xl font-extrabold text-primary leading-tight">
                {slide.title}
              </h1>
              <p className="mt-6 max-w-3xl mx-auto text-lg md:text-xl text-foreground/70">
                {slide.description}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute left-0 top-1/2 -translate-y-1/2 hidden md:block">
        <button onClick={scrollPrev} className="p-3 rounded-full bg-background/50 hover:bg-background border border-border">
          <ArrowLeft />
        </button>
      </div>
      <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden md:block">
        <button onClick={scrollNext} className="p-3 rounded-full bg-background/50 hover:bg-background border border-border">
          <ArrowRight />
        </button>
      </div>

      <div className="mt-10">
        <Link href={PATHROUTES.register}>
            <Button>
                <Rocket className="mr-2 h-5 w-5" />
                No esperes más, comienza ahora
            </Button>
        </Link>
      </div>
    </section>
  );
};