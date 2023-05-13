const { Router } = require("express");
const router = Router();
const checkIsAuthenticate = require("../middleware/checkIsAuthenticate");
const Todo = require("./Todo");
const User = require("../users/User");

router.get("/todos", checkIsAuthenticate, async (req, res) => {
  const { user } = req.session;

  const todos = await Todo.findAll({
    include: {
      model: User,
      where: {
        email: user.email
      }
    }
  });

  res.render("todos/index", {
    todos
  });
});

router.post("/todos/create", checkIsAuthenticate, async (req, res) => {
  const { task } = req.body;
  const { user } = req.session;

  if (!task) {
    return res.redirect("/todos/create");
  }

  await Todo.create({
    task,
    userId: user.id
  });

  res.redirect("/todos");
});

router.get("/todos/delete/:id", checkIsAuthenticate, async (req, res) => {
  const { id } = req.params;
  const { user } = req.session;

  const todo = await Todo.findOne({
    include: {
      model: User,
      where: {
        email: user.email
      }
    },
    where: {
      id
    }
  });

  if (!todo) {
    return res.redirect("/todos");
  }

  await Todo.destroy({
    where: {
      id
    }
  });

  res.redirect("/todos");
});

module.exports = router;
