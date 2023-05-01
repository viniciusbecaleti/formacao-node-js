const express = require('express') // Importa o express
const app = express() // Inicia o express

// Rotas
app.get("/", (req, res) => {
  res.send("Página Home")
})

app.get("/blog/:artigo?", (req, res) => {
  const { artigo } = req.params

  if (artigo) {
    return res.send(`Página do artigo: ${artigo}`)
  }

  res.send("Página Blog")
})

app.get("/canal/youtube", (req, res) => {
  const { canal } = req.query

  if (canal) {
    return res.send(`Canal: ${canal}`)
  }

  res.send(`Página YouTube`)
})

app.get("/ola/:nome/:profissao", (req, res) => {
  const { nome, profissao } = req.params

  res.send(`Olá, ${nome} - ${profissao}`)
})

// Inicia um servidor
app.listen(5500, () => console.log("Servidor rodando na porta 5500"))