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
  nombre: string;
  cif: string;
  telefono: string;
  email: string;
  nombreContacto: string;
  direccion: string;
  lat: number;
  lng: number;
  moneda: 'ARS' | 'CLP' | 'USD' | 'EUR';
  debeDinero: boolean;
  mercaderiaPendiente: boolean;
}

export interface Producto {
  id: string;
  proveedorId: string;
  nombre: string;
  descripcion: string;
  costo: number;
  margenUtilidad: number; 
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