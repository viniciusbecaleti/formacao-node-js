const express = require("express");
const app = express();
const { Op } = require("sequelize");
const sequelize = require("./db/sequelize");
const Game = require("./games/Game");
const Platform = require("./games/Platform");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

sequelize.authenticate()
  .then(() => {
    console.log("Connection has been established successfully");
  })
  .catch(err => {
    console.log("Unable to connect to the database:", err);
  });

app.get("/games", async (req, res) => {
  const games = await Game.findAll({
    include: {
      model: Platform,
      attributes: ["id", "name"],
      through: { attributes: [] }
    }
  });

  res.status(200).json({ games });
});

app.get("/platforms", async (req, res) => {
  const platforms = await Platform.findAll({
    include: {
      model: Game,
      attributes: ["id", "title"],
      through: { attributes: [] }
    }
  });

  res.status(200).json({ platforms });
});

app.post("/platform", async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({
      message: "The 'name' field is missing!"
    });
  }

  const platformAlreadyExists = await Platform.findOne({
    where: {
      name
    }
  });

  if (platformAlreadyExists) {
    return res.status(409).json({
      message: "Plataform already exists"
    });
  }

  try {
    await Platform.create({ name });
    res.status(201).json({
      message: "Plataform created successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: "An error occurred while saving the data to the database"
    });
  }
});

app.delete("/platform/:id", async (req, res) => {
  const { id } = req.params;

  const platform = await Platform.findByPk(id);

  if (!platform) {
    return res.status(404).json({
      message: "Platform not found"
    });
  }

  await Platform.destroy({
    where: {
      id
    }
  });

  return res.sendStatus(200);
});

app.post("/game", async (req, res) => {
  const { title } = req.body;
  const { platforms } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "The 'title' field is missing!"
    });
  }

  if (!platforms || platforms.length === 0) {
    return res.status(400).json({
      message: "The 'platforms' field is missing!"
    });
  }

  try {
    const selectedPlatforms = await Platform.findAll({
      where: {
        name: {
          [Op.in]: platforms
        }
      }
    });

    if (selectedPlatforms.length !== platforms.length) {
      return res.status(400).json({
        message: "The 'platforms' field has an error!"
      });
    }

    const gameAlreadyExists = await Game.findOne({
      where:{
        title
      }
    });

    if (gameAlreadyExists) {
      return res.status(409).json({
        message: "Game already exists"
      });
    }

    const createdGame = await Game.create({
      title
    });

    await createdGame.addPlatforms(selectedPlatforms);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while saving the data to the database"
    });
  }
});

app.delete("/game/:id", async (req, res) => {
  const { id } = req.params;

  const game = await Game.findByPk(id);

  if (!game) {
    return res.status(404).json({
      message: "Game not found"
    });
  }

  await Game.destroy({
    where: {
      id
    }
  });

  return res.sendStatus(200);
});

app.put("/game/:id", async (req, res) => {
  const { id } = req.params;
  const { title, platforms } = req.body;

  if (!title) {
    return res.status(400).json({
      message: "The 'title' field is missing!"
    });
  }

  if (!platforms || platforms.length === 0) {
    return res.status(400).json({
      message: "The 'platforms' field is missing!"
    });
  }

  try {
    const game = await Game.findByPk(id);

    if (!game) {
      return res.status(404).json({
        message: "Game not found"
      });
    }

    const gameAlreadyExists = await Game.findOne({
      where: {
        title
      }
    });

    if (gameAlreadyExists && gameAlreadyExists.id !== game.id) {
      return res.status(409).json({
        message: "Game already exists"
      });
    }

    const selectedPlatforms = await Platform.findAll({
      where: {
        name: {
          [Op.in]: platforms
        }
      }
    });

    if (selectedPlatforms.length !== platforms.length) {
      return res.status(400).json({
        message: "The 'platforms' field has an error!"
      });
    }

    await Game.update({
      title
    }, {
      where: {
        id
      }
    });

    await game.setPlatforms(selectedPlatforms);

    return res.sendStatus(200);
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred while querying database data"
    });
  }
});

app.listen(5500, () => console.log("Server is running on http://localhost:5500"));
