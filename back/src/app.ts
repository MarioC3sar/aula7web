import express from "express";
import cors from "cors";
import router from "./routes/cidades.route";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.use("/cidade", router);
app.use("/irradiacao", router);

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

export default app;
