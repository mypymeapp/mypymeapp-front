'use client';

import { useState } from 'react';
import { notFound } from "next/navigation";
import { mockEmpleados } from "@/mocks/data";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { formatCurrency } from "@/utils/formatters";
import { 
  ArrowLeft, 
  Edit, 
  Mail, 
  Phone, 
  Calendar, 
  DollarSign, 
  UserCheck, 
  UserX,
  Clock,
  Briefcase,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import Link from "next/link";
import { PATHROUTES } from "@/constants/pathroutes";

interface Props {
	params: { id: string };
}

export default function EmpleadoDetallePage({ params }: Props) {
	const empleado = mockEmpleados.find(e => e.id === params.id);
	const [isEditing, setIsEditing] = useState(false);

	if (!empleado) return notFound();

	// Calcular tiempo en la empresa
	const calcularTiempoEnEmpresa = (fechaIngreso: string) => {
		const ingreso = new Date(fechaIngreso);
		const ahora = new Date();
		const diferenciaMeses = (ahora.getFullYear() - ingreso.getFullYear()) * 12 + ahora.getMonth() - ingreso.getMonth();
		
		if (diferenciaMeses < 12) {
			return `${diferenciaMeses} ${diferenciaMeses === 1 ? 'mes' : 'meses'}`;
		}
		const años = Math.floor(diferenciaMeses / 12);
		const mesesRestantes = diferenciaMeses % 12;
		return `${años} ${años === 1 ? 'año' : 'años'}${mesesRestantes > 0 ? ` y ${mesesRestantes} ${mesesRestantes === 1 ? 'mes' : 'meses'}` : ''}`;
	};

	// Formatear fecha
	const formatearFecha = (fecha: string) => {
		return new Date(fecha).toLocaleDateString('es-ES', {
			day: 'numeric',
			month: 'long',
			year: 'numeric'
		});
	};

	return (
		<div className="p-4 md:p-8 space-y-6">
			{/* Header con navegación */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-4">
					<Link href={PATHROUTES.pymes.empleados}>
						<Button variant="outline">
							<ArrowLeft className="mr-2 h-4 w-4" />
							Volver
						</Button>
					</Link>
					<div>
						<h1 className="text-3xl font-bold text-foreground">
							{empleado.nombre} {empleado.apellido}
						</h1>
						<p className="text-foreground/70 flex items-center gap-2 mt-1">
							<Briefcase className="w-4 h-4" />
							{empleado.rol}
						</p>
					</div>
				</div>
				<div className="flex gap-2">
					<Button 
						variant={empleado.activo ? "danger" : "primary"}
						onClick={() => alert(empleado.activo ? 'Desactivar empleado' : 'Activar empleado')}
					>
						{empleado.activo ? (
							<><UserX className="mr-2 h-4 w-4" /> Desactivar</>
						) : (
							<><UserCheck className="mr-2 h-4 w-4" /> Activar</>
						)}
					</Button>
					<Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
						<Edit className="mr-2 h-4 w-4" />
						Editar
					</Button>
				</div>
			</div>

			{/* Badge de estado */}
			<div className="flex items-center gap-4">
				<div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
					empleado.activo 
						? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
						: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
				}`}>
					{empleado.activo ? (
						<><CheckCircle2 className="w-4 h-4" /> Activo</>
					) : (
						<><AlertCircle className="w-4 h-4" /> Inactivo</>
					)}
				</div>
			</div>

			{/* Grid principal */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* Columna izquierda - Información personal */}
				<div className="lg:col-span-1 space-y-6">
					{/* Avatar y datos básicos */}
					<Card className="text-center">
						<div className="bg-primary/10 p-6 rounded-full flex items-center justify-center w-24 h-24 mx-auto mb-4">
							<span className="font-bold text-primary text-4xl">
								{empleado.nombre.charAt(0)}{empleado.apellido.charAt(0)}
							</span>
						</div>
						<h2 className="text-xl font-bold text-foreground mb-1">
							{empleado.nombre} {empleado.apellido}
						</h2>
						<p className="text-foreground/60 mb-4">{empleado.rol}</p>
						<div className="pt-4 border-t border-border space-y-2">
							<p className="text-sm text-foreground/70">ID: {empleado.id}</p>
						</div>
					</Card>

					{/* Información de contacto */}
					<Card>
						<h3 className="text-lg font-bold mb-4 text-foreground">Contacto</h3>
						<div className="space-y-3">
							<div className="flex items-center gap-3 text-foreground/80">
								<Mail className="w-4 h-4 text-primary flex-shrink-0" />
								<span className="break-all">{empleado.email}</span>
							</div>
							<div className="flex items-center gap-3 text-foreground/80">
								<Phone className="w-4 h-4 text-primary flex-shrink-0" />
								<span>{empleado.telefono}</span>
							</div>
						</div>
					</Card>
				</div>

				{/* Columna derecha - Información laboral y financiera */}
				<div className="lg:col-span-2 space-y-6">
					{/* Información laboral */}
					<Card>
						<h3 className="text-xl font-bold mb-6 text-foreground">Información Laboral</h3>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<Calendar className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
									<div>
										<p className="font-semibold text-foreground">Fecha de Ingreso</p>
										<p className="text-foreground/80">{formatearFecha(empleado.fechaIngreso)}</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									<Clock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
									<div>
										<p className="font-semibold text-foreground">Tiempo en la Empresa</p>
										<p className="text-foreground/80">{calcularTiempoEnEmpresa(empleado.fechaIngreso)}</p>
									</div>
								</div>
							</div>
							<div className="space-y-4">
								<div className="flex items-start gap-3">
									<Briefcase className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
									<div>
										<p className="font-semibold text-foreground">Cargo</p>
										<p className="text-foreground/80">{empleado.rol}</p>
									</div>
								</div>
								<div className="flex items-start gap-3">
									{empleado.activo ? (
										<CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
									) : (
										<AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
									)}
									<div>
										<p className="font-semibold text-foreground">Estado</p>
										<p className={`font-medium ${
											empleado.activo 
												? 'text-green-600' 
												: 'text-red-600'
										}`}>
											{empleado.activo ? 'Activo' : 'Inactivo'}
										</p>
									</div>
								</div>
							</div>
						</div>
					</Card>

					{/* Información financiera */}
					<Card>
						<h3 className="text-xl font-bold mb-6 text-foreground">Información Salarial</h3>
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
							<div className="text-center p-4 bg-primary/5 rounded-lg border border-primary/20">
								<DollarSign className="w-8 h-8 text-primary mx-auto mb-2" />
								<p className="text-sm text-foreground/60 mb-1">Salario Mensual</p>
								<p className="text-2xl font-bold text-primary">
									{formatCurrency(empleado.salario, 'USD')}
								</p>
							</div>
							<div className="text-center p-4 bg-card rounded-lg border border-border">
								<Calendar className="w-8 h-8 text-foreground/60 mx-auto mb-2" />
								<p className="text-sm text-foreground/60 mb-1">Salario Anual</p>
								<p className="text-xl font-bold text-foreground">
									{formatCurrency(empleado.salario * 12, 'USD')}
								</p>
							</div>
							<div className="text-center p-4 bg-card rounded-lg border border-border">
								<Clock className="w-8 h-8 text-foreground/60 mx-auto mb-2" />
								<p className="text-sm text-foreground/60 mb-1">Costo Total</p>
								<p className="text-xl font-bold text-foreground" title="Costo aproximado incluyendo beneficios">
									{formatCurrency(empleado.salario * 12 * 1.3, 'USD')}
								</p>
								<p className="text-xs text-foreground/40 mt-1">*Incluye beneficios estimados</p>
							</div>
						</div>
					</Card>

					{/* Acciones rápidas */}
					<Card>
						<h3 className="text-xl font-bold mb-4 text-foreground">Acciones Rápidas</h3>
						<div className="flex flex-wrap gap-3">
							<Button 
								variant="outline" 
								onClick={() => window.open(`mailto:${empleado.email}`, '_blank')}
							>
								<Mail className="mr-2 h-4 w-4" />
								Enviar Email
							</Button>
							<Button 
								variant="outline" 
								onClick={() => window.open(`tel:${empleado.telefono}`, '_self')}
							>
								<Phone className="mr-2 h-4 w-4" />
								Llamar
							</Button>
							<Button variant="outline" onClick={() => alert('Función de generar reporte próximamente')}>
								<DollarSign className="mr-2 h-4 w-4" />
								Generar Recibo
							</Button>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
