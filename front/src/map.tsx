import React from "react";
import {
  LoadScript,
  GoogleMap as Map,
  Marker,
  Polygon,
} from "@react-google-maps/api";
import "./map.css";

type Cidade = {
  lat?: number;
  lng?: number;
  geom?: { type: string; coordinates: [number, number] };
};

type Irradiacao = {
  poligono: Array<{ lat: number; lng: number }>;
};

interface MapComponentProps {
  cidade?: Cidade;
  irradiacao?: Irradiacao;
}

function isValidLatLng(lat: any, lng: any) {
  return (
    typeof lat === "number" &&
    !isNaN(lat) &&
    typeof lng === "number" &&
    !isNaN(lng)
  );
}

function getLatLngFromCidade(cidade?: Cidade) {
  if (!cidade) return null;
  if (isValidLatLng(cidade.lat, cidade.lng)) {
    return { lat: cidade.lat!, lng: cidade.lng! };
  }
  if (
    cidade.geom &&
    cidade.geom.type === "Point" &&
    Array.isArray(cidade.geom.coordinates)
  ) {
    // GeoJSON Point: [lng, lat]
    const [lng, lat] = cidade.geom.coordinates;
    if (isValidLatLng(lat, lng)) {
      return { lat, lng };
    }
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
    <LoadScript googleMapsApiKey="AIzaSyBRYyMHDzS355bpfMsWVmN0AfOw4foAPXk">
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
        {cidade && getLatLngFromCidade(cidade) && (
          <Marker position={getLatLngFromCidade(cidade)!} />
        )}
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
