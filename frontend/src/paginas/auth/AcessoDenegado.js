import React, { useEffect } from 'react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const AccesoDenegado = () => {
  const navigate = useNavigate();

  useEffect(() => {
    Swal.fire({
      title: 'Acceso Denegado',
      text: 'No tienes los permisos necesarios para acceder a esta página.',
      icon: 'error',
      timer: 2000,
      showConfirmButton: false,
    }).then(() => {
      navigate('/'); // Redirige a la página de inicio después de la alerta
    });
  }, [navigate]);

  return null; // La página no necesita renderizar nada
};

export default AccesoDenegado;
