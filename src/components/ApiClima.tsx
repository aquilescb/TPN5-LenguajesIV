// src/components/ApiClima.tsx
import { useEffect, useState } from "react";
// Tipo de respuesta de los datos que queremos de la API
type WeatherResponse = {
   location: { name: string; country: string; localtime: string };
   current: {
      temp_c: number;
      feelslike_c: number;
      humidity: number;
      wind_kph: number;
      wind_degree: number;
      wind_dir: string;
      condition: { text: string; icon: string };
   };
};

export default function ApiClima() {
   // Estados: datos, carga, error, modo automático de ubicación actual
   const [data, setData] = useState<WeatherResponse | null>(null);
   const [loading, setLoading] = useState(false);
   const [err, setErr] = useState<string | null>(null);
   const [, setUsingAuto] = useState<"geo" | "ip" | null>(null);
   // Consultas
   async function fetchByQuery(q: string) {
      setLoading(true);
      setErr(null);
      setData(null);
      try {
         //API Key y URL
         const key = "44df8ac4c13445e4a07225527250510";
         //Usamos encodeURIComponent para evitar errores con caracteres especiales. Mando la latitud y longitud o "auto:ip" debido a que la API lo permite
         //El parámetro lang=es es para que la respuesta esté en español
         const url = `https://api.weatherapi.com/v1/current.json?key=${key}&q=${encodeURIComponent(
            q
         )}&lang=es`;
         // Consulta realiza a la API
         const res = await fetch(url);
         //Parseo a un formato JSON
         const json: WeatherResponse = await res.json();
         //Guardar datos de la API
         setData(json);
      } catch (e: any) {
         // Mensaje de Error
         setErr(e?.message ?? "Error al consultar el clima");
      } finally {
         // Siempre desactivar carga
         setLoading(false);
      }
   }

   // Intenta GEO primero, si falla -> auto:ip
   useEffect(() => {
      // Funciones de éxito y fallo de geolocalización
      const geoOk = (pos: GeolocationPosition) => {
         // Coordenadas
         const { latitude, longitude } = pos.coords;
         setUsingAuto("geo");
         //Mandar consulta con latitud y longitud para que use la API
         fetchByQuery(`${latitude},${longitude}`);
      };
      // Fallback a IP
      const geoFail = () => {
         setUsingAuto("ip");
         //Mandar el IP para que use la API
         fetchByQuery("auto:ip");
      };
      // Intentar geolocalización
      if ("geolocation" in navigator) {
         // Solicitar geolocalización al usuario esperando 10 segundos
         navigator.geolocation.getCurrentPosition(geoOk, geoFail, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 0,
         });
      } else {
         // Si no hay geolocalización, usar IP
         setUsingAuto("ip");
         fetchByQuery("auto:ip");
      }
   }, []);
   // URL del icono asegurando que sea httpp
   const iconUrl = data
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
                     //Se actualiza el clima
                     setData(null);
                     setErr(null);
                     setUsingAuto(null);
                     // Intentar geolocalización nuevamente
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
                     }
                  }}
                  disabled={loading}
               >
                  {loading ? <span className="spinner" /> : "Actualizar"}
               </button>
            </div>

            {/* Mensaje de Errores */}
            {err && (
               <p className="error" style={{ textAlign: "center" }}>
                  {err}
               </p>
            )}
            {/* Mensaje de espera */}
            {!data && !loading && !err && (
               <p className="hint" style={{ textAlign: "center" }}>
                  Esperando ubicación…
               </p>
            )}
            {/* Datos del clima */}
            {data && (
               <div className="api-grid">
                  {/* Imagen y condición */}
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
