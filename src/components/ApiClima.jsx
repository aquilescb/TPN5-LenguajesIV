import { useEffect, useState } from "react";

export default function ApiClima() {
   // Estados: datos, carga, error, modo automático (geo/ip)
   const [data, setData] = useState(null);
   const [loading, setLoading] = useState(false);
   const [err, setErr] = useState(null);
   const [, setUsingAuto] = useState(null);
   // Consulta el clima por query puede venir el IP o la latitud y longitud
   async function fetchByQuery(q) {
      setLoading(true);
      setErr(null);
      setData(null);
      try {
         // Key público de WeatherAPI.com (free plan)
         const key = "44df8ac4c13445e4a07225527250510";
         // Construye URL donde se usa encodeURIComponent para evitar problemas con caracteres especiales. Elegimos el idioma español (lang=es) y q puede ser "auto:ip" o "lat,lon"
         const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(
            q
         )}&lang=es`;
         // Realiza la consulta
         const res = await fetch(url);
         //Parseamos el JSON los datos traido de la API
         const json = await res.json();
         //Guardamos los datos en el estado
         setData(json);
      } catch (e) {
         // En caso de error, guarda el mensaje
         setErr(e?.message || "Error al consultar el clima");
      } finally {
         // Finaliza la carga
         setLoading(false);
      }
   }

   // Intenta geolocalización; si falla → auto:ip
   useEffect(() => {
      //Geolocalización
      const geoOk = (pos) => {
         // Si se obtiene la posición, extrae latitud y longitud y consulta el clima
         const { latitude, longitude } = pos.coords;
         // Indica que se está usando geolocalización
         setUsingAuto("geo");
         // Consulta el clima con latitud y longitud
         fetchByQuery(`${latitude},${longitude}`);
      };
      // Si falla la geolocalización, usa la IP
      const geoFail = () => {
         // Indica que se está usando IP
         setUsingAuto("ip");
         // Consulta el clima con la IP
         fetchByQuery("auto:ip");
      };
      // Verifica si el navegador soporta geolocalización
      if ("geolocation" in navigator) {
         navigator.geolocation.getCurrentPosition(geoOk, geoFail, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
         });
      } else {
         setUsingAuto("ip");
         fetchByQuery("auto:ip");
      }
   }, []);

   // URL del icono del clima para asegurar que es completa y sea http
   const iconUrl =
      data && data.current
         ? data.current.condition.icon.startsWith("http")
            ? data.current.condition.icon
            : `https:${data.current.condition.icon}`
         : "";

   return (
      <div className="page-center">
         <div className="card api-card">
            <h1>
               Clima —{" "}
               {data
                  ? `${data.location.name}, ${data.location.country}`
                  : "determinando ubicación..."}
            </h1>

            <div className="api-actions">
               <button
                  className="btn"
                  onClick={() => {
                     // Reintento automático: geo → ip
                     setData(null);
                     setErr(null);
                     setUsingAuto(null);

                     if ("geolocation" in navigator) {
                        navigator.geolocation.getCurrentPosition(
                           (pos) => {
                              const { latitude, longitude } = pos.coords;
                              setUsingAuto("geo");
                              fetchByQuery(`${latitude},${longitude}`);
                           },
                           () => {
                              setUsingAuto("ip");
                              fetchByQuery("auto:ip");
                           },
                           {
                              enableHighAccuracy: true,
                              timeout: 8000,
                              maximumAge: 0,
                           }
                        );
                     } else {
                        setUsingAuto("ip");
                        fetchByQuery("auto:ip");
                     }
                  }}
                  disabled={loading}
               >
                  {loading ? <span className="spinner" /> : "Actualizar"}
               </button>
            </div>

            {/* Errores */}
            {err && (
               <p className="error" style={{ textAlign: "center" }}>
                  {err}
               </p>
            )}

            {/* Espera */}
            {!data && !loading && !err && (
               <p className="hint" style={{ textAlign: "center" }}>
                  Esperando ubicación…
               </p>
            )}

            {/* Datos */}
            {data && data.current && (
               <div className="api-grid">
                  {/* Imagen + condición */}
                  <div className="api-icon-card">
                     <img
                        src={iconUrl}
                        alt={data.current.condition.text}
                        className="api-icon"
                     />
                     <div className="api-cond">
                        {data.current.condition.text}
                     </div>
                  </div>

                  {/* 6 campos */}
                  <div className="api-stats card">
                     <div className="api-row">
                        <span className="meta">Temperatura</span>
                        <strong>{Math.round(data.current.temp_c)} °C</strong>
                     </div>
                     <div className="api-row">
                        <span className="meta">Sensación térmica</span>
                        <strong>
                           {Math.round(data.current.feelslike_c)} °C
                        </strong>
                     </div>
                     <div className="api-row">
                        <span className="meta">Humedad</span>
                        <strong>{data.current.humidity} %</strong>
                     </div>
                     <div className="api-row">
                        <span className="meta">Viento</span>
                        <strong>
                           {Math.round(data.current.wind_kph)} km/h
                        </strong>
                     </div>
                     <div className="api-row">
                        <span className="meta">Dirección del viento</span>
                        <strong>
                           {data.current.wind_dir} ({data.current.wind_degree}°)
                        </strong>
                     </div>
                     <div className="api-row">
                        <span className="meta">Actualizado</span>
                        <strong>
                           {new Date(data.location.localtime).toLocaleString()}
                        </strong>
                     </div>
                  </div>
               </div>
            )}

            <p className="form-note" style={{ marginTop: 10 }}>
               Fuente: WeatherAPI.com
            </p>
         </div>
      </div>
   );
}
