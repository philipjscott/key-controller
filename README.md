# key-controller

[![npm version](https://badge.fury.io/js/key-controller.svg)](https://badge.fury.io/js/key-controller)
[![Build Status](https://travis-ci.org/ScottyFillups/key-controller.svg?branch=master)](https://travis-ci.org/ScottyFillups/key-controller)
[![Coverage Status](https://coveralls.io/repos/github/ScottyFillups/key-controller/badge.svg?branch=master)](https://coveralls.io/github/ScottyFillups/key-controller?branch=master)
[![install size](https://packagephobia.now.sh/badge?p=key-controller)](https://packagephobia.now.sh/result?p=key-controller)

key-controller is a library that abstracts handling `keydown` and `keyup` events in the browser, making it easier to change keyboard controls dynamically.

key-controller uses [KeyboardEvent.key](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/key) for `controller.register(...)`. We recommend using https://keycode.info/ for looking up `.key` property of specific key's event.

## Installation

```
npm install key-controller --save-dev
```

If you don't use a module bundler, you can include the minified file which exports the `KeyController` global:

```html
<script src="unpkg.com/key-controller/umd/key-controller.min.js" defer></script>
```

## Concepts

Keyboard controls usually map to an abstract action, eg. `Spacebar -> Jump`. To make a controller, you pass in generator function and a context:

```js
const generator = ctx => ({
  jump () {
    ctx.jump()
  }
})
const player = {
  jump () {
    console.log('jump!')
  }
}

const controller = new KeyController(generator, player)
```

Your generator function will be called with the contexts that were passed to `KeyController` and should return a JavaScript object containing abstract actions.

To map keyboard controls to the actions, you call `controller.register(mycontrols)`:

```js
const controls = {
  jump: ' '
}

controller.register(controls)

// Pressing Spacebar will now call player.jump()
```

## Usage

```js
import KeyController from 'key-controller'

const billyTheGoblin = {
  x: 0,
  isDancing: false
}

const generator = goblin => {
  moveLeft () {
    goblin.x -= 1
  },
  moveRight () {
    goblin.x += 1
  },
  toggleDance: {
    keyup () {
      goblin.isDancing = false
    },
    keydown () {
      goblin.isDancing = true
    }
  },
}
const controls = {
  moveLeft: ['ArrowLeft', 'a'],
  moveRight: ['ArrowRight', 'd'],
  toggleDance: 'alt+d'
}
const controller = new KeyController(generator, billyTheGoblin)

controller.register(controls)
```

## API

#### new KeyController(generator, [...context])

Creates a "controller", an object that stores a collection of abstract actions to be trigger by the controls in `controller.register(mycontrols)`.

#### generator

Type: `([...Any]) => Object`

A function that takes an arbitrary number of arguments, and returns an object with abstract actions. An action name can map to a function or an object that contains a `keydown` and/or `keyup` function. If the action name maps to a function, **it will be triggered on** `keydown`. 

The functions will always be passed its respective `KeyboardEvent` when the action is triggered. You probably won't need to use it though.

```js
const generator = (cat, dog) => ({
  patDog (e) {
    console.log('Keyboard event:', e)
    console.log('You\'re patting the dog!')
    dog.woof()
  },
  patCat () {
    keydown () {
      console.log('You started patting the cat')
    },
    keyup () {
      console.log('You stopped patting the cat; it\'s now upset :c')
      cat.ragequit()
    }
  }
})
```

There is a special action name, `_`, which is triggered on every keypress (i.e. you don't need to specify it in your `control` object); it's intended for debugging purposes, such as logging the contexts.

#### context

Type: `Any`

An arbitrary number of arguments that will all be passed to the generator function (useful if you want your generator function in a separate file, which doesn't have access to the desired scope.

#### controller.register(controls)

Registers controls to the abstract actions defined in the generator function.

#### controls

Type: `Object`

A mapping of the abstract action names to keyboard controls, e.g.

```js
const controls = {
  left: 'a',
  right: 'd'
}
```

An abstract action can map to multiple controls using arrays:

```js
// Jump when "w" or the Spacebar is pressed
const controls = {
  jump: ['w', ' ']
}
```

"Modifier keys", ie. `meta`, `ctrl`, `alt` can be prepended using `+` to check whether they're being held down on keypress:

```js
// Quit when the user press q while holding ctrl
// Note that the order and case of the modifier keys does not matter, but the "primary key" must be the last character
const controls = {
  quit: 'ctrl+q',
  rageQuit: 'cTlR+aLT+q'
}
```

Note that `shift` is NOT supported; instead, just enter the character you want to trigger the event on. For example, rather than doing `shift+w`, do `W`:
```js
// 'W' refers to shift+w
const controls = {
  jump: 'w',
  jumpSuperHigh: 'W'
}
```

#### controller.unbind()

Unbinds the controller from the DOM. Calls `document.removeEventListener(...)` under the hood.

#### controller.bind()

Binds the controller from the DOM. Calls `document.addEventListener(...)` under the hood.
