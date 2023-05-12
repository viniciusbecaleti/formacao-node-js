function checkIsAuthenticate(req, res, next) {
  const { user } = req.session;

  if (!user) {
    res.redirect("/");
  }

  next();
}

module.exports = checkIsAuthenticate;
