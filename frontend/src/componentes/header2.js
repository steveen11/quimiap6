import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/style_header2.css';

const Header2 = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Limpiar los datos de sesión
    sessionStorage.clear();
    
    // Redirigir al inicio
    navigate('/');
  };

  return (
    <div>
      <header className="py-3 mb-4 border-bottom">
        <div className="d-flex align-items-center">
          <img
            src="/img/LOGO_JEFE_DE_PRODUCCIÓN-Photoroom.png"
            alt="LOGO-JEFE-DE-PRODUCCI-N"
            className="logo"
          />
        </div>
        <ul className="nav me-auto mb-2 mb-lg-0">
          <li className="nav-item"><a href="usuarios_admin.js" className="nav-link px-2">Usuarios</a></li>
          <li className="nav-item"><a href="productos.js" className="nav-link px-2">Productos</a></li>
          <li className="nav-item"><a href="ventas_admin.js" className="nav-link px-2">Ventas</a></li>
          <li className="nav-item"><a href="domicilios_admin.js" className="nav-link px-2">Domicilios</a></li>
        </ul>
        <div>
          {/* Botón para cerrar sesión */}
          <button
            type="button"
            className="btn btn-primary btn-custom"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>
    </div>
  );
}

export default Header2;
