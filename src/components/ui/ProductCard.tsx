'use client';

import { useState } from 'react';
import { Card } from "./Card";
import { Producto } from "@/mocks/types";
import { Input } from './Input';
import { Button } from './Button';
import { formatCurrency } from '@/utils/formatters';

interface ProductoCardProps {
    producto: Producto;
    moneda: 'ARS' | 'CLP' | 'UYU' | 'MXN' | 'EUR';
    isBaseCurrency: boolean;
    exchangeRate: number;
}

export const ProductoCard = ({ producto, moneda, isBaseCurrency, exchangeRate }: ProductoCardProps) => {
    const [margen, setMargen] = useState(producto.margenUtilidad);

    const costoLocal = producto.costo;
    const precioReventaLocal = costoLocal * (1 + margen / 100);
    
    const costoBase = isBaseCurrency ? costoLocal : costoLocal / exchangeRate;
    const precioReventaBase = isBaseCurrency ? precioReventaLocal : precioReventaLocal / exchangeRate;

    return (
        <Card isClickable={false}>
            <h3 className="font-bold text-foreground text-lg">{producto.nombre}</h3>
            <p className="text-foreground/60 text-sm mb-4">{producto.descripcion}</p>
            
            <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div>
                    <p className="font-semibold text-foreground/70">Costo ({moneda})</p>
                    <p className="font-bold text-foreground">{formatCurrency(costoLocal, moneda)}</p>
                </div>
                <div>
                    <p className="font-semibold text-foreground/70">Costo (USD)</p>
                    <p className="font-bold text-foreground">{formatCurrency(costoBase, 'USD')}</p>
                </div>
                 <div>
                    <p className="font-semibold text-foreground/70">Reventa ({moneda})</p>
                    <p className="font-bold text-primary">{formatCurrency(precioReventaLocal, moneda)}</p>
                </div>
                 <div>
                    <p className="font-semibold text-foreground/70">Reventa (USD)</p>
                    <p className="font-bold text-primary">{formatCurrency(precioReventaBase, 'USD')}</p>
                </div>
            </div>

            <div className="flex items-end gap-2">
                <div className="flex-grow">
                     <label htmlFor={`margen-${producto.id}`} className="block text-xs font-medium text-foreground/80 mb-1">Margen de Utilidad (%)</label>
                     <input
                        type="number"
                        id={`margen-${producto.id}`}
                        value={margen}
                        onChange={(e) => setMargen(Number(e.target.value))}
                        className="w-full px-3 py-2 text-foreground bg-background border border-border rounded-lg"
                    />
                </div>
                <Button variant='outline' className="px-3 py-2 h-[42px]">Guardar</Button>
            </div>
        </Card>
    )
}