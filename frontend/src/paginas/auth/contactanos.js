import React from 'react';
import '../../styles/contacto.css';
import Header from '../../componentes/header1';
import Footer from '../../componentes/footer';
import emailjs from 'emailjs-com';
import Swal from 'sweetalert2';

const Contacto = () => {

    // Manejo del envío del formulario
    const handleSubmit = (e) => {
        e.preventDefault();

        // Obtener los datos del formulario
        const form = e.target;

        emailjs.sendForm('service_vxxsebc', 'template_4epclxt', form, 'HtGnygqg2GRVjZwJs')
            .then((result) => {
                console.log(result.text);
                Swal.fire({
                    icon: 'success',
                    title: 'Formulario enviado con éxito',
                    text: 'Tu mensaje ha sido enviado exitosamente, responderemos lo más rápido posible.',
                    timer: 3000, 
                    showConfirmButton: false
                });
                form.reset(); 
            }, (error) => {
                console.log(error.text);
                Swal.fire({
                    icon: 'error',
                    title: 'Error al enviar el formulario',
                    text: 'Hubo un error al enviar tu mensaje. Por favor, intenta nuevamente.',
                    timer: 3000, 
                    showConfirmButton: false
                });
            });
    }

    return (
        <div>
            <Header productos={[]} />
            <br/>
            <br/>
            <br/>
            <br/>
            <br/>

            <div className="container">
                <section className="d-flex flex-wrap justify-content-center">
                    <div className="col-md-6">
                        <article className="">
                            <h1 className='text-black'>Escríbanos su solicitud</h1>
                            <form onSubmit={handleSubmit} >
                                <div className="mb-3">
                                    <label htmlFor="name" className="form-label">Nombre</label>
                                    <input type="text" className="form-control" id="name" name="name" placeholder="Nombre" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="email" className="form-label">Correo electrónico</label>
                                    <input type="email" className="form-control" id="email" name="email" aria-describedby="emailHelp" placeholder="Correo electrónico" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="phone" className="form-label">Teléfono</label>
                                    <input type="number" className="form-control" id="phone" name="phone" aria-describedby="phoneHelp" placeholder="Teléfono" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="subject" className="form-label">Asunto</label>
                                    <input type="text" className="form-control" id="subject" name="subject" aria-describedby="subjectHelp" placeholder="Asunto" required />
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="message" className="form-label">Mensaje</label>
                                    <textarea className="form-control" id="message" name="message" rows={4} placeholder="Escribe tu mensaje aquí" required />
                                </div>
                                <div className="text-end">
                                    <button type="submit" className="btn btn-success">Enviar</button>
                                </div>
                            </form>
                        </article>
                    </div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Contacto;
