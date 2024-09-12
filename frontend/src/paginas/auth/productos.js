import React, { useEffect, useState,useRef } from 'react';
import Header2 from '../../componentes/header2';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faSearch,faFilter } from '@fortawesome/free-solid-svg-icons';
import '../../styles/productos.css'

const Productos = () => {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    imagen: '',
    categoria: '',
    composicion: '',
    contenido_neto: '',
    usos: '',
    advertencias: '',
    cantidad:'',
    precio_unitario: '',
    estado:'disponible'
  });

  const [productos, setProductos] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // Estado para filtro
  const [productsTypeFilter, setProductsTypeFilter] = useState('todos');
  const [showFilters, setShowFilters] = useState(false);
  const filterMenuRef = useRef(null);

    // Paginación
    const [currentPageProduct, setCurrentPageProduct] = useState(1);
    const recordsPerPage = 3;

  // Función para obtener productos de la API
  const fetchProductos = async () => {
    try {
      const response = await axios.get('http://localhost:4000/Products');
      setProductos(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  };

  useEffect(() => {
    fetchProductos();
  }, []);

  // Manejar cambio en los campos de formulario
  const handleInputChange = (e) => {
    const { id, value } = e.target;

    setFormData((prevFormData) => {
      const newFormData = { ...prevFormData, [id]: value };

      // Si se cambia la cantidad, ajustar el estado automáticamente
      if (id === 'cantidad') {
        newFormData.estado = value > 0 ? 'disponible' : 'agotado';
      }

      return newFormData;
    });
  };

  const handleKeyPress = (event) => {
    // Permite solo letras y espacios
    if (!/^[a-zA-Z\s]*$/.test(event.key)) {
      event.preventDefault();
    }
  }

  // Función para registrar un nuevo producto
  const handleRegisterProduct = async () => {
    try {
      await axios.post('http://localhost:4000/Products', formData);
      fetchProductos(); // Actualizar la lista de productos
      resetForm();
      Swal.fire({
        title: 'Producto registrado!!',
        text: `El producto "${formData.nombre}" se registró`,
        icon: 'success',
        showConfirmButton: false,
        timer: 1000, // Duración de 3 segundos
      });
      // Si necesitas redireccionar, utiliza react-router-dom
      // navigate('/productos');
    } catch (error) {
      console.error('Error registering product:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo registrar el producto.',
        icon: 'error',
        showConfirmButton: false,
        timer: 2000, // Duración de 3 segundos
      });
    }
  };

  // Función para editar un producto
  const handleEditProduct = (product) => {
    setIsEditing(true);
    setCurrentProduct(product);
    setFormData(product);
  };

  // Función para actualizar un producto
  const handleUpdateProduct = async () => {
    try {
      await axios.put(`http://localhost:4000/Products/${currentProduct.id}`, formData);
      fetchProductos(); // Actualizar la lista de productos
      resetForm();
      setIsEditing(false);
      Swal.fire({
        title: 'Producto actualizado!!',
        text: `El producto "${formData.nombre}" se actualizó`,
        icon: 'success',
        showConfirmButton: false,
        timer: 1000,
      });
      // Si necesitas redireccionar, utiliza react-router-dom
      // navigate('/productos');
    } catch (error) {
      console.error('Error updating product:', error);
      Swal.fire({
        title: 'Error',
        text: 'No se pudo actualizar el producto.',
        icon: 'error',
        timer: 2000, // Duración de 3 segundos
      });
    }
  };

  // Descontinuar producto
const handleSetInactiveProduct = async (id) => {
  const confirmDescontinuar = await Swal.fire({
    title: '¿Estás seguro?',
    text: 'El producto será marcado como descontinuado.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, descontinuar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
  });

  if (confirmDescontinuar.isConfirmed) {
    try {
      // Obtener el producto actual
      const response = await axios.get(`http://localhost:4000/Products/${id}`);
      const productoActual = response.data;
      const productoActualizado = { ...productoActual, estado: 'descontinuado' }; // Cambiar el estado

      // Actualizar el producto en la API
      await axios.put(`http://localhost:4000/Products/${id}`, productoActualizado);
      
      Swal.fire({
        title: '¡Descontinuado!',
        text: 'Producto marcado como descontinuado exitosamente.',
        icon: 'success',
        confirmButtonText: 'OK',
        confirmButtonColor: '#3085d6',
      }).then(() => {
        fetchProductos(); // Actualizar la lista de productos
      });
    } catch (error) {
      console.error('Error descontinuando el producto:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Error al descontinuar el producto.',
        icon: 'error',
        confirmButtonText: 'OK',
        confirmButtonColor: '#d33',
      });
    }
  }
};
  
  useEffect(() => {
    // Obtener la lista de productos actualizada
    const fetchProductos = async () => {
      try {
        const response = await axios.get('http://localhost:4000/Products');
        setProductos(response.data);
      } catch (error) {
        console.error('Error al obtener los productos:', error);
      }
    };

    fetchProductos();
  }, []);   

  // Resetear formulario
  const resetForm = () => {
    setFormData({
      nombre: '',
      descripcion: '',
      imagen: '',
      categoria: '',
      composicion: '',
      contenido_neto: '',
      usos: '',
      advertencias: '',
      precio_unitario: '',
      cantidad:'',
      estado:'disponible'
    });
    setCurrentProduct(null);
  };

   // Función para manejar el cambio en el input de búsqueda
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle user type filter change
  const handleProductsTypeFilterChange = (e) => {
    setProductsTypeFilter(e.target.value);
  };


 // Filtrar productos basados en el término de búsqueda y en la categoría
