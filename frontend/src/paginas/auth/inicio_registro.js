import React, { useState, useEffect } from 'react';
import '../../styles/inicio_registro.css';
import Header from "../../componentes/header1";
import Footer from "../../componentes/footer";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Swal from 'sweetalert2';

const Inicio_registro = () => {
    const [formData, setFormData] = useState({
        tipo_doc: '',
        num_doc: '',
        nombres: '',
        apellidos: '',
        telefono: '',
        correo_electronico: '',
        contrasena: '',
        rol: 'Cliente',
        estado: 'No verificado'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLengthError, setPasswordLengthError] = useState('');

    const togglePassword = () => {
        setShowPassword(prevShowPassword => !prevShowPassword);
    };

    const validatePassword = (password) => {
        const minLength = 8;
        const maxLength = 16;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
        const lengthValid = password.length >= minLength && password.length <= maxLength;

        if (!lengthValid) {
            return 'La contraseña debe tener entre 8 y 16 caracteres.';
        }
        if (!hasUpperCase) {
            return 'La contraseña debe contener al menos una letra mayúscula.';
        }
        if (!hasSpecialChar) {
            return 'La contraseña debe contener al menos un carácter especial.';
        }

        return '';
    };

    const handleRegisterSubmit = async (event) => {
        event.preventDefault();
    
        if (phoneError || passwordError || passwordLengthError) {
            Swal.fire({
                title: 'Error',
                text: 'Por favor corrige los errores antes de enviar.',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }
    
        try {
            // Primero, enviar la información del registro a la API existente
            const response = await axios.post("http://localhost:4000/Users", {
                ...formData,
                estado: "Pendiente" // Cambia el estado a pendiente
            });
    
            // Mostrar mensaje de éxito tras el registro
            await Swal.fire({
                title: 'Revisa tu correo electrónico',
                text: 'Para activar tu cuenta.',
                icon: 'info',
                timer: 2000,
                showConfirmButton: false
            });
    
            // Ahora, enviar el correo de verificación al servidor de correos en el puerto 5000
            const verificationResponse = await axios.post('http://localhost:5000/enviar-verificacion', {
                correo_electronico: formData.correo_electronico, // Cambiar 'para' por 'correo_electronico'
                id: response.data.id // Suponiendo que el id del usuario se devuelve en la respuesta
                // Puedes incluir un token de verificación aquí
            });
    
            console.log('Correo de verificación enviado:', verificationResponse.data);
    
            
    
        } catch (error) {
            console.error("Error al enviar los datos:", error);
    
            Swal.fire({
                title: 'Error',
                text: 'Hubo un problema al registrar tu cuenta. Inténtalo de nuevo.',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };
    
    

    const handleChange = (event) => {
        const { name, value } = event.target;

        if (name === 'telefono') {
            if (value.length > 10) {
                setPhoneError('El número de teléfono no puede tener más de 10 dígitos.');
            } else {
                setPhoneError('');
            }
        }

        if (name === 'contrasena') {
            let newValue = value;
            if (newValue.length > 16) {
                newValue = newValue.slice(0, 16); // Limita a 16 caracteres
                setPasswordLengthError('La contraseña no puede tener más de 16 caracteres.');
            } else {
                setPasswordLengthError('');
            }
            setPasswordError(validatePassword(newValue));
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: newValue
            }));
            return;
        }

        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }));
    };

    const handleKeyPress = (event) => {
        if (!/^[a-zA-Z\s]*$/.test(event.key)) {
            event.preventDefault();
        }
    };

    useEffect(() => {
        const script = document.createElement('script');
        script.src = '/script/login.js';
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    /*inicio de sesion*/
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isAuthenticated, setIsAuthenticated] = useState(
        sessionStorage.getItem("isAuthenticated") === "true"
    );
    const [userName, setUserName] = useState(() => {
        return sessionStorage.getItem("userName") || "";
    });
    const navigate = useNavigate();

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

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            // Realizar una solicitud GET a la API para obtener los usuarios
            const response = await axios.get("http://localhost:4000/Users", {
                params: {
                    correo_electronico: email,
                    contrasena: password,
                },
            });
    
            // Encontrar el usuario que coincide con el correo y contraseña proporcionados
            const user = response.data.find(
                (u) => u.correo_electronico === email &&
                       u.contrasena === password
            );
    
            if (user) {
                // Verificar el estado del usuario
                if (user.estado === "Activo") {
                    // Guardar datos del usuario en sessionStorage
                    sessionStorage.setItem("isAuthenticated", "true");
                    sessionStorage.setItem("userRole", user.rol);
                    sessionStorage.setItem("userName", user.nombres);
                    sessionStorage.setItem("userId", user.id);
                    setIsAuthenticated(true);
                    setUserName(user.nombres);
    
                    // Mostrar alerta de inicio de sesión exitoso
                    await Swal.fire({
                        title: 'Inicio de sesión exitoso',
                        text: `Bienvenid@, ${user.nombres}!`,
                        icon: 'success',
                        timer: 2000,
                        showConfirmButton: false
                    });
    
                    // Navegar según el rol del usuario
                    switch (user.rol.toLowerCase()) {
                        case "cliente":
                            navigate("/");
                            break;
                        case "jefe de produccion":
                            navigate("/jf_produccion");
                            break;
                        case "domiciliario":
                            navigate("/domiciliario");
                            break;
                        case "gerente":
                            navigate("/usuarios_admin");
                            break;
                        default:
                            navigate("/");
                    }
                } else if (user.estado === "Pendiente") {
                    // Mostrar alerta si el usuario está pendiente
                    await Swal.fire({
                        title: 'Cuenta Pendiente',
                        text: 'Tu cuenta está pendiente de verificación. Por favor, revisa tu correo electrónico para completar la verificación.',
                        icon: 'info',
                        timer: 2000,
                        showConfirmButton: false
                    });
                } else if (user.estado === "Inactivo") {
                    // Mostrar alerta si el usuario está inactivo
                    await Swal.fire({
                        title: 'Cuenta Inactiva',
                        text: 'Tu cuenta está inactiva. Por favor, contacta a soporte.',
                        icon: 'warning',
                        timer: 2000,
                        showConfirmButton: false
                    });
                }
            } else {
                // Mostrar alerta si el correo o la contraseña son incorrectos
                await Swal.fire({
                    title: 'Error',
                    text: 'Correo o contraseña incorrectos',
                    icon: 'error',
                    timer: 2000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            // Mostrar alerta si ocurre un error durante la solicitud
            console.error("Error durante el inicio de sesión:", error);
            await Swal.fire({
                title: 'Error',
                text: 'Ocurrió un error durante el inicio de sesión. Por favor, intente nuevamente.',
                icon: 'error',
                timer: 2000,
                showConfirmButton: false
            });
        }
    };
    
    return (
        <div className="registro-container">
            <Header/>
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

            <br/>
            <br/>

            <div className="main">
                <div className="contenedor__todo">
                    <div className="caja__trasera">
                        <div className="caja__trasera-login">
                            <h3>¿Ya tienes una cuenta?</h3>
                            <p>Inicia sesión para entrar en la página</p>
                            <button id="btn__iniciar-sesion">Iniciar Sesión</button>
                        </div>
                        <div className="caja__trasera-register">
                            <h3>¿Aún no tienes una cuenta?</h3>
                            <p>Regístrate para que puedas iniciar sesión</p>
                            <button id="btn__registrarse">Regístrarse</button>
                        </div>
                    </div>
                    {/*Formulario de Login y registro*/}
                    <div className="contenedor__login-register">
                        {/*Login*/}
                        <form onSubmit={handleLogin} className="formulario__login">
                            <h2 style={{ marginBottom: '80px' }}>Iniciar Sesión</h2>
                            <input type="email" placeholder="Correo Electronico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <div className="input-container">
                                <input 
                                    placeholder="Contraseña"
                                    type={showPassword ? "text" : "password"}
                                    name="contrasena"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" className="btn-toggle-visibility" onClick={togglePassword}>
                                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"} />
                                </button>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <button type="submit">Ingresar</button>
                            </div>
                        </form>

                        {/*Register*/}
                        <form onSubmit={handleRegisterSubmit} className="formulario__register" style={{padding: '10px 20px'}}>
                            <h2>Regístrarse</h2>
                            <select 
                                id="tipoDoc" 
                                name="tipo_doc" 
                                className="tipoDoc"
                                value={formData.tipo_doc}
                                onChange={handleChange}
                                required
                            >
                                <option value="" disabled>tipo doc</option>
                                <option value="dni">DNI</option>
                                <option value="pasaporte">Pasaporte</option>
                                <option value="licencia">Licencia</option>
                                <option value="tarjeta">TI</option>
                                <option value="cedula">CC</option>
                            </select>
                            <input type="number" placeholder="Identificación" id="identificacion" name="num_doc"
                                value={formData.num_doc}
                                onChange={handleChange}
                                required />
                            <input type="text" placeholder="Nombres" name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                required/>
                            <input type="text" placeholder="Apellidos" name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                required/>
                            <input type="text" placeholder="Telefono" name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                maxLength={10}
                                required />
                            {phoneError && <div className="error-message">{phoneError}</div>}
                            <input type="email" placeholder="Correo Electronico" name="correo_electronico"
                                value={formData.correo_electronico}
                                onChange={handleChange}
                                required/>
                            <div className="input-container">
                                <input 
                                    placeholder="Contraseña"
                                    type={showPassword ? "text" : "password"}
                                    name="contrasena"
                                    value={formData.contrasena}
                                    onChange={handleChange}
                                    required
                                    maxLength={16} // Limita la entrada a 16 caracteres
                                />
                                <button type="button" className="btn-toggle-visibility" onClick={togglePassword}>
                                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"} />
                                </button>
                            </div>
                            {passwordError && <div className="error-message">{passwordError}</div>}
                            {passwordLengthError && <div className="error-message">{passwordLengthError}</div>}
                            <div className="checkbox-container">
                                <input
                                    type="checkbox"
                                    id="terminos"
                                    name="terminos"
                                    className="caja"
                                    required
                                />
                                <label htmlFor="terminos">
                                    Autorizo el Tratamiento de datos. Acepto los Términos y Condiciones
                                </label>
                            </div>
                            <div className="registrarse">
                                <button type="submit">Regístrarse</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    );
}

export default Inicio_registro;
