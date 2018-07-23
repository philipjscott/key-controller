const inc = {
  keydown (model) {
    model.num += 1
  }
}
const dec = {
  keydown (model) {
    model.num -= 1
  }
}
const reset = {
  keydown (model) {
    model.num = 0
  }
}
const _ = {
  keydown (model) {
    console.log(model)
  }
}

export {
  inc,
  dec,
  reset,
  _
}
