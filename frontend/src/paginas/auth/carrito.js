import React, { useState, useEffect } from 'react';
import Header from '../../componentes/header1';
import Footer from '../../componentes/footer';
import { useNavigate } from 'react-router-dom'; // Importar useNavigate
import Swal from 'sweetalert2'; // Importar SweetAlert2 para mostrar alertas

const CarritoPage = () => {
  const [carrito, setCarrito] = useState([]);
  const navigate = useNavigate(); // Inicializar useNavigate

  useEffect(() => {
    // Obtener el carrito desde el almacenamiento local
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    setCarrito(carritoGuardado);
  }, []);

  // Función para aumentar la cantidad del producto
  const aumentarCantidad = (id) => {
    const nuevoCarrito = carrito.map(p =>
      p.id === id ? { ...p, cantidad: p.cantidad + 1 } : p
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); // Actualiza el almacenamiento local
  };

  // Función para disminuir la cantidad del producto
  const disminuirCantidad = (id) => {
    const nuevoCarrito = carrito.map(p =>
      p.id === id ? { ...p, cantidad: p.cantidad > 1 ? p.cantidad - 1 : 1 } : p
    );
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); // Actualiza el almacenamiento local
  };

  // Función para eliminar un producto del carrito
  const eliminarProducto = (id) => {
    const nuevoCarrito = carrito.filter(p => p.id !== id);
    setCarrito(nuevoCarrito);
    localStorage.setItem('carrito', JSON.stringify(nuevoCarrito)); // Actualiza el almacenamiento local
  };

  // Función para vaciar el carrito
  const vaciarCarrito = () => {
    setCarrito([]);
    localStorage.removeItem('carrito'); // Elimina el carrito del localStorage
  };

  // Función para calcular el subtotal
  const calcularSubtotal = () => {
    return carrito.reduce((total, producto) => total + (producto.precio_unitario * producto.cantidad), 0);
  };

  // Función para calcular la cantidad total
  const calcularCantidadTotal = () => {
    return carrito.reduce((total, producto) => total + producto.cantidad, 0);
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
        timer: 2000, // Cerrar automáticamente después de 2 segundos
        showConfirmButton: false, // No mostrar botón de confirmación
      });
      return; // No permitir continuar si el carrito está vacío
    }

    if (!isAuthenticated) {
      // Mostrar alerta si el usuario no está autenticado
      Swal.fire({
        title: "Inicia sesión o crea una cuenta",
        text: "Debes estar registrado para proceder con el pago.",
        icon: "warning",
        timer: 3000, // Cerrar automáticamente después de 3 segundos
        showConfirmButton: false, // No mostrar botón de confirmación
      }).then(() => {
        navigate("/inicio_registro.js"); // Redirige a la página de inicio de sesión/registro
      });
    } else {
      // Continuar con el proceso de pago
      navigate("/venta_cliente.js");
    }
  };

  return (
    <div>
      <Header />
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
                      <button onClick={() => disminuirCantidad(producto.id)} className="btn btn-sm btn-danger">-</button>
                      <span className="mx-2">{producto.cantidad}</span>
                      <button onClick={() => aumentarCantidad(producto.id)} className="btn btn-sm btn-success">+</button>
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
              <button onClick={vaciarCarrito} className="btn btn-danger mt-2">Vaciar Carrito</button>
            </div>
            <button onClick={() => navigate('/')} className="btn btn-success mt-2">Seguir Comprando</button>
            <button onClick={handlePagar} className="btn btn-success mt-2">Pagar</button> {/* Actualizado con la validación */}
          </div>
        </div>
      </div>
      <br />
      <Footer />
    </div>
  );
};

export default CarritoPage;
