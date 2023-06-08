const express = require("express")
const router = express.Router()
const HomeController = require("../controllers/HomeController")
const UserController = require("../controllers/UserController")

router.get("/", HomeController.index)
router.get("/users", UserController.index)
router.get("/user/:id", UserController.show)
router.post("/user", UserController.create)
router.put("/user/:id", UserController.update)
router.delete("/user/:id", UserController.delete)
router.post("/user/recover-password", UserController.recoverPassword)
router.post("/user/change-password", UserController.changePassword)

module.exports = router
