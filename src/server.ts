import express from "express";
import { createPostgresStack, destroyPostgresStack } from "./cdktfHelper";

const app = express();
app.use(express.json());

// Criar banco 
app.post("/databases", (req, res) => {
  try {
    const stackPath = createPostgresStack(req.body);
    res.status(201).send({ message: `Banco ${req.body.name} criado`, stackPath });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

// Destruir banco
app.delete("/databases/:name", (req, res) => {
  try {
    const stackPath = destroyPostgresStack(req.params.name);
    res.status(200).send({ message: `Banco ${req.params.name} removido`, stackPath });
  } catch (err) {
    res.status(500).send({ error: err.message });
  }
});

app.listen(3333, () => console.log("API rodando em http://localhost:3333"));