const filteredProducts = productos
.filter((producto) => 
  producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
  producto.id.toString().includes(searchTerm.toLowerCase()) // Filtrar por ID
)
.filter((producto) => {
  // Permitir todas las categorías si el filtro es 'todos', 
  // o verificar si el producto pertenece a una de las categorías específicas
  if (productsTypeFilter === 'todos') return true;
  return [
    'Cuidado de la Ropa', 
    'Hogar y Limpieza', 
    'Cuidado de Pisos', 
    'Desinfectantes'
  ].includes(productsTypeFilter) && producto.categoria === productsTypeFilter;
});
  // Calcular el índice del primer y último registro para la página actual
const indexOfLastRecordProduct = currentPageProduct * recordsPerPage;
const indexOfFirstRecordProduct = indexOfLastRecordProduct - recordsPerPage;

// Obtener los productos filtrados para la página actual
const currentRecordsProduct = filteredProducts.slice(indexOfFirstRecordProduct, indexOfLastRecordProduct);
const totalPagesProduct = Math.ceil(filteredProducts.length / recordsPerPage);

// Cambiar de página
const handlePageChangeProduct = (pageNumber) => {
  setCurrentPageProduct(pageNumber);
};

  return (
    <div>
      <Header2 />
      <div className="container">
        <h2>Registro de productos</h2>
        {/* Campo de búsqueda */}
        <div className="d-flex justify-content-between align-items-center mb-3 position-relative">
          {/* Barra de búsqueda */}
  <div className="d-flex align-items-center">
    <FontAwesomeIcon icon={faSearch} className="me-2" style={{ fontSize: '20px' }} />
    <input
      type="text"
      id="searchInput"
      className="form-control"
      placeholder="Buscar por ID o Nombre"
      value={searchTerm}
      onChange={handleSearchChange}
    />
    {/* Ícono de filtro */}
    <button
      type="button"
      className="btn btn-light ms-2 position-relative"
      onClick={() => setShowFilters(!showFilters)}
    >
      <FontAwesomeIcon icon={faFilter} style={{ fontSize: '20px' }} />
    </button>
    {showFilters && (
      <div ref={filterMenuRef} className="filter-menu position-absolute mt-2 p-2 bg-white border rounded shadow">
        <select id="productsTypeFilter" className="form-select" value={productsTypeFilter} onChange={handleProductsTypeFilterChange}>
          <option value="todos">Todos</option>
          <option value="Cuidado de la Ropa">Cuidado de la Ropa</option>
          <option value="Hogar y Limpieza">Hogar y Limpieza</option>
          <option value="Cuidado de Pisos">Cuidado de Pisos</option>
          <option value="Desinfectantes">Desinfectantes</option>
        </select>
      </div>
    )}
  </div>
          <button type="button" className="btn btn-success mt-2" data-bs-toggle="modal" data-bs-target="#registroProductoModal">
            Registrar Producto
          </button>
        </div>
        {/* Modal */}
        <div className="modal fade" id="registroProductoModal" tabIndex={-1} aria-labelledby="registroProductoModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="registroProductoModalLabel">Registrar Producto</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" />
              </div>
              <div className="modal-body">
                <form>
                  {/* Formulario de registro */}
                  <div className="mb-3">
                    <label htmlFor="nombre" className="form-label">Nombre</label>
                    <input type="text" className="form-control" id="nombre" placeholder="Ingrese nombre del producto" value={formData.nombre} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="descripcion" className="form-label">Descripción</label>
                    <input type="text" className="form-control" id="descripcion" placeholder="Ingrese descripción del producto" value={formData.descripcion} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Imagen (URL)</label>
                    <input
                      type="text" className="form-control" id="imagen" value={formData.imagen} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <select
                      className="form-control"
                      id="categoria"
                      value={formData.categoria}
                      onChange={handleInputChange}
                    >
                      <option value="">Selecciona una categoría</option>
                      <option value="Cuidado de la Ropa">Cuidado de la Ropa</option>
                      <option value="Hogar y Limpieza">Hogar y Limpieza</option>
                      <option value="Cuidado de Pisos">Cuidado de Pisos</option>
                      <option value="Desinfectantes">Desinfectantes</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="composicion" className="form-label">Composición</label>
                    <input type="text" className="form-control" id="composicion" placeholder="Ingrese composición del producto" value={formData.composicion} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="contenido_neto" className="form-label">Contenido Neto</label>
                    <input type="text" className="form-control" id="contenido_neto" placeholder="Ingrese contenido neto del producto" value={formData.contenido_neto} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="usos" className="form-label">Usos</label>
                    <input type="text" className="form-control" id="usos" placeholder="Ingrese usos del producto" value={formData.usos} onChange={handleInputChange} onKeyPress={handleKeyPress} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="advertencias" className="form-label">Advertencias</label>
                    <input type="text" className="form-control" id="advertencias" placeholder="Ingrese advertencias del producto" value={formData.advertencias} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="cantidad" className="form-label">Cantidad</label>
                    <input type="number" className="form-control" id="cantidad" placeholder="Ingrese la cantidad a ingresar" value={formData.cantidad} onChange={handleInputChange} />
                  </div>
                  <div className="mb-3">
                    <label htmlFor="precio_unitario" className="form-label">Precio Unitario</label>
                    <input type="text" className="form-control" id="precio_unitario" placeholder="Ingrese precio unitario del producto" value={formData.precio_unitario} onChange={handleInputChange} />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" onClick={resetForm}>Cerrar</button>
                <button type="button" className="btn btn-success" onClick={isEditing ? handleUpdateProduct : handleRegisterProduct}>
                  {isEditing ? 'Guardar Cambios' : 'Guardar'}
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Contenedor centrado para la tabla */}
        <div className="d-flex justify-content-center mt-4">
          <div className="table-container">
            <table className="table table-striped">
              <thead>
                <tr>
                <th style={{ width: '120px' }}>Imagen</th>
                  <th style={{ width: '80px' }}>ID Producto</th>
                  <th style={{ width: '150px' }}>Nombre</th>
                  <th style={{ width: '200px' }}>Descripción</th>
                  <th style={{ width: '120px' }}>Categoría</th>
                  <th style={{ width: '150px' }}>Composición</th>
                  <th style={{ width: '120px' }}>Contenido Neto</th>
                  <th style={{ width: '150px' }}>Usos</th>
                  <th style={{ width: '150px' }}>Advertencias</th>
                  <th style={{ width: '100px' }}>Cantidad</th>
                  <th style={{ width: '120px' }}>Precio Unitario</th>
                  <th style={{ width: '100px' }}>Estado</th>
                  <th style={{ width: '100px' }}>Editar</th>
                  <th style={{ width: '100px' }}>Eliminar</th>
                </tr>
              </thead>
              <tbody>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <tr key={index}>
              <td>
                <img src={product.imagen} alt="producto" style={{ width: '100px', height: 'auto' }} />
              </td>
              <td>{index + 1}</td>
              <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.nombre}
              </td>
              <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.descripcion}
              </td>
              <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.categoria}
              </td>
              <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.composicion}
              </td>
              <td style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.contenido_neto}
              </td>
              <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.usos}
              </td>
              <td style={{ maxWidth: '150px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {product.advertencias}
              </td>
              <td>{product.cantidad}</td>
              <td>{product.precio_unitario}</td>
              <td>{product.estado}</td>
              <td>
                <button
                  type="button"
                  className="btn-sm"
                  data-bs-toggle="modal"
                  style={{ background: 'none', border: 'none' }}
                  data-bs-target="#registroProductoModal"
                  onClick={() => handleEditProduct(product)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </button>
              </td>
              <td>
                <button
                  type="button"
                  className="btn-sm"
                  style={{ background: 'none', border: 'none' }}
                  onClick={() => handleSetInactiveProduct(product.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan="14" className="text-center">No se encontraron productos.</td>
          </tr>
        )}
      </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Paginación */}
<div className="d-flex justify-content-center mt-4">
  <nav>
    <ul className="pagination">
      <li
        className={`paginate_button page-item ${
          currentPageProduct === 1 ? "disabled" : ""
        }`}
      >
        <Link
          onClick={() => handlePageChangeProduct(currentPageProduct - 1)}
          to="#"
          className="page-link"
        >
          Anterior
        </Link>
      </li>
      {[...Array(totalPagesProduct)].map((_, index) => (
        <li
          key={index}
          className={`paginate_button page-item ${
            currentPageProduct === index + 1 ? "active" : ""
          }`}
        >
          <button
            onClick={() => handlePageChangeProduct(index + 1)}
            className="page-link"
          >
            {index + 1}
          </button>
        </li>
      ))}
      <li
        className={`paginate_button page-item next ${
          currentPageProduct === totalPagesProduct ? "disabled" : ""
        }`}
      >
        <Link
          onClick={() => handlePageChangeProduct(currentPageProduct + 1)}
          to="#"
          className="page-link"
        >
          Siguiente
        </Link>
      </li>
    </ul>
  </nav>
</div>

    </div>
  );
};



export default Productos;
