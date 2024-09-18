import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../styles/style_bienvenida.css';
import Header from "../../componentes/header1";
import Footer from "../../componentes/footer";
import { Link } from 'react-router-dom';

const Bienvenida = () => {
  const [productos, setProductos] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/Products');
      const productosDisponibles = response.data.filter(producto => producto.estado === 'disponible');
      setProductos(productosDisponibles);
      setSearchResults(productosDisponibles); // Inicializa los resultados de búsqueda con los productos disponibles
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  const productosFiltrados = categoriaSeleccionada
    ? searchResults.filter(producto => producto.categoria === categoriaSeleccionada)
    : searchResults;

  const handleCategoriaClick = (categoria) => {
    setCategoriaSeleccionada(categoria);
  };

  const obtenerStockDelProducto = async (id) => {
    try {
      const response = await axios.get(`http://localhost:4000/Products/${id}`);
      return parseInt(response.data.cantidad, 10); // Devuelve la cantidad disponible del producto
    } catch (error) {
      console.error('Error al obtener el stock del producto:', error);
      return 0;
    }
  };

  const agregarAlCarrito = async (producto) => {
    const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || [];
    const productoEnCarrito = carritoGuardado.find(p => p.id === producto.id);

    // Obtén el stock del producto
    const stock = await obtenerStockDelProducto(producto.id);

    if (productoEnCarrito) {
      // Verificar si la nueva cantidad no excede el stock disponible
      if (productoEnCarrito.cantidad + 1 > stock) {
        Swal.fire({
          title: '¡Cantidad máxima alcanzada!',
          text: `Alcanzaste el maximo de cantidad del producto ${producto.nombre} no puedes llevar mas de ${stock}.`,
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }

      // Actualizar la cantidad en el carrito
      const nuevoCarrito = carritoGuardado.map(p =>
        p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
      );
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    } else {
      // Verificar si el producto está disponible en stock
      if (stock < 1) {
        Swal.fire({
          title: 'Producto no disponible',
          text: `${producto.nombre} no está disponible en stock.`,
          icon: 'error',
          timer: 2000,
          showConfirmButton: false
        });
        return;
      }

      // Agregar el producto al carrito con cantidad inicial de 1
      const nuevoCarrito = [...carritoGuardado, { ...producto, cantidad: 1 }];
      localStorage.setItem('carrito', JSON.stringify(nuevoCarrito));
    }

    Swal.fire({
      title: '¡Producto agregado!',
      text: `${producto.nombre} ha sido agregado al carrito.`,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    });

    console.log('Carrito después de agregar:', JSON.parse(localStorage.getItem('carrito')));
  };

  const ProductCard = ({ producto }) => (
    <div className="col-md-3" key={producto.id}>
      <div className="card product-card">
        <img 
          src={producto.imagen} 
          alt={producto.nombre} 
          className="card-img-top" 
          style={{ height: '300px', objectFit: 'cover' }} 
        />
        <div className="card-body">
          <h5 className="card-title">{producto.nombre}</h5>
          <p className="card-text"><strong>${producto.precio_unitario}</strong></p>
          <button 
            onClick={() => agregarAlCarrito(producto)} 
            className="btn btn-outline-primary me-2">
            <i className="bi bi-cart" /> Agregar
          </button>
          <button 
            type="button" 
            className="btn btn-outline-secondary mt-1 me-2"
            data-bs-toggle="modal" 
            data-bs-target={`#modalDetalles${producto.id}`}>
            <i className="bi bi-eye" /> Ver Detalles
          </button>
        </div>
      </div>
      {/* Modal para detalles del producto */}
      <div 
        className="modal fade" 
        id={`modalDetalles${producto.id}`} 
        tabIndex="-1" 
        aria-labelledby={`modalDetallesLabel${producto.id}`} 
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id={`modalDetallesLabel${producto.id}`}>{producto.nombre}</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <img 
                src={producto.imagen} 
                alt={producto.nombre} 
                className="img-fluid mb-3" 
                style={{ height: '300px', objectFit: 'cover' }} 
              />
              <p><strong>Descripción:</strong> {producto.descripcion || 'No disponible'}</p>
              <p><strong>Advertencias:</strong> {producto.advertencias}</p>
              <p><strong>Composición:</strong> {producto.composicion}</p>
              <p><strong>Precio:</strong> ${producto.precio_unitario}</p>
            </div>
            
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Cerrar</button>
              <button 
                type="button" 
                className="btn btn-success"
                onClick={() => {
                  agregarAlCarrito(producto);
                  document.querySelector(`[data-bs-dismiss="modal"]`).click();
                }}
              >
                <i className="bi bi-cart" /> Agregar al Carrito
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const handleSearch = (term) => {
    const filteredResults = productos.filter(producto => 
      producto.nombre.toLowerCase().includes(term.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(term.toLowerCase())
    );
    setSearchResults(filteredResults);
  };

  return (
    <div>
      <Header productos={productos} onSearch={handleSearch} />
      <br/>
      <br/>
      <br/>
      <br/>

      {/* Hero Section */}
      <div className="hero">
        <div id="mainCarousel" className="carousel slide" data-bs-ride="carousel">
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src="/img/carrusel-images/supersale.jpg" className="d-block w-100" alt="Oferta 1" />
              <div className="carousel-caption d-none d-md-block">
                <Link to="#" className="btn btn-danger">Compra Aquí</Link>
              </div>
            </div>
            <div className="carousel-item">
              <img src="/img/carrusel-images/pngtree-sale-promotion-50-off-image_914144.png" className="d-block w-100" alt="Oferta 2" />
              <div className="carousel-caption d-none d-md-block">
                <Link to="#" className="btn btn-danger">Compra Aquí</Link>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" type="button" data-bs-target="#mainCarousel" data-bs-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true" />
            <span className="visually-hidden">Previous</span>
          </button>
          <button className="carousel-control-next" type="button" data-bs-target="#mainCarousel" data-bs-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true" />
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
            {/* Categorías */}
            <section className="categories-section">
        <div className="container">
          <div className="row text-center">
            <div className="col-md-3">
              <Link onClick={() => handleCategoriaClick('Cuidado de la Ropa')} className="category-link">
                <div className="category-icon">
                  <i className="bi bi-person-standing-dress" />
                </div>
                <div className="category-text">Cuidado de la Ropa</div>
              </Link>
            </div>
            <div className="col-md-3">
              <Link onClick={() => handleCategoriaClick('Hogar y Limpieza')} className="category-link">
                <div className="category-icon">
                  <i className="bi bi-house-door" />
                </div>
                <div className="category-text">Hogar y Limpieza</div>
              </Link>
            </div>
            <div className="col-md-3">
              <Link onClick={() => handleCategoriaClick('Cuidado de Pisos')} className="category-link">
                <div className="category-icon">
                  <i className="bi bi-square" />
                </div>
                <div className="category-text">Cuidado de Pisos</div>
              </Link>
            </div>
            <div className="col-md-3">
              <Link onClick={() => handleCategoriaClick('Desinfectantes')} className="category-link">
                <div className="category-icon">
                  <i className="bi bi-shield-check" />
                </div>
                <div className="category-text">Desinfectantes</div>
              </Link>
            </div>
          </div>
        </div>
      </section>
      {/* Productos */}
      <section className="productos">
        <div className="container">
          <div className="row">
            {productosFiltrados.map(producto => (
              <ProductCard key={producto.id} producto={producto} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Bienvenida;
