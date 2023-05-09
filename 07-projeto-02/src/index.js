const cors = require("cors")
const express = require("express")
const app = express()
const session = require("express-session")
const bcrypt = require("bcryptjs")
const formatDate = require("./utils/formatDate")
const sequelize = require("./database/db")
const CategoriesController = require("./categories/CategoriesController")
const ArticlesController = require("./articles/ArticlesController")
const UsersController = require("./users/UsersController")
const Article = require("./articles/Article")
const Category = require("./categories/Category")
const User = require("./users/User")

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
app.use(session({
  secret: "sd56g4sd564g65%#$#dfh64df56h4df56gh46s$%%$@fd5g4hdf5h456",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // 24 horas
  }
}))

// const getCategories = async (req, res, next) => {
//   const categories = await Category.findAll({
//     order: [["name", "ASC"]]
//   })
//   req.categories = categories
//   next()
// }

app.get("/", async (req, res) => {
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
    hasMorePage
  })
})

app.get("/article/:slug", async (req, res) => {
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

// app.get("/category/:slug", getCategories, async (req, res) => {
//   const categories = req.categories
//   const { slug } = req.params

//   const categoryExists = await Category.findOne({
//     where: {
//       slug
//     }
//   })

//   if (!categoryExists) {
//     return res.redirect("..")
//   }

//   const totalPerPage = 4

//   const articlesByCategory = await Article.findAndCountAll({
//     include: Category,
//     where: {
//       CategoryId: categoryExists.id
//     },
//     limit: totalPerPage,
//     offset: 0
//   })

//   let hasMorePage = true
//   if (totalPerPage >= articlesByCategory.count) {
//     hasMorePage = false
//   }

//   res.render("index", {
//     articles: articlesByCategory.rows,
//     formatDate,
//     categories,
//     hasMorePage
//   })
// })

app.get("/page/:page", async (req, res) => {
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
    formatDate,
    hasMorePage,
    currentPage: page
  })
})

app.get("/login", (req, res) => {
  const { user } = req.session

  if (user) {
    return res.redirect("/admin/articles/")
  }

  res.render("login")
})

app.post("/authentication", async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({
    where: {
      email
    }
  })

  if (!user) {
    return res.redirect("/login")
  }

  const correctPassword = bcrypt.compareSync(password, user.password)

  if (!correctPassword) {
    return res.redirect("/login")
  }

  req.session.user = {
    id: user.id,
    email: user.email
  }

  res.redirect("/admin/articles")
})

app.get("/logout", (req, res) => {
  req.session.user = undefined
  res.redirect("/")
})

app.use("/admin/categories", CategoriesController)
app.use("/admin/articles", ArticlesController)
app.use("/admin/users", UsersController)

app.listen(5500, () => console.log("Server listening on http://localhost:5500"))
