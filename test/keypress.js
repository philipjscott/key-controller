/* global KeyboardEvent */

'use strict'

import keycode from 'keycode'

function keyPress (key, eventType, options = {}) {
  const eventInit = Object.assign({}, { keyCode: keycode(key) }, options)
  const event = new KeyboardEvent(eventType, eventInit)

  document.dispatchEvent(event)
}

function keydownPress (key) {
  keyPress(key, 'keydown')
}

function keyupPress (key) {
  keyPress(key, 'keyup')
}

function keyupShiftPress (key) {
  keyPress(key, 'keyup', { shiftKey: true })
}

export {
  keyupShiftPress,
  keydownPress,
  keyupPress
}
