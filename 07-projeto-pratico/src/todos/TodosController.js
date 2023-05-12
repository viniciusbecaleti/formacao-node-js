const { Router } = require("express");
const router = Router();
const checkIsAuthenticate = require("../middleware/checkIsAuthenticate");

router.get("/todos", checkIsAuthenticate, async (req, res) => {
  const { user } = req.session;

  res.send(user);
});

module.exports = router;
