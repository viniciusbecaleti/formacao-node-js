class HomeController {
  async index(req, res) {
    res.send("index")
  }
}

module.exports = new HomeController()
