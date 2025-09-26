import { useState } from "react";
import emailjs from "@emailjs/browser";
import Aviso from "./Aviso";

export default function Contacto() {
   // Estado del formulario
   const [form, setForm] = useState({
      nombre: "",
      email: "",
      asunto: "",
      mensaje: "",
   });
   // Estado de envío
   const [submitting, setSubmitting] = useState(false);
   // Estado del aviso
   const [aviso, setAviso] = useState({ open: false, ok: true, msg: "" });
   // Manejo de cambios en los campos, actualiza el estado del formulario
   function handleChange(e) {
      setForm({ ...form, [e.target.name]: e.target.value });
   }
   // Manejo del envío del formulario
   async function handleSubmit(e) {
      e.preventDefault();
      // Validar que todos los campos estén completos
      if (!form.nombre || !form.email || !form.asunto || !form.mensaje) {
         setAviso({
            open: true,
            ok: false,
            msg: "Todos los campos son obligatorios.",
         });
         return;
      }
      // Enviar el correo
      try {
         setSubmitting(true);
         //enviar el correo con emailjs
         await emailjs.send(
            "service_igoqkjb",
            "template_ap4r4xe",
            {
               name: form.nombre,
               email: form.email,
               title: form.asunto,
               message: form.mensaje,
            },
            "xIHLw3LRX7_zzaMsq"
         );
         // Si se envió correctamente, limpiar el formulario y mostrar aviso
         setForm({ nombre: "", email: "", asunto: "", mensaje: "" });
         // Mostrar aviso de éxito
         setAviso({
            open: true,
            ok: true,
            msg: "Correo enviado correctamente.",
         });
         // Si hubo un error, mostrar aviso de error
      } catch (err) {
         console.error(err);
         // Mostrar aviso de error
         setAviso({
            open: true,
            ok: false,
            msg: "Ocurrió un error al enviar el correo. Intenta nuevamente.",
         });
         // Finalmente, siempre desactivar el estado de envío
      } finally {
         setSubmitting(false);
      }
   }
   // Renderizado del componente
   return (
      <div className="page-center">
         {/* Contenedor centrado */}
         <main
            className="card contact-card"
            style={{ width: "min(100%, 1000px)" }}
         >
            <h2>Contacto</h2>

            <div className="contact-layout">
               {/* Formulario */}
               <form onSubmit={handleSubmit} className="form contact-form">
                  <label className="field">
                     <span>Nombre</span>
                     <input
                        type="text"
                        name="nombre"
                        value={form.nombre}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                     />
                  </label>

                  <label className="field">
                     <span>Dirección de correo</span>
                     <input
                        type="email"
                        name="email"
                        value={form.email}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                     />
                  </label>

                  <label className="field">
                     <span>Asunto</span>
                     <input
                        type="text"
                        name="asunto"
                        value={form.asunto}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                     />
                  </label>

                  <label className="field">
                     <span>Mensaje</span>
                     <textarea
                        name="mensaje"
                        rows="5"
                        value={form.mensaje}
                        onChange={handleChange}
                        disabled={submitting}
                        required
                     />
                  </label>

                  <button className="btn" type="submit" disabled={submitting}>
                     {submitting ? (
                        <>
                           <span className="spinner" /> Enviando…
                        </>
                     ) : (
                        "Enviar"
                     )}
                  </button>
                  <p className="form-note">
                     Te presento la ubicación del hotel, por si querés venir a
                     visitarnos.
                  </p>
               </form>

               {/* Mapa embebido */}
               <div className="map-card card">
                  <div className="map-wrap">
                     <iframe
                        title="Ubicación del hotel"
                        allowFullScreen
                        src="https://www.google.com/maps?q=Alejandro+I+Hotel,+Balcarce+252,+Salta,+Argentina&output=embed"
                     />
                  </div>
               </div>
            </div>
         </main>
         {/* Componente de aviso modal */}
         <Aviso
            open={aviso.open}
            title={aviso.ok ? "Listo" : "Hubo un problema"}
            onClose={() => setAviso({ ...aviso, open: false })}
         >
            <p className={aviso.ok ? "ok" : "error"}>{aviso.msg}</p>
         </Aviso>
      </div>
   );
}
