const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");

const User = sequelize.define("users", {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

// User.sync();

module.exports = User;
