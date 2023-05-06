const cors = require("cors")
const express = require("express")
const app = express()
const sequelize = require("./database/db")
const CategoriesController = require("./categories/CategoriesController")
const ArticlesController = require("./articles/ArticlesController")
const Article = require("./articles/Article")
const Category = require("./categories/Category")
const formatDate = require("./utils/formatDate")

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

const getCategories = async (req, res, next) => {
  const categories = await Category.findAll({
    order: [["name", "ASC"]]
  })
  req.categories = categories
  next()
}

app.get("/", getCategories, async (req, res) => {
  const categories = req.categories

  const articles = await Article.findAll({
    include: Category,
    order: [["id", "DESC"]]
  })

  res.render("index", {
    articles,
    formatDate,
    categories
  })
})

app.get("/:slug", getCategories, async (req, res) => {
  const { slug } = req.params
  const categories = req.categories

  const articleExists = await Article.findOne({
    include: Category,
    where: {
      slug
    }
  })

  if (!articleExists) {
    return res.redirect("/")
  }

  res.render("article", {
    article: articleExists,
    formatDate,
    categories
  })
})

app.get("/category/:slug", getCategories, async (req, res) => {
  const categories = req.categories
  const { slug } = req.params

  const categoryExists = await Category.findOne({
    where: {
      slug
    }
  })

  if (!categoryExists) {
    return res.redirect("..")
  }

  const articlesByCategory = await Article.findAll({
    include: Category,
    where: {
      CategoryId: categoryExists.id
    }
  })

  res.render("index", {
    articles: articlesByCategory,
    formatDate,
    categories
  })
})

app.use("/admin/categories", CategoriesController)
app.use("/admin/articles", ArticlesController)

app.listen(5500, () => console.log("Server listening on http://localhost:5500"))
