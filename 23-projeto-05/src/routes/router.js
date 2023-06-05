const express = require("express")
const router = express.Router()
const HomeController = require("../controllers/HomeController")
const UserController = require("../controllers/UserController")

router.get("/", HomeController.index)
router.get("/users", UserController.index)
router.get("/users/:id", UserController.show)
router.post("/users", UserController.create)
router.put("/users/:id", UserController.update)

module.exports = router
