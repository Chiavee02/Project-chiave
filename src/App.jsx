import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import MapMarker from "./componenti/mapMarker";
import fotina from "./componenti/img/negro.jpg";
import future from "./componenti/img/future_car.jpg";

function App() {
  const [position, setPosition] = useState([45.4384, 10.9916]); // Verona

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.watchPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => console.log("Geolocalizzazione negata, uso Verona")
      );
    }
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "100vh", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        attribution='&copy; <a href="https://carto.com/">CARTO</a>'
      />

      {/* Marker posizione attuale */}
      <MapMarker
        position={position}
        title="Sei qui"
        description="Questa è la tua posizione attuale."
        images={[]}
        buttonText="OK"
      />

      {/* Marker Milano */}
      <MapMarker
        position={[45.4642, 9.19]}
        title="Milano"
        description="Centro economico della Lombardia"
        images={[fotina, future]}
        buttonText="Scopri di più"
      />
    </MapContainer>
  );
}

export default App;
