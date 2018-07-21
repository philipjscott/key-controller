import Controller from '../lib'

const model = {
  num: 0
}
const virtuals = {
  keydown: {
    inc (model) {
      model.num += 1
    },
    dec (model) {
      model.num -= 1
    },
    reset (model) {
      model.num = 0
    },
    print (model) {
      console.log(model)
    }
  }
}
const controls = {
  inc: '1',
  dec: '2',
  reset: '3',
  print: '4'
}

const controller = new Controller(model, virtuals)

controller.register(controls)
