
import { notFound } from "next/navigation";
import { mockEmpleados } from "@/mocks/data";

interface Props {
	params: { id: string };
}

export default function EmpleadoDetallePage({ params }: Props) {
	const empleado = mockEmpleados.find(e => e.id === params.id);
	if (!empleado) return notFound();

	return (
		<div className="p-8 max-w-xl mx-auto">
			<h1 className="text-2xl font-bold text-foreground mb-6">Detalles del empleado</h1>
			<div className="bg-card border border-border rounded-lg p-6 space-y-4">
				<div className="flex items-center gap-4 mb-4">
					<div className="bg-primary/10 p-4 rounded-full flex items-center justify-center w-16 h-16">
						<span className="font-bold text-primary text-3xl">{empleado.nombre.charAt(0)}</span>
					</div>
					<div>
						<h2 className="font-bold text-xl text-foreground">{empleado.nombre} {empleado.apellido}</h2>
						<p className="text-sm text-foreground/60">{empleado.rol}</p>
					</div>
				</div>
				<div className="space-y-2 text-foreground/80">
					<p><span className="font-semibold">Email:</span> {empleado.email}</p>
					<p><span className="font-semibold">Teléfono:</span> {empleado.telefono}</p>
					<p><span className="font-semibold">Fecha de ingreso:</span> {empleado.fechaIngreso}</p>
					<p><span className="font-semibold">Salario:</span> ${empleado.salario}</p>
					<p><span className="font-semibold">Estado:</span> {empleado.activo ? <span className="text-green-600 font-bold">Activo</span> : <span className="text-red-600 font-bold">Inactivo</span>}</p>
				</div>
			</div>
		</div>
	);
}
