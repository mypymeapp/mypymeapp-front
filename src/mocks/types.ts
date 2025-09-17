export interface Empleado {
  id: string;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  rol: string; // dueño de empresa: mira todo / control mercaderia: inventario / administracion: compras, facturacion, proveedores, empleados / vendedor: ventas y clientes 
  fechaIngreso: string;
  salario: number;
  activo: boolean; // justificacion de inactividad // si esta inactivo no puede loguearse
}
export interface Proveedor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  contactName?: string;
  address?: string;
  country?: string;
  cif?: string;
  moneda?: 'ARS' | 'CLP' | 'USD' | 'EUR';
  debeDinero?: boolean;
  mercaderiaPendiente?: boolean;
}

export interface Category {
  id: string;
  name: string;
}

export interface Product {
  id: string;
  name: string;
  sku: string;
  barcode?: string;
  description?: string;
  price: number;
  cost?: number;
  category?: Category;
  qty?: number;
}

export interface FacturaProveedor {
    id: string;
    proveedorId: string;
    numeroFactura: string;
    fechaEmision: string;
    fechaVencimiento: string;
    monto: number;
    estado: 'Pagada' | 'Pendiente' | 'Vencida';
}

export interface Compra {
    id: string;
    proveedorId: string;
    producto: string;
    facturaId: string;
    fecha: string;
    monto: number;
    estadoEntrega: 'En camino' | 'Recibido' | 'Pendiente';
    estadoPago: 'Pagada' | 'Pendiente' | 'Vencida';
}
