const knex = require("../database/knex")
const bcrypt = require("bcrypt")
const validateEmail = require("../utils/validateEmail")
const PasswordToken = require("./PasswordToken")

class User {
  async findAll() {
    try {
      return await knex.select(["id", "name", "email", "role"]).table("users")
    } catch (error) {
      console.log(error)
    }
  }

  async findById(id) {
    try {
      return await knex.select(["id", "name", "email", "role"]).table("users").where({ id }).first()
    } catch (error) {
      console.log(error)
    }
  }

  async findByEmail(email) {
    try {
      return await knex.select(["id", "name", "email", "role"]).table("users").where({ email }).first()
    } catch (error) {
      console.log(error)
    }
  }

  async new({ name, email, password }) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10)

      await knex.insert({
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 0
      }).table("users")
    } catch (error) {
      console.log(error)
    }
  }

  async update(id, { name, email, role }) {
    try {
      const user = await this.findById(id)

      if (!user) {
        return {
          status: false,
          error: "User not found"
        }
      }

      const updatedUserData = {}

      if (name !== undefined) {
        if (name.length === 0) {
          return {
            status: false,
            error: "Invalid name",
          }
        }

        updatedUserData.name = name
      }

      if (email !== undefined) {
        if (email.length === 0) {
          return {
            status: false,
            error: "Invalid email address",
          }
        }

        const isValidEmail = validateEmail(email)

        if (!isValidEmail) {
          return {
            status: false,
            error: "Invalid email address",
          }
        }

        if (email === user.email) {
          return {
            status: false,
            error: "This email address is already your email address",
          }
        }

        const userByEmail = await this.findByEmail(email)

        if (userByEmail && userByEmail.email !== user.email) {
          return {
            status: false,
            error: "Email address already exists",
          }
        }

        updatedUserData.email = email
      }

      /**
       * 0 - user
       * 1 - admin
       */
      if (role !== undefined) {
        if (role < 0 || role > 1 || isNaN(role)) {
          return {
            status: false,
            error: "Invalid role",
          }
        }

        updatedUserData.role = role
      }

      await knex.update(updatedUserData).table("users").where({ id })

      return {
        status: true
      }
    } catch (error) {
      console.log(error)
    }
  }

  async delete(id) {
    try {
      const user = await this.findById(id)

      if (!user) {
        return {
          status: false,
          error: "User not found"
        }
      }

      await knex.delete().table("users").where({ id })

      return {
        status: true
      }
    } catch (error) {
      console.log(error)
    }
  }

  async changePassword(newPassword, userId, token) {
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    await knex.update({ password: hashedPassword }).table("users").where({ id: userId })

    await PasswordToken.setUsed(token)
  }
}

module.exports = new User()
