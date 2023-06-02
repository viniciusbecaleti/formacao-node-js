const express = require('express')
const app = express()
const knex = require("./knex")
const { uuid } = require('uuidv4')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.get("/games", async (req, res) => {
  const games = await knex.select([
    "games.*",
    "studios.name as studio_name",
  ]).table("games").innerJoin("studios", "studios.id", "=", "games.studio_id")
  return res.status(200).json(games)
})

app.post("/game", async (req, res) => {
  const { name, price, studio_id } = req.body

  const game = {
    id: uuid(),
    name,
    price,
    studio_id
  }

  try {
    await knex.insert(game).into("games")
    return res.sendStatus(201)
  } catch (error) {
    console.log(error);
    return res.status(400).json({
      message: "Ocorreu um erro ao inserir o jogo"
    })
  }
})

app.delete("/game/:gameId", async (req, res) => {
  const { gameId } = req.params

  try {
    await knex.from("games").del().where("id", gameId)
  } catch (error) {
    return res.sendStatus(400)
  }

  res.sendStatus(200)
})

app.put("/game/:gameId", async (req, res) => {
  const { gameId } = req.params
  const { name, price } = req.body

  const game = {
    id: gameId,
    name,
    price
  }

  try {
    await knex.from("games").where("id", gameId).update(game)
    return res.sendStatus(200)
  } catch (error) {
    return res.sendStatus(400)
  }
})

app.get("/studios", async (req, res) => {
  const studios = await knex.select("*").from("studios")
  return res.status(200).json(studios)
})

app.post("/studio", async (req, res) => {
  const { name } = req.body

  const studio = {
    id: uuid(),
    name
  }

  try {
    await knex.insert(studio).into("studios")
    return res.sendStatus(201)
  } catch (error) {
    return res.sendStatus(400)
    
  }
})

app.delete("/studio/:studioId", async (req, res) => {
  const { studioId } = req.params

  try {
    await knex.table("studios").del().where("id", studioId)
  } catch (error) {
    console.log(error);
    return res.sendStatus(400)
  }

  res.sendStatus(200)
})

const port = 3000
app.listen(port, () => console.log("Server listening on port " + port))