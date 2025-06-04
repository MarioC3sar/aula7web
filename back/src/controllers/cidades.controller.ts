import type { Request, Response } from "express";
import { cidadeService } from "../services/cidades.service";

export const cidadeController = {
  async getAllCidades(_: Request, res: Response) {
    try {
      const cidades = await cidadeService.getAllCidades();
      res.json(cidades);
    } catch (error) {
      console.error("Erro no controller de cidades:", error);
      res.status(500).json({ error: "Erro ao buscar cidades" });
    }
  },

  async getIncidenciaForCidade(req: Request, res: Response) {
    try {
      const cidadeId = Number.parseInt(req.params.id);

      if (Number.isNaN(cidadeId)) {
        return res.status(400).json({ error: "ID da cidade inválido" });
      }

      const result = await cidadeService.getIncidenciaForCidade(cidadeId);

      if (!result) {
        return res.status(404).json({ error: "Cidade não encontrada" });
      }

      res.json(result);
    } catch (error) {
      console.error("Erro no controller de incidência por cidade:", error);
      res.status(500).json({ error: "Erro ao buscar incidência para cidade" });
    }
  },
};
