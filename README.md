# key-controller

key-controller is a library that simplifies registering handlers for `keydown` and `keyup` events.

key-controller currently only supports projects that transpile ES6. We plan to make a UMD build soon :smiley:

key-controller uses [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) for mapping controls to virtual keys.

## Installation

```
yarn add key-controller --dev

# OR

npm install key-controller --save-dev
```

## Usage

```js
import Controller from 'key-controller'

const myModel = {
  num: 0,
  x: 0,
  y: 0,
  isDancing: false
}
const virtuals = {
  inc: {
    keydown (model) {
      model.num += 1
    }
  },
  dec: {
    keydown (model) {
      model.num -= 1
    }
  },
  moveLeft: {
    keydown (model) {
      model.x -= 1
    }
  },
  moveRight: {
    keydown (model) {
      model.x += 1
    }
  },
  moveUp: {
    keydown (model) {
      model.y += 1
    }
  },
  moveDown: {
    keydown (model) {
      model.y -= 1
    }
  },
  toggleDancing: {
    keydown (model) {
      model.isDancing = !model.isDancing
    }
  },
  // the "_" virtual key is special;
  // it's triggered by any keypress and is used primarily for debugging
  _: { 
    keydown (model) {
      console.log(model)
    }
  }
}
const controls = {
  inc: '+',
  dec: '-',
  moveLeft: ['ArrowLeft', 'a'],
  moveRight: ['ArrowRight', 'd'],
  moveUp: ['ArrowUp', 'w'],
  moveDown: ['ArrowDown', 's'],
  toggleDance: 'alt+d'
}
const controller = new Controller(myModel, virtuals)

controller.register(controls) // map keyboard controls to "virtual keys"

// controller.register( ... ) can be called with new controls any time;
// this overwrites the old controls
```
