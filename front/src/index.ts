import React, { useEffect, useState } from "react";

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
}

export default function CidadeList() {
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState<Cidade | null>(
    null
  );
  const [irradiacao, setIrradiacao] = useState<Irradiacao | null>(null);

  useEffect(() => {
    // Buscar lista de cidades do servidor
    fetch("http://localhost:5000/cidades")
      .then((res) => res.json())
      .then(setCidades);
  }, []);

  const handleCidadeClick = (cidade: Cidade) => {
    setCidadeSelecionada(cidade);
    // Buscar dados de irradiação da cidade
    fetch(`http://localhost:5000/irradiacao/${cidade.id}`)
      .then((res) => res.json())
      .then(setIrradiacao);
  };
}
