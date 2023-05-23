const { DataTypes } = require("sequelize");
const sequelize = require("../db/sequelize");
const Game = require("./Game");

const Platform = sequelize.define("platforms", {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  }
});

Game.belongsToMany(Platform, { through: "GamePlatform" });
Platform.belongsToMany(Game, { through: "GamePlatform" });

module.exports = Platform;
