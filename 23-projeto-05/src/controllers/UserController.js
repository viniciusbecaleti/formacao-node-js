const User = require("../models/User")
const PasswordToken = require("../models/PasswordToken")
const validateEmail = require("../utils/validateEmail")

class UserController {
  async index(req, res) {
    try {
      const users = await User.findAll()
      res.json(users)
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: "Internal server error",
      })
    }
  }

  async show(req, res) {
    const { id } = req.params

    try {
      const user = await User.findById(id)

      if (user.length === 0) {
        return res.status(404).json({
          error: "User not found",
        })
      }

      res.json(user)
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: "Internal server error",
      })
    }
  }

  async create(req, res) {
    const { name, email, password, confirmPassword } = req.body

    if (name === undefined) {
      return res.status(403).json({
        error: "'name' is a required parameter",
      })
    }

    if (name.length === 0) {
      return res.status(403).json({
        error: "'name' parameter can't be empty",
      })
    }

    if (email === undefined) {
      return res.status(403).json({
        error: "'email' is a required parameter",
      })
    }

    if (email.length === 0) {
      return res.status(403).json({
        error: "'email' parameter can't be empty",
      })
    }

    const validEmail = validateEmail(email)

    if (!validEmail) {
      return res.status(403).json({
        error: "Invalid email address",
      })
    }

    const user = await User.findByEmail(email)

    if (user) {
      return res.status(406).json({
        error: "E-mail already exists",
      })
    }

    if (password === undefined) {
      return res.status(403).json({
        error: "'password' is a required parameter",
      })
    }

    if (password.length < 6) {
      return res.status(403).json({
        error: "'password' parameter can't be less than 6 characters",
      })
    }

    if (confirmPassword === undefined) {
      return res.status(403).json({
        error: "confirmPassword is a required parameter",
      })
    }

    if (password !== confirmPassword) {
      return res.status(403).json({
        error: "The 'password' and 'confirmPassword' params needs to be equals",
      })
    }

    try {
      await User.new({
        name,
        email,
        password,
      })
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: "Internal server error",
      })
    }

    res.sendStatus(201)
  }

  async update(req, res) {
    const { id } = req.params
    const { name, email, role} = req.body

    try {
      const response = await User.update(id, { name, email, role })

      if (!response.status) {
        return res.status(406).json({
          error: response.error,
        })
      }

      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: "Internal server error",
      })
    }
  }

  async delete(req, res) {
    const { id } = req.params

    try {
      const response = await User.delete(id)

      if (!response.status) {
        return res.status(406).json({
          error: response.error,
        })
      }

      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: "Internal server error",
      })
    }
  }

  async recoverPassword(req, res) {
    const { email } = req.body

    if (email === undefined) {
      return res.status(403).json({
        error: "'email' is a required parameter",
      })
    }

    if (email.length === 0) {
      return res.status(403).json({
        error: "'email' parameter can't be empty",
      })
    }

    const validEmail = validateEmail(email)

    if (!validEmail) {
      return res.status(403).json({
        error: "Invalid email address",
      })
    }

    const user = await User.findByEmail(email)

    if (!user) {
      return res.status(403).json({
        error: "User not found",
      })
    }

    const response = await PasswordToken.create(user.id)

    if (!response.status) {
      return res.status(406).json({
        error: response.error,
      })
    }

    res.json(response.token)
  }

  async changePassword(req, res) {
    try {
      const { token, password } = req.body

      if (token === undefined) {
        return res.status(403).json({
          error: "'token' is a required parameter",
        })
      }

      const isValidToken = await PasswordToken.validate(token)

      if (!isValidToken.status) {
        return res.status(406).json({
          error: isValidToken.error,
        })
      }

      if (password === undefined) {
        return res.status(403).json({
          error: "'password' is a required parameter",
        })
      }

      if (password.length < 6) {
        return res.status(403).json({
          error: "'password' parameter can't be less than 6 characters",
        })
      }

      await User.changePassword(password, isValidToken.token.user_id, isValidToken.token.token)

      res.sendStatus(200)
    } catch (error) {
      console.log(error)
      res.status(500).json({
        error: "Internal server error",
      })
    }
  }
}

module.exports = new UserController()
