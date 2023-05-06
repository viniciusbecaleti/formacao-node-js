const express = require("express")
const router = express.Router()
const slugify = require("slugify")
const Article = require("./Article")
const Category = require("../categories/Category")

router.get("/", async (req, res) => {
  const articles = await Article.findAll({ include: Category })

  res.render("admin/articles/index", {
    articles
  })
})

router.get("/new", async (req, res) => {
  const categories = await Category.findAll({ raw: true })

  res.render("admin/articles/new", {
    categories
  })
})

router.post("/save", async (req, res) => {
  const { title, body, categoryId } = req.body
  const slug = slugify(title, {
    remove: /[*+~.()'"!:@?]/g,
    lower: true,
  })

  if (!title || !body || !categoryId) {
    return res.redirect("/admin/articles/new")
  }

  const slugAlreadyExists = await Article.findOne({
    where: {
      slug
    }
  })

  if (slugAlreadyExists) {
    return res.redirect("/admin/articles/new")
  }

  await Article.create({
    title,
    slug,
    body,
    CategoryId: categoryId
  })

  res.redirect("/admin/articles")
})

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    return res.redirect("/admin/articles")
  }

  const articleExists = await Article.findByPk(id)

  if (!articleExists) {
    return res.redirect("/admin/categories")
  }

  await Article.destroy({
    where: {
      id
    }
  })

  res.json({ message: "success" })
})

router.get("/update/:id", async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    return res.redirect("/admin/articles")
  }

  const articleExists = await Article.findByPk(id)

  if (!articleExists) {
    return res.redirect("/admin/articles")
  }

  const categories = await Category.findAll()

  res.render("admin/articles/update", {
    article: articleExists,
    categories
  })
})

router.put("/update", async (req, res) => {
  const { id, title, body, categoryId } = req.body

  if (!id || isNaN(id) || !title || !body || !categoryId) {
    return res.json({ message: "error" })
  }

  const articleExists = await Article.findByPk(id)

  if (!articleExists) {
    return res.json({ message: "error" })
  }

  await Article.update({
    title,
    slug: slugify(title, {
      remove: /[*+~.()'"!:@?]/g,
      lower: true,
    }),
    body,
    CategoryId: categoryId,
  }, {
    where: {
      id
    }
  })

  res.json({ message: "success" })
})

module.exports = router
