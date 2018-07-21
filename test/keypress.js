'use strict'

import keycode from 'keycode'

function keyPress (key, eventType, fn) {
  const event = document.createEvent('KeyboardEvent')

  event.key = keycode(key)
  event.initEvent(eventType)

  if (fn) {
    fn(event)
  }

  document.dispatchEvent(event)
}

function keydownPress (key) {
  keyPress(key, 'keydown')
}

function keyupPress (key) {
  keyPress(key, 'keyup')
}

function keydownPressShift (key) {
  keyPress(key, 'keydown', (event) => {
    event.shiftKey = true
  })
}

export {
  keydownPressShift,
  keydownPress,
  keyupPress
}
