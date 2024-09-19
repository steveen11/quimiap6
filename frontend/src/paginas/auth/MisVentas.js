import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../componentes/header1';
import Footer from '../../componentes/footer';
import '../../styles/MisVentas.css';
import Swal from 'sweetalert2';

const MisVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]);
  const [ventaSeleccionada, setVentaSeleccionada] = useState(null);
  const [paginaActual, setPaginaActual] = useState(1); 
  const userId = sessionStorage.getItem('userId');

  const ventasPorPagina = 5;

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        const salesResponse = await axios.get('http://localhost:4000/Sales');
        const productosResponse = await axios.get('http://localhost:4000/Products');
        setProductos(productosResponse.data);

        const ventasDelUsuario = salesResponse.data.filter((venta) => venta.cliente_id === userId);

        const ventasConDetalles = await Promise.all(ventasDelUsuario.map(async (venta) => {
          const saleDetailsResponse = await axios.get(`http://localhost:4000/SaleDetails?venta_id=${venta.id}`);
          return {
            ...venta,
            SaleDetails: saleDetailsResponse.data
          };
        }));

        setVentas(ventasConDetalles);
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    };

    if (userId) {
      fetchVentas();
    }
  }, [userId]);

  const enviarDetallesPorCorreo = async (venta) => {
    try {
      const productosComprados = venta.SaleDetails.map(detalle => {
        const precio_unitario = detalle.precio_unitario; // Asegúrate de que este campo esté disponible
        const cantidad = detalle.cantidad;
        const subtotal = calcularSubtotal(detalle); // Usa la función que ya tienes
  
        return {
          producto_id: detalle.producto_id,
          nombre: obtenerNombreProducto(detalle.producto_id),
          imagen: obtenerImagenProducto(detalle.producto_id),
          cantidad,
          precio_unitario,
          subtotal, // Agrega el subtotal aquí
          precio_total: subtotal // Si el precio total es igual al subtotal, así lo puedes manejar
        };
      });
  
      const response = await axios.post('http://localhost:5000/enviar-detalle-venta', {
        venta_id: venta.id,
        correo_electronico: venta.correo_electronico,
        productos: productosComprados, // Envía todos los productos en un solo campo
        id: userId
      });
  
      // Usar SweetAlert para mostrar el mensaje de éxito
      await Swal.fire({
        icon: 'success',
        title: 'Revisa tu correo',
        text: response.data.message,
        showConfirmButton: false, // Mostrar botón de cerrar en lugar del botón de aceptar
        timer: 400,
      });
    } catch (error) {
      console.error('Error al enviar el correo:', error);
      
      // Usar SweetAlert para mostrar el mensaje de error
      await Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Ocurrió un error al enviar el correo.',
        confirmButtonText: 'Aceptar'
      });
    }
  };

  const obtenerNombreProducto = (productoId) => {
    const producto = productos.find((prod) => prod.id === productoId);
    return producto ? producto.nombre : 'Producto no encontrado';
  };

  const obtenerImagenProducto = (productoId) => {
    const producto = productos.find((prod) => prod.id === productoId);
    return producto ? producto.imagen : 'placeholder.png';
  };

  const toggleDetallesVenta = (ventaId) => {
    if (ventaSeleccionada === ventaId) {
      setVentaSeleccionada(null);
    } else {
      setVentaSeleccionada(ventaId);
    }
  };
  //calcular subtotal
  const calcularSubtotal = (detalle) => {
    return detalle.precio_unitario * detalle.cantidad;
  };
  const indiceUltimaVenta = paginaActual * ventasPorPagina;
  const indicePrimeraVenta = indiceUltimaVenta - ventasPorPagina;
  const ventasPaginadas = ventas.slice(indicePrimeraVenta, indiceUltimaVenta);

  const numeroTotalPaginas = Math.ceil(ventas.length / ventasPorPagina);

  const cambiarPagina = (numeroPagina) => {
    if (numeroPagina > 0 && numeroPagina <= numeroTotalPaginas) {
      setPaginaActual(numeroPagina);
    }
  };

  return (
    <div>
      <Header />
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <main className="container mt-4 flex-grow-1">
        {ventas.length > 0 ? (
          <>
            <h2 className="text-center mb-4">Mis Compras</h2>
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Método de Pago</th>
                  <th>Precio Total</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {ventasPaginadas.map((venta) => (
                  <React.Fragment key={venta.id}>
                    <tr>
                      <td>{venta.fecha_venta}</td>
                      <td>{venta.metodo_pago}</td>
                      <td>${parseFloat(venta.precio_total).toFixed(2)}</td>
                      <td>{venta.estado}</td>
                      <td>
                        <button 
                          className="btn btn-success" 
                          onClick={() => toggleDetallesVenta(venta.id)}
                        >
                          {ventaSeleccionada === venta.id ? 'Ocultar detalles' : 'Ver detalles'}
                        </button>
                      </td>
                    </tr>
                    {ventaSeleccionada === venta.id && (
                      <tr>
                        <td colSpan="5">
                          <table className="table">
                            <thead>
                              <tr>
                                <th>Producto</th>
                                <th>Imagen</th>
                                <th>Cantidad</th>
                                <th>Precio Unitario</th>
                                <th>Subtotal</th>
                              </tr>
                            </thead>
                            <tbody>
                              {venta.SaleDetails.map((detalle) => (
                                <tr key={detalle.id}>
                                  <td>{obtenerNombreProducto(detalle.producto_id)}</td>
                                  <td>
                                    <img 
                                      src={obtenerImagenProducto(detalle.producto_id)} 
                                      alt="Producto" 
                                      className="img-fluid product-img"
                                    />
                                  </td>
                                  <td>{detalle.cantidad}</td>
                                  <td>${parseFloat(detalle.precio_unitario).toFixed(2)}</td>
                                  <td>${calcularSubtotal(detalle).toFixed(2)}</td>
                                </tr>
                              ))}
                              <tr>
                                <td colSpan={2} style={{ textAlign: 'left', fontWeight: 'bold' }}>Precio Total:</td>
                                <td colSpan={2}>
                                  <strong>${parseFloat(venta.precio_total).toFixed(2)}</strong>
                                </td>
                                <td colSpan={5} style={{ textAlign: 'left' }}>
                                  <button 
                                    className="btn btn-success" 
                                    onClick={() => enviarDetallesPorCorreo(venta)}
                                  >
                                    Detalles por Correo
                                  </button>
                                </td>
                              </tr>

                            </tbody>
                          </table>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>

            {/* Paginación */}
            <nav>
              <ul className="pagination justify-content-center">
                <li className={`page-item ${paginaActual === 1 ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => cambiarPagina(paginaActual - 1)}>
                    Anterior
                  </button>
                </li>
                {Array.from({ length: numeroTotalPaginas }, (_, index) => (
                  <li key={index} className={`page-item ${paginaActual === index + 1 ? 'active' : ''}`}>
                    <button className="page-link" onClick={() => cambiarPagina(index + 1)}>
                      {index + 1}
                    </button>
                  </li>
                ))}
                <li className={`page-item ${paginaActual === numeroTotalPaginas ? 'disabled' : ''}`}>
                  <button className="page-link" onClick={() => cambiarPagina(paginaActual + 1)}>
                    Siguiente
                  </button>
                </li>
              </ul>
            </nav>
          </>
        ) : (
          <div className="text-center my-5">
            <div className="custom-alert">
              <h4 className="alert-heading">No tiene ventas registradas</h4>
              <p>Actualmente no tienes ventas en tu historial. Te invitamos a explorar nuestros productos y realizar tu primera compra.</p>
              <a href="/" className="btn btn-success">Ir a comprar</a>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default MisVentas;