/* global KeyboardEvent */

'use strict'

function keyPress (key, eventType, options = {}) {
  const eventInit = Object.assign({}, { key }, options)
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
