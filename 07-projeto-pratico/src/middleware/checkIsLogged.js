function checkIsLogged(req, res, next) {
  const { user } = req.session;

  if (user) {
    return res.redirect("/todos");
  }

  next();
}

module.exports = checkIsLogged;
