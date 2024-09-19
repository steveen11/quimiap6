import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom"; // Añadir useLocation
import '../styles/header_styles.css';
import Swal from 'sweetalert2';

const Header = ({ productos, onSearch, contadorCarrito  = () => {} }) => 
  { const [isAuthenticated, setIsAuthenticated] = useState(
    sessionStorage.getItem("isAuthenticated") === "true"
  );
  const [userName, setUserName] = useState(() => {
    return sessionStorage.getItem("userName") || "";
  });
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const handleRedirect = () => {
    navigate('/inicio_registro.js'); // Cambia esta ruta a la ruta correcta
  };

  useEffect(() => {
    if (isAuthenticated) {
      const storedUserName = sessionStorage.getItem("userName");
      if (storedUserName) {
        setUserName(storedUserName);
      }
    } else {
      setUserName("");
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    sessionStorage.clear();
    setIsAuthenticated(false);
    setUserName("");
    localStorage.removeItem('carrito');
    navigate("/");
  };

  const handleMisVentasClick = () => {
    if (!isAuthenticated) {
      Swal.fire({
        title: 'Acceso Denegado',
        text: 'Debes iniciar sesión para acceder a esta sección.',
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/");
        }
      });
    } else {
      navigate("/MisVentas.js");
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };
  

  return (
    <div>
      <header className="sticky-header">
        <div className="container d-flex justify-content-between align-items-center py-3">
          {/* Logo */}
          <div className="header-logo-container">
            <Link to="/">
              <img
                src="/img/Logo.png"
                alt="Logo"
                className="header-logo me-4"
              />
            </Link>
          </div>
          {/* Botón de opciones */}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-outline-secondary me-3"
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasCategorias"
              aria-controls="offcanvasCategorias"
            >
              <i className="bi bi-list" />
            </button>
            <span>Más Opciones</span>
          </div>
          {/* Barra de búsqueda */}
          <div className="mx-3 flex-grow-1">
            <form className="d-flex justify-content-center" onSubmit={handleSearchSubmit}>
              <input
                className="form-control search-bar"
                type="search"
                placeholder="Buscar productos"
                aria-label="Buscar"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
              <button
                className="btn btn-outline-success search-button ms-2"
                type="submit"
              >
                <i className="bi bi-search" />
              </button>
            </form>
          </div>
          {/* Login Dropdown */}
          <div className="dropdown">
            {isAuthenticated ? (
              <div className="dropdown">
                <button
                  className="btn btn-outline-secondary dropdown-toggle"
                  id="userDropdown"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  <i className="bi bi-person" /> {userName || "Usuario"}
                </button>
                <ul
                  className="dropdown-menu dropdown-menu-end"
                  aria-labelledby="userDropdown"
                >
                  <li>
                    <button className="dropdown-item" onClick={() => navigate('/perfil.js')}> 
                      Perfil
                    </button>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="dropdown-item">
                      Cerrar sesión
                    </button>
                  </li>
                </ul>
              </div>
            ) : (
              <>
                <button
                  className="btn btn-outline-success dropdown-toggle"
                  id="loginDropdown"
                  type="button"
                  onClick={handleRedirect}
                >
                  <i className="bi bi-person" /> Iniciar sesión
                </button>
              </>
            )}
          </div>
          {/* Carrito de compras */}
          <Link to="/carrito.js" className="text-success ms-3">
            <i className="bi bi-cart3 fs-4" />
            {contadorCarrito > 0 && ( // Mostrar el contador solo si hay productos en el carrito
              <span className="badge bg-danger ms-1">{contadorCarrito}</span>
            )}
          </Link>
        </div>
      </header>
      {/* Sidebar interactivo */}
      <div className="offcanvas offcanvas-start offcanvas-categorias" tabIndex={-1} id="offcanvasCategorias" aria-labelledby="offcanvasCategoriasLabel">
        <div className="offcanvas-header">
          <h5 className="offcanvas-title" id="offcanvasCategoriasLabel">Mis Ventas</h5>
          <button type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close" />
        </div>
        <div className="offcanvas-body">
          <ul className="list-group">
            <li className="list-group-item">
              <button onClick={handleMisVentasClick} className="text-decoration-none text-dark btn btn-link">
                Ver mis compras
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Header;
