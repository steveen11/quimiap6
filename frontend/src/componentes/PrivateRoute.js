import React from 'react';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const PrivateRoute = ({ children, allowedRoles }) => {
  const userRole = sessionStorage.getItem("userRole");
  
  if (!userRole) {
    // Redirigir a inicio de sesión si no hay usuario
    return <Navigate to="/" />;
  }

  if (allowedRoles && !allowedRoles.includes(userRole)) {
    // Mostrar alerta de acceso denegado
    Swal.fire({
      title: 'Acceso Denegado',
      text: "No tienes los permisos necesarios para acceder a esta página.",
      icon: 'error',
      timer: 3000,
      showConfirmButton: false
    });

    // Redirigir a la página de acceso denegado
    return <Navigate to="/AccesoDenegado.js" />;
  }

  return children;
};

export default PrivateRoute;
