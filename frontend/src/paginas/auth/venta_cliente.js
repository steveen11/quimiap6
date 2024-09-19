import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/style_venta_cliente.css';
import Header from "../../componentes/header1";
import Footer from "../../componentes/footer";
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const VentasCliente = () => {
  const [fechaVenta] = useState(new Date().toISOString().split('T')[0]);
  const [metodoPago, setMetodoPago] = useState('');
  const [precioTotal, setPrecioTotal] = useState('');
  const [carrito, setCarrito] = useState([]);
  const [cliente, setCliente] = useState(null);
  const [domicilio, setDomicilio] = useState({
    direccion: '',
    ciudad: '',
    codigo_postal: '',
    fecha_entrega: ''
  });
  const [mostrarDomicilio, setMostrarDomicilio] = useState(false);

  const navigate = useNavigate();
  const clienteId = sessionStorage.getItem('userId');
  const carritoItems = JSON.parse(localStorage.getItem('carrito')) || [];

  useEffect(() => {
    const fetchCliente = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/Users/${clienteId}`);
        setCliente(response.data);
        // Cargar los datos del domicilio guardado si existen
        if (response.data.domicilio) {
          setDomicilio(response.data.domicilio);
        }
      } catch (error) {
        console.error('Error al obtener datos del cliente:', error);
      }
    };

    const fetchCarrito = () => {
      setCarrito(carritoItems);
    };

    fetchCliente();
    fetchCarrito();
  }, [clienteId, carritoItems]);

  const actualizarCantidadProducto = async (productoId, cantidadComprada) => {
    try {
      const response = await axios.get(`http://localhost:4000/Products/${productoId}`);
      const productoActual = response.data;
      const nuevaCantidad = productoActual.cantidad - cantidadComprada;
      const estadoProducto = nuevaCantidad <= 0 ? 'Agotado' : productoActual.estado;

      await axios.put(`http://localhost:4000/Products/${productoId}`, {
        ...productoActual,
        cantidad: nuevaCantidad,
        estado: estadoProducto
      });
    } catch (error) {
      console.error('Error al actualizar la cantidad del producto:', error);
    }
  };

  const verificarCantidadYRegistrarVenta = async () => {
    for (const producto of carrito) {
      try {
        const response = await axios.get(`http://localhost:4000/Products/${producto.id}`);
        const productoActual = response.data;
        if (productoActual.cantidad < producto.cantidad) {
          Swal.fire({
            icon: 'error',
            title: 'Producto Agotado',
            text: `La cantidad del producto "${producto.nombre}" excede la cantidad disponible.`,
          });
          return false; // Detiene el proceso si hay un producto agotado
        }
      } catch (error) {
        console.error('Error al verificar la cantidad del producto:', error);
      }
    }
    return true; // Continúa si todos los productos están disponibles
  };

  const asignarDomiciliario = async () => {
    try {
      const response = await axios.get('http://localhost:4000/Users');
      const usuarios = response.data;
      const domiciliariosDisponibles = usuarios.filter(user => user.rol === 'domiciliario');
  
      if (domiciliariosDisponibles.length > 0) {
        // Obtén el índice del próximo domiciliario desde el almacenamiento local
        let index = parseInt(localStorage.getItem('domiciliarioIndex')) || 0;
        const domiciliario = domiciliariosDisponibles[index];
        
        // Actualiza el índice para la próxima asignación
        index = (index + 1) % domiciliariosDisponibles.length;
        localStorage.setItem('domiciliarioIndex', index);
        
        return domiciliario.id;
      } else {
        throw new Error('No hay domiciliarios disponibles');
      }
    } catch (error) {
      console.error('Error al asignar domiciliario:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const disponible = await verificarCantidadYRegistrarVenta();
    if (!disponible) {
      return;
    }
  
    const estadoVenta = 'Completada';
    const ventaData = {
      fecha_venta: fechaVenta,
      metodo_pago: metodoPago,
      precio_total: precioTotal,
      estado: estadoVenta,
      cliente_id: clienteId,
    };
  
    try {
      const domiciliarioId = mostrarDomicilio ? await asignarDomiciliario() : null;
      if (mostrarDomicilio && !domiciliarioId) {
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'No se pudo asignar un domiciliario.',
        });
        return;
      }
  
      const ventaResponse = await axios.post('http://localhost:4000/Sales', ventaData);
      const ventaId = ventaResponse.data.id;
  
      for (const producto of carrito) {
        const detalleData = {
          venta_id: ventaId,
          producto_id: producto.id,
          cantidad: producto.cantidad,
          precio_unitario: producto.precio_unitario,
        };
        await axios.post('http://localhost:4000/SaleDetails', detalleData);
        await actualizarCantidadProducto(producto.id, producto.cantidad);
      }
  
      if (mostrarDomicilio) {
        const domicilioData = {
          venta_id: ventaId,
          direccion: domicilio.direccion,
          ciudad: domicilio.ciudad,
          codigo_postal: domicilio.codigo_postal,
          // Excluye fecha_entrega aquí
          estado: 'Pendiente',
          domiciliario_id: domiciliarioId,
        };
        await axios.post('http://localhost:4000/domicilio', domicilioData);
  
        // Guardar el domicilio en el perfil del cliente sin fecha_entrega
        await axios.put(`http://localhost:4000/Users/${clienteId}`, {
          ...cliente,
          domicilio: {
            direccion: domicilio.direccion,
            ciudad: domicilio.ciudad,
            codigo_postal: domicilio.codigo_postal
          }
        });
      }
  
      Swal.fire({
        icon: 'success',
        title: 'Venta registrada con éxito',
        text: 'La venta ha sido registrada correctamente.',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        navigate('/MisVentas.js');
        setMetodoPago('');
        setPrecioTotal('');
        setCarrito([]);
        setDomicilio({
          direccion: '',
          ciudad: '',
          codigo_postal: '',
          fecha_entrega: ''
        });
        setMostrarDomicilio(false);
        localStorage.removeItem('carrito');
        localStorage.removeItem('clienteId');
      });
    } catch (error) {
      console.error('Error al registrar la venta:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Hubo un problema al registrar la venta. Inténtelo de nuevo.',
        timer: 2000,
        showConfirmButton: false
      });
    }
  };

  const calcularTotal = () => {
    return carrito.reduce((total, producto) => total + (producto.precio_unitario * producto.cantidad), 0);
  };

  useEffect(() => {
    setPrecioTotal(calcularTotal());
  }, [carrito]);

  const handleFechaEntregaChange = (e) => {
    const fechaSeleccionada = new Date(e.target.value);
    const fechaActual = new Date();

    // Elimina la hora de la fecha actual para la comparación
    fechaActual.setHours(0, 0, 0, 0);

    // Elimina la hora de la fecha seleccionada para la comparación
    fechaSeleccionada.setHours(0, 0, 0, 0);

    if (fechaSeleccionada >= fechaActual) {
      setDomicilio({ ...domicilio, fecha_entrega: e.target.value });
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'Fecha Inválida',
        text: 'La fecha de entrega no puede ser anterior a la fecha actual.',
        timer: 2000,
        showConfirmButton: false
      });
      setDomicilio({ ...domicilio, fecha_entrega: '' });
    }
  };




  return (
    <div>
      <Header productos={[]} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="container mt-5">
        <h2 className="mb-4">Registro de Venta</h2>

        <div className="row">
          {/* Columna de Productos */}
          <div className="col-md-6">
            <h4>Carrito de Compras</h4>
            {carrito.length > 0 ? (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio Unitario</th>
                    <th>Cantidad</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  {carrito.map((producto) => (
                    <tr key={producto.id}>
                      <td>{producto.nombre}</td>
                      <td>${producto.precio_unitario}</td>
                      <td>{producto.cantidad}</td>
                      <td>${producto.precio_unitario * producto.cantidad}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3"><strong>Total:</strong></td>
                    <td>${precioTotal}</td>
                  </tr>
                </tfoot>
              </table>
            ) : (
              <p>No hay productos en el carrito.</p>
            )}
          </div>

          {/* Columna de Datos de Venta */}
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="fechaVenta" className="form-label">Fecha de Venta</label>
                <input
                  type="date"
                  className="form-control"
                  id="fechaVenta"
                  value={fechaVenta}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="metodoPago" className="form-label">Método de Pago</label>
                <select
                  className="form-control"
                  id="metodoPago"
                  value={metodoPago}
                  onChange={(e) => setMetodoPago(e.target.value)}
                  required
                >
                  <option value="">Selecciona un método de pago</option>
                  <option value="Efectivo">Efectivo</option>
                  <option value="Transferencia Bancaria">Transferencia Bancaria</option>
                </select>
              </div>

              <div className="mb-3">
                <label htmlFor="precioTotal" className="form-label">Precio Total</label>
                <input
                  type="number"
                  className="form-control"
                  id="precioTotal"
                  value={precioTotal}
                  readOnly
                />
              </div>

              <div className="mb-3">
                <label htmlFor="domicilio" className="form-label">
                  <input
                    type="checkbox"
                    id="domicilio"
                    checked={mostrarDomicilio}
                    onChange={(e) => setMostrarDomicilio(e.target.checked)}
                  />
                  Dirección de Domicilio
                </label>
              </div>

              {mostrarDomicilio && (
                <div>
                  <div className="mb-3">
                    <label htmlFor="direccion" className="form-label">Dirección</label>
                    <input
                      type="text"
                      className="form-control"
                      id="direccion"
                      maxLength={20}
                      placeholder={cliente && cliente.domicilio ? cliente.domicilio.direccion : 'Ingrese dirección'}
                      onChange={(e) => setDomicilio({ ...domicilio, direccion: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="ciudad" className="form-label">Ciudad</label>
                    <input
                      type="text"
                      className="form-control"
                      id="ciudad"
                      maxLength={20}
                      placeholder={cliente && cliente.domicilio ? cliente.domicilio.ciudad : 'Ingrese ciudad'}
                      onChange={(e) => setDomicilio({ ...domicilio, ciudad: e.target.value })}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="codigoPostal" className="form-label">Código Postal</label>
                    <input
                      type="text"
                      className="form-control"
                      id="codigoPostal"
                      maxLength={6}
                      placeholder={cliente && cliente.domicilio ? cliente.domicilio.codigo_postal : 'Ingrese código postal'}
                      onChange={(e) => setDomicilio({ ...domicilio, codigo_postal: e.target.value })}
                      required
                      
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="fechaEntrega" className="form-label">Fecha de Entrega</label>
                    <input
                      type="date"
                      className="form-control"
                      id="fechaEntrega"
                      value={domicilio.fecha_entrega}
                      onChange={handleFechaEntregaChange}
                      required
                    />
                  </div>
                </div>
              )}
              <button type="submit" className="btn btn-success float-end">Confirmar Venta</button>            
              </form>
              <br/>
              <br/>
              <br/>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VentasCliente;
