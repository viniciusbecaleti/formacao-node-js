/*
const mostrarSite = true
const site = "www.guiadoprogramador.com"

console.log("Hello, world!")
console.log("Meu nome é Vinicius")
console.log("E eu estou aprendendo NodeJS com o Guia do Programador")

if (mostrarSite) {
  console.log(site)
}
*/

const { soma, subtracao, multiplicacao, divisao } = require("./calculadora")

console.log(soma(10, 20))
console.log(subtracao(20, 10))
console.log(multiplicacao(10, 10))
console.log(divisao(100, 2))
