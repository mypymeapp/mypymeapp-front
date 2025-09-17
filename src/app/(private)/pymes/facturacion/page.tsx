// app/(private)/pymes/facturacion/page.tsx
'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/Card';
import jsPDF from 'jspdf';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Plus, Trash2, User, MapPin, Phone, Mail, AlertCircle, FileText, History, Shield, CheckCircle, X } from 'lucide-react';
import { mockProveedores, mockProductos } from '../../../../mocks/data';

interface ItemFactura {
  productoId: string;
  descripcion: string;
  cantidad: number;
  precioUnitario: number;
  total: number;
}

interface Factura {
  id: string;
  numero: string;
  fecha: Date;
  proveedor: string;
  cliente: string;
  tipo: string;
  total: number;
  items: ItemFactura[];
  estadoAFIP: 'Pendiente' | 'Aprobada' | 'Rechazada';
  cae?: string;
}

export default function FacturacionPage() {
  const [items, setItems] = useState<ItemFactura[]>([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState('');
  const [tipoFactura, setTipoFactura] = useState('A');
  const [cliente, setCliente] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [facturas, setFacturas] = useState<Factura[]>([]);
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const proveedor = mockProveedores.find(p => p.id === proveedorSeleccionado);
  const productosProveedor = mockProductos.filter(p => p.proveedorId === proveedorSeleccionado);

  // ✅ VALIDACIONES ROBUSTAS
  const validarFactura = (): string[] => {
    const errores: string[] = [];

    if (!proveedorSeleccionado) {
      errores.push('Debe seleccionar un proveedor');
    }

    if (!cliente.trim()) {
      errores.push('Debe ingresar un cliente');
    }

    if (items.length === 0) {
      errores.push('Debe agregar al menos un item');
    }

    items.forEach((item, index) => {
      if (!item.descripcion.trim()) {
        errores.push(`Item ${index + 1}: Descripción requerida`);
      }
      if (item.cantidad <= 0) {
        errores.push(`Item ${index + 1}: Cantidad debe ser mayor a 0`);
      }
      if (item.precioUnitario <= 0) {
        errores.push(`Item ${index + 1}: Precio debe ser mayor a 0`);
      }
    });

    return errores;
  };

  const agregarItem = () => {
    if (!proveedorSeleccionado) {
      setError('Debe seleccionar un proveedor antes de agregar items');
      return;
    }
    
    setError('');
    setItems([...items, { 
      productoId: '', 
      descripcion: '', 
      cantidad: 1, 
      precioUnitario: 0, 
      total: 0 
    }]);
  };

  const eliminarItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const actualizarItem = (index: number, field: keyof ItemFactura, value: string | number) => {
    const newItems = [...items];
    newItems[index][field] = value as never;
    
    if (field === 'productoId') {
      const producto = mockProductos.find(p => p.id === value);
      if (producto) {
        newItems[index].descripcion = producto.nombre;
        newItems[index].precioUnitario = producto.costo;
        newItems[index].total = newItems[index].cantidad * producto.costo;
      }
    } else if (field === 'cantidad' || field === 'precioUnitario') {
      const cantidad = Number(newItems[index].cantidad);
      const precioUnitario = Number(newItems[index].precioUnitario);
      newItems[index].total = cantidad * precioUnitario;
    }
    
    setItems(newItems);
  };

  const total = items.reduce((sum, item) => sum + item.total, 0);

  // ✅ GENERAR PDF (Mock)
  const generarPDF = () => {
    const errores = validarFactura();
    if (errores.length > 0) {
      setError(errores.join(', '));
      return;
    }

try {
    const doc = new jsPDF();
    
    // Encabezado
    doc.setFontSize(20);
    doc.text(`FACTURA ${tipoFactura}`, 105, 20, { align: 'center' });
    
    // Datos de la factura
    doc.setFontSize(12);
    doc.text(`Proveedor: ${proveedor?.nombre || ''}`, 20, 40);
    doc.text(`Cliente: ${cliente}`, 20, 50);
    doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 60);
    
    // Items de la factura
    let y = 80;
    doc.text('ITEMS:', 20, y);
    y += 10;
    
    items.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.descripcion} - Cant: ${item.cantidad} - $${item.precioUnitario}`, 25, y);
      y += 7;
    });
    
    // Total
    doc.setFontSize(14);
    doc.text(`TOTAL: $${total.toFixed(2)}`, 20, y + 10);
    
    // Generar el PDF real
    const pdfBlob = doc.output('blob');
    const url = URL.createObjectURL(pdfBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `factura-${tipoFactura}-${Date.now()}.pdf`;
    link.click();
    
    setError('');
    alert('PDF generado exitosamente!');
    
  } catch (error) {
    setError('Error al generar el PDF');
  }
};

  // ✅ EMITIR FACTURA AFIP (Mock)
  const emitirFacturaAFIP = async () => {
    const errores = validarFactura();
    if (errores.length > 0) {
      setError(errores.join(', '));
      return;
    }

    try {
    setError('Conectando con AFIP...');
    
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const nuevaFactura: Factura = {
      id: Date.now().toString(),
      numero: `FAC-${tipoFactura}-${facturas.length + 1}`,
      fecha: new Date(),
      proveedor: proveedor?.nombre || '',
      cliente,
      tipo: tipoFactura,
      total,
      items: [...items],
      estadoAFIP: 'Aprobada',
      cae: Math.random().toString(36).substring(2, 15).toUpperCase()
    };

    setFacturas([nuevaFactura, ...facturas]);
    setItems([]);
    setCliente('');
    setError('');
    
    // Mostrar mensaje de éxito en lugar de alert
    setSuccess(`✅ Factura emitida exitosamente! CAE: ${nuevaFactura.cae}`);
    
    // Limpiar el mensaje después de 5 segundos
    // setTimeout(() => setSuccess(''), 5000);
    
  } catch (error) {
    setError('Error al conectar con AFIP. Intente nuevamente.');
  }
};

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
<div className="flex justify-between items-center">
  <h1 className="text-3xl font-bold text-foreground">Facturación</h1>
  <div className="flex gap-4 items-center">
    <Button variant="outline" onClick={() => setMostrarHistorial(!mostrarHistorial)} className='cursor-pointer'>
      <History className="h-4 w-4 mr-2" />
      {mostrarHistorial ? 'Nueva Factura' : 'Ver Historial'}
    </Button>
    
    {/* BADGE MEJORADO */}
    <div className={`px-4 py-2 rounded-full text-sm font-medium ${
      items.length > 0 
        ? 'bg-green-100 text-green-800 border border-green-300 dark:bg-green-900 dark:text-green-300' 
        : 'bg-gray-100 text-gray-800 border border-gray-300 dark:bg-gray-800 dark:text-gray-300'
    }`}>
      {items.length > 0 ? '📝 Factura en proceso' : '📋 Sin items'}
    </div>
  </div>
</div>

      {/* HISTORIAL DE FACTURAS */}
      {mostrarHistorial && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">📊 Historial de Facturas</h2>
          {facturas.length === 0 ? (
            <p className="text-foreground/60">No hay facturas emitidas</p>
          ) : (
            <div className="space-y-3">
              {facturas.map(factura => (
                <div key={factura.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-semibold">{factura.numero}</h3>
                      <p className="text-sm">{factura.cliente} - ${factura.total}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs ${
                      factura.estadoAFIP === 'Aprobada' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {factura.estadoAFIP}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      )}

      {/* NUEVA FACTURA */}
      {!mostrarHistorial && (
  <>
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-foreground">Nueva Factura</h2>
        <p className="text-foreground/60">Complete los datos para emitir la factura AFIP</p>
      </div>

      <div className="space-y-6">
        {/* Selección de proveedor */}
        <div>
          <label className="block text-sm font-medium text-foreground/70 mb-2">Proveedor</label>
          <select 
            value={proveedorSeleccionado} 
            onChange={(e) => {
              setProveedorSeleccionado(e.target.value);
              setError('');
            }}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground"
          >
            <option value="">Seleccionar proveedor</option>
            {mockProveedores.map(prov => (
              <option key={prov.id} value={prov.id}>
                {prov.nombre} - {prov.nombreContacto}
              </option>
            ))}
          </select>
        </div>

        {/* Mensaje de error */}
        {error && (
          <div className="flex items-center gap-2 p-3 bg-red-100 border border-red-300 text-red-700 rounded-md">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Mensaje de éxito */}
        {success && (
          <div className="flex items-center gap-2 p-3 bg-green-100 border border-green-300 text-green-700 rounded-md">
            <CheckCircle className="h-5 w-5 flex-shrink-0" />
            <p className="text-sm">{success}</p>
          

         {/* Botón de cerrar (X) */}
    <button
      onClick={() => setSuccess('')}
      className="text-green-600 hover:text-green-800 hover:bg-green-100 rounded-full p-1 transition-colors cursor-pointer"
      aria-label="Cerrar mensaje"
      >
      <X className="h-4 w-4" />
    </button>
  </div>
)}


        {/* Info del proveedor seleccionado */}
        {proveedor && (
          <Card className="p-4 bg-muted/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {proveedor.nombreContacto}
                </h4>
                <p className="text-sm text-foreground/70">{proveedor.nombre}</p>
                <p className="text-sm text-foreground/70">CIF: {proveedor.cif}</p>
              </div>
              <div>
                <p className="text-sm flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {proveedor.direccion}
                </p>
                <p className="text-sm flex items-center">
                  <Phone className="h-4 w-4 mr-2" />
                  {proveedor.telefono}
                </p>
                <p className="text-sm flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  {proveedor.email}
                </p>
              </div>
            </div>
          </Card>
        )}

        {/* Tipo de factura y cliente */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">Tipo de Factura</label>
            <select 
              value={tipoFactura} 
              onChange={(e) => setTipoFactura(e.target.value)}
              className="w-full p-2 border border-border rounded-md bg-background text-foreground"
            >
              <option value="A">Factura A</option>
              <option value="B">Factura B</option>
              <option value="C">Factura C</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-foreground/70 mb-2">Cliente</label>
            <Input
              id="cliente"
              label=""
              placeholder="Nombre o razón social del cliente"
              value={cliente}
              onChange={(e) => setCliente(e.target.value)}
            />
          </div>
        </div>

{/* // Items de la factura - VERSIÓN MEJORADA Y RESPONSIVAk */}
<div>
  <div className="flex justify-between items-center mb-4">
    <h3 className="text-lg font-semibold">Items</h3>
    <Button onClick={agregarItem} className='cursor-pointer'>
      <Plus className="h-4 w-4 mr-2" />
      Agregar Item
    </Button>
  </div>

  {/* Items - VERSIÓN MEJORADA Y RESPONSIVA */}
  <div className="space-y-3">
    {items.map((item, index) => (
      <div key={index} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-start p-4 border border-border rounded-md bg-card shadow-sm">
        
        {/* Producto (4 columnas en desktop, 12 en mobile) */}
        <div className="sm:col-span-4">
          <label className="text-xs font-medium text-foreground/70 block mb-1">Producto</label>
          <select
            value={item.productoId}
            onChange={(e) => actualizarItem(index, 'productoId', e.target.value)}
            className="w-full p-2 border border-border rounded-md bg-background text-foreground text-sm"
          >
            <option value="">Seleccionar producto</option>
            {productosProveedor.map(prod => (
              <option key={prod.id} value={prod.id}>
                {prod.nombre}
              </option>
            ))}
          </select>
        </div>
        
        {/* Cantidad (2 columnas) */}
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-foreground/70 block mb-1">Cantidad</label>
          <Input
            id={`cantidad-${index}`}
            label=''
            type="number"
            min="1"
            placeholder="1"
            value={item.cantidad}
            onChange={(e) => actualizarItem(index, 'cantidad', parseInt(e.target.value) || 1)}
            className="text-sm h-9"
          />
        </div>
        
        {/* Precio Unitario (2 columnas) */}
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-foreground/70 block mb-1">Precio Unit.</label>
          <Input
            id={`precio-${index}`}
            label=''
            type="number"
            step="0.01"
            min="0"
            placeholder="0.00"
            value={item.precioUnitario}
            onChange={(e) => actualizarItem(index, 'precioUnitario', parseFloat(e.target.value) || 0)}
            className="text-sm h-9"
          />
        </div>
        
        {/* Total (2 columnas) */}
        <div className="sm:col-span-2">
          <label className="text-xs font-medium text-foreground/70 block mb-1">Total</label>
          <div className="font-medium text-sm bg-muted p-2 rounded border h-9 flex items-center justify-center">
            ${item.total.toFixed(2)}
          </div>
        </div>
        
        {/* Botón eliminar (2 columnas) */}
        <div className="sm:col-span-2 flex items-center justify-center pt-4">
          <Button
            variant="danger"
            onClick={() => eliminarItem(index)}
            className="text-red-500 hover:text-red-200 h-9 w-full sm:w-auto cursor-pointer"
            
          >
            <Trash2 className="h-4 w-4" />
            <span className="sr-only">Eliminar</span>
          </Button>
        </div>
      </div>
    ))}
  </div>

  {/* Mensaje cuando no hay items */}
  {items.length === 0 && (
    <div className="text-center py-8 border-2 border-dashed border-border rounded-md">
      <FileText className="h-12 w-12 text-foreground/30 mx-auto mb-2" />
      <p className="text-foreground/60">No hay items agregados</p>
      <p className="text-sm text-foreground/40">Haga clic en `Agregar Item` para comenzar</p>
    </div>
  )}

          {/* Total y acciones */}
          {items.length > 0 && (
            <div className="flex justify-between items-center pt-4 border-t mt-4">
              <div className="text-2xl font-bold">
                Total: ${total.toFixed(2)}
              </div>
              <div className="space-x-2">
                <Button variant="outline" onClick={generarPDF} 
                      className="cursor-pointer">
                  <FileText className="h-4 w-4 mr-2" />
                  Generar PDF
                </Button>
                <Button onClick={emitirFacturaAFIP}
                       className="cursor-pointer">
                  <Shield className="h-4 w-4 mr-2" />
                  Emitir Factura AFIP
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>

    {/* CONEXIÓN AFIP */}
    <Card className="p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-foreground">🏛️ Conexión AFIP</h2>
        <p className="text-foreground/60">Estado de la configuración para facturación electrónica</p>
      </div>
      <div className="flex items-center space-x-2">
        <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 text-sm">
          ✅ Conectado (Modo Simulación)
        </span>
        <Button variant="primary" className='cursor-pointer'>
          Configurar conexión AFIP Real
        </Button>
      </div>
    </Card>
  </>
)}
    </div>
  );
}