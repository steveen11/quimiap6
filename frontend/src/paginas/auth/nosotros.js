import React from 'react';
import Header from '../../componentes/header1';
import Footer from '../../componentes/footer';
import '../../styles/nosotros.css'
const Nosotros = () =>{
    return(
        <div>
      <Header productos={[]} />
      <br/>
    <br/>
    <br/>
    <br/>
  <div className="container">
    <section>
    <br/>
    <br/>
      <h1>QUIMIAP: Innovación y Calidad en Productos de Aseo</h1>
      <p>En QUIMIAP, nos dedicamos a proporcionar soluciones de limpieza de alta calidad que marcan la diferencia. Nuestra pasión por la higiene y el cuidado nos impulsa a ofrecer productos innovadores y eficaces, diseñados para satisfacer las necesidades más exigentes. Sabemos que la limpieza es esencial para la salud y el bienestar, y trabajamos arduamente para garantizar que cada producto cumpla con los más altos estándares de calidad.</p>
      <p>Utilizamos ingredientes de primera categoría y procesos de producción avanzados para asegurar que nuestros productos sean eficaces y seguros. Estamos en la vanguardia de la industria, desarrollando constantemente nuevas fórmulas y productos para ofrecer soluciones de limpieza más eficientes y amigables con el medio ambiente. Nuestro compromiso con la innovación nos permite proporcionar productos que no solo limpian, sino que también protegen y mejoran los espacios donde se utilizan.</p>
      <p>Creemos que un buen servicio es fundamental para el éxito. Nuestro equipo está siempre dispuesto a ayudar y a proporcionar el apoyo necesario para garantizar que nuestros clientes obtengan los mejores resultados posibles. Ya sea para la limpieza industrial, comercial o residencial, en QUIMIAP estamos aquí para ofrecer productos de aseo que realmente marcan la diferencia.</p>
    </section>
  </div>
  <br/>
  <section className="sec1">
    <div className="row">
      <div className="col-md-4">
        <h5>Misión</h5>
        <p className="p1">
          Ofrecemos soluciones de limpieza innovadoras y eficientes para mejorar la higiene y el bienestar de nuestros clientes. Utilizamos ingredientes y procesos avanzados para garantizar productos seguros y eficaces, promoviendo un entorno más limpio y saludable.</p>
      </div>
      <div className="col-md-5">
        <h5>Visión</h5>
        <p className="p1">Ser el líder en la industria de productos de aseo, reconocido por nuestra innovación, calidad y compromiso con el medio ambiente. Aspiramos a establecer relaciones duraderas con nuestros clientes, basadas en la confianza y la excelencia en el servicio</p>
      </div>
      <div className="col-md-3">
        <h5>Valores</h5>
        <p className="p2">
          Calidad<br />
          Innovación<br />
          Compromiso<br />
          Responsabilidad Ambiental
        </p>
      </div>
    </div>
  </section>
  <Footer />
</div>

    )

}

export default Nosotros