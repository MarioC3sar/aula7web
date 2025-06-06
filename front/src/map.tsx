import React from "react";
import {
  LoadScript,
  GoogleMap as Map,
  Marker,
  Polygon,
} from "@react-google-maps/api";
import { Cidade, Irradiacao } from "./App";

interface MapComponentProps {
  cidade?: Cidade;
  irradiacao?: Irradiacao;
}

function getLatLngFromCidade(cidade?: Cidade) {
  if (!cidade) return null;
  if (typeof cidade.lat === "number" && typeof cidade.lng === "number") {
    return { lat: cidade.lat, lng: cidade.lng };
  }
  if (
    cidade.geom &&
    cidade.geom.type === "Point" &&
    Array.isArray(cidade.geom.coordinates)
  ) {
    return { lat: cidade.geom.coordinates[1], lng: cidade.geom.coordinates[0] };
  }
  return null;
}

export default function MapComponent({
  cidade,
  irradiacao,
}: MapComponentProps) {
  const center = getLatLngFromCidade(cidade) ?? { lat: -14.235, lng: -51.9253 };
  const zoom = cidade ? 12 : 4;

  return (
    <LoadScript googleMapsApiKey="">
      <Map
        key={center.lat + "," + center.lng}
        mapContainerClassName="map-container"
        center={center}
        zoom={zoom}
        mapContainerStyle={{ width: "100vw", height: "100vh" }}
        options={{
          gestureHandling: "greedy",
          disableDefaultUI: true,
          draggable: true,
          scrollwheel: true,
        }}
      >
        {/* Marcador na cidade selecionada */}
        {cidade && getLatLngFromCidade(cidade) && (
          <Marker position={getLatLngFromCidade(cidade)!} />
        )}

        {/* Polígono usado para obter a irradiação */}
        {irradiacao &&
          Array.isArray(irradiacao.poligono) &&
          irradiacao.poligono.length >= 3 && (
            <Polygon
              paths={irradiacao.poligono}
              options={{
                fillColor: "#1976d2",
                fillOpacity: 0.2,
                strokeColor: "#1976d2",
                strokeWeight: 2,
              }}
            />
          )}
      </Map>
    </LoadScript>
  );
}
