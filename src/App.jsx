import "./index.css";
import CargaImagen from "./components/CargaImagen";
import Contacto from "./components/Contacto";
import Servicios from "./components/Servicios";
import { Routes, Route, Link } from "react-router-dom";
export default function App() {
   return (
      <div>
         {/* Menú de navegación */}
         <nav className="navbar">
            <Link to="/">CargaImagen</Link>
            <Link to="/contacto">Contacto</Link>
            <Link to="/servicios">Servicios</Link>
         </nav>

         {/* Rutas */}
         <Routes>
            <Route path="/" element={<CargaImagen />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/servicios" element={<Servicios />} />
         </Routes>
      </div>
   );
}
