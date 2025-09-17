'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ArrowLeft, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { PATHROUTES } from '@/constants/pathroutes';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Category, Product } from '@/mocks/types';

export default function EditarProductoPage({ params }: { params: { id: string } }) {
    const { id: productId } = params;
    const { data: session } = useSession();
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [initialValues, setInitialValues] = useState({ name: '', sku: '', barcode: '', description: '', price: 0, cost: 0, categoryId: '', qty: 0, });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            if (!session?.accessToken) return;
            try {
                const [productRes, categoriesRes] = await Promise.all([
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, { headers: { 'Authorization': `Bearer ${session.accessToken}` } }),
                    fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, { headers: { 'Authorization': `Bearer ${session.accessToken}` } })
                ]);
                if (!productRes.ok) throw new Error('No se pudo cargar el producto.');
                const productData: Product = await productRes.json();
                const categoriesData = categoriesRes.ok ? await categoriesRes.json() : [];
                setInitialValues({
                    name: productData.name, sku: productData.sku, barcode: productData.barcode || '', description: productData.description || '',
                    price: productData.price, cost: productData.cost || 0, categoryId: productData.category?.id || '', qty: productData.qty || 0,
                });
                setCategories(categoriesData);
            } catch (error) {
                toast.error(error instanceof Error ? error.message : 'Error al cargar los datos');
                router.push(PATHROUTES.pymes.inventario);
            } finally { setLoading(false); }
        };
        if (session) fetchData();
    }, [session, productId, router]);

    const formik = useFormik({
        initialValues: initialValues,
        enableReinitialize: true,
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre es requerido'), sku: Yup.string().required('El SKU es requerido'),
            price: Yup.number().min(0).required('El precio es requerido'), cost: Yup.number().min(0),
            categoryId: Yup.string().required('La categoría es requerida'),
            qty: Yup.number().integer('Debe ser un número entero').min(0, 'No puede ser negativo').required('La cantidad es requerida'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            setSubmitting(true);
            try {
                 const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${productId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${session?.accessToken}`, },
                    body: JSON.stringify(values),
                });
                if (!res.ok) throw new Error('Error al actualizar el producto');
                toast.success('¡Producto actualizado con éxito!');
                router.push(PATHROUTES.pymes.inventario);
            } catch (error) { toast.error(error instanceof Error ? error.message : 'Error desconocido'); }
            finally { setSubmitting(false); }
        },
    });

    if (loading) { return <div className="p-8 flex justify-center"><Loader2 className="animate-spin h-8 w-8" /></div>; }

    return (
        <div className="p-4 md:p-8">
            <div className="flex items-center gap-4 mb-8">
                <Link href={PATHROUTES.pymes.inventario}><Button variant="outline" className="px-3"><ArrowLeft className="h-5 w-5" /></Button></Link>
                <h1 className="text-3xl font-bold text-foreground">Editar Producto</h1>
            </div>
            <Card isClickable={false}>
                <form onSubmit={formik.handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <Input id="name" label="Nombre del Producto" {...formik.getFieldProps('name')} />
                            {formik.touched.name && formik.errors.name ? <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div> : null}
                        </div>
                        <div>
                            <Select id="categoryId" label="Categoría" {...formik.getFieldProps('categoryId')}>
                                <option value="">Selecciona una categoría</option>
                                {categories.map(cat => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
                            </Select>
                            {formik.touched.categoryId && formik.errors.categoryId ? <div className="text-red-500 text-xs mt-1">{formik.errors.categoryId}</div> : null}
                        </div>
                        <div><Input id="sku" label="SKU (Código único)" {...formik.getFieldProps('sku')} />{formik.touched.sku && formik.errors.sku ? <div className="text-red-500 text-xs mt-1">{formik.errors.sku}</div> : null}</div>
                        <div><Input id="barcode" label="Código de Barras (opcional)" {...formik.getFieldProps('barcode')} /></div>
                        <div><Input id="price" label="Precio de Venta" type="number" step="0.01" {...formik.getFieldProps('price')} />{formik.touched.price && formik.errors.price ? <div className="text-red-500 text-xs mt-1">{formik.errors.price}</div> : null}</div>
                        <div><Input id="cost" label="Costo (opcional)" type="number" step="0.01" {...formik.getFieldProps('cost')} /></div>
                        <div><Input id="qty" label="Cantidad en Stock" type="number" {...formik.getFieldProps('qty')} />{formik.touched.qty && formik.errors.qty ? <div className="text-red-500 text-xs mt-1">{formik.errors.qty}</div> : null}</div>
                    </div>
                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-foreground/80 mb-2">Descripción (opcional)</label>
                        <textarea id="description" rows={4} {...formik.getFieldProps('description')} className="w-full px-4 py-3 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
                    </div>
                    <div className="flex justify-end pt-4"><Button type="submit" disabled={formik.isSubmitting}>{formik.isSubmitting ? 'Guardando...' : 'Guardar Cambios'}</Button></div>
                </form>
            </Card>
        </div>
    );
}