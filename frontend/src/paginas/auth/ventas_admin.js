import React, { useState, useEffect } from 'react';
import Header2 from '../../componentes/header2';
import axios from 'axios';
import Swal from 'sweetalert2';

const VentasAdmin = () => {
  const [ventas, setVentas] = useState([]);
  const [filteredVentas, setFilteredVentas] = useState([]); // Estado para ventas filtradas
  const [fechaFiltro, setFechaFiltro] = useState(''); // Estado para la fecha del filtro
  const [clienteIdFiltro, setClienteIdFiltro] = useState(''); // Estado para el ID del cliente

  // Función para obtener VENTAS de la API
  const fetchVentas = async () => {
    try {
      const response = await axios.get('http://localhost:4000/Sales');
      setVentas(response.data);
      setFilteredVentas(response.data); // Inicialmente, mostrar todas las ventas
    } catch (error) {
      console.error('Error fetching ventas:', error);
    }
  };

  useEffect(() => {
    fetchVentas();
  }, []);

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

    setFilteredVentas(ventasFiltradas);
  };

  return (
    <div>
      <Header2 />
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
                <th>Método de Pago</th>
                <th>Precio Total</th>
                <th>Estado</th>
                <th>ID Cliente</th>
              </tr>
            </thead>
            <tbody>
              {filteredVentas.map((venta) => (
                <tr key={venta.id}>
                  <td>{venta.id}</td>
                  <td>{venta.fecha_venta}</td>
                  <td>{venta.metodo_pago}</td>
                  <td>{venta.precio_total}</td>
                  <td>{venta.estado}</td>
                  <td>{venta.cliente_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </div>
    </div>
  );
}

export default VentasAdmin;