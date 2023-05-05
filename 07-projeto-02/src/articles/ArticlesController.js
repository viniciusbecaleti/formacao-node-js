const express = require("express")
const router = express.Router()
const Article = require("./Article")

router.get("/", (req, res) => {
  res.render("admin/articles/index")
})

router.get("/new", (req, res) => {
  res.render("admin/articles/new")
})

module.exports = router
