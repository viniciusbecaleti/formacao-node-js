class Dado {
  constructor(faces) {
    this.faces = faces;
  }

  girar() {
    console.log(Math.floor(Math.random() * this.faces + 1))
  }
}

const dadoComum = new Dado(20)
dadoComum.girar()