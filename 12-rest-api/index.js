const express = require("express")
const app = express()

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

const db = {
  games: [
    {
      id: 14,
      name: 'Euro Truck Simulator 2',
      year: 2012,
      price: 1249
    },
    {
      id: 23,
      name: 'Mortal Kombat 1',
      year: 2023,
      price: 27990
    },
    {
      id: 78,
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

  if (name === undefined || year === undefined || price === undefined) {
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
    id: Math.floor(Math.random() * 101),
    name,
    year,
    price
  }

  db.games.push(newGame)

  res.status(201).json(newGame)
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

app.listen(5500, () => console.log("Server is running on port 5500"))