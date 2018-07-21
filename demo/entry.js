import Controller from '../lib'
import * as virtuals from './virtuals'

const model = {
  num: 0
}
const controls = {
  inc: '1',
  dec: '2',
  reset: '3',
  print: '4'
}

const controller = new Controller(model, virtuals)

controller.register(controls)
