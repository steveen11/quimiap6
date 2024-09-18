import React from "react";
import { useNavigate } from "react-router-dom";
import '../styles/style_header2.css';

const Header3 = () => {
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
            src="https://i.ibb.co/dbTBHkz/LOGO-JEFE-DE-PRODUCCI-N.jpg"
            alt="LOGO-JEFE-DE-PRODUCCI-N"
            className="logo"
          />
        </div>
        <ul className="nav me-auto mb-2 mb-lg-0">
          <li className="nav-item"><a href="jf_produccion.js" className="nav-link px-2">Productos</a></li>
          <li className="nav-item"><a href="ventas_jfproduccion.js" className="nav-link px-2">Ventas</a></li>
        </ul>
        <div>
          {/* Botón para cerrar sesión */}
          <button
            type="button"
            className="btn btn-success btn-custom"
            onClick={handleLogout}
          >
            Cerrar sesión
          </button>
        </div>
      </header>
    </div>
  );
}

export default Header3;
