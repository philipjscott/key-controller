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
const left = {
  keydown (model) {
    model.x -= 1
  }
}
const right = {
  keydown (model) {
    model.x += 1
  }
}
const up = {
  keydown (model) {
    model.y += 1
  }
}
const down = {
  keydown (model) {
    model.y -= 1
  }
}
const special = {
  keydown (model) {
    model.rage = !model.rage
  }
}

export {
  inc,
  dec,
  reset,
  left,
  right,
  up,
  down,
  special,
  _
}
