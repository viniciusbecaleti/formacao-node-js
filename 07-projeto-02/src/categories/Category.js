const { DataTypes } = require("sequelize")
const sequelize = require("../database/db")

const Category = sequelize.define("Categories", {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
})

Category.sync({ force: false })

module.exports = Category
