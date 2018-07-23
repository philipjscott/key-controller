# key-controller

key-controller is a library that simplifies registering handlers for `keydown` and `keyup` events.

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
  num: 0
}
const virtuals = {
  inc: {
    keydown (model, e) { // e is the Keyboard Event; you can manually check if the shift key is pressed
      if (e.shiftKey) {  // In this case, we're checking if '+' is pressed, not '='
        model.num += 1
      }
    }
  },
  dec: {
    keydown (model) {
      model.num -= 1
    }
  },
  _: { // the "_" virtual key is special; it's triggered by any keypress and is used primarily for debugging
    keydown (model) {
      console.log(model)
    }
  }
}
const controls = {
  inc: '=', // at the moment, key-controller does not support case-sensitive keys; must ae lower-case
  dec: '-'
}
const controller = new Controller(myModel, virtuals)

controller.register(controls) // map keyboard controls to "virtual keys"

// controller.register( ... ) can be called with new controls any time;
// this overwrites the old controls
```

key-controller currently only supports projects that transpile ES6. We plan to make a UMD build soon :smiley:

key-controller uses [keycode](https://www.npmjs.com/package/keycode) for mapping characters to Keyboard event keycodes.
