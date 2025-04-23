import React from 'react';
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";

export default function Map() {
  const markers = [
    { id: 1, lat: 55.75, lng: 37.61, name: "Пекарня 'У Васи'" },
    { id: 2, lat: 55.76, lng: 37.62, name: "Фруктовый рай" },
  ];

  return (
    <MapContainer
      center={[55.75, 37.61]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {markers.map((marker) => (
        <Marker key={marker.id} position={[marker.lat, marker.lng]}>
          <Popup>{marker.name}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}