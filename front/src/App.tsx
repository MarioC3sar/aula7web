import React, { useEffect, useState } from "react";
import MapComponent from "./map";
import "./App.css";

export interface Cidade {
  id: number;
  nome: string;
  lat: number;
  lng: number;
  geom?: any;
}

export interface Irradiacao {
  poligono: Array<{ lat: number; lng: number }>;
  anual: number;
  mensal: {
    jan: number;
    fev: number;
    mar: number;
    abr: number;
    mai: number;
    jun: number;
    jul: number;
    ago: number;
    set: number;
    out: number;
    nov: number;
    dez: number;
  };
}

export default function App() {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<Cidade | null>(
    null
  );
  const [irradiacao, setIrradiacao] = useState<Irradiacao | null>(null);

  useEffect(() => {
    // Buscar lista de cidades do servidor
    fetch("http://localhost:5000/cidade")
      .then((res) => res.json())
      .then(setCidades)
      .catch((err) => console.error("Erro ao buscar cidades:", err));
  }, []);

  const handleCidadeClick = (cidade: Cidade) => {
    console.log("Clicou na cidade:", cidade);
    setCidadeSelecionada(cidade);

    fetch(`http://localhost:5000/irradiacao/${cidade.id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("Dados de irradiação recebidos:", data);

        // Converta o GeoJSON para o formato esperado pelo Google Maps
        const poligonoConvertido = data.incidencia.geom.coordinates[0].map(
          ([lng, lat]: [number, number]) => ({ lat, lng })
        );

        // Atualize o estado com o polígono convertido
        setIrradiacao({
          ...data.incidencia,
          poligono: poligonoConvertido,
        });
      })
      .catch((err) => console.error("Erro ao buscar irradiação:", err));
  };

  console.log("Polígono recebido:", irradiacao?.poligono);

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside
        style={{ width: 300, overflowY: "auto", background: "#f5f5f5" }}
        className="hide-scrollbar"
      >
        <h2>Cidades</h2>
        <ul>
          {cidades.map((cidade) => (
            <li key={cidade.id}>
              <button onClick={() => handleCidadeClick(cidade)}>
                {cidade.nome}
              </button>
            </li>
          ))}
        </ul>
      </aside>
      <main style={{ flex: 1 }}>
        <MapComponent
          cidade={cidadeSelecionada ?? undefined}
          irradiacao={irradiacao ?? undefined}
        />
      </main>

      {/* Painel fixo no canto inferior direito */}
      {irradiacao && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            backgroundColor: "#fff",
            padding: "10px",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
            width: "250px",
            maxHeight: "400px",
            overflowY: "auto",
          }}
          className="hide-scrollbar"
        >
          <h4
            style={{
              margin: "0 0 10px",
              fontSize: "16px",
              color: "#1976d2",
            }}
          >
            Dados de Irradiação
          </h4>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            <li>Anual: {irradiacao.anual}</li>
            <li>Jan: {irradiacao.mensal.jan}</li>
            <li>Fev: {irradiacao.mensal.fev}</li>
            <li>Mar: {irradiacao.mensal.mar}</li>
            <li>Abr: {irradiacao.mensal.abr}</li>
            <li>Mai: {irradiacao.mensal.mai}</li>
            <li>Jun: {irradiacao.mensal.jun}</li>
            <li>Jul: {irradiacao.mensal.jul}</li>
            <li>Ago: {irradiacao.mensal.ago}</li>
            <li>Set: {irradiacao.mensal.set}</li>
            <li>Out: {irradiacao.mensal.out}</li>
            <li>Nov: {irradiacao.mensal.nov}</li>
            <li>Dez: {irradiacao.mensal.dez}</li>
          </ul>
        </div>
      )}
    </div>
  );
}
