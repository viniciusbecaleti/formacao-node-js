const { DataTypes } = require("sequelize")
const sequelize = require("../database/db")

const User = sequelize.define("Users", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
})

User.sync({ force: false })

module.exports = User
