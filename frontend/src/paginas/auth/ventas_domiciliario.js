import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import Header4 from '../../componentes/header4';

const VentasDomiciliario = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [detallesVenta, setDetallesVenta] = useState({});
  const [domicilios, setDomicilios] = useState([]);
  const [domiciliarioId, setDomiciliarioId] = useState(null);
  const [fechaFiltro, setFechaFiltro] = useState('');
  const [clienteIdFiltro, setClienteIdFiltro] = useState('');
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null); // Estado para la venta seleccionada

  useEffect(() => {
    const id = sessionStorage.getItem('userId');
    setDomiciliarioId(id);
    fetchDomicilios(id);
    fetchVentas();
    fetchProductos();
  }, []);

  // Función para obtener domicilios de la API
  const fetchDomicilios = async (domiciliarioId) => {
    try {
      const response = await axios.get('http://localhost:4000/domicilio');
      const domiciliosFiltrados = response.data.filter(domicilio => domicilio.domiciliario_id === domiciliarioId);
      setDomicilios(domiciliosFiltrados);
      // Filtrar ventas relacionadas con los domicilios
      const ventasFiltradas = await Promise.all(domiciliosFiltrados.map(async (domicilio) => {
        const ventaResponse = await axios.get(`http://localhost:4000/Sales/${domicilio.venta_id}`);
        return ventaResponse.data;
      }));
      setVentas(ventasFiltradas);
    } catch (error) {
      console.error('Error fetching domicilios:', error);
    }
  };

  // Función para obtener ventas de la API
  const fetchVentas = async () => {
    try {
      const response = await axios.get('http://localhost:4000/Sales');
      setVentas(response.data);
    } catch (error) {
      console.error('Error fetching ventas:', error);
    }
  };

  // Función para obtener productos de la API
  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/Products');
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching productos:', error);
    }
  };

  // Función para obtener detalles de venta de la API
  const fetchDetallesVenta = async (ventaId) => {
    try {
      const response = await axios.get(`http://localhost:4000/SaleDetails?venta_id=${ventaId}`);
      setDetallesVenta(prev => ({
        ...prev,
        [ventaId]: response.data
      }));
      setVentaSeleccionada(ventaId); // Actualizar la venta seleccionada
    } catch (error) {
      console.error('Error fetching sale details:', error);
    }
  };

  // Función para manejar el cambio en el input de fecha
  const handleFechaChange = (e) => {
    setFechaFiltro(e.target.value);
  };

  // Función para manejar el cambio en el input de ID de cliente
  const handleClienteIdChange = (e) => {
    setClienteIdFiltro(e.target.value);
  };

  // Función para filtrar las ventas cuando se hace clic en el botón de búsqueda
  const filtrarVentas = () => {
    const regexFecha = /^\d{4}-\d{2}-\d{2}$/;

    let ventasFiltradas = ventas;

    // Filtrar por fecha si se ingresó una
    if (fechaFiltro && regexFecha.test(fechaFiltro)) {
      ventasFiltradas = ventasFiltradas.filter((venta) =>
        venta.fecha_venta.startsWith(fechaFiltro)
      );
    } else if (fechaFiltro && !regexFecha.test(fechaFiltro)) {
      Swal.fire({
        icon: 'error',
        title: 'Formato de fecha incorrecto',
        text: 'Use el formato YYYY-MM-DD',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
      });
      return;
    }

    // Filtrar por cliente ID si se ingresó uno
    if (clienteIdFiltro) {
      ventasFiltradas = ventasFiltradas.filter((venta) =>
        venta.cliente_id === clienteIdFiltro
      );
    }

    setVentas(ventasFiltradas);
  };

  const handleVerDetalles = (ventaId) => {
    if (ventaId !== ventaSeleccionada) {
      fetchDetallesVenta(ventaId);
    }
  };

  // Función para obtener el nombre del producto y su imagen a partir del id
  const getProducto = (productoId) => {
    return productos.find(p => p.id === productoId) || { nombre: 'Desconocido', imagen_url: '' };
  };

  return (
    <div>
      <Header4 />
      <div className="container">
        <section className="container mt-5">
          <h2>Consulta de Ventas</h2>
          <br />

          {/* Filtros para fecha y cliente ID */}
          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="fechaFiltro" className="form-label me-3">Filtrar por Fecha (YYYY-MM-DD):</label>
            <input
              type="text"
              id="fechaFiltro"
              className="form-control me-2"
              style={{ width: '200px' }}  // Ajusta el tamaño del input
              placeholder="YYYY-MM-DD"
              value={fechaFiltro}
              onChange={handleFechaChange}
            />
          </div>

          <div className="mb-3 d-flex align-items-center">
            <label htmlFor="clienteIdFiltro" className="form-label me-3">Filtrar por ID de Cliente:</label>
            <input
              type="text"
              id="clienteIdFiltro"
              className="form-control me-2"
              style={{ width: '200px' }}  // Ajusta el tamaño del input
              placeholder="ID de Cliente"
              value={clienteIdFiltro}
              onChange={handleClienteIdChange}
            />
          </div>

          {/* Botón para filtrar las ventas */}
          <button type="button" className="btn btn-success mb-3" onClick={filtrarVentas}>Buscar</button>

          {/* Tabla de ventas */}
          <table className="table table-striped mt-4">
            <thead>
              <tr>
                <th>ID Venta</th>
                <th>Fecha Venta</th>
                <th>Precio Total</th>
                <th>ID Cliente</th>
                <th>Acción</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.fecha_venta}</td>
                  <td>{venta.precio_total}</td>
                  <td>{venta.cliente_id}</td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleVerDetalles(venta.id)}
                    >
                      Ver Detalles
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Tabla de detalles de venta */}
          {ventaSeleccionada && detallesVenta[ventaSeleccionada] && (
            <section className="container mt-5">
              <h2>Detalles de Venta</h2>
              <table className="table table-striped mt-4">
                <thead>
                  <tr>
                    <th>ID Producto</th>
                    <th>Nombre Producto</th>
                    <th>Imagen Producto</th>
                    <th>Cantidad</th>
                    <th>Precio Unitario</th>
                  </tr>
                </thead>
                <tbody>
                  {detallesVenta[ventaSeleccionada].map((detalle) => {
                    const producto = getProducto(detalle.producto_id);
                    return (
                      <tr key={detalle.id}>
                        <td>{detalle.producto_id}</td>
                        <td>{producto.nombre}</td>
                        <td>
                          <img src={producto.imagen} alt={producto.nombre} style={{ width: '80px', height: '80px' }} />
                        </td>
                        <td>{detalle.cantidad}</td>
                        <td>{detalle.precio_unitario}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          )}
        </section>
      </div>
    </div>
  );
}

export default VentasDomiciliario;
