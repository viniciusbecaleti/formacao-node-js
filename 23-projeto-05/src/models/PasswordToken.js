const knex = require("../database/knex")
const { v4 } = require("uuid")

class PasswordToken {
  async create(id) {
    try {
      const token = v4()

      await knex.insert({
        user_id: id,
        token,
      }).into("password_tokens")

      return {
        status: true,
        token
      }
    } catch (error) {
      console.log(error)

      return {
        status: false,
        error
      }
    }
  }
}

module.exports = new PasswordToken()
