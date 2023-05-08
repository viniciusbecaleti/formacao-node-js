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

  const totalPerPage = 4

  const articles = await Article.findAndCountAll({
    include: Category,
    limit: totalPerPage,
    offset: 0,
    order: [["id", "DESC"]]
  })

  let hasMorePage = true
  if (totalPerPage >= articles.count) {
    hasMorePage = false
  }

  res.render("index", {
    articles: articles.rows,
    formatDate,
    categories,
    hasMorePage
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

app.get("/page/:page", getCategories, async (req, res) => {
  const categories = req.categories
  const page = Number(req.params.page)

  const totalPerPage = 4
  const currentOffset = (page * totalPerPage) - totalPerPage // ou (page - 1) * totalPerPage

  if (isNaN(page) || page < 2) {
    return res.redirect("..")
  }

  const articles = await Article.findAndCountAll({
    limit: totalPerPage,
    offset: currentOffset,
    include: Category,
    order: [["id", "DESC"]]
  })

  if (articles.rows.length === 0) {
    return res.redirect("..")
  }

  let hasMorePage = true
  if (currentOffset + totalPerPage >= articles.count) {
    hasMorePage = false
  }

  const result = {
    articles,
    hasMorePage
  }

  res.render("page", {
    articles: result.articles.rows,
    categories,
    formatDate,
    hasMorePage,
    currentPage: page
  })
})

app.use("/admin/categories", CategoriesController)
app.use("/admin/articles", ArticlesController)

app.listen(5500, () => console.log("Server listening on http://localhost:5500"))
