import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../../componentes/header1';
import Footer from '../../componentes/footer';
import '../../styles/MisVentas.css'; // Importar el archivo CSS

const MisVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [productos, setProductos] = useState([]); // Para almacenar la información de los productos
  const userId = sessionStorage.getItem('userId'); // Obtener el ID del usuario desde sessionStorage

  useEffect(() => {
    const fetchVentas = async () => {
      try {
        // Obtener las ventas relacionadas con el usuario logueado
        const salesResponse = await axios.get('http://localhost:4000/Sales');
        // Obtener los productos
        const productosResponse = await axios.get('http://localhost:4000/Products');

        // Guardar los productos en el estado
        setProductos(productosResponse.data);

        // Filtrar las ventas que pertenecen al usuario logueado
        const ventasDelUsuario = salesResponse.data.filter((venta) => venta.cliente_id === userId);

        // Para cada venta del usuario, obtener sus detalles
        const ventasConDetalles = await Promise.all(ventasDelUsuario.map(async (venta) => {
          const saleDetailsResponse = await axios.get(`http://localhost:4000/SaleDetails?venta_id=${venta.id}`);
          
          // Agregar los detalles a la venta
          return {
            ...venta,
            SaleDetails: saleDetailsResponse.data
          };
        }));

        // Establecer las ventas con los detalles correspondientes en el estado
        setVentas(ventasConDetalles);
      } catch (error) {
        console.error('Error al obtener las ventas:', error);
      }
    };

    if (userId) {
      fetchVentas();
    }
  }, [userId]);

  // Función para obtener el nombre del producto dado su id
  const obtenerNombreProducto = (productoId) => {
    const producto = productos.find((prod) => prod.id === productoId);
    return producto ? producto.nombre : 'Producto no encontrado';
  };

  return (
    <div className="d-flex flex-column min-vh-100"> {/* Asegura que el contenedor ocupe al menos la altura de la vista */}
      <Header />
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

      <main className="container mt-4 flex-grow-1"> {/* Flex-grow-1 asegura que ocupe el espacio disponible */}
        {ventas.length > 0 ? (
          <>
            <h2 className="text-center mb-4">Mis Ventas</h2>
            <div className="row">
              {ventas.map((venta) => (
                <div className="col-md-6 mb-4" key={venta.id}>
                  <div className="card fixed-size-card"> {/* Se añade una clase para el tamaño fijo */}
                    <div className="card-body">
                      <p className="card-text"><strong>Fecha:</strong> {venta.fecha_venta}</p>
                      <p className="card-text"><strong>Método de Pago:</strong> {venta.metodo_pago}</p>
                      <p className="card-text"><strong>Precio Total:</strong> ${parseFloat(venta.precio_total).toFixed(2)}</p>
                      <p className="card-text"><strong>Estado:</strong> {venta.estado}</p>
                      <h6>Detalles de la Venta:</h6>
                      <ul>
                        {venta.SaleDetails.map((detalle) => (
                          <li key={detalle.id}>
                            Producto: {obtenerNombreProducto(detalle.producto_id)}, Cantidad: {detalle.cantidad}, Precio Unitario: ${parseFloat(detalle.precio_unitario).toFixed(2)}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <div className="text-center my-5">
            <div className="custom-alert"> {/* Usar la clase personalizada */}
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
