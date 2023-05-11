const express = require("express")
const server = express()

server.set("views", "src/views")
server.set("view engine", "ejs")

server.use(express.static("public"))

server.get("/", (req, res) => {
  res.render("index")
})

server.listen(5500, () => console.log("Server listening on http://localhost:5500"))