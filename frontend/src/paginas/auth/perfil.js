import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import '../../styles/perfil_styles.css';
import Header from '../../componentes/header1';
import Footer from '../../componentes/footer';

const PerfilPage = () => {
  const [userData, setUserData] = useState({
    nombres: '',
    apellidos: '',
    telefono: '',
    correo_electronico: '',
    tipo_doc: '',
    num_doc: '',
    contrasena: ''
  });

  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    const userId = sessionStorage.getItem("userId") || "2020";
    
    // Obtener datos del usuario desde la API
    axios.get(`http://localhost:4000/Users/${userId}`)
      .then(response => {
        const user = response.data;
        setUserData({
          nombres: user.nombres,
          apellidos: user.apellidos,
          telefono: user.telefono,
          correo_electronico: user.correo_electronico,
          tipo_doc: user.tipo_doc,
          num_doc: user.num_doc,
          contrasena: user.contrasena
        });
      })
      .catch(error => {
        console.error("Error al obtener los datos del usuario", error);
      });
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const userId = sessionStorage.getItem("userId") || "2020";

    // Obtén el rol y estado actuales para no perderlos
    axios.get(`http://localhost:4000/Users/${userId}`)
      .then(response => {
        const { rol, estado } = response.data;

        // Combina userData con rol y estado
        const updatedData = {
          ...userData,
          rol,
          estado
        };

        // Realiza la actualización con todos los campos
        axios.put(`http://localhost:4000/Users/${userId}`, updatedData)
          .then(() => {
            Swal.fire({
              icon: 'success',
              title: 'Datos actualizados correctamente',
              timer: 2000,
              showConfirmButton: false
            });
            setEditMode(false);
          })
          .catch(error => {
            console.error("Error al actualizar los datos", error);
          });
      })
      .catch(error => {
        console.error("Error al obtener el rol y estado", error);
      });
  };

  const handleCancelEdit = () => {
    setEditMode(false);
  };

  return (
    <div>
      <Header productos={[]} />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
      <div className="profile-container">
        <h2 className="text-center">Mi Perfil</h2>
        <div className="profile-card">
          <div className="row">
            <div className="col-md-6">
              <div className="profile-section">
                <h4>Nombres</h4>
                {editMode ? (
                  <input
                    type="text"
                    name="nombres"
                    value={userData.nombres}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <p>{userData.nombres}</p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-section">
                <h4>Apellidos</h4>
                {editMode ? (
                  <input
                    type="text"
                    name="apellidos"
                    value={userData.apellidos}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <p>{userData.apellidos}</p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-section">
                <h4>Teléfono</h4>
                {editMode ? (
                  <input
                    type="text"
                    name="telefono"
                    value={userData.telefono}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <p>{userData.telefono}</p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-section">
                <h4>Correo Electrónico</h4>
                {editMode ? (
                  <input
                    type="email"
                    name="correo_electronico"
                    value={userData.correo_electronico}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <p>{userData.correo_electronico}</p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-section">
                <h4>Tipo de Documento</h4>
                {editMode ? (
                  <input
                    type="text"
                    name="tipo_doc"
                    value={userData.tipo_doc}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <p>{userData.tipo_doc}</p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-section">
                <h4>Número de Documento</h4>
                {editMode ? (
                  <input
                    type="text"
                    name="num_doc"
                    value={userData.num_doc}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <p>{userData.num_doc}</p>
                )}
              </div>
            </div>
            <div className="col-md-6">
              <div className="profile-section">
                <h4>Contraseña</h4>
                {editMode ? (
                  <input
                    type="password"
                    name="contrasena"
                    value={userData.contrasena}
                    onChange={handleInputChange}
                    className="form-control"
                  />
                ) : (
                  <p>••••••••</p>
                )}
              </div>
            </div>
          </div>
          <div className="profile-buttons">
            {editMode ? (
              <>
                <button onClick={handleSubmit} className="btn btn-success mr-3">Guardar Cambios</button>
                <button onClick={handleCancelEdit} className="btn btn-secondary ml-3">Volver Atrás</button>
              </>
            ) : (
              <button onClick={() => setEditMode(true)} className="btn btn-success">Editar Perfil</button>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PerfilPage;