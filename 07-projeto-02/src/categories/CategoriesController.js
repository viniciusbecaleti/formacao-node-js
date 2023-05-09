const express = require("express")
const router = express.Router()
const Category = require("./Category")
const slugify = require("slugify")
const authenticate = require("../middlewares/authentication")

router.use(authenticate)

router.get("/", async (req, res) => {
  const categories = await Category.findAll()

  res.render("admin/categories/index", {
    categories
  })
})

router.get("/new", (req, res) => {
  res.render("admin/categories/new")
})

router.post("/save", async (req, res) => {
  const { name } = req.body

  if (!name) {
    return res.redirect("/admin/categories/new")
  }

  const categoryAlreadyExists = await Category.findOne({
    where: {
      name
    }
  })

  if (categoryAlreadyExists) {
    return res.redirect("/admin/categories/new")
  }

  await Category.create({
    name,
    slug: slugify(name, {
      remove: /[*+~.()'"!:@]/g,
      lower: true,
    })
  })

  res.redirect("/admin/categories")
})

router.delete("/delete/:id", async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    return res.redirect("/admin/categories")
  }

  const categoryExists = await Category.findByPk(id)

  if (!categoryExists) {
    return res.redirect("/admin/categories")
  }

  await Category.destroy({
    where: {
      id
    }
  })

  res.json({ message: "success" })
})

router.get("/update/:id", async (req, res) => {
  const { id } = req.params

  if (!id || isNaN(id)) {
    return res.redirect("/admin/categories")
  }

  const categoryExists = await Category.findByPk(id, { raw: true })

  if (!categoryExists) {
    return res.redirect("/admin/categories")
  }

  res.render("admin/categories/update", {
    category: categoryExists,
  })
})

router.put("/update", async (req, res) => {
  const { id, name } = req.body

  if (!id || !name || isNaN(id)) {
    return res.json({ message: "error" })
  }

  const categoryExists = await Category.findByPk(id, { raw: true })
  const nameAlreadyExists = await Category.findOne({
    where: {
      name
    }
  })

  if (!categoryExists || nameAlreadyExists) {
    return res.json({ message: "error" })
  }

  await Category.update({
    name,
    slug: slugify(name, {
      remove: /[*+~.()'"!:@]/g,
      lower: true,
    })
  }, {
    where: {
      id
    }
  })

  return res.json({ message: "success" })
})

module.exports = router
