import React, { useState, useRef } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "./CustomMarker.css"; // Importa uno stile esterno se necessario

// Icona predefinita per i marker
const defaultIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41], // Dimensioni icona
  iconAnchor: [12, 41], // Punto dell'icona ancorato alla posizione
  popupAnchor: [1, -34], // Punto di ancoraggio del popup
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  shadowSize: [41, 41], // Dimensione dell'ombra
});

// Componente marker personalizzato
const MapMarker = ({
  position, // Posizione geografica del marker
  icon = defaultIcon, // Icona personalizzata o default
  title, // Titolo visualizzato nel popup
  description, // Descrizione testuale nel popup
  images = [], // Array di immagini da mostrare in slideshow
  buttonText, // Testo del pulsante opzionale
}) => {
  const [currentIndex, setCurrentIndex] = useState(0); // Slide attiva
  const [offsetX, setOffsetX] = useState(0); // Spostamento orizzontale per effetto swipe
  const startX = useRef(null); // Punto iniziale dello swipe
  const isDragging = useRef(false); // Flag per rilevare trascinamento

  const imageWidth = 250; // Larghezza fissa dell’immagine/slide

  // Inizio dello swipe
  const handleStart = (x) => {
    startX.current = x;
    isDragging.current = true;
  };

  // Trascinamento dello swipe
  const handleMove = (x) => {
    if (!isDragging.current) return;
    const delta = x - startX.current;
    setOffsetX(delta); // Aggiorna offset visivo durante trascinamento
  };

  // Fine dello swipe e determinazione cambio slide
  const handleEnd = () => {
    if (!isDragging.current) return;

    const threshold = imageWidth / 3; // Soglia per cambio slide
    if (offsetX < -threshold && currentIndex < images.length - 1) {
      setCurrentIndex((prev) => prev + 1); // Slide successiva
    } else if (offsetX > threshold && currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1); // Slide precedente
    }

    setOffsetX(0); // Reimposta offset
    isDragging.current = false; // Termina trascinamento
  };

  return (
    <Marker position={position} icon={icon}>
      <Popup minWidth={270}>
        <div style={{ textAlign: "center" }}>
          {/* Galleria immagini swipe/slide */}
          {images.length > 0 && (
            <div
              style={{
                overflow: "hidden", // Nasconde le immagini fuori dal contenitore
                borderRadius: "8px", // Angoli arrotondati
                width: `${imageWidth}px`,
                height: "160px",
                margin: "auto",
                position: "relative",
                touchAction: "pan-y", // Impedisce lo scroll verticale durante swipe
                userSelect: "none", // Evita selezione testo durante drag
                cursor: isDragging.current ? "grabbing" : "grab", // Feedback visivo
              }}
              // Eventi per touchscreen
              onTouchStart={(e) => handleStart(e.touches[0].clientX)}
              onTouchMove={(e) => handleMove(e.touches[0].clientX)}
              onTouchEnd={handleEnd}
              // Eventi per mouse
              onMouseDown={(e) => handleStart(e.clientX)}
              onMouseMove={(e) => {
                if (isDragging.current) handleMove(e.clientX);
              }}
              onMouseUp={handleEnd}
              onMouseLeave={handleEnd}
            >
              {/* Contenitore immagini con transizione */}
              <div
                style={{
                  display: "flex", // Disposizione immagini in orizzontale
                  transform: `translateX(calc(-${
                    currentIndex * imageWidth
                  }px + ${offsetX}px))`,
                  transition: isDragging.current
                    ? "none" // Niente animazione durante drag
                    : "transform 0.4s ease", // Transizione fluida
                  width: `${images.length * imageWidth}px`,
                }}
              >
                {/* Render di ogni immagine */}
                {images.map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`Slide ${i + 1}`}
                    style={{
                      width: `${imageWidth}px`,
                      height: "160px",
                      objectFit: "contain", // L’immagine sta dentro il contenitore
                      flexShrink: 0, // Impedisce ridimensionamento
                      pointerEvents: "none", // Disabilita clic sull'immagine
                    }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Indicatori di slide (pallini sotto immagini) */}
          <div
            style={{
              marginTop: "8px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            {images.map((_, i) => (
              <div
                key={i}
                onClick={() => setCurrentIndex(i)} // Cambio slide manuale
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  margin: "0 4px",
                  backgroundColor: currentIndex === i ? "#333" : "#ccc",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>

          {/* Titolo */}
          {title && <h3 style={{ margin: "10px 0 4px" }}>{title}</h3>}

          {/* Descrizione */}
          {description && (
            <p style={{ fontSize: "0.9rem", marginBottom: "8px" }}>
              {description}
            </p>
          )}

          {/* Bottone opzionale */}
          {buttonText && <button className="markerbutton">{buttonText}</button>}
        </div>
      </Popup>
    </Marker>
  );
};

export default MapMarker;
