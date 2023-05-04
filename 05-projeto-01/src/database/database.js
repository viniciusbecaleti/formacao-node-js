const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("guiaperguntas", "root", "root", {
  host: "localhost",
  dialect: "mysql"
})

module.exports = sequelize
