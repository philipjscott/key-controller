'use strict'

import Controller from '../lib/controller'

const model = {
  a: 5
}
const commands = {
  keyup: {
    inc (model, e) {
      if (!e.shiftKey) {
        model.a += 10
        console.log('Increment! Keyup!')
      } else {
        model.a += 100
        console.log('Increment! Keyup + shiftKey!')
      }
    },
    print (model) {
      console.log(model)
    }
  },
  keydown: {
    inc (model) {
      model.a += 1
      console.log('Increment! Keydown!')
    },
    dec (model) {
      model.a -= 1
      console.log('Decrement! Keydown!')
    },
    reset (model) {
      model.a = 0
      console.log('Reset! Keydown!')
    }
  }
}
const controls = {
  inc: '1',
  dec: '2',
  reset: '3',
  print: '4'
}

const controller = new Controller(model, commands)

controller.register(controls)
