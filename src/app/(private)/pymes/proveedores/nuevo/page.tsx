'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';

const monedas = [
    { value: 'ARS', label: 'Peso Argentino (ARS)' },
    { value: 'CLP', label: 'Peso Chileno (CLP)' },
    { value: 'USD', label: 'Dólar Estadounidense (USD)' },
    { value: 'EUR', label: 'Euro (EUR)' },
];

export default function NuevoProveedorPage() {
    const formik = useFormik({
        initialValues: {
            nombre: '',
            cif: '',
            telefono: '',
            email: '',
            nombreContacto: '',
            direccion: '',
            moneda: 'USD',
        },
        validationSchema: Yup.object({
            nombre: Yup.string().required('El nombre es requerido'),
            cif: Yup.string().required('La identificación fiscal es requerida'),
            telefono: Yup.string().required('El teléfono es requerido'),
            email: Yup.string().email('Email no válido').required('El email es requerido'),
            nombreContacto: Yup.string().required('El nombre del contacto es requerido'),
            direccion: Yup.string().required('La dirección es requerida'),
            moneda: Yup.string().required('La moneda es requerida'),
        }),
        onSubmit: (values, { resetForm }) => {
            toast.success('¡Proveedor creado con éxito! (simulación)');
            console.log(values);
            resetForm();
        },
    });

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href={PATHROUTES.pymes.proveedores}>
                    <Button variant="outline" className="px-3">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <h1 className="text-3xl font-bold text-foreground">Crear Nuevo Proveedor</h1>
            </div>

            <Card isClickable={false}>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Input id="nombre" label="Nombre del Proveedor" {...formik.getFieldProps('nombre')} />
                            {formik.touched.nombre && formik.errors.nombre ? <div className="text-red-500 text-xs mt-1">{formik.errors.nombre}</div> : null}
                        </div>
                        <div>
                            <Input id="cif" label="Identificación Fiscal (CUIT/NIF/etc.)" {...formik.getFieldProps('cif')} />
                            {formik.touched.cif && formik.errors.cif ? <div className="text-red-500 text-xs mt-1">{formik.errors.cif}</div> : null}
                        </div>
                        <div>
                            <Input id="telefono" label="Teléfono" {...formik.getFieldProps('telefono')} />
                            {formik.touched.telefono && formik.errors.telefono ? <div className="text-red-500 text-xs mt-1">{formik.errors.telefono}</div> : null}
                        </div>
                        <div>
                            <Input id="email" label="Email de Contacto" type="email" {...formik.getFieldProps('email')} />
                            {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div> : null}
                        </div>
                        <div>
                            <Input id="nombreContacto" label="Nombre de la Persona de Contacto" {...formik.getFieldProps('nombreContacto')} />
                            {formik.touched.nombreContacto && formik.errors.nombreContacto ? <div className="text-red-500 text-xs mt-1">{formik.errors.nombreContacto}</div> : null}
                        </div>
                         <div>
                            <label htmlFor="moneda" className="block text-sm font-medium text-foreground/80 mb-2">Moneda Principal</label>
                            <select id="moneda" {...formik.getFieldProps('moneda')} className="w-full px-4 py-3 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                                {monedas.map(m => <option key={m.value} value={m.value}>{m.label}</option>)}
                            </select>
                            {formik.touched.moneda && formik.errors.moneda ? <div className="text-red-500 text-xs mt-1">{formik.errors.moneda}</div> : null}
                        </div>
                    </div>
                    <div>
                        <Input id="direccion" label="Dirección (para el mapa)" {...formik.getFieldProps('direccion')} />
                        {formik.touched.direccion && formik.errors.direccion ? <div className="text-red-500 text-xs mt-1">{formik.errors.direccion}</div> : null}
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit">Guardar Proveedor</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}