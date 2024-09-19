import React from "react";
import { Link } from "react-router-dom";
import '../styles/footer_styles.css';

const Footer = () => {
  const currentYear = new Date().getFullYear(); // Obtiene el año actual
    return(
<div>
<footer className="bg-success text-white pt-5">
    <div className="container">
      <div className="row">
        <div className="col-md-3">
          <h5>APP QUIMIAP </h5>
          <Link to="#"><img src="https://via.placeholder.com/150x50/000000/ffffff?text=App+Store" alt="App Store" className="img-fluid mb-2" /></Link>
          <br />
          <Link to="#"><img src="https://via.placeholder.com/150x50/000000/ffffff?text=Google+Play" alt="Google Play" className="img-fluid" /></Link>
        </div>
        <div className="col-md-3">
          <h5>Contáctanos</h5>
          <ul className="list-unstyled">
        <article className="mb-4">
          <div className="d-flex align-items-center mb-3">
            <i className="fa-solid fa-phone me-2" />
            <p className="mb-0">3108686112</p>
          </div>
          <Link to="/contactanos.js" className="text-white"><strong>Formulario de contacto</strong></Link>

        </article>          
        </ul>
          <div className="d-flex justify-content-start">
            <Link to="#" className="me-2"><i className="bi bi-instagram text-white fs-3" /></Link>
            <Link to="#" className="me-2"><i className="bi bi-facebook text-white fs-3" /></Link>
          </div>
        </div>
        <div className="col-md-2">
          <h5>Nosotros</h5>
          <ul className="list-unstyled">
            <li><Link to="/nosotros.js" className="text-white text-decoration-none">Quiénes somos</Link></li>
            <li><Link to="#" className="text-white text-decoration-none">Nuestra Historia</Link></li>
            <li><Link to="#" className="text-white text-decoration-none">Trabaja con nosotros</Link></li>
          </ul>
        </div>
        <div className="col-md-2">
          <h5>Legales</h5>
          <ul className="list-unstyled">
            <li><Link to="#" className="text-white text-decoration-none">Políticas de privacidad</Link></li>
            <li><Link to="#" className="text-white text-decoration-none">Términos y condiciones</Link></li>
            <li><Link to="#" className="text-white text-decoration-none">Reversión de pago</Link></li>
          </ul>
        </div>
      </div>
      <div className="text-center mt-4">
        <p>&copy; {currentYear} QUIMIAP S.A.S. Todos los derechos reservados. NIT 800.149.695-1</p>
    </div>
    </div>
  </footer>
    </div>

    )
}

export default Footer;