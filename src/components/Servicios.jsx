import standard from "../img/habitacion1.png";
import superior from "../img/habitacion2.png";
import premium from "../img/habitacion3.jpeg";
import vip from "../img/habitacion4.jpeg";
import exclusiva from "../img/habitacion5.jpg";
import clasica from "../img/habitacion6.jpg";
// Componente local para mostrar las habitaciones disponibles
const habitaciones = [
   {
      id: 1,
      titulo: "Habitación Estandar",
      descripcion:
         "La habitación cuenta con una cama doble, escritorio y baño privado. La mas recomendada para una o dos personas.",
      precio: 90_000,
      img: standard,
   },
   {
      id: 2,
      titulo: "Habitacion clasica",
      descripcion:
         "Cuenta con una cama doble, escritorio y baño privado. Simple para una o dos personas.",
      precio: 50_000,
      img: clasica,
   },
   {
      id: 3,
      titulo: "Habitación VIP",
      descripcion:
         "Habitacion con servicio de mayordomo con vista al paisaje, para 2 personas",
      precio: 250_000,
      img: vip,
   },
   {
      id: 4,
      titulo: "Habitacion Premium",
      descripcion:
         "Habitacion amplia con cama king para 8 personas, hidromasaje, sala de estar y balcón con la mejor vista del hotel",
      precio: 800_000,
      img: premium,
   },
   {
      id: 5,
      titulo: "Habitacion Exclusiva",
      descripcion:
         "Ideal personas que prefieran comodidad y lujo. Cuenta con 6 cama king, sala de estar, hidromasaje y balcón con vista al lago.",
      precio: 500_000,
      img: exclusiva,
   },
   {
      id: 6,
      titulo: "Habitación Familiar Superior",
      descripcion:
         "Habitacion amplia con dos camas dobles, ideal para 4 personas",
      precio: 300_000,
      img: superior,
   },
];
// Componente Servicios
export default function Servicios() {
   return (
      <main className="page-center">
         <div className="card contact-card">
            <h2>Habitaciones</h2>
            {/* Grid de habitaciones */}
            <div className="services-grid">
               {/* Mapeo de las habitaciones */}
               {habitaciones.map((h) => (
                  <article key={h.id} className="service-card card">
                     <img src={h.img} alt={h.titulo} />
                     {/* Cuerpo de la tarjeta */}
                     <div className="service-body">
                        <h3 className="service-title">{h.titulo}</h3>
                        <p className="service-desc">{h.descripcion}</p>
                        <div className="service-price">
                           ${h.precio.toLocaleString("es-AR")}
                        </div>
                     </div>
                  </article>
               ))}
            </div>
         </div>
      </main>
   );
}
