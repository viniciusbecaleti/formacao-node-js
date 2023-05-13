const { DataTypes } = require("sequelize");
const sequelize = require("../database/connection");
const User = require("../users/User");

const Todo = sequelize.define("todos", {
  task: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

User.hasMany(Todo);
Todo.belongsTo(User);

// Todo.sync();

module.exports = Todo;
