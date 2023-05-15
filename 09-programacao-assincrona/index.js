function getId() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(5)
    }, 1500)
  })
}

function getEmail(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("erivaldo@email.com")
    }, 2000)
  })
}

function sendMail(to) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const error = false

      if (error) {
        return reject("Error sending mail")
      }
      
      resolve("Cadastro realizado com sucesso!")
    }, 3000)
  })
}

(async () => {
  const id = await getId()
  const email = await getEmail(id)

  sendMail(email)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    })

  console.log("Não travei");
})()

console.log("To aqui fora");
