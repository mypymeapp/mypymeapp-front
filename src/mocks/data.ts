
import type { Empleado } from './types';

export const mockEmpleados: Empleado[] = [
  {
    id: 'emp-001',
    nombre: 'Maria',
    apellido: 'Perez',
    email: 'maria.perez@empresa.com',
    telefono: '+34 600 123 456',
    puesto: 'Administradora',
    fechaIngreso: '2022-01-15',
    salario: 2200,
    activo: true,
  },
  {
    id: 'emp-002',
    nombre: 'Juan',
    apellido: 'Garcia',
    email: 'juan.garcia@empresa.com',
    telefono: '+34 600 654 321',
    puesto: 'Técnico',
    fechaIngreso: '2021-06-10',
    salario: 1800,
    activo: true,
  },
  {
    id: 'emp-003',
    nombre: 'Lucia',
    apellido: 'Martinez',
    email: 'lucia.martinez@empresa.com',
    telefono: '+34 600 789 123',
    puesto: 'Vendedora',
    fechaIngreso: '2023-03-01',
    salario: 1600,
    activo: true,
  },
  {
    id: 'emp-004',
    nombre: 'Carlos',
    apellido: 'Lopez',
    email: 'carlos.lopez@empresa.com',
    telefono: '+34 600 321 987',
    puesto: 'Logística',
    fechaIngreso: '2020-11-20',
    salario: 1700,
    activo: false,
  },
  {
    id: 'emp-005',
    nombre: 'Ana',
    apellido: 'Sanchez',
    email: 'ana.sanchez@empresa.com',
    telefono: '+34 600 456 789',
    puesto: 'Soporte',
    fechaIngreso: '2024-02-12',
    salario: 1500,
    activo: true,
  },
];
import { Proveedor, FacturaProveedor, Compra, Producto } from './types';

export const mockProveedores: Proveedor[] = [
  { 
    id: 'prov-001', 
    nombre: 'TecnoComponentes S.L.', 
    cif: 'B12345678', 
    telefono: '912 345 678', 
    email: 'contacto@tecnocomponentes.es', 
    nombreContacto: 'Elena García', 
    direccion: 'Madrid, España', 
    lat: 40.416775, 
    lng: -3.703790, 
    moneda: 'EUR', 
    debeDinero: true, 
    mercaderiaPendiente: true 
  },
  { 
    id: 'prov-002', 
    nombre: 'Importadora Andina Tech', 
    cif: '76.123.456-K', 
    telefono: '+56 2 2123 4567', 
    email: 'ventas@andinachtech.cl', 
    nombreContacto: 'Javier Rojas', 
    direccion: 'Santiago, Chile', 
    lat: -33.4116, 
    lng: -70.5735, 
    moneda: 'CLP', 
    debeDinero: true, 
    mercaderiaPendiente: false 
  },
  { 
    id: 'prov-003', 
    nombre: 'Componentes Electrónicos Cuyo', 
    cif: '30-12345678-5', 
    telefono: '+54 9 261 123 4567', 
    email: 'compras@cecuyo.com.ar', 
    nombreContacto: 'Laura Fernandez', 
    direccion: 'Mendoza, Argentina', 
    lat: -32.8908, 
    lng: -68.8272, 
    moneda: 'ARS', 
    debeDinero: false, 
    mercaderiaPendiente: true 
  },
  { 
    id: 'prov-004', 
    nombre: 'Global Supplies Inc.', 
    cif: '987654321', 
    telefono: '+1 305 123 4567', 
    email: 'sales@globalsupplies.com', 
    nombreContacto: 'John Smith', 
    direccion: 'Miami, USA', 
    lat: 25.7617, 
    lng: -80.1918, 
    moneda: 'USD', 
    debeDinero: false, 
    mercaderiaPendiente: false 
  },
];

export const mockProductos: Producto[] = [
  { id: 'prod-01', proveedorId: 'prov-001', nombre: 'Microcontrolador ATmega328P', descripcion: 'Chip principal para placas Arduino UNO.', costo: 2.50, margenUtilidad: 120 },
  { id: 'prod-02', proveedorId: 'prov-001', nombre: 'Sensor de Temperatura DHT22', descripcion: 'Sensor digital de alta precisión.', costo: 4.00, margenUtilidad: 150 },
  { id: 'prod-03', proveedorId: 'prov-002', nombre: 'Pantalla OLED 0.96"', descripcion: 'Display I2C 128x64 azul y amarillo.', costo: 3500, margenUtilidad: 100 },
  { id: 'prod-04', proveedorId: 'prov-003', nombre: 'Bobina de Estaño 60/40 100g', descripcion: 'Estaño para soldadura electrónica.', costo: 2800, margenUtilidad: 80 },
  { id: 'prod-05', proveedorId: 'prov-003', nombre: 'Protoboard 830 puntos', descripcion: 'Placa de pruebas estándar.', costo: 1500, margenUtilidad: 110 },
];

export const mockFacturas: FacturaProveedor[] = [
    { id: 'fact-p-01', proveedorId: 'prov-001', numeroFactura: 'FC-2023-08-152', fechaEmision: '2023-08-15', fechaVencimiento: '2023-09-14', monto: 1250.75, estado: 'Pagada' },
    { id: 'fact-p-02', proveedorId: 'prov-001', numeroFactura: 'FC-2023-09-011', fechaEmision: '2023-09-01', fechaVencimiento: '2023-09-30', monto: 850.00, estado: 'Pendiente' },
    { id: 'fact-p-03', proveedorId: 'prov-002', numeroFactura: 'FC-2023-07-205', fechaEmision: '2023-07-20', fechaVencimiento: '2023-08-19', monto: 2400000.50, estado: 'Vencida' },
];

export const mockCompras: Compra[] = [
    { id: 'comp-001', proveedorId: 'prov-001', producto: 'Lote de 50 Microchips XT-500', facturaId: 'fact-p-01', fecha: '2023-08-15', monto: 1250.75, estadoEntrega: 'Recibido', estadoPago: 'Pagada'},
    { id: 'comp-002', proveedorId: 'prov-001', producto: 'Cajas de Tornillería Métrica', facturaId: 'fact-p-02', fecha: '2023-09-01', monto: 850.00, estadoEntrega: 'En camino', estadoPago: 'Pendiente'},
    { id: 'comp-003', proveedorId: 'prov-002', producto: '20x Unidades de Fuente de Poder 750W', facturaId: 'fact-p-03', fecha: '2023-07-20', monto: 2400000.50, estadoEntrega: 'Recibido', estadoPago: 'Vencida'},
];

