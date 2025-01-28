const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors()); // Habilita CORS para aceitar requisições de qualquer origem
app.use(express.json()); // Middleware para interpretar JSON no corpo das requisições

// Configuração da conexão com o banco de dados
const pool = new Pool({
  user: "postgres",
  host: "autorack.proxy.rlwy.net",
  database: "railway",
  password: "lJWAHqtAWuLrSvaWUCVfgdwAOYAhQYpp",
  port: 31771,
  ssl: { rejectUnauthorized: false } // Habilita SSL
});

// Rota para enviar uma mensagem
app.post("/mensagem", async (req, res) => {
  const { conteudo } = req.body;

  try {
    const result = await pool.query(
      "INSERT INTO mensagens (conteudo) VALUES ($1) RETURNING id",
      [conteudo]
    );
    const mensagemId = result.rows[0].id;
    res.status(201).json({
      mensagem: "Mensagem enviada com sucesso!",
      id: mensagemId,
    });
  } catch (error) {
    console.error("Erro ao inserir mensagem:", error);
    res.status(500).json({ erro: "Erro ao enviar mensagem" });
  }
});

// Rota para visualizar mensagens
app.get("/mensagens", async (req, res) => {
  try {
    const result = await pool.query("SELECT id, conteudo FROM mensagens");
    const mensagens = result.rows.map((msg) => ({
      id: msg.id,
      conteudo: msg.conteudo,
    }));
    res.json(mensagens);
  } catch (error) {
    console.error("Erro ao consultar mensagens:", error);
    res.status(500).json({ erro: "Erro ao carregar mensagens" });
  }
});

// Inicia o servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
