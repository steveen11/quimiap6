import React, { useState, useEffect } from 'react';
import '../../styles/inicio_registro.css';
import Header from "../../componentes/header1";
import Footer from "../../componentes/footer";
import { useNavigate, Link } from 'react-router-dom';
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
        estado: 'Pendiente'
    });
    const [showPassword, setShowPassword] = useState(false);
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordLengthError, setPasswordLengthError] = useState('');
    const [allowLetters, setAllowLetters] = useState(false);

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
    // registrar usuarios
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
            window.location.href = '/';
    
            // Ahora, enviar el correo de verificación al servidor de correos en el puerto 5000
            const verificationResponse = await axios.post('http://localhost:5000/enviar-verificacion', {
                correo_electronico: formData.correo_electronico, // Cambiar 'para' por 'correo_electronico'
                id:response.data.id // Suponiendo que el id del usuario se devuelve en la respuesta
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
            // Elimina cualquier carácter que no sea un número
            const sanitizedValue = value.replace(/\D/g, '');
    
            // Si el valor tiene más de 10 dígitos, lo recorta
            const limitedValue = sanitizedValue.slice(0, 10);
    
            if (limitedValue.length <= 10) {
                setPhoneError(''); // Limpia el error si es válido
                setFormData(prevFormData => ({
                    ...prevFormData,
                    [name]: limitedValue // Solo actualiza si es válido
                }));
            } else {
                setPhoneError('El número de teléfono no debe tener más de 10 dígitos.');
            }
            return; // Se asegura que no pase al siguiente bloque
        }

        if (name === 'contrasena') {
            let newValue = value;
            if (newValue.length > 16) {
                newValue = newValue.slice(0, 14); // Limita a 16 caracteres
                setPasswordLengthError('La contraseña no puede tener más de 14 caracteres.');
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
    // Función para prevenir el pegar en el campo de contraseña
    const handlePaste = (event) => {
        if (event.target.name === 'contrasena') {
            event.preventDefault();
            setPasswordError('No se permite pegar en el campo de contraseña.');
        }
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
                            navigate("/jf_produccion.js");
                            break;
                        case "domiciliario":
                            navigate("/domiciliario.js");
                            break;
                        case "gerente":
                            navigate("/usuarios_admin.js");
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
     // Maneja el cambio en el tipo de documento
     const handleTipoDocChange = (event) => {
        const { value } = event.target;

        // Actualiza el estado del tipo de documento
        setFormData((prevData) => ({
            ...prevData,
            tipo_doc: value,
            num_doc: '' // Resetea el campo de identificación al cambiar el tipo de documento
        }));

        // Verifica el tipo de documento seleccionado
        if (value === "cedula extranjería") {
            setAllowLetters(true); // Permite letras y números
        } else {
            setAllowLetters(false); // Solo permite números para tarjeta y cédula
        }
    };
    
    // Maneja el cambio en el campo de identificación
    const handleIdentificacionChange = (event) => {
        const { value } = event.target;

        // Lógica para cédula (10 dígitos solo numéricos) y tarjeta (10 dígitos solo numéricos)
        if ((formData.tipo_doc === "cedula de ciudadania" || formData.tipo_doc === "tarjeta de identidad") && /^[0-9]{0,10}$/.test(value)) {
            setFormData((prevData) => ({ ...prevData, num_doc: value }));
        } 
        // Lógica para cédula de extranjería (10-12 caracteres alfanuméricos)
        else if (formData.tipo_doc === "cedula extranjeria" && /^[a-zA-Z0-9]{0,12}$/.test(value) && value.length <= 12) {
            setFormData((prevData) => ({ ...prevData, num_doc: value }));
        }
    };

    //solicitar correo en olvisdate tu contraseña:
    const handleForgotPasswordClick = async () => {
    // Mostrar alerta para que el usuario ingrese su correo
    const { value: email } = await Swal.fire({
        title: 'Recuperar contraseña',
        input: 'email',
        inputLabel: 'Por favor ingresa tu correo electrónico para recuperar la contraseña:',
        inputPlaceholder: 'correo@ejemplo.com',
        showCancelButton: true,
        confirmButtonText: 'Enviar',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Debes ingresar un correo electrónico';
            }
        }
    });

    if (email) {
        try {
            // Enviar petición al backend con el correo ingresado
            const response = await fetch('http://localhost:5000/enviar-restablecer-contrasena', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ correo_electronico: email })
            });

            if (response.ok) {
                // Mostrar alerta de éxito sin redirigir
                Swal.fire({
                    icon: 'success',
                    title: 'Correo enviado',
                    text: 'Se ha enviado un link de recuperación a tu correo electrónico.',
                    timer: 1000, // Tiempo de cierre automático en milisegundos
                    showConfirmButton: false // Ocultar botón de confirmación para no hacer clic
                });
            } else {
                // Mostrar alerta de error sin redirigir
                Swal.fire({
                    icon: 'error',
                    title: 'Error',
                    text: 'Hubo un error al enviar el correo.',
                    timer: 1000,
                    showConfirmButton: false
                });
            }
        } catch (error) {
            console.error("Error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Hubo un error al intentar enviar el correo.',
                timer: 1000,
                showConfirmButton: false
            });
        }
    }
};
    return (
        <div className="registro-container">
            <Header productos={[]} />
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
                            <label htmlFor="email">Correo Electrónico:</label>
                            <input type="email" placeholder="Ingresa correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <label htmlFor="password">Contraseña:</label>
                            <div className="input-container">
                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Ingresa la contraseña"
                                    name="contrasena"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    onPaste={handlePaste}
                                    required
                                />
                                <button type="button" className="btn-toggle-visibility" onClick={togglePassword}>
                                    <i className={showPassword ? "bi bi-eye-slash" : "bi bi-eye"} />
                                </button>
                            </div>
                            <div style={{ marginTop: '20px', textAlign: 'left' }}>
                                <Link to="#" 
                                style={{ color: '#28a745', textDecoration: 'none' }}
                                onClick={handleForgotPasswordClick}
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div style={{textAlign: 'right'}}>
                                <button type="submit">Ingresar</button>
                            </div>
                        </form>

                        {/*Register*/}
                        <form onSubmit={handleRegisterSubmit} className="formulario__register" style={{padding: '10px 20px'}}>
                            <h2>Registrarse</h2>
                            <select 
                                id="tipoDoc" 
                                name="tipo_doc" 
                                className="tipoDoc"
                                value={formData.tipo_doc}
                                onChange={handleTipoDocChange}
                                required
                            >
                                <option value="" disabled>Tipo Documento</option>
                                <option value="cedula extranjeria">CE</option>
                                <option value="tarjeta de identidad">TI</option>
                                <option value="cedula de ciudadania">CC</option>
                            </select>

                            <input 
                                type="text" 
                                placeholder="N° identificación" 
                                id="identificacion" 
                                name="num_doc"
                                value={formData.num_doc}
                                onChange={handleIdentificacionChange}
                                required 
                            />

                            <label htmlFor="nombres">Nombres:</label>
                            <input 
                                type="text" 
                                placeholder="Ingrese sus nombres" 
                                name="nombres"
                                value={formData.nombres}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                required 
                            />

                            <label htmlFor="apellidos">Apellidos:</label>
                            <input 
                                type="text" 
                                placeholder="Ingrese sus apellidos" 
                                name="apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                onKeyPress={handleKeyPress}
                                required 
                            />

                            <label htmlFor="telefono">Teléfono:</label>
                            <input 
                                type="number" 
                                placeholder="Dijite su telefono" 
                                name="telefono"
                                value={formData.telefono}
                                onChange={handleChange}
                                maxLength={10}
                                required 
                            />
                            {phoneError && <div className="error-message">{phoneError}</div>}

                            <label htmlFor="correo_electronico">Correo Electrónico:</label>
                            <input 
                                type="email" 
                                placeholder="Ingrese su correo" 
                                name="correo_electronico"
                                value={formData.correo_electronico}
                                onChange={handleChange}
                                required 
                            />

                            <label htmlFor="contrasena">Contraseña:</label>
                            <div className="input-container">
                                <input 
                                type={showPassword ? "text" : "password"}
                                placeholder="Ingrese una contraseña" 
                                name="contrasena"
                                value={formData.contrasena}
                                onChange={handleChange}
                                onPaste={handlePaste}
                                required
                                maxLength={16} 
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
                                <button type="submit">Registrarse</button>
                            </div>
                        </form>

                    </div>
                </div>
            </div>
            <br/>
            <br/>

            <Footer/>
        </div>
    );
}

export default Inicio_registro;
