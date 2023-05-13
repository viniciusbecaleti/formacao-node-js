function checkIsAuthenticate(req, res, next) {
  const { user } = req.session;

  if (!user) {
    return res.redirect("/");
  }

  next();
}

module.exports = checkIsAuthenticate;
