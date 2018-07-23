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

function keydownAltCtrlPress (key) {
  keyPress(key, 'keydown', {
    ctrlKey: true,
    altKey: true
  })
}

function keydownAltPress (key) {
  keyPress(key, 'keydown', { altKey: true })
}

export {
  keydownAltCtrlPress,
  keydownAltPress,
  keyupShiftPress,
  keydownPress,
  keyupPress
}
