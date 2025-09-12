'use client';

import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { PATHROUTES } from '@/constants/pathroutes';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

const paises = [
  { value: 'AR', label: 'Argentina' },
  { value: 'UY', label: 'Uruguay' },
  { value: 'CL', label: 'Chile' },
  { value: 'ES', label: 'España' },
  { value: 'MX', label: 'México' },
];

export default function CreateCompanyPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push(PATHROUTES.login);
        }
    }, [status, router]);

    const formik = useFormik({
        initialValues: {
            name: '', pais: 'AR', razonSocial: '', rut_Cuit: '', rubroPrincipal: '',
        },
        validationSchema: Yup.object({
            name: Yup.string().required('El nombre de la empresa es requerido'),
            pais: Yup.string().required('El país es requerido'),
            razonSocial: Yup.string().required('La Razón Social es requerida'),
            rut_Cuit: Yup.string().required('La identificación fiscal es requerida'),
            rubroPrincipal: Yup.string().required('El rubro es requerido'),
        }),
        onSubmit: async (values, { setSubmitting }) => {
            if (!session?.user?.id || !session?.user?.email) {
                toast.error('Sesión no válida.');
                setSubmitting(false);
                return;
            }
            setSubmitting(true);
            try {
                const companyData = {
                    ...values,
                    userId: session.user.id,
                    mail: session.user.email,
                    password: "password_provisional_123"
                };

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/companies`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(companyData)
                });

                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Error al crear la empresa.');
                }
                
                toast.success('¡Empresa configurada! Por favor, inicia sesión de nuevo para que se actualicen tus datos.');
                signOut({ callbackUrl: PATHROUTES.login });

            } catch (error) {
                 toast.error(error instanceof Error ? error.message : 'Ocurrió un error.');
            } finally {
                 setSubmitting(false);
            }
        }
    });
    
    const getIdentificacionLabel = (pais: string) => {
        switch (pais) {
          case 'AR': return 'CUIT (Sin guiones)';
          case 'UY': case 'CL': return 'RUT (Sin puntos ni guiones)';
          case 'ES': return 'NIF';
          case 'MX': return 'RFC';
          default: return 'Identificación Fiscal';
        }
    };

    if (status === 'loading' || !session) {
        return <div className="flex items-center justify-center min-h-screen bg-background"><Loader2 className="animate-spin h-12 w-12 text-primary" /></div>;
    }
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-lg p-8 space-y-6 bg-card border border-border rounded-2xl">
                <div className="text-center">
                    <h1 className="text-3xl font-extrabold text-primary">Un último paso...</h1>
                    <p className="mt-2 text-foreground/70">Hola <span className="font-bold">{session.user.name}</span>, configura los datos de tu empresa.</p>
                </div>
                <form onSubmit={formik.handleSubmit} className="space-y-4">
                    <div>
                        <Input id="name" label="Nombre de tu PYME" {...formik.getFieldProps('name')} />
                        {formik.touched.name && formik.errors.name ? <div className="text-red-500 text-xs mt-1">{formik.errors.name}</div> : null}
                    </div>
                    <div>
                        <label htmlFor="pais" className="block mb-2 text-sm font-medium text-foreground/80">País de la empresa</label>
                        <select id="pais" {...formik.getFieldProps('pais')} className="w-full px-4 py-3 text-foreground bg-background border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                            {paises.map(pais => <option key={pais.value} value={pais.value}>{pais.label}</option>)}
                        </select>
                        {formik.touched.pais && formik.errors.pais ? <div className="text-red-500 text-xs mt-1">{formik.errors.pais}</div> : null}
                    </div>
                     <div>
                        <Input id="razonSocial" label="Razón Social" {...formik.getFieldProps('razonSocial')} />
                        {formik.touched.razonSocial && formik.errors.razonSocial ? <div className="text-red-500 text-xs mt-1">{formik.errors.razonSocial}</div> : null}
                    </div>
                    <div>
                        <Input id="rut_Cuit" label={getIdentificacionLabel(formik.values.pais)} {...formik.getFieldProps('rut_Cuit')} />
                        {formik.touched.rut_Cuit && formik.errors.rut_Cuit ? <div className="text-red-500 text-xs mt-1">{formik.errors.rut_Cuit}</div> : null}
                    </div>
                    <div>
                        <Input id="rubroPrincipal" label="Rubro Principal" {...formik.getFieldProps('rubroPrincipal')} />
                        {formik.touched.rubroPrincipal && formik.errors.rubroPrincipal ? <div className="text-red-500 text-xs mt-1">{formik.errors.rubroPrincipal}</div> : null}
                    </div>
                    
                    <Button type="submit" disabled={formik.isSubmitting} className="w-full">
                        {formik.isSubmitting ? 'Configurando...' : 'Finalizar Configuración'}
                    </Button>
                </form>
            </div>
        </div>
    );
}