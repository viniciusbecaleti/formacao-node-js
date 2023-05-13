const express = require("express");
const server = express();
const sequelize = require("./database/connection");
const session = require("express-session");
const checkIsAuthenticate = require("./middleware/checkIsAuthenticate");
const UsersController = require("./users/UsersController");
const TodosController = require("./todos/TodosController");

server.set("views", "src/views");
server.set("view engine", "ejs");

server.use(express.static("public"));
server.use(express.urlencoded({ extended: false }));
server.use(express.json());
server.use(session({
  secret: "691fd352139ddd5987bd3f4003439ee0",
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 * 30 // 30 dias
  }
}));

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (error) {
    console.log(`unable to connect to the database: ${error}`);
  }
})();

server.use("/", UsersController);
server.use("/", TodosController);

server.listen(5500, () => console.log("Server listening on http://localhost:5500"));
