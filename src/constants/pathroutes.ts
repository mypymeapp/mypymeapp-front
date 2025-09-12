export const PATHROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  contacto: '/contacto',

  onboarding: {
    create_company: '/onboarding/create-company',
  },

  pymes: {
    dashboard: '/pymes',
    ventas: '/pymes/ventas',
    compras: '/pymes/compras',
    facturacion: '/pymes/facturacion',
    inventario: '/pymes/inventario',
    inventario_nuevo: '/pymes/inventario/nuevo',
    inventario_editar: (id: string) => `/pymes/inventario/${id}/editar`,
    proveedores: '/pymes/proveedores',
    proveedores_nuevo: '/pymes/proveedores/nuevo',
    proveedor_detalle: (id: string) => `/pymes/proveedores/${id}`,
    clientes: '/pymes/clientes',
    reportes: '/pymes/reportes',
    soporte: '/pymes/soporte',
    configuracion: '/pymes/configuracion',
    configuracion_perfil: '/pymes/configuracion/perfil',
    configuracion_personalizacion: '/pymes/configuracion/personalizacion',
  },

  admin: {
    dashboard: '/admin',
  },

  features: {
    ia: '/features/ai-advisor',
    personalizacion: '/features/brand-customization',
    roles: '/features/team-permissions',
  },
};