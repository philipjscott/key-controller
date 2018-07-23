import Controller from '../lib'
import * as virtuals from './virtuals'

const model = {
  num: 0,
  rage: false,
  x: 0,
  y: 0
}
const controls = {
  inc: '1',
  dec: '2',
  reset: '3',
  left: ['ArrowLeft', 'a'],
  up: ['ArrowUp', 'w'],
  down: ['ArrowDown', 's'],
  right: ['ArrowRight', 'd'],
  special: 'ctrl+alt+*'
}

const controller = new Controller(model, virtuals)

controller.register(controls)
