import express from "express";
import { cidadeController } from "../controllers/cidades.controller";

const router = express.Router();

router.get("/", cidadeController.getAllCidades);

router.get("/:id", (req, res) => {
	cidadeController.getIncidenciaForCidade(req, res);
});

export default router;
