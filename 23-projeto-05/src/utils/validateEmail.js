function validateEmail(email) {
  const regex = new RegExp(/^(([a-zA-Z0-9][\w\-.]*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}))$/)

  if (!email.match(regex)) {
    return false
  }

  return true
}

module.exports = validateEmail
