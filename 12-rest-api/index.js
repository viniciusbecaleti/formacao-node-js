const express = require("express")
const app = express()
const cors = require("cors")

app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

const db = {
  games: [
    {
      id: 1685238662296,
      name: 'Euro Truck Simulator 2',
      year: 2012,
      price: 1249
    },
    {
      id: 1685238662796,
      name: 'Mortal Kombat 1',
      year: 2023,
      price: 27990
    },
    {
      id: 1685238662996,
      name: 'The Outlast Trials',
      year: 2023,
      price: 8899
    }
  ]
}

app.get("/games", (req, res) => {
  res.status(200).json(db.games)
})

app.get("/game/:id", (req, res) => {
  const { id } = req.params
  const game = db.games.find(game => game.id === Number(id))
  
  if (isNaN(id)) {
    return res.status(400).json({
      message: "Invalid game ID"
    })
  }

  if (!game) {
    return res.status(404).json({
      message: "Game is not found"
    })
  }

  res.status(200).json(game)
})

app.post("/game", (req, res) => {
  const { name, year, price } = req.body

  if (!name || !year || !price) {
    return res.status(400).json({
      message: "Invalid game data"
    })
  }

  if (isNaN(year) || isNaN(price)) {
    return res.status(400).json({
      message: "Invalid game data"
    })
  }

  const newGame = {
    id: Number(new Date().getTime()),
    name,
    year,
    price
  }

  db.games.push(newGame)

  res.sendStatus(201)
})

app.delete("/game/:id", (req, res) => {
  const { id } = req.params

  if (isNaN(id)) {
    return res.status(400).json({
      message: "Invalid game id"
    })
  }

  const game = db.games.find(game => game.id === Number(id))

  if (!game) {
    return res.status(404).json({
      message: "Game is not found"
    })
  }

  const games = db.games.filter(game => game.id !== Number(id))

  db.games = games

  res.sendStatus(200)
})

app.put("/game/:id", (req, res) => {
  const { id } = req.params
  const { name, year, price } = req.body

  if (isNaN(id)) {
    return res.status(400).json({
      message: "Invalid game id"
    })
  }

  const game = db.games.find(game => game.id === Number(id))

  if (!game) {
    return res.status(404).json({
      message: "Game is not found"
    })
  }

  if (year && isNaN(year)) {
    return res.status(400).json({
      message: "Invalid game data"
    })
  }

  if (price && isNaN(price)) {
    return res.status(400).json({
      message: "Invalid game data"
    })
  }

  const games = db.games.map(game => {
    if (game.id === Number(id)) {
      return {
        id: game.id,
        name: name ? name : game.name,
        year: year ? year : game.year,
        price: price ? price : game.price,
      }
    }

    return game
  })

  db.games = games

  res.sendStatus(200)
})

app.listen(3000, () => console.log("Server is running on port 5500"))