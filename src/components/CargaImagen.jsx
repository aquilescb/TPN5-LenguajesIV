import { useRef, useState } from "react";

export default function CargaImagen() {
   const inputRef = useRef(null);

   const [isDragOver, setIsDragOver] = useState(false);
   const [preview, setPreview] = useState(""); // dataURL
   const [meta, setMeta] = useState(null); // { name, sizeKB, type }
   const [message, setMessage] = useState("Ningún archivo seleccionado aún.");
   const [error, setError] = useState("");

   function resetView(msg = "Ningún archivo seleccionado aún.") {
      setPreview("");
      setMeta(null);
      setMessage(msg);
      setError("");
   }

   function handleFile(file) {
      if (!file || !file.type || !file.type.startsWith("image/")) {
         resetView();
         setError(
            "El archivo debe ser una imagen (PNG, JPG, GIF, WEBP, etc.)."
         );
         return;
      }

      setError("");
      setMessage("Cargando vista previa…");

      const reader = new FileReader();
      reader.onload = () => {
         setPreview(reader.result);
         setMessage("Imagen cargada correctamente.");
         setMeta({
            name: file.name,
            sizeKB: (file.size / 1024).toFixed(1),
            type: file.type,
         });
      };
      reader.onerror = () => {
         resetView("No se pudo leer el archivo.");
         setError("No se pudo leer el archivo.");
      };
      reader.readAsDataURL(file);
   }

   function onInputChange(e) {
      const file = e.target.files?.[0];
      handleFile(file);
   }

   function onDrop(e) {
      e.preventDefault();
      setIsDragOver(false);
      const file = e.dataTransfer?.files?.[0];
      handleFile(file);
   }

   return (
      <main className="layout">
         {/* Columna izquierda*/}
         <aside className="card">
            <h2>Elegir la imagen</h2>
            <input
               id="fileInput"
               ref={inputRef}
               type="file"
               accept="image/*"
               onChange={onInputChange}
            />

            <h2>O arrastrar y soltar</h2>
            <div
               id="dropzone"
               className={`dropzone ${isDragOver ? "is-dragover" : ""}`}
               onDragEnter={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
               }}
               onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragOver(true);
               }}
               onDragLeave={() => setIsDragOver(false)}
               onDrop={onDrop}
               onClick={() => inputRef.current?.click()}
            >
               <div>
                  <strong>Soltá acá tu imagen</strong>
                  <div className="hint">PNG, JPG, GIF, WEBP, etc.</div>
               </div>
            </div>
         </aside>

         {/* Columna derecha */}
         <section className="card preview">
            <h2>Vista previa</h2>
            <div id="message" className={`meta ${error ? "error" : ""}`}>
               {error ? error : message}
            </div>

            {preview ? (
               <img id="imgPreview" alt="Vista previa" src={preview} />
            ) : null}

            {meta ? (
               <div id="fileMeta" className="meta">
                  <strong>Archivo:</strong> {meta.name}
                  <br />
                  <strong>Tamaño:</strong> {meta.sizeKB} KB
                  <br />
                  <strong>Tipo:</strong> {meta.type}
               </div>
            ) : null}
         </section>
      </main>
   );
}
