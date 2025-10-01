

'use client';

import { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { ArrowLeft, ListOrdered, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useSession } from 'next-auth/react';
import { PATHROUTES } from '@/constants/pathroutes';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Category } from '@/mocks/types';

const paises = [
  { value: 'ARGENTINA', label: 'Argentina' },
  { value: 'URUGUAY', label: 'Uruguay' },
  { value: 'CHILE', label: 'Chile' }
];

export default function EditarProveedorPage() {
  const { data: session } = useSession();
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

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
    enableReinitialize: true,
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
      if (!session?.accessToken) {
        toast.error("Sesión no válida");
        setSubmitting(false);
        return;
      }
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.accessToken}`,
          },
          body: JSON.stringify(values),
        });
        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || 'Error al actualizar el proveedor');
        }
        toast.success('Proveedor actualizado correctamente');
        router.push(PATHROUTES.pymes.proveedores);
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (!session?.accessToken || !id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const token = session.accessToken;

        // 1️⃣ Traer TODAS las categorías
        const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        let catData: Category[] = [];
        if (catRes.ok) catData = await catRes.json();
        setCategories(catData);

        // 2️⃣ Traer datos del proveedor
        const provRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/supplier/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!provRes.ok) throw new Error("No se pudo cargar el proveedor");
        const provData = await provRes.json();

        // 3️⃣ Setear valores en el form (incluyendo categoría seleccionada)
        formik.setValues({
          name: provData.name || '',
          email: provData.email || '',
          phone: provData.phone || '',
          contactName: provData.contactName || '',
          address: provData.address || '',
          country: provData.country || 'ARGENTINA',
          categoryId: provData.categoryId || '',
        });

      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [session, id]);

  if (loading) return (
    <div className="p-8 h-full flex justify-center items-center">
      <ListOrdered className="animate-spin h-12 w-12 text-primary" />
    </div>
  );

  return (
    <div className="p-4 md:p-8">
      <div className="flex items-center gap-4 mb-8">
        <Link href={PATHROUTES.pymes.proveedores}>
          <Button variant="outline" className="px-3">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-3xl font-bold text-foreground">Editar Proveedor</h1>
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
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </Select>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={formik.isSubmitting}>
              {formik.isSubmitting ? 'Guardando...' : 'Actualizar Proveedor'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}