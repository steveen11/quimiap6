import React from 'react';
import '../../styles/contacto.css'
import Header from '../../componentes/header1';
import Footer from '../../componentes/footer';
const Contacto = () =>{
    return(
        <div>
            <Header />
        <div className="container">

<section className="d-flex flex-wrap justify-content-between">
  {/* Información de contacto */}
  <div className="col-md-6 d-flex flex-column align-items-center contact-info">
    <br />
    <article className="mb-4">

      <h1 className="section-title">Info de contacto</h1>
      <div className="d-flex align-items-center mb-3">
        <i className="fa-solid fa-phone me-2" />
        <p className="mb-0">3108686112</p>
      </div>
      <div className="d-flex align-items-center">
        <i className="fa-solid fa-envelope me-2" />
        <p className="mb-0">qumiapContacto@gmail.com</p>
      </div>
    </article>
  </div>
  {/* Formulario */}
  <div className="col-md-6">
  <br />
    <article className="text-center">
      <h1 className="section-title">Escríbanos su solicitud</h1>
      <form>
        <div className="mb-3">
          <input type="text" className="form-control" id="name" placeholder="Nombre" />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Correo electrónico" />
        </div>
        <div className="mb-3">
          <input type="number" className="form-control" id="phone" aria-describedby="emailHelp" placeholder="Teléfono" />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" id="subject" aria-describedby="emailHelp" placeholder="Asunto" />
        </div>
        <div className="mb-3">
          <textarea className="form-control" id="message" rows={4} placeholder="Escribe tu mensaje aquí" required defaultValue={""} />
        </div>
        <button type="submit" className="btn btn-primary bt1 btn-custom">Enviar</button>
      </form>
    </article>
  </div>
</section>
</div>
<Footer />
        </div>
    )
}

export default Contacto