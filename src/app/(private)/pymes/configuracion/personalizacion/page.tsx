'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ArrowLeft, RefreshCw } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';

const themeVariables = [
    { id: 'primary', label: 'Color Primario', description: 'Acentos, botones, etc.' },
    { id: 'background', label: 'Fondo Principal', description: 'Fondo de toda la app.' },
    { id: 'foreground', label: 'Texto Principal', description: 'Texto general.' },
    { id: 'card', label: 'Fondo de Tarjetas', description: 'Contenedores y modales.' },
    { id: 'border', label: 'Bordes', description: 'Líneas y separadores.' },
    { id: 'button-text', label: 'Texto de Botón', description: 'Texto sobre botones primarios.' },
];

export default function PersonalizacionPage() {
    const [colors, setColors] = useState<Record<string, string>>({});
    const [initialColors, setInitialColors] = useState<Record<string, string>>({});
    const [isDark, setIsDark] = useState(false);

    useEffect(() => {
        const isCurrentlyDark = document.documentElement.classList.contains('dark');
        setIsDark(isCurrentlyDark);

        const rootStyle = getComputedStyle(document.documentElement);
        const currentColors: Record<string, string> = {};
        const mode = isCurrentlyDark ? 'dark' : 'light';
        
        themeVariables.forEach(v => {
            currentColors[v.id] = rootStyle.getPropertyValue(`--${v.id}-${mode}`).trim();
        });
        
        setColors(currentColors);
        setInitialColors(currentColors);
    }, []);

    const handleColorChange = (variableId: string, color: string) => {
        setColors(prev => ({ ...prev, [variableId]: color }));
        document.body.style.setProperty(`--${variableId}`, color);
    };
    
    const handleReset = () => {
        Object.entries(initialColors).forEach(([variableId, color]) => {
            document.body.style.setProperty(`--${variableId}`, color);
        });
        setColors(initialColors);
        toast('Colores restaurados.', { icon: '🎨' });
    };

    const handleSaveChanges = () => {
        toast.success('¡Cambios guardados con éxito! (simulación)');
    };

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href={PATHROUTES.pymes.configuracion}>
                    <Button variant="outline" className="px-3"><ArrowLeft className="h-5 w-5" /></Button>
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Personalización de Marca</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card isClickable={false} className="space-y-6">
                        <p className="text-sm text-foreground/70">Estás editando el tema <span className="font-bold text-primary">{isDark ? 'Oscuro' : 'Claro'}</span>.</p>
                        {themeVariables.map(variable => (
                            <div key={variable.id}>
                                <label htmlFor={variable.id} className="font-bold text-foreground">{variable.label}</label>
                                <p className="text-xs text-foreground/60 mb-2">{variable.description}</p>
                                <div className="flex items-center gap-4">
                                    <input
                                        type="color"
                                        id={variable.id}
                                        value={colors[variable.id] || '#000000'}
                                        onChange={(e) => handleColorChange(variable.id, e.target.value)}
                                        className="w-12 h-12 p-1 bg-transparent border-none cursor-pointer"
                                    />
                                    <input 
                                        type="text"
                                        value={colors[variable.id] || ''}
                                        onChange={(e) => handleColorChange(variable.id, e.target.value)}
                                        className="w-full px-3 py-2 text-foreground bg-background border border-border rounded-lg"
                                    />
                                </div>
                            </div>
                        ))}
                    </Card>
                    <div className="flex gap-4 mt-6">
                        <Button onClick={handleSaveChanges} className="w-full">Guardar Cambios</Button>
                        <Button variant="outline" onClick={handleReset}><RefreshCw className="h-5 w-5"/></Button>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    <div className="sticky top-24">
                        <h2 className="text-xl font-bold mb-4">Previsualización en Vivo</h2>
                        <div className="p-8 rounded-2xl transition-colors duration-300 bg-background border border-border text-foreground">
                             <h3 className="text-3xl font-bold mb-2 text-primary">My PYME App</h3>
                             <p>Este es un ejemplo de cómo se verá tu aplicación con los nuevos colores. Juega con las opciones de la izquierda y mira cómo todo cambia al instante.</p>
                             <div className="mt-6 p-6 rounded-lg bg-card border border-border">
                                <h4 className="font-bold">Una tarjeta de ejemplo</h4>
                                <p className="opacity-70 mt-1">El contenido dentro de las tarjetas usará el color de fondo que elijas.</p>
                             </div>
                             <Button className="mt-6">Botón Principal</Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}