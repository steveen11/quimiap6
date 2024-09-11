import React, { useState, useEffect } from 'react';
import Header2 from '../../componentes/header2';
import axios from 'axios';
import Swal from 'sweetalert2'; // Importa SweetAlert2

const DomicilioAdmin = () => {
  const [domicilios, setDomicilios] = useState([]);
  const [filtroEntregados, setFiltroEntregados] = useState(false); // Estado para manejar el filtro

  // Función para obtener domicilios de la API
  const fetchDomicilios = async () => {
    try {
      const response = await axios.get('http://localhost:4000/domicilio');
      setDomicilios(response.data);
    } catch (error) {
      console.error('Error fetching domicilios:', error);
    }
  };

  useEffect(() => {
    fetchDomicilios();
  }, []);

  // Función para actualizar el estado del domicilio
  const confirmarDomicilio = async (domicilioId) => {
    try {
      await axios.patch(`http://localhost:4000/domicilio/${domicilioId}`, {
        estado: 'Entregado'
      });

      // Actualizar el estado local después de la actualización
      setDomicilios(domicilios.map(domicilio =>
        domicilio.id === domicilioId ? { ...domicilio, estado: 'Entregado' } : domicilio
      ));

      // Mostrar alerta con SweetAlert2
      Swal.fire({
        title: 'Confirmación',
        text: 'Domicilio confirmado como entregado',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    } catch (error) {
      console.error('Error updating domicilio:', error);

      // Mostrar alerta de error con SweetAlert2
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el estado del domicilio',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  // Función para alternar el filtro de domicilios entregados
  const toggleFiltroEntregados = () => {
    setFiltroEntregados(!filtroEntregados);
  };

  // Filtrar los domicilios si el filtro está activado
  const domiciliosFiltrados = filtroEntregados
    ? domicilios.filter(domicilio => domicilio.estado === 'Entregado')
    : domicilios;

  return (
    <div>
      <Header2 />
      <section className="container mt-5">
        <h2>Consulta de domicilios</h2>
        <br />
        {/* Botón para filtrar domicilios entregados */}
        <button 
          type="button" 
          className="btn btn-success mb-4" 
          onClick={toggleFiltroEntregados}
        >
          {filtroEntregados ? 'Mostrar todos los domicilios' : 'Ver domicilios entregados'}
        </button>
        {/* Tabla de domicilios */}
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>ID domicilio</th>
              <th>Dirección</th>
              <th>Ciudad</th> {/* Nueva columna para la ciudad */}
              <th>Fecha de entrega</th>
              <th>Estado</th> {/* Columna de estado */}
              <th>Acción</th>
            </tr>
          </thead>
          <tbody>
            {domiciliosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="6">No hay domicilios disponibles.</td>
              </tr>
            ) : (
              domiciliosFiltrados.map((domicilio) => (
                <tr key={domicilio.id}>
                  <td>{domicilio.id}</td>
                  <td>{domicilio.direccion}</td>
                  <td>{domicilio.ciudad}</td> {/* Mostrar la ciudad */}
                  <td>{domicilio.fecha_entrega}</td>
                  <td>{domicilio.estado}</td> {/* Mostrar el estado */}
                  <td>
                    {domicilio.estado !== 'Entregado' && (
                      <button
                        type="button"
                        className="btn btn-warning btn-sm"
                        onClick={() => confirmarDomicilio(domicilio.id)}
                      >
                        Confirmar
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default DomicilioAdmin;
