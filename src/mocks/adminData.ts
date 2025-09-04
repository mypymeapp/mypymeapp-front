export interface Empresa {
    id: string;
    nombre: string;
    plan: 'Gratis' | 'Premium';
    fechaRegistro: string;
    usuariosActivos: number;
}

export const mockEmpresas: Empresa[] = [
    { id: 'emp-001', nombre: 'TecnoComponentes S.L.', plan: 'Premium', fechaRegistro: '2023-01-15', usuariosActivos: 5 },
    { id: 'emp-002', nombre: 'Ferretería El Martillo Feliz', plan: 'Gratis', fechaRegistro: '2023-03-22', usuariosActivos: 2 },
    { id: 'emp-003', nombre: 'Consultora Digital Avanzada', plan: 'Premium', fechaRegistro: '2023-05-10', usuariosActivos: 12 },
];