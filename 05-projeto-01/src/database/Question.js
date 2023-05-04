const { DataTypes } = require("sequelize")
const sequelize = require("./database")

const Question = sequelize.define("Question", {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  }
})

Question.sync({ force: false })

module.exports = Question
