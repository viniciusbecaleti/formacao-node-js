const express = require("express")
const app = express()
const sequelize = require("./database/database")
const Question = require("./database/Question")

sequelize.authenticate()
  .then(() => {
    console.log("Connection has been established successfully")
  })
  .catch((error) => {
    console.error("Unable to connect to the database:", error)
  })

app.set("view engine", "ejs")
app.set("views", "src/views")

app.use(express.static("public"))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.get("/", async (req, res) => {
  let questions = []

  try {
    questions = await Question.findAll({
      order: [["id", "DESC"]]
    })
  } catch (error) {
    console.log(error)
  }

  res.render("index", {
    questions
  })
})

app.get("/ask", (req, res) => {
  res.render("ask")
})

app.post("/ask", async (req, res) => {
  const { title, description } = req.body

  try {
    await Question.create({
      title,
      description
    })

    res.redirect("/")
  } catch (error) {
    console.log(error)
  }
})

app.get("/question/:id", async (req, res) => {
  const { id } = req.params

  try {
    const question = await Question.findByPk(id)

    if (!question) {
      return res.redirect("/")
    }

    res.render("question", {
      question
    })
  } catch (error) {
    console.log(error)
  }
})

app.listen(5500, () => console.log("Server is running on http://localhost:5500"))
