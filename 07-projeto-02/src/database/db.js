const { Sequelize } = require("sequelize")

const sequelize = new Sequelize("guiapress", "root", "root", {
  host: "localhost",
  dialect: "mysql",
})

module.exports = sequelize
