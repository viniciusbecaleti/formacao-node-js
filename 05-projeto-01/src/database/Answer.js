const { DataTypes } = require("sequelize")
const sequelize = require("./database")
const Question = require("./Question")

const Answer = sequelize.define("Answers", {
  username: {
    type: DataTypes.STRING,
  },
  body: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  question_id: {
    type: DataTypes.INTEGER,
    references: {
      model: Question,
      key: "id"
    }
  }
})

Answer.sync({ force: false })

module.exports = Answer
