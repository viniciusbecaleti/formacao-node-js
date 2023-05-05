const express = require("express")
const app = express()
const cors = require("cors")
const sequelize = require("./database/db")
const CategoriesController = require("./categories/CategoriesController")
const ArticlesController = require("./articles/ArticlesController")

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
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(cors())

app.get("/", (req, res) => {
  res.render("index")
})

app.use("/admin/categories", CategoriesController)
app.use("/admin/articles", ArticlesController)

app.listen(5500, () => console.log("Server listening on http://localhost:5500"))
