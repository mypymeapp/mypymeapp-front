// export const PATHROUTES = {
//   home: '/',
//   login: '/login',
//   register: '/register',
//   forgot_password: '/forgot-password',
//   reset_password: '/reset-password',
//   nosotros: '/nosotros',
//   contacto: '/contacto',

//   onboarding: {
//     create_company: '/onboarding/create-company',
//   },

//   pymes: {
//     dashboard: '/pymes',
//     ventas: '/pymes/ventas',
//     ventas_nueva: '/pymes/ventas/nueva',
//     ventas_detalle: (id:string) => `/pymes/ventas/${id}`,
//     ventas_editar: (id:string) => `/pymes/ventas/${id}/editar`,
//     compras: '/pymes/compras',
//     compras_nuevo: '/pymes/compras/nuevo',
//     compras_detalle: (id: string) => `/pymes/compras/${id}`,
//     compras_editar: (id: string) => `/pymes/compras/${id}/editar`,
//     facturacion: '/pymes/facturacion',
//     inventario: '/pymes/inventario',
//     inventario_nuevo: '/pymes/inventario/nuevo',
//     inventario_editar: (id: string) => `/pymes/inventario/${id}/editar`,
//     proveedores: '/pymes/proveedores',
//     proveedores_nuevo: '/pymes/proveedores/nuevo',
//     proveedor_detalle: (id: string) => `/pymes/proveedores/${id}`,
//     proveedor_editar: (id: string) => `/pymes/proveedores/${id}/editar`,
//     clientes: '/pymes/clientes',
//     clientes_nuevo: '/pymes/clientes/nuevo',
//     clientes_editar: (id: string) => `/pymes/clientes/${id}/editar`,
//     clientes_detalle: (id: string) => `/pymes/clientes/${id}`,  
//     reportes: '/pymes/reportes',
//     soporte: '/pymes/soporte',
//     configuracion: '/pymes/configuracion',
//     configuracion_perfil: '/pymes/configuracion/perfil',
//     suscripcion: '/pymes/configuracion/suscripcion',
//     miembros: '/pymes/configuracion/miembros',
//     miembros_nuevo: '/pymes/configuracion/miembros/nuevo',
//     miembros_editar: (id: string) => `/pymes/configuracion/miembros/${id}`,
//   },

//   superadmin: {
//     dashboard: '/superadmin',
//   },

//   features: {
//     ia: '/features/ai-advisor',
//     personalizacion: '/features/brand-customization',
//     roles: '/features/team-permissions',
//   },
// };

//////////////////////////////////////

export const PATHROUTES = {
  home: '/',
  login: '/login',
  register: '/register',
  forgot_password: '/forgot-password',
  reset_password: '/reset-password',
  nosotros: '/nosotros',
  contacto: '/contacto',

  onboarding: {
    create_company: '/onboarding/create-company',
  },

  pymes: {
    dashboard: '/pymes',
    
    // RUTAS DE VENTAS (TUS APORTACIONES)
    ventas: '/pymes/ventas',
    ventas_nueva: '/pymes/ventas/nueva',
    ventas_detalle: (id:string) => `/pymes/ventas/${id}`,
    ventas_editar: (id:string) => `/pymes/ventas/${id}/editar`,

    // RUTAS DE COMPRAS (SINTAXIS CORREGIDA)
    compras: '/pymes/compras',
    compras_nuevo: '/pymes/compras/nuevo',
    compras_detalle: (id: string) => `/pymes/compras/${id}`,
    compras_editar: (id: string) => `/pymes/compras/${id}/editar`,
    
    facturacion: '/pymes/facturacion',
    
    // RUTAS DE INVENTARIO (SINTAXIS CORREGIDA)
    inventario: '/pymes/inventario',
    inventario_nuevo: '/pymes/inventario/nuevo',
    inventario_editar: (id: string) => `/pymes/inventario/${id}/editar`,

    // RUTAS DE PROVEEDORES (APORTE TUYO EN editar y SINTAXIS CORREGIDA)
    proveedores: '/pymes/proveedores',
    proveedores_nuevo: '/pymes/proveedores/nuevo',
    proveedor_detalle: (id: string) => `/pymes/proveedores/${id}`,
    proveedor_editar: (id: string) => `/pymes/proveedores/${id}/editar`,
    
    // RUTAS DE CLIENTES (SINTAXIS CORREGIDA)
    clientes: '/pymes/clientes',
    clientes_nuevo: '/pymes/clientes/nuevo',
    clientes_editar: (id: string) => `/pymes/clientes/${id}/editar`,
    clientes_detalle: (id: string) => `/pymes/clientes/${id}`,  
    
    reportes: '/pymes/reportes',
    soporte: '/pymes/soporte',
    configuracion: '/pymes/configuracion',
    configuracion_perfil: '/pymes/configuracion/perfil',
    suscripcion: '/pymes/configuracion/suscripcion',
    
    // RUTAS DE MIEMBROS (SINTAXIS CORREGIDA)
    miembros: '/pymes/configuracion/miembros',
    miembros_nuevo: '/pymes/configuracion/miembros/nuevo',
    miembros_editar: (id: string) => `/pymes/configuracion/miembros/${id}`,
  },

  superadmin: {
    dashboard: '/superadmin',
  },

  features: {
    ia: '/features/ai-advisor',
    personalizacion: '/features/brand-customization',
    roles: '/features/team-permissions',
  },
};