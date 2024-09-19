import React, { useState, useEffect } from 'react';
import Header from '../../componentes/header1';
import Footer from '../../componentes/footer';
import { useNavigate } from 'react-router-dom'; 
import Swal from 'sweetalert2'; 

const CarritoPage = () => {
  const [carrito, setCarrito] = useState([]);
  const [contadorCarrito, setContadorCarrito] = useState(0); // Estado para el contador del carrito
  const navigate = useNavigate(); 

  useEffect(() => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
    actualizarContador(carritoGuardado); // Inicializa el contador con los productos en el carrito
  }, []);

  // Función para actualizar el contador
  const actualizarContador = (nuevoCarrito) => {
    const totalProductos = nuevoCarrito.reduce((total, producto) => total + producto.cantidad, 0);
    setContadorCarrito(totalProductos);
  };

  // Función para aumentar la cantidad del producto
  const aumentarCantidad = async (id) => {
    try {
      // Obtén el stock actual del producto desde la API
      const response = await fetch(`http://localhost:4000/Products/${id}`);
      const producto = await response.json();
      const productoStock = parseInt(producto.cantidad, 10); // Asume que la API devuelve el stock
  
      const nuevoCarrito = carrito.map(p => {
        if (p.id === id) {
          if (p.cantidad < productoStock) { // Usa el stock real del producto
            return { ...p, cantidad: p.cantidad + 1 };
          } else {
            Swal.fire({
              title: 'Cantidad máxima alcanzada',
              text: 'No puedes agregar más de la cantidad disponible en stock.',
              icon: 'warning',
              timer: 2000,
              showConfirmButton: false,
            });
            return p;
          }
        }
        return p;
      });
  
      setCarrito(nuevoCarrito);
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); // Actualiza el almacenamiento local
      actualizarContador(nuevoCarrito); // Actualiza el contador
    } catch (error) {
      console.error('Error al obtener el stock del producto:', error);
    }
  };

  // Función para disminuir la cantidad del producto
  const disminuirCantidad = (id) => {
    const nuevoCarrito = carrito.map(p =>
      p.id === id ? { ...p, cantidad: p.cantidad > 1 ? p.cantidad - 1 : 1 } : p
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    actualizarContador(nuevoCarrito); // Actualiza el contador
  };

  // Función para eliminar un producto del carrito
  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter(p => p.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    actualizarContador(nuevoCarrito); // Actualiza el contador
  };

  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem('carrito'); // Elimina el carrito del localStorage
    actualizarContador([]); // Actualiza el contador a 0
  };

  // Función para calcular el subtotal
  const calcularSubtotal = () => {
    return carrito.reduce((total, producto) => total + (producto.precio_unitario * producto.cantidad), 0);
  };

  // Función para manejar el pago
  const handlePagar = () => {
    const isAuthenticated = sessionStorage.getItem("isAuthenticated") === "true";

    // Verificar si el carrito está vacío
    if (carrito.length === 0) {
      Swal.fire({
        title: "Carrito vacío",
        text: "Debes agregar productos al carrito antes de proceder al pago.",
        icon: "error",
        timer: 2000, 
        showConfirmButton: false, 
      });
      return; // No permitir continuar si el carrito está vacío
    }

    if (!isAuthenticated) {
      // Mostrar alerta si el usuario no está autenticado
      Swal.fire({
        title: "Inicia sesión o crea una cuenta",
        text: "Debes estar registrado para proceder con el pago.",
        icon: "warning",
        timer: 2000, 
        showConfirmButton: false, 
      }).then(() => {
        navigate("/inicio_registro.js"); // Redirige a la página de inicio de sesión/registro
      });
    } else {
      // Continuar con el proceso de pago
      navigate("/venta_cliente.js");
    }
  };
  const calcularCantidadTotal = () => {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
  };

  return (
    <div>
      <Header productos={[]} contadorCarrito={contadorCarrito} />
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>
      <br/>

      <div className="container mt-5">
        <h2>Carrito de Compras</h2>
        <br/>

        <div className="table-responsive">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Precio</th>
                <th>Cantidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(carrito) && carrito.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center">No hay productos en el carrito.</td>
                </tr>
              ) : (
                carrito.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.nombre}</td>
                    <td>${producto.precio_unitario}</td>
                    <td>
                      <button onClick={() => disminuirCantidad(producto.id)} className="btn btn-sm">-</button>
                      <span className="mx-2">{producto.cantidad}</span>
                      <button onClick={() => aumentarCantidad(producto.id)} className="btn btn-sm ">+</button>
                    </td>
                    <td>
                      <button onClick={() => eliminarProducto(producto.id)} className="btn btn-sm btn-danger">Eliminar</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="d-flex justify-content-between align-items-center mt-3">
            <div>
              <h4>Subtotal: ${calcularSubtotal()}</h4>
              <h4>Cantidad Total: {calcularCantidadTotal()}</h4> {/* Cantidad Total agregada aquí */}
            </div>
            <div className="d-flex justify-content-center align-items-center mt-3">
              <button onClick={vaciarCarrito} className="btn btn-danger mx-2">Vaciar Carrito</button>
              <button onClick={() => navigate('/')} className="btn btn-success mx-2">Seguir Comprando</button>
              <button onClick={handlePagar} className="btn btn-success mx-2">Pagar</button>
            </div>
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default CarritoPage;
