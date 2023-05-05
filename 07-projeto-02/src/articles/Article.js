const { DataTypes } = require("sequelize")
const sequelize = require("../database/db")
const Category = require("../categories/Category")

const Article = sequelize.define("Articles", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  slug: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})

Category.hasMany(Article)
Article.belongsTo(Category)

Article.sync({ force: false })

module.exports = Article
