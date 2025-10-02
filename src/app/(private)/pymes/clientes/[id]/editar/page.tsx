


"use client";

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { ArrowLeft, ListOrdered, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useSession } from 'next-auth/react';

import { Customer } from '@/types/customer'; 

import { useRouter, useParams } from 'next/navigation'; // 🟢 Importa useParams

// export default function EditarClientePage({ params }: { params: { id: string } }) {
export default function EditarClientePage() {

    // 🟢 Usa useParams para obtener los parámetros de la URL
    const params = useParams();
    const customerId = params.id as string;

   // const { id: customerId } = params;
    const { data: session } = useSession();
    const router = useRouter();
    // 🔹 Cambiamos los campos del estado inicial para que coincidan con la API
    const [initialValues, setInitialValues] = useState({ name: '', email: '', phone: '', notes: '' });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCustomer = async () => {
            if (!session?.accessToken) return;
            try {
                // 🔹 Llamada a la API real para obtener el cliente por ID
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${customerId}`, {
                    headers: { 'Authorization': `Bearer ${session.accessToken}` }
                });
                if (!res.ok) throw new Error('No se pudo cargar el cliente.');
                const customerData: Customer = await res.json();
                
                // 🔹 Mapeamos los datos de la API a los valores del formulario
                setInitialValues({
                    name: customerData.name,
                    email: customerData.email,
                    phone: customerData.phone || '',
                    notes: customerData.notes || '',
                });
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Error al cargar los datos del cliente');
                router.push(PATHROUTES.pymes.clientes);
            } finally {
                setLoading(false);
            }
        };
        if (session) fetchCustomer();
    }, [session, customerId, router]);

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        // 🔹 Validamos los campos de la nueva API (name, email, phone)
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre es requerido'),
            email: Yup.string().email('Ingresa un email válido').required('El email es requerido'),
            phone: Yup.string(),
            notes: Yup.string(),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
                // 🔹 Llamada a la API real para actualizar el cliente
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/customers/${customerId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${session?.accessToken}`,
                    },
                    // 🔹 Enviamos los valores del formulario directamente
                    body: JSON.stringify(values),
                });
                if (!res.ok) throw new Error('Error al actualizar el cliente');
                toast.success('¡Cliente actualizado con éxito!');
                router.push(PATHROUTES.pymes.clientes);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Error desconocido');
            } finally {
                setSubmitting(false);
            }
        },
    });

    if (loading) {
        return (
            <div className="p-8 h-full flex justify-center items-center">
               <ListOrdered className="animate-spin h-12 w-12 text-primary" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href={PATHROUTES.pymes.clientes}><Button variant="outline" className="px-3"><ArrowLeft className="h-5 w-5" /></Button></Link>
                <h1 className="text-3xl font-bold text-foreground">Editar Cliente</h1>
            </div>
            <Card isClickable={false}>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* 🔹 Inputs con los nuevos nombres de campo de la API */}
                        <div>
                            <Input id="name" label="Nombre del Cliente" {...formik.getFieldProps('name')} />
                            {formik.touched.name && formik.errors.name ? <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div> : null}
                        </div>
                        <div>
                            <Input id="email" label="Email" type="email" {...formik.getFieldProps('email')} />
                            {formik.touched.email && formik.errors.email ? <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div> : null}
                        </div>
                        <div>
                            <Input id="phone" label="Teléfono" {...formik.getFieldProps('phone')} />
                        </div>
                        <div>
                            <Input id="notes" label="Observaciones" {...formik.getFieldProps('notes')} />
                        </div>
                    </div>
                    <div className="flex justify-end pt-4">
                        <Button type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</Button>
                    </div>
                </form>
            </Card>
        </div>
    );
}