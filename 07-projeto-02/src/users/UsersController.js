const express = require("express")
const router = express.Router()
const bcrypt = require("bcryptjs")
const User = require("./User")
const authenticate = require("../middlewares/authentication")

router.use(authenticate)

router.get("/", async (req, res) => {
  const users = await User.findAll()

  res.render("admin/users/index", {
    users
  })
})

router.get("/create", (req, res) => {
  return res.render("admin/users/create")
})

router.post("/create", async (req, res) => {
  const { email, password, confirmPassword } = req.body

  if (!email || !password || !confirmPassword) {
    return res.redirect("/admin/users/create")
  }

  if (password !== confirmPassword) {
    return res.redirect("/admin/users/create")
  }

  const userExists = await User.findOne({
    where: {
      email
    }
  })

  if (userExists) {
    return res.redirect("/admin/users/create")
  }

  const salt = bcrypt.genSaltSync(10)
  const hashedPassword = bcrypt.hashSync(password, salt)

  await User.create({
    email,
    password: hashedPassword
  })

  res.redirect("/admin/users")
})

module.exports = router
