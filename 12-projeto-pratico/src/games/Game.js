const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");

const Game = sequelize.define("games", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

module.exports = Game;
