const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors()); // Habilita CORS para requisições de qualquer origem
app.use(express.json()); // Middleware para interpretar JSON no corpo das requisições

// Configuração da conexão com o banco de dados (online)
const pool = new Pool({
  user: "postgres",
  host: "autorack.proxy.rlwy.net",
  database: "railway",
  password: "lJWAHqtAWuLrSvaWUCVfgdwAOYAhQYpp",
  port: 31771,
  ssl: {
    rejectUnauthorized: false, // Para conexões SSL em ambientes de desenvolvimento/produção
  },
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
const PORT = process.env.PORT || 8080; // Porta padrão para produção ou 8080
const HOST = process.env.HOST || "0.0.0.0"; // Para rodar em qualquer endereço na nuvem

app.listen(PORT, () => {
  console.log(`Servidor online rodando em http://${HOST}:${PORT}`);
});
