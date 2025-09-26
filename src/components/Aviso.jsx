export default function Aviso({ open, title, children, onClose }) {
   if (!open) return null;

   return (
      <div className="modal-backdrop" onClick={onClose}>
         <div
            className="modal-card"
            onClick={(e) => e.stopPropagation()} // Evita cerrar si clickean el contenido
         >
            <h3 className="modal-title">{title}</h3>
            <div className="modal-body">{children}</div>
            <button className="btn" onClick={onClose}>
               Aceptar
            </button>
         </div>
      </div>
   );
}
