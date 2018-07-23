# key-controller

key-controller is a library that simplifies registering handlers for `keydown` and `keyup` events. Below is an example of usage:

```js
const myModel = {
  num: 0
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
  }
}
const controls = {
  inc: '+',
  dec: '-'
}
const controller = new Controller(myModel, virtuals)

controller.register(controls) // map keyboard controls to "virtual keys"

// controller.register( ... ) can be called with new controls any time;
// this overwrites the old controls
```

key-controller uses [keycode](https://www.npmjs.com/package/keycode) for mapping characters to Keyboard event keycodes.
