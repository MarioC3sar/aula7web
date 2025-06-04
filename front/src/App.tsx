import React, { useEffect, useState } from "react";
import MapComponent from "./map";
import "./App.css";

interface Cidade {
  id: number;
  nome: string;
  lat: number;
  lng: number;
  geom?: any;
}

interface Irradiacao {
  poligono: Array<{ lat: number; lng: number }>;
  [key: string]: any;
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
      .then(setCidades);
  }, []);

  const handleCidadeClick = (cidade: Cidade) => {
    console.log("Clicou na cidade:", cidade);
    setCidadeSelecionada(cidade);
    fetch(`http://localhost:5000/irradiacao/${cidade.id}`)
      .then((res) => res.json())
      .then(setIrradiacao);
  };

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <aside style={{ width: 300, overflowY: "auto", background: "#f5f5f5" }}>
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
        {irradiacao && Array.isArray(irradiacao.poligono) && (
          <div>
            <h3>Irradiação</h3>
            <ul>
              {irradiacao.poligono.map((p, i) => (
                <li key={i}>
                  lat: {p.lat}, lng: {p.lng}
                </li>
              ))}
            </ul>
          </div>
        )}
      </aside>
      <main style={{ flex: 1 }}>
        <MapComponent
          cidade={cidadeSelecionada ?? undefined}
          irradiacao={irradiacao ?? undefined}
        />
      </main>
    </div>
  );
}
