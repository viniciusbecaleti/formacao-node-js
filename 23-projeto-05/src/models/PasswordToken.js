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

  async validate(token) {
    try {
      const isValidToken = await knex.select("*").from("password_tokens").where({ token }).first()

      if (!isValidToken) {
        return {
          status: false,
          error: "Invalid token"
        }
      }

      if (isValidToken.used) {
        return {
          status: false,
          error: "Token already used"
        }
      }

      return {
        status: true,
        token: isValidToken
      }
    } catch (error) {
      console.log(error)

      return {
        status: false,
        error
      }
    }
  }

  async setUsed(token) {
    try {
      await knex.update({ used: 1 }).table("password_tokens").where({ token })
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
