'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from '@/components/ui/Select';
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Category } from '@/mocks/types';

const paises = [ { value: 'ARGENTINA', label: 'Argentina' }, { value: 'URUGUAY', label: 'Uruguay' }, { value: 'CHILE', label: 'Chile' } ];
const monedas = [ { value: 'ARS', label: 'Peso Argentino (ARS)' }, { value: 'CLP', label: 'Peso Chileno (CLP)' }, { value: 'USD', label: 'Dólar (USD)' }, { value: 'EUR', label: 'Euro (EUR)' } ];

export default function NuevoProveedorPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            if(!session) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories/company/${session.user.companyId}`, { headers: { 'Authorization': `Bearer ${session.accessToken}` } });
                if (res.ok) setCategories(await res.json());
            } catch (error) { toast.error("Error al cargar categorías"); }
        }
        if(session) fetchCategories();
    }, [session]);

    const formik = useFormik({
        initialValues: {
            name: '',
            email: '',
            phone: '',
            contactName: '',
            address: '',
            country: 'ARGENTINA',
            categoryId: '',
           
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre es requerido'),
            email: Yup.string().email('Email no válido').required('El email es requerido'),
            phone: Yup.string().required('El teléfono es requerido'),
            contactName: Yup.string().required('El nombre del contacto es requerido'),
            address: Yup.string().required('La dirección es requerida'),
            country: Yup.string().required('El país es requerido'),
            categoryId: Yup.string().required('La categoría es requerida'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            if (!session?.user?.companyId || !session.accessToken) {
                toast.error("Sesión o ID de compañía no válidos.");
                setSubmitting(false);
                return;
            }
            setSubmitting(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/supplier`, { 
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session.accessToken}` },
                    body: JSON.stringify({
                        ...values,
                        companyId: session.user.companyId 
                    }),
                });
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Error al crear el proveedor.');
                }
                toast.success('¡Proveedor creado con éxito!');
                router.push(PATHROUTES.pymes.proveedores);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Ocurrió un error desconocido.');
            } finally {
                setSubmitting(false);
            }
        },
    });

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href={PATHROUTES.pymes.proveedores}><Button variant="outline" className="px-3"><ArrowLeft className="h-5 w-5" /></Button></Link>
                <h1 className="text-3xl font-bold text-foreground">Crear Nuevo Proveedor</h1>
            </div>
            <Card isClickable={false}>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input id="name" label="Nombre del Proveedor" {...formik.getFieldProps('name')} />
                        <Input id="contactName" label="Nombre de Contacto" {...formik.getFieldProps('contactName')} />
                        <Input id="email" label="Email" type="email" {...formik.getFieldProps('email')} />
                        <Input id="phone" label="Teléfono" {...formik.getFieldProps('phone')} />
                        <Input id="address" label="Dirección (para el mapa)" {...formik.getFieldProps('address')} />
                        <Select id="country" label="País" {...formik.getFieldProps('country')}>
                            {paises.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
                        </Select>
                        <Select id="categoryId" label="Categoría" {...formik.getFieldProps('categoryId')}>
                             <option value="">Selecciona una categoría</option>
                             {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                        </Select>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Guardando...' : 'Guardar Proveedor'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}