import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { mockEmpresas } from "@/mocks/adminData";

export default function AdminDashboardPage() {
    return (
        <div className="p-4 md:p-8">
            <h1 className="text-3xl font-bold text-foreground mb-8">Dashboard de SuperAdmin</h1>
            <Card isClickable={false}>
                <h2 className="text-xl font-bold mb-4">Empresas Registradas ({mockEmpresas.length})</h2>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-border">
                                <th className="p-2">Nombre</th>
                                <th className="p-2">Plan</th>
                                <th className="p-2">Usuarios</th>
                                <th className="p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {mockEmpresas.map(empresa => (
                                <tr key={empresa.id} className="border-b border-border last:border-b-0">
                                    <td className="p-2 font-medium">{empresa.nombre}</td>
                                    <td className="p-2">
                                        <span className={`px-2 py-1 text-xs rounded-full ${empresa.plan === 'Premium' ? 'bg-primary/20 text-primary' : 'bg-foreground/10 text-foreground/70'}`}>
                                            {empresa.plan}
                                        </span>
                                    </td>
                                    <td className="p-2">{empresa.usuariosActivos}</td>
                                    <td className="p-2"><Button variant="outline" className="px-3 py-1 text-xs h-auto">Gestionar</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    )
}