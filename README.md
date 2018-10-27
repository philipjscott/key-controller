# key-controller

key-controller is a library that abstracts handling `keydown` and `keyup` events, making it easier to change keyboard controls "on the fly".

key-controller currently only supports projects that transpile ES6. We plan to make a UMD build if somebody requests it :smiley:

key-controller uses [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) for mapping controls to virtual keys. We recommend using https://keycode.info/ for looking up concretes.

## Installation

```
npm install key-controller --save-dev
```

## Concepts

Keyboard controls often map to an abstract action, eg. the `spacebar` key is often the "jump" button. We will call abstract actions "virtual keys", and keyboard controls "concrete keys", or "virtuals" and "concretes" for short.

You need to provide three things to key-controller:
* A generator function, which takes in models and returns virtuals
* "Models" that are passed to the generator function
* A mapping of virtual keys to concrete keys

The generator function takes in arguments (models) and returns an object with virtuals. The key is the virtual key name, and the value is a function to be executed when that virtual key is triggered:

```js
const gen = (model1, model2) => ({
  jump () {
    console.log(`Jump! Models: ${model1}, ${model2}`)
  }
})
```

The generator function is passed to key-controller constructor as the first argument. The remaining arguments are passed to the generator function as models:

```js
const controller = new Controller(gen, 'foo', 'bar')

// jump() will now be called when you press the spacebar
controller.register({
  jump: ' '
})
```

In the above example, `'Jumps! Models: foo, bar'` will be outputted every time you press the spacebar.

## Usage

```js
import Controller from 'key-controller'

const myModel = {
  x: 0,
  y: 0,
  isDancing: false
}

const generator = (model) => {
  moveLeft () {
    model.x -= 1
  },
  moveRight () {
    model.x += 1
  },
  moveUp () {
    model.y += 1
  },
  moveDown () {
    model.y -= 1
  },
  toggleDance: {
    keyup () {
      model.isDancing = false
    },
    keydown () {
      model.isDancing = true
    }
  },
  // the "_" virtual key is special;
  // it's triggered by any keypress and is used primarily for debugging
  _: { 
    keydown () {
      console.log(model)
    }
  }
}
const controls = {
  moveLeft: ['ArrowLeft', 'a'],
  moveRight: ['ArrowRight', 'd'],
  moveUp: ['ArrowUp', 'w'],
  moveDown: ['ArrowDown', 's'],
  toggleDance: 'alt+d'
}
const controller = new Controller(generator, myModel)

controller.register(controls) // map keyboard controls to "virtual keys"

// controller.register( ... ) can be called with new controls any time;
// this overwrites the old controls
```

## Testing

If Headless Chrome complains about no usable sandbox and you're on Linux, run the following (you'll need to be root):

```
echo 1 > /proc/sys/kernel/unprivileged_userns_clone
```

The above command isn't permanent; to make the changes persist, you'll need to modify `sysctl.d`:

```
echo 'kernel.unprivileged_userns_clone=1' > /etc/sysctl.d/00-local-userns.conf
```

For more information, see "Enable support to run unprivileged containers" [here](https://wiki.archlinux.org/index.php/Linux_Containers).
