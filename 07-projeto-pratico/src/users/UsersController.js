const { Router } = require("express");
const router = Router();
const bcrypt = require("bcryptjs");
const User = require("./User");
const checkIsLogged = require("../middleware/checkIsLogged");

router.get("/", checkIsLogged, (req, res) => {
  res.render("index");
});

router.get("/signup", checkIsLogged, (req, res) => {
  res.render("signup");
});

router.post("/signup", async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  const user = await User.findOne({
    where: {
      email
    }
  });

  if (user) {
    return res.render("signup", {
      error: "Email já cadastrado!"
    });
  }

  if (password != confirmPassword) {
    return res.render("signup", {
      error: "As senhas não são iguais!"
    });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  await User.create({
    email,
    password: hashedPassword,
  });

  res.redirect("/");
});

router.get("/logout", (req, res) => {
  req.session.user = undefined;
  res.redirect("/");
});

router.post("/authentication", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({
    where: {
      email
    }
  });

  if (!user) {
    return res.render("index", {
      error: "Usuário não encontrado!"
    });
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (!validPassword) {
    return res.render("index", {
      error: "A senha não confere!"
    });
  }

  req.session.user = {
    id: user.id,
    email: user.email
  };

  res.redirect("/todos");
});

module.exports = router;
